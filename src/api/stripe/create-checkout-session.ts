import Stripe from 'stripe';
import type { Request, Response } from 'express';
import { supabase } from '../../lib/supabase.js';

// Debug logs for environment variables
console.log('Environment variables:', {
  secretKeyExists: !!import.meta.env.VITE_STRIPE_SECRET_KEY,
  secretKeyLength: import.meta.env.VITE_STRIPE_SECRET_KEY?.length,
  allEnvKeys: Object.keys(import.meta.env)
});

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

type PlanType = 'basic' | 'pro';
type IntervalType = 'weekly' | 'monthly' | 'yearly';

interface PriceConfig {
  [key: string]: {
    [key: string]: string | undefined;
  };
}

// Price IDs for different plans and intervals
const PRICE_IDS: PriceConfig = {
  basic: {
    weekly: import.meta.env.VITE_STRIPE_BASIC_WEEKLY_PRICE_ID,
    monthly: import.meta.env.VITE_STRIPE_BASIC_MONTHLY_PRICE_ID,
    yearly: import.meta.env.VITE_STRIPE_BASIC_YEARLY_PRICE_ID,
  },
  pro: {
    weekly: import.meta.env.VITE_STRIPE_PRO_WEEKLY_PRICE_ID,
    monthly: import.meta.env.VITE_STRIPE_PRO_MONTHLY_PRICE_ID,
    yearly: import.meta.env.VITE_STRIPE_PRO_YEARLY_PRICE_ID,
  },
};

// API route to create a checkout session
// This the server-side route that handles the checkout session creation
export default async function handler(req: Request, res: Response) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Check if Stripe is properly initialized
    if (!import.meta.env.VITE_STRIPE_SECRET_KEY) {
      console.error('Stripe not initialized: Missing secret key');
      res.status(500).json({
        error: 'Stripe configuration error',
        details: 'Stripe API key not configured'
      });
      return;
    }

    // Get request body
    const { plan, interval } = req.body;
    console.log('Creating checkout session for:', { plan, interval });

    // Get price ID
    const priceId = PRICE_IDS[plan]?.[interval];
    if (!priceId) {
      console.error('Invalid plan configuration:', { plan, interval });
      res.status(400).json({
        error: 'Invalid plan configuration',
        details: 'The selected plan or interval is not available'
      });
      return;
    }

    // Create checkout session
    console.log('Creating Stripe session with price:', priceId);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${req.headers.origin || 'http://localhost:5175'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'http://localhost:5175'}/subscription`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_creation: 'always',
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe API Error:', error);
    const stripeError = error instanceof Error ? error : new Error('Unknown error');
    
    res.status(500).json({
      error: 'Failed to create checkout session',
      details: stripeError.message,
      type: error instanceof Stripe.errors.StripeError ? error.type : 'unknown'
    });
  }
}

// This function is used to create a checkout session from the client-side
// It is called when the user clicks the "Subscribe" button
export async function createCheckoutSession(plan: string, interval: string) {
  try {
    // Get the current user from Supabase
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error('User must be authenticated to create a checkout session');
    }

    let priceId;
    switch (plan) {
      case 'basic':
        switch (interval) {
          case 'weekly':
            priceId = import.meta.env.VITE_STRIPE_BASIC_WEEKLY_PRICE_ID;
            break;
          case 'monthly':
            priceId = import.meta.env.VITE_STRIPE_BASIC_MONTHLY_PRICE_ID;
            break;
          case 'yearly':
            priceId = import.meta.env.VITE_STRIPE_BASIC_YEARLY_PRICE_ID;
            break;
          default:
            throw new Error('Invalid interval');
        }
        break;
      case 'pro':
        switch (interval) {
          case 'weekly':
            priceId = import.meta.env.VITE_STRIPE_PRO_WEEKLY_PRICE_ID;
            break;
          case 'monthly':
            priceId = import.meta.env.VITE_STRIPE_PRO_MONTHLY_PRICE_ID;
            break;
          case 'yearly':
            priceId = import.meta.env.VITE_STRIPE_PRO_YEARLY_PRICE_ID;
            break;
          default:
            throw new Error('Invalid interval');
        }
        break;
      default:
        throw new Error('Invalid plan');
    }

    if (!priceId) {
      throw new Error('Price ID not found');
    }

    // Create checkout session
    console.log('Creating Stripe session with:', {
      plan,
      interval,
      priceId,
      userId: session.user.id,
      userEmail: session.user.email
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${window.location.origin}/subscription`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_email: session.user.email || undefined,
      client_reference_id: session.user.id,
      metadata: {
        user_id: session.user.id,
        user_email: session.user.email || '',
        plan,
        interval
      },
    });

    return checkoutSession;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
} 