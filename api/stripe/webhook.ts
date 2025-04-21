import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { buffer } from 'micro'; // Use raw body for signature verification
import * as dotenv from 'dotenv';
import { supabaseAdmin as supabase } from '../../src/lib/supabaseAdmin.js';

// Load your root .env (has STRIPE_SECRET_KEY, WEBHOOK_SECRET, SUPABASE_URL, etc)
dotenv.config();

// Ensure critical env vars are set
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing STRIPE_SECRET_KEY');
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('Missing STRIPE_WEBHOOK_SECRET');
}
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false, // Don't parse body as JSON
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  if (!sig || typeof sig !== 'string') {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await buffer(req);
    event = stripe.webhooks.constructEvent(rawBody.toString(), sig, webhookSecret);
  } catch (err: any) {
    console.error('Error constructing webhook event:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Common helpers to record subscription changes
  async function upsertSubscription(userId: string, subscription: Stripe.Subscription, planId: string) {
    const periodStart = new Date(subscription.current_period_start * 1000).toISOString();
    const periodEnd = new Date(subscription.current_period_end * 1000).toISOString();
    // Upsert into subscriptions table
    await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        stripe_customer_id: subscription.customer as string,
        stripe_subscription_id: subscription.id,
        plan_id: planId,
        status: subscription.status,
        current_period_start: periodStart,
        current_period_end: periodEnd,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' }
    );

    // Insert audit trail
    const { data: historyRows, error: histErr } = await supabase
    .from('subscription_history')
    .insert({
      user_id:               userId,
      stripe_subscription_id: subscription.id,
      plan_id:                planId,
      status:                 subscription.status,
      period_start:           periodStart,
      period_end:             periodEnd,
      event_type:             event.type,
      created_at:             new Date().toISOString(),
    })
    .select();
  
    if (histErr) {
      console.error('❌ subscription_history insert error:', histErr);
    } else {
      console.log('✅ subscription_history inserted:', historyRows);
    }
  }

  // Add any Stripe event types you care about below:
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      if (!userId) {
        console.error('Missing client_reference_id');
        break;
      }

      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      const customerId = session.customer as string;
      const priceId = subscription.items.data[0].price.id;
      let customerEmail = session.customer_email;

      // if customerEmail is null fetch Customer record, which always has .email:
      if (!customerEmail) {
        const cust = (await stripe.customers.retrieve(customerId)) as Stripe.Customer;
        customerEmail = cust.email || customerEmail; 
      }

      let subscriptionTier = 'free';
      if (
        [process.env.STRIPE_PRO_PRICE_WEEKLY_ID,
         process.env.STRIPE_PRO_PRICE_MONTHLY_ID,
         process.env.STRIPE_PRO_PRICE_YEARLY_ID].includes(priceId)
      ) {
        subscriptionTier = 'pro';
      } else if (
        [process.env.STRIPE_BASIC_PRICE_WEEKLY_ID,
         process.env.STRIPE_BASIC_PRICE_MONTHLY_ID,
         process.env.STRIPE_BASIC_PRICE_YEARLY_ID].includes(priceId)
      ) {
        subscriptionTier = 'basic';
      }
      // Update current state in public.profiles table
      // 2a) upsert into profiles
      const { data: updatedProfile, error: upsertErr } = await supabase
        .from('profiles')
        .upsert(
          {
            id: userId,
            email: customerEmail,
            stripe_customer_id: customerId,
            subscription_tier: subscriptionTier,
            subscription_status: subscription.status,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        )
        .select();

      if (upsertErr) {
        console.error('❌ profiles upsert error:', upsertErr);
      } else {
        console.log('✅ profiles upserted row:', updatedProfile);
      }
      
      // Upsert subscription details into subscriptions table
      await upsertSubscription(userId, subscription, priceId);
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const userRes = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', subscription.customer as string)
        .limit(1)
        .single();
      if (userRes.error || !userRes.data?.id) {
        console.error('No matching profile for customer ID:', subscription.customer);
        break;
      }
      const userId = userRes.data.id;
      const priceId = subscription.items.data[0].price.id;
      let subscriptionTier = 'free';
      if (
        [process.env.STRIPE_PRO_PRICE_WEEKLY_ID,
         process.env.STRIPE_PRO_PRICE_MONTHLY_ID,
         process.env.STRIPE_PRO_PRICE_YEARLY_ID].includes(priceId)
      ) {
        subscriptionTier = 'pro';
      } else if (
        [process.env.STRIPE_BASIC_PRICE_WEEKLY_ID,
         process.env.STRIPE_BASIC_PRICE_MONTHLY_ID,
         process.env.STRIPE_BASIC_PRICE_YEARLY_ID].includes(priceId)
      ) {
        subscriptionTier = 'basic';
      }
      // Update profiles
      const { error: updateError } = await supabase
      .from('profiles')
      .update({
        subscription_tier: event.type === 'customer.subscription.deleted' ? 'free' : subscriptionTier,
        subscription_status: subscription.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);
      if (updateError) console.error('Supabase update error:', updateError);
      
      // Record in subscriptions & history
      await upsertSubscription(userId, subscription, priceId);
      break;
    }

    default:
      // Other events are ignored
      break;
  }

  return res.status(200).json({ received: true });
}