// this is the local harness for the Stripe webhook server
// it is not used in production, but is useful for testing locally
import express = require('express');
import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load .env.stripe for local development
dotenv.config({ path: '.env.stripe' });

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase environment variables missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
if (!webhookSecret) {
  console.error('⚠️ Missing STRIPE_WEBHOOK_SECRET in env');
  process.exit(1);
}

const app = express();

app.use((req, res, next) => {
  console.log(`🔔 Received ${req.method} request on ${req.url}`);
  next();
});

app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res): Promise<void> => {
  const sig = req.headers['stripe-signature'];
  if (!sig) {
    res.status(400).send('Missing stripe-signature header');
    return;
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error('🔴 Signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle specific event types
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.client_reference_id;
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;

    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const priceId = subscription.items.data[0].price.id;

      let tier = 'free';
      if ([process.env.VITE_STRIPE_PRO_WEEKLY_PRICE_ID, process.env.VITE_STRIPE_PRO_MONTHLY_PRICE_ID, process.env.VITE_STRIPE_PRO_YEARLY_PRICE_ID].includes(priceId)) {
        tier = 'pro';
      } else if ([process.env.VITE_STRIPE_BASIC_WEEKLY_PRICE_ID, process.env.VITE_STRIPE_BASIC_MONTHLY_PRICE_ID, process.env.VITE_STRIPE_BASIC_YEARLY_PRICE_ID].includes(priceId)) {
        tier = 'basic';
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          stripe_customer_id: customerId,
          subscription_tier: tier,
          subscription_status: subscription.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        console.error('❌ Supabase update failed:', error.message);
      } else {
        console.log(`✅ Updated user ${userId} to tier ${tier}`);
      }
    } catch (err) {
      console.error('❌ Stripe or Supabase error:', err);
    }
  }

  res.json({ received: true });
});

const PORT = 5176;
app.listen(PORT, () => {
  console.log(`✅ Webhook server listening on http://localhost:${PORT}/webhook`);
});