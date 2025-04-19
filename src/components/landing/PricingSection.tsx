import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with the environment variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface PricingFeature {
  name: string;
  includedIn: ('free' | 'basic' | 'pro')[];
}

type BillingInterval = 'weekly' | 'monthly' | 'yearly';

const features: PricingFeature[] = [
  { name: 'Strokes Gained Statistics', includedIn: ['free', 'basic', 'pro'] },
  { name: 'Basic player rankings', includedIn: ['free', 'basic', 'pro'] },
  { name: 'Model Dashboard', includedIn: ['basic', 'pro'] },
  { name: 'Matchup Tool', includedIn: ['basic', 'pro'] },
  { name: '3-Ball Tool', includedIn: ['basic', 'pro'] },
  { name: 'Historical performance data', includedIn: ['pro'] },
  { name: 'Expert Insights', includedIn: ['pro'] },
  { name: 'AI Caddie', includedIn: ['pro'] },
  { name: 'Course Fit Tool', includedIn: ['pro'] },
  { name: 'Advanced analytics', includedIn: ['pro'] },
  { name: 'Priority support', includedIn: ['pro'] },
];

const plans = [
  {
    id: 'free',
    name: 'Free',
    description: 'Basic access to essential golf statistics',
    price: {
      weekly: '0',
      monthly: '0',
      yearly: '0'
    },
    buttonText: 'Get Started',
    buttonStyle: 'text-gray-700 bg-white hover:bg-gray-50',
    featured: false
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Advanced tools for serious golf analysis',
    price: {
      weekly: '17.99',
      monthly: '59.99',
      yearly: '599.99'
    },
    buttonText: 'Start Basic Plan',
    buttonStyle: 'text-gray-700 bg-white hover:bg-gray-50',
    featured: true
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Complete suite of professional golf analysis tools',
    price: {
      weekly: '59.99',
      monthly: '199.99',
      yearly: '999.99'
    },
    buttonText: 'Start Pro Plan',
    buttonStyle: 'text-white bg-green-500 hover:bg-green-600',
    featured: false,
    tag: 'Most popular'
  }
];

async function createCheckoutSession(
  plan: string,
  billingInterval: 'weekly' | 'monthly' | 'yearly'
) {
  const res = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan, billingInterval }),
  });

  if (!res.ok) {
    throw new Error(`Server error: ${res.statusText}`);
  }
  return res.json() as Promise<{ id: string }>;
}

// This component renders the pricing section of the landing page
// It includes a list of plans with their features and a button to subscribe to each plan
// waits for stripe to load before redirecting to the checkout session
// On successful subscription, Stripe calls /api/stripe/create-checkout-session
export default function PricingSection() {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (plan: string) => {
    if (plan === 'free') return;
    
    try {
      setLoading(true);
      setError(null);
      const session = await createCheckoutSession(plan, billingInterval);
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mx-auto max-w-4xl mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        <div className="text-center">
          <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">
            Pricing
          </h2>
          <p className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Choose your plan
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg shadow-lg divide-y divide-gray-200 border-2 border-gray-900 ${
                plan.name === 'Pro' ? 'bg-gray-900' : 'bg-white'
              }`}
            >
              <div className="p-6">
                {plan.tag && (
                  <span className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-green-100 text-green-600 mb-4">
                    {plan.tag}
                  </span>
                )}
                <h2 className={`text-2xl font-semibold ${plan.name === 'Pro' ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h2>
                <p className={`mt-4 text-sm ${plan.name === 'Pro' ? 'text-gray-300' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
                <p className="mt-8">
                  <span className={`text-4xl font-extrabold ${plan.name === 'Pro' ? 'text-white' : 'text-gray-900'}`}>
                    ${plan.price[billingInterval]}
                  </span>
                  <span className={`text-base font-medium ${plan.name === 'Pro' ? 'text-gray-300' : 'text-gray-500'}`}>
                    /{billingInterval}
                  </span>
                </p>
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading || plan.id === 'free'}
                  className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium ${
                    plan.buttonStyle
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Loading...' : plan.buttonText}
                </button>
              </div>
              <div className="px-6 pt-6 pb-8">
                <ul className="space-y-4">
                  {features.map((feature) => {
                    const included = feature.includedIn.includes(plan.id as 'free' | 'basic' | 'pro');
                    return (
                      <li
                        key={feature.name}
                        className={`flex items-start ${
                          plan.name === 'Pro' ? 'text-gray-300' : 'text-gray-500'
                        }`}
                      >
                        {included ? (
                          <svg
                            className={`h-6 w-6 ${
                              plan.name === 'Pro' ? 'text-green-400' : 'text-green-500'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-6 w-6 text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        <span className="ml-3">{feature.name}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <button 
            onClick={() => setBillingInterval('weekly')}
            className={`px-6 py-2 rounded-md transition-colors ${
              billingInterval === 'weekly'
                ? 'text-white bg-green-500 hover:bg-green-600'
                : 'text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            Weekly
          </button>
          <button 
            onClick={() => setBillingInterval('monthly')}
            className={`px-6 py-2 rounded-md transition-colors ${
              billingInterval === 'monthly'
                ? 'text-white bg-green-500 hover:bg-green-600'
                : 'text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setBillingInterval('yearly')}
            className={`px-6 py-2 rounded-md transition-colors ${
              billingInterval === 'yearly'
                ? 'text-white bg-green-500 hover:bg-green-600'
                : 'text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>
    </div>
  );
} 