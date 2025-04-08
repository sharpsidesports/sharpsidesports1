import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { supabase } from '../../src/lib/supabase';

if (!process.env.VITE_STRIPE_SECRET_KEY) {
  throw new Error('Missing Stripe secret key');
}

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the user's session
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return res.status(400).json({ error: 'No Stripe customer found' });
    }

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${req.headers.origin}/account`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Error creating portal session:', err);
    res.status(500).json({ 
      error: 'Failed to create portal session',
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
} 