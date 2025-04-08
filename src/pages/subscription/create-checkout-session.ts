import Stripe from 'stripe';
import { supabase } from '../../lib/supabase';

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    const { plan, interval } = await req.json();
    
    // Get the current user
    const { data: { session: authSession } } = await supabase.auth.getSession();
    if (!authSession?.user) {
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

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/subscription`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_email: authSession.user.email || undefined,
      client_reference_id: authSession.user.id,
      metadata: {
        user_id: authSession.user.id,
        user_email: authSession.user.email || '',
        plan,
        interval
      }
    });

    return new Response(JSON.stringify({ sessionId: session.id }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to create checkout session',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 