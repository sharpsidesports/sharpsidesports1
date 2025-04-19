import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { buffer } from 'micro'; // Use raw body for signature verification
import * as dotenv from 'dotenv';
import * as path from 'path';
import { supabaseAdmin as supabase } from '../../src/lib/supabaseAdmin.js';

// Load .env.stripe
dotenv.config({ path: path.resolve(process.cwd(), '.env.stripe') });

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

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
    event = stripe.webhooks.constructEvent(rawBody.toString(), sig, webhookSecret as string);
  } catch (err: any) {
    console.error('Error constructing webhook event:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
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

      let subscriptionTier = 'free';
      if (
        [process.env.VITE_STRIPE_PRO_WEEKLY_PRICE_ID,
         process.env.VITE_STRIPE_PRO_MONTHLY_PRICE_ID,
         process.env.VITE_STRIPE_PRO_YEARLY_PRICE_ID].includes(priceId)
      ) {
        subscriptionTier = 'pro';
      } else if (
        [process.env.VITE_STRIPE_BASIC_WEEKLY_PRICE_ID,
         process.env.VITE_STRIPE_BASIC_MONTHLY_PRICE_ID,
         process.env.VITE_STRIPE_BASIC_YEARLY_PRICE_ID].includes(priceId)
      ) {
        subscriptionTier = 'basic';
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          stripe_customer_id: customerId,
          subscription_tier: subscriptionTier,
          subscription_status: subscription.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) console.error('Supabase update error:', error);
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const priceId = subscription.items.data[0].price.id;

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId);

      if (!profiles || profiles.length === 0) {
        console.error('No matching profile for customer ID:', customerId);
        break;
      }

      let subscriptionTier = 'free';
      if (
        [process.env.VITE_STRIPE_PRO_WEEKLY_PRICE_ID,
         process.env.VITE_STRIPE_PRO_MONTHLY_PRICE_ID,
         process.env.VITE_STRIPE_PRO_YEARLY_PRICE_ID].includes(priceId)
      ) {
        subscriptionTier = 'pro';
      } else if (
        [process.env.VITE_STRIPE_BASIC_WEEKLY_PRICE_ID,
         process.env.VITE_STRIPE_BASIC_MONTHLY_PRICE_ID,
         process.env.VITE_STRIPE_BASIC_YEARLY_PRICE_ID].includes(priceId)
      ) {
        subscriptionTier = 'basic';
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_tier: event.type === 'customer.subscription.deleted' ? 'free' : subscriptionTier,
          subscription_status: subscription.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profiles[0].id);

      if (error) console.error('Supabase update error:', error);
      break;
    }
  }

  return res.status(200).json({ received: true });
}