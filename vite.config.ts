import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import express from 'express';
import bodyParser from 'body-parser';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  // Initialize Stripe
  const stripe = new Stripe(env.VITE_STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
  });

  // Initialize webhook server
  const app = express();
  app.use(bodyParser.raw({ type: 'application/json' }));
  
  // Webhook endpoint
  app.post('/api/stripe/webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig || '',
        env.VITE_STRIPE_WEBHOOK_SECRET || ''
      );
      console.log('Event constructed successfully:', event.type);
    } catch (err) {
      console.error('Error constructing webhook event:', err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
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

        // Initialize Supabase client for this request
        const supabase = createClient(
          env.VITE_SUPABASE_URL || '',
          env.VITE_SUPABASE_SERVICE_ROLE_KEY || ''
        );

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
        return res.status(500).send('Error processing subscription');
      }
    }

    res.json({ received: true });
  });

  // Start webhook server
  const webhookPort = 5176;
  app.listen(webhookPort, () => {
    console.log(`Webhook server listening on port ${webhookPort}`);
  });

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/datagolf': {
          target: 'https://feeds.datagolf.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/datagolf/, ''),
        },
        '/api/stripe/webhook': {
          target: `http://localhost:${webhookPort}`,
          changeOrigin: true,
        },
      },
    },
    define: {
      __STRIPE_PUBLISHABLE_KEY__: JSON.stringify(env.VITE_STRIPE_PUBLISHABLE_KEY),
      __STRIPE_PRO_PRICE_WEEKLY_ID__: JSON.stringify(env.VITE_STRIPE_PRO_PRICE_WEEKLY_ID),
      __STRIPE_PRO_PRICE_MONTHLY_ID__: JSON.stringify(env.VITE_STRIPE_PRO_PRICE_MONTHLY_ID),
      __STRIPE_PRO_PRICE_YEARLY_ID__: JSON.stringify(env.VITE_STRIPE_PRO_PRICE_YEARLY_ID),
      __STRIPE_BASIC_PRICE_WEEKLY_ID__: JSON.stringify(env.VITE_STRIPE_BASIC_PRICE_WEEKLY_ID),
      __STRIPE_BASIC_PRICE_MONTHLY_ID__: JSON.stringify(env.VITE_STRIPE_BASIC_PRICE_MONTHLY_ID),
      __STRIPE_BASIC_PRICE_YEARLY_ID__: JSON.stringify(env.VITE_STRIPE_BASIC_PRICE_YEARLY_ID),
    }
  };
});