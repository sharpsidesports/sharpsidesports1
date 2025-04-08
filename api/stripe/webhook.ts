import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { supabase } from '../../src/lib/supabase';
import * as dotenv from 'dotenv';
import path from 'path';

// Load Stripe-specific environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.stripe') });

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('Missing Stripe webhook secret');
}

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );

    // Handle subscription events
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Get the user ID from the client_reference_id
        const userId = session.client_reference_id;
        if (!userId) {
          console.error('No user ID found in session:', session.id);
          break;
        }

        // Get subscription details from the session
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const customerId = session.customer as string;
        const priceId = subscription.items.data[0].price.id;

        // Determine subscription tier based on the price ID
        let subscriptionTier = 'free';
        
        // Check Pro price IDs
        if (
          priceId === process.env.VITE_STRIPE_PRO_WEEKLY_PRICE_ID ||
          priceId === process.env.VITE_STRIPE_PRO_MONTHLY_PRICE_ID ||
          priceId === process.env.VITE_STRIPE_PRO_YEARLY_PRICE_ID
        ) {
          subscriptionTier = 'pro';
        }
        // Check Basic price IDs
        else if (
          priceId === process.env.VITE_STRIPE_BASIC_WEEKLY_PRICE_ID ||
          priceId === process.env.VITE_STRIPE_BASIC_MONTHLY_PRICE_ID ||
          priceId === process.env.VITE_STRIPE_BASIC_YEARLY_PRICE_ID
        ) {
          subscriptionTier = 'basic';
        }

        console.log('Updating user profile:', {
          userId,
          customerId,
          subscription_tier: subscriptionTier,
          subscription_status: subscription.status,
          price_id: priceId
        });

        // Update user's profile with Stripe customer ID and subscription details
        const { error } = await supabase
          .from('profiles')
          .update({
            stripe_customer_id: customerId,
            subscription_tier: subscriptionTier,
            subscription_status: subscription.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (error) {
          console.error('Error updating user profile:', error);
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const priceId = subscription.items.data[0].price.id;

        // Get user profile by Stripe customer ID
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId);

        if (!profiles || profiles.length === 0) {
          console.error('No user found for customer:', customerId);
          break;
        }

        // Determine subscription tier based on the price ID
        let subscriptionTier = 'free';
        
        // Check Pro price IDs
        if (
          priceId === process.env.VITE_STRIPE_PRO_WEEKLY_PRICE_ID ||
          priceId === process.env.VITE_STRIPE_PRO_MONTHLY_PRICE_ID ||
          priceId === process.env.VITE_STRIPE_PRO_YEARLY_PRICE_ID
        ) {
          subscriptionTier = 'pro';
        }
        // Check Basic price IDs
        else if (
          priceId === process.env.VITE_STRIPE_BASIC_WEEKLY_PRICE_ID ||
          priceId === process.env.VITE_STRIPE_BASIC_MONTHLY_PRICE_ID ||
          priceId === process.env.VITE_STRIPE_BASIC_YEARLY_PRICE_ID
        ) {
          subscriptionTier = 'basic';
        }

        // Update subscription status for the user
        const { error } = await supabase
          .from('profiles')
          .update({
            subscription_tier: event.type === 'customer.subscription.deleted' ? 'free' : subscriptionTier,
            subscription_status: subscription.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', profiles[0].id);

        if (error) {
          console.error('Error updating subscription status:', error);
        }
        break;
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(400).json({
      error: 'Webhook error',
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
} 