import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { loadEnv } from 'vite';
import type { Request as ExpressRequest } from 'express';

const env = loadEnv('', process.cwd(), '');
const stripe = new Stripe(env.VITE_STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Initialize Supabase client for server-side use
const supabase = createClient(
  env.VITE_SUPABASE_URL || '',
  env.VITE_SUPABASE_SERVICE_ROLE_KEY || '',
);

  // This function handles the Stripe webhook events
  // It verifies the event and updates the Supabase database accordingly
  export async function POST({ request }: { request: ExpressRequest }): Promise<{ status: number; headers: Record<string, string>; body: string }> {

  console.log('Webhook received');
  const payload = request.body.toString('utf8');
  const sig = request.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig || '',
      env.VITE_STRIPE_WEBHOOK_SECRET || ''
    );
    console.log('Event constructed successfully:', event.type);
  } catch (err) {
    console.error('Error constructing webhook event:', err);
    return {
      status: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
    };
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Checkout session completed:', session);

    try {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      const priceId = subscription.items.data[0].price.id;
      console.log('Price ID:', priceId);

      let subscriptionTier = 'free';
      
      // Check Pro tier price IDs
      if (
        priceId === env.VITE_STRIPE_PRO_PRICE_WEEKLY_ID ||
        priceId === env.VITE_STRIPE_PRO_PRICE_MONTHLY_ID ||
        priceId === env.VITE_STRIPE_PRO_PRICE_YEARLY_ID
      ) {
        subscriptionTier = 'pro';
      }
      // Check Basic tier price IDs
      else if (
        priceId === env.VITE_STRIPE_BASIC_PRICE_WEEKLY_ID ||
        priceId === env.VITE_STRIPE_BASIC_PRICE_MONTHLY_ID ||
        priceId === env.VITE_STRIPE_BASIC_PRICE_YEARLY_ID
      ) {
        subscriptionTier = 'basic';
      }

      console.log('Determined subscription tier:', subscriptionTier);
      console.log('client_reference_id:', session.client_reference_id);
      console.log('session.customer:', session.customer);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          stripe_customer_id: session.customer,
          subscription_tier: subscriptionTier,
          subscription_status: 'active'
        })
        .eq('id', session.client_reference_id);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        throw updateError;
      }

      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error processing subscription:', error);
      //return new Response('Error processing subscription', { status: 500 });
      return {
        status: 500,
        headers: { 'Content-Type': 'text/plain' },
        body: `Error processing subscription: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };

    }
  }

  return {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ received: true }),
  };
} 