import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { loadEnv } from 'vite';

const env = loadEnv('', process.cwd(), '');
const stripe = new Stripe(env.VITE_STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Initialize Supabase client for server-side use
const supabase = createClient(
  env.VITE_SUPABASE_URL || '',
  env.VITE_SUPABASE_SERVICE_ROLE_KEY || '',
);

export async function POST({ request }) {
  console.log('Webhook received');
  const payload = await request.text();
  const sig = request.headers.get('stripe-signature');

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
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Checkout session completed:', session);

    try {
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
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
      return new Response('Error processing subscription', { status: 500 });
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
} 