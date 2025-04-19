// API endpoint creates Stripe Checkout session for subscription plan
import 'dotenv/config';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken'; // remove once RS256 is supported by Supabase

// Ensure all server‑side env vars are present
if (!process.env.STRIPE_SECRET_KEY) throw new Error('Missing Stripe secret key');
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase env vars for admin helper');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-03-31.basil' as Stripe.LatestApiVersion,
});

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // 🔑 Log incoming headers so you can see the JWT
  console.log('📥 Authorization header:', req.headers.authorization);
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1) Unpack request
    const { plan, billingInterval } = req.body as {
      plan: 'basic' | 'pro';
      billingInterval: 'weekly' | 'monthly' | 'yearly';
    };

    // 2) Authenticate user via Supabase JWT
    const authHeader = String(req.headers.authorization || '');
    const token = authHeader.replace(/^Bearer\s/, '');

    // ───────────────────────────────────────────────────────────────
    // ▼ HS256 WORKAROUND: MANUAL VERIFICATION (remove when RS256 ships: https://github.com/orgs/supabase/discussions/29260) ▼
    let payload: any;
    try {
      payload = jwt.verify(
        token,
        process.env.SUPABASE_JWT_SECRET!
      );
    } catch (err) {
      console.error('JWT verification failed:', err);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    console.log('✅ HS256 decoded JWT payload:', payload);
    const userId = payload.sub as string;
    const userEmail = payload.email as string | undefined;
    // ▲ End workaround ▲
    // ───────────────────────────────────────────────────────────────

    /* 
    // RS256 flow (uncomment/remove above block once RS256 is enabled):
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !user) {
      console.error('❌ supabaseAdmin.auth.getUser error:', userError);
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = user.id;
    const userEmail = user.email;
    */

    // 3) Map plan+interval to a Stripe Price ID
    const PRICE_MAP: Record<string,string> = {
      basic_weekly:  process.env.STRIPE_BASIC_PRICE_WEEKLY_ID!,  
      basic_monthly: process.env.STRIPE_BASIC_PRICE_MONTHLY_ID!,
      basic_yearly:  process.env.STRIPE_BASIC_PRICE_YEARLY_ID!,
      pro_weekly:    process.env.STRIPE_PRO_PRICE_WEEKLY_ID!,    
      pro_monthly:   process.env.STRIPE_PRO_PRICE_MONTHLY_ID!,   
      pro_yearly:    process.env.STRIPE_PRO_PRICE_YEARLY_ID!,    
    };
    const key = `${plan}_${billingInterval}`;
    const priceId = PRICE_MAP[key];
    console.log('🔑 price lookup:', key, '→', priceId);
    if (!priceId) {
      console.log('❌ Invalid plan/interval combination');
      return res.status(400).json({ error: 'Invalid plan or billing interval' });
    }

    // 4) Lookup or create Stripe customer ID
    const { data: profile, error: profErr } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();
    console.log('👤 Supabase profile lookup →', { profile, profErr });
    if (profErr) throw profErr;
    const customerId = profile?.stripe_customer_id;
    console.log('🔑 Using Stripe customer ID:', customerId);

    // 5) Create the Checkout Session

    // First, assemble the common params:
    const params: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: userId,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      metadata: { user_id: userId, user_email: userEmail || '', plan, billingInterval },
      success_url: `${req.headers.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${req.headers.origin}/subscription/cancel`,
    };

    // Then add *either* customer *or* customer_email, never both:
    if (customerId) {
      params.customer = customerId;
    } else if (userEmail) {
      params.customer_email = userEmail;
    }

    // Finally, create the session:
    const session = await stripe.checkout.sessions.create(params);
    console.log('✅ Stripe session created:', session.id);

    return res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error('❌ Error creating checkout session:', err);
    return res.status(500).json({
      error:   'Failed to create checkout session',
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
}