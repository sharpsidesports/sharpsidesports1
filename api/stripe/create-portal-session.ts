/*“Customer Portal” endpoint, a separate piece of the billing flow that lets existing subscribers manage their subscription 
(update cards, cancel, etc.) via Stripe’s hosted Billing Portal. 
This Portal endpoint generates a URL that you’d surface in your “Account” page so customers can self‑service their subscription.*/

import 'dotenv/config';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken'; // HS256 manual decode remove when supabase releases RS256

// Ensure all server‑side env vars are present
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing Stripe secret key');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.SUPABASE_URL) {
  throw new Error('Missing Supabase env vars for admin client');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

    // 1) Extract JWT from Authorization header
    const authHeader = String(req.headers.authorization || '');
    const token = authHeader.replace(/^Bearer\s/, '');
    console.log('📥 Authorization header:', authHeader);

  // ───────────────────────────────────────────────────────────────
  // ▼ HS256 WORKAROUND: MANUAL VERIFICATION (remove when RS256 ships: https://github.com/orgs/supabase/discussions/29260) ▼
  // Decode JWT header for debugging
  try {
    const headerJson = JSON.parse(
      Buffer.from(token.split('.')[0], 'base64').toString('utf8')
    );
    console.log('🔍 JWT header:', headerJson);
  } catch (e) {
    console.warn('⚠️ Failed to decode JWT header', e);
  }

  let userId: string;
  try {
    // Verify HS256 signature using service role secret
    const decoded: any = jwt.verify(
      token,
      process.env.SUPABASE_JWT_SECRET!
    );
    console.log('✅ HS256 decoded JWT payload:', decoded);
    userId = decoded.sub;
  } catch (e) {
    console.error('❌ HS256 JWT verification failed:', e);
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // === END HS256 BLOCK ===

  /*
  // === FUTURE RS256 VERIFY BLOCK (UNCOMMENT WHEN SUPABASE SUPPORTS RS256) ===
  // const { data: { user }, error: userErr } = await supabaseAdmin.auth.getUser(token);
  // if (userErr || !user) {
  //   console.error('❌ supabaseAdmin.auth.getUser error:', userErr);
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }
  // userId = user.id;
  // userEmail = user.email;
  // === END RS256 BLOCK ===
  */

  try {
    // Lookup Stripe customer ID in Supabase
    const { data: profile, error: profErr } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();
    console.log('👤 Supabase profile lookup →', { profile, profErr });
    if (profErr || !profile?.stripe_customer_id) {
      return res.status(400).json({ error: 'No Stripe customer found' });
    }

    // Create the portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${req.headers.origin}/account`,
    });
    console.log('✅ Portal session URL:', session.url);

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('❌ Error creating portal session:', err);
    return res.status(500).json({
      error: 'Failed to create portal session',
      details: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}