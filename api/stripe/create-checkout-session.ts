import type { VercelRequest, VercelResponse } from '@vercel/node';
import 'dotenv/config';  // ← this will read your .env file into process.env
import Stripe from 'stripe';

console.log('🔑 STRIPE_SECRET_KEY is present? →', process.env.STRIPE_SECRET_KEY);

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing Stripe secret key');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-03-31.basil' as Stripe.LatestApiVersion,
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  console.log('📥 /create-checkout-session payload:', req.body);
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

 // 1) Log and unpack what you got
 console.log('📥 /create-checkout-session payload:', req.body);
 const { plan, billingInterval, customerId } = req.body as {
   plan: 'basic' | 'pro',
   billingInterval: 'weekly' | 'monthly' | 'yearly',
   customerId?: string
 };

 // ────────────────────────────────────────────────────────────────
 // 2) Map plan + interval to one of your Price IDs
 // ────────────────────────────────────────────────────────────────
 const PRICE_MAP: Record<string,string> = {
   basic_weekly:  process.env.STRIPE_BASIC_PRICE_WEEKLY_ID!,
   basic_monthly: process.env.STRIPE_BASIC_PRICE_MONTHLY_ID!,
   basic_yearly:  process.env.STRIPE_BASIC_PRICE_YEARLY_ID!,
   pro_weekly:    process.env.STRIPE_PRO_PRICE_WEEKLY_ID!,
   pro_monthly:   process.env.STRIPE_PRO_PRICE_MONTHLY_ID!,
   pro_yearly:    process.env.STRIPE_PRO_PRICE_YEARLY_ID!,
 };

 const key = `${plan}_${billingInterval}`;                          // e.g. "pro_monthly"
 const priceId = PRICE_MAP[key];

 if (!priceId) {
   console.error('❌ Invalid plan or interval:', plan, billingInterval);
   return res.status(400).json({ error: 'Invalid plan or billing interval' });
 }

 console.log('plan, billingInterval → priceId =', priceId);

 // ────────────────────────────────────────────────────────────────
 // 3) Create the session with your real price ID
 // ────────────────────────────────────────────────────────────────
 try {
   const session = await stripe.checkout.sessions.create({
     mode: 'subscription',
     payment_method_types: ['card'],
     line_items: [{ price: priceId, quantity: 1 }],
     customer: customerId,
     success_url:  `${req.headers.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
     cancel_url:   `${req.headers.origin}/subscription/cancel`,
   });

   return res.status(200).json({ sessionId: session.id });
 } catch (err) {
   console.error('Error creating checkout session:', err);
   return res.status(500).json({
     error: 'Failed to create checkout session',
     details: err instanceof Error ? err.message : 'Unknown error'
   });
 }
}