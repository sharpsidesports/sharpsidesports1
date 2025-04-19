import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const STRIPE_BASIC_PRODUCT_ID = import.meta.env.VITE_STRIPE_BASIC_PRODUCT_ID;
const STRIPE_PRO_PRODUCT_ID = import.meta.env.VITE_STRIPE_PRO_PRODUCT_ID;

if (!STRIPE_PUBLIC_KEY) {
  throw new Error('Missing Stripe publishable key');
}

export const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  BASIC: 'basic',
  PRO: 'pro'
} as const;

export type SubscriptionTier = typeof SUBSCRIPTION_TIERS[keyof typeof SUBSCRIPTION_TIERS];

export const PRODUCT_IDS = {
  [SUBSCRIPTION_TIERS.BASIC]: STRIPE_BASIC_PRODUCT_ID,
  [SUBSCRIPTION_TIERS.PRO]: STRIPE_PRO_PRODUCT_ID,
};

export async function createCheckoutSession(priceId: string, customerId?: string) {
  try {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        customerId,
      }),
    });

    const { sessionId } = await response.json();
    const stripe = await stripePromise;
    
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) {
      throw error;
    }
  } catch (err) {
    console.error('Error creating checkout session:', err);
    throw err;
  }
}

export async function createCustomerPortalSession() {
  try {
    const response = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { url } = await response.json();
    window.location.href = url;
  } catch (err) {
    console.error('Error creating portal session:', err);
    throw err;
  }
} 