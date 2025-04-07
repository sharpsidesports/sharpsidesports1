import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { supabase } from '../../src/lib/supabaseClient';
import * as dotenv from 'dotenv';
import path from 'path';

// Load Stripe-specific environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.stripe') });

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('Missing Stripe webhook secret');
}

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-03-31.basil' as Stripe.LatestApiVersion,
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
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Get user by Stripe customer ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (!profile) {
          console.error('No user found for customer:', customerId);
          break;
        }

        // Update user's subscription status
        const { error } = await supabase
          .from('profiles')
          .update({
            subscription_tier: subscription.items.data[0].price?.lookup_key || 'free',
            subscription_status: subscription.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', profile.id);

        if (error) {
          console.error('Error updating user subscription:', error);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Get user by Stripe customer ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (!profile) {
          console.error('No user found for customer:', customerId);
          break;
        }

        // Reset user's subscription to free tier
        const { error } = await supabase
          .from('profiles')
          .update({
            subscription_tier: 'free',
            subscription_status: 'inactive',
            updated_at: new Date().toISOString()
          })
          .eq('id', profile.id);

        if (error) {
          console.error('Error updating user subscription:', error);
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