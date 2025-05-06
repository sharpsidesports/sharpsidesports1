import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CheckIcon } from '@heroicons/react/24/outline';
import { useAuthContext } from '../../context/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase.js';
import Modal from '../Modal.js';
import SignUpForm from '../auth/SignUpForm.js';

// Initialize Stripe with the environment variable
// Ensure that the publishable key is present in the environment variables
// and is not empty before initializing the Stripe instance. ALSO, VITE_ prefix is REQUIRED because it is a client-side call!
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

// Log Stripe initialization
console.log('Stripe publishable key exists:', !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const billingIntervals = [
  { id: 'weekly', name: 'Weekly' },
  { id: 'monthly', name: 'Monthly' },
  { id: 'yearly', name: 'Yearly' },
];

const allFeatures = [
  'Strokes Gained Statistics',
  'Basic player rankings',
  'Model Dashboard',
  'Matchup Tool',
  '3-Ball Tool',
  'Historical performance data',
  'Expert Insights',
  'AI Caddie',
  'Course Fit Tool',
  'Advanced analytics',
  'Priority support',
];

const tiers = [
  {
    id: 'free',
    name: 'Free',
    description: 'Basic access to essential golf statistics.',
    price: {
      weekly: '0',
      monthly: '0',
      yearly: '0',
    },
    features: [
      'Strokes Gained Statistics',
      'Basic player rankings',
    ],
    cta: 'Get Started',
    mostPopular: false,
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Advanced tools for serious golf analysis',
    price: {
      weekly: '17.99',
      monthly: '59.99',
      yearly: '599.99',
    },
    features: [
      'Strokes Gained Statistics',
      'Basic player rankings',
      'Model Dashboard',
      'Matchup Tool',
      '3-Ball Tool',
    ],
    cta: 'Start Basic Plan',
    mostPopular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Complete suite of professional golf analysis tools',
    price: {
      weekly: '59.99',
      monthly: '199.99',
      yearly: '999.99',
    },
    features: allFeatures,
    cta: 'Start Pro Plan',
    mostPopular: true,
  },
];

export default function PricingPlans() {
  const [selectedInterval, setSelectedInterval] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [showSignUpModal, setShowSignUpModal] = useState(false);

// --- helper ----------------------------------------------------
async function createCheckoutSession(
  plan: string,
  billingInterval: 'weekly' | 'monthly' | 'yearly'
) {
    // 1) grab current session & token
    const {
      data: { session }
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    console.log('🔥 debug token:', session?.access_token);

    // 2) include the Bearer token so your Vercel function can authenticate
    const res = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ plan, billingInterval })
    });

  if (!res.ok) {
    throw new Error(`Server error ${res.status}: ${res.statusText}`);
  }

  const { sessionId } = await res.json() as { sessionId: string };
  return sessionId;
}
// ----------------------------------------------------------------

const handleSubscribe = async (plan: string) => {
    if (plan === 'free') return;
    
    // If user is not authenticated, redirect to auth page
    if (!user) {
      // Store the selected plan and interval in sessionStorage
      sessionStorage.setItem('selectedPlan', JSON.stringify({ plan, interval: selectedInterval }));
      navigate('/auth');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const sessionId = await createCheckoutSession(plan, selectedInterval as 'weekly' | 'monthly' | 'yearly');
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }
      
      const { error } = await stripe.redirectToCheckout({ sessionId });

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
    <div className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {error && (
          <div className="mx-auto max-w-4xl mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-green-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the right plan for your game
          </p>
        </div>
        <div className="mt-16 flex justify-center">
          <div className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg">
            {billingIntervals.map((interval) => (
              <button
                key={interval.id}
                onClick={() => setSelectedInterval(interval.id)}
                className={`px-6 py-3 text-base font-semibold rounded-md transition-all duration-200 ${
                  selectedInterval === interval.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {interval.name}
              </button>
            ))}
          </div>
        </div>
        <div className="isolate mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:mt-20 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-3xl p-8 ring-1 ring-gray-200 transition-all duration-200 hover:ring-2 hover:ring-green-500 ${
                tier.mostPopular ? 'bg-gray-900 text-white ring-gray-900' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  id={tier.name}
                  className={`text-base font-semibold leading-7 ${
                    tier.mostPopular ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {tier.name}
                </h3>
                {tier.mostPopular ? (
                  <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-semibold leading-5 text-green-400">
                    Most popular
                  </span>
                ) : null}
              </div>
              <p className={`mt-3 text-sm leading-6 ${
                tier.mostPopular ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {tier.description}
              </p>
              <p className="mt-4 flex items-baseline gap-x-1">
                <span className={`text-3xl font-bold tracking-tight ${
                  tier.mostPopular ? 'text-white' : 'text-gray-900'
                }`}>
                  ${tier.price[selectedInterval as keyof typeof tier.price]}
                </span>
                <span className={`text-sm font-semibold leading-6 ${
                  tier.mostPopular ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  /{selectedInterval}
                </span>
              </p>
              <button
                onClick={() => setShowSignUpModal(true)}
                disabled={loading}
                className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-bold text-lg shadow-sm transition-all duration-150
                  ${tier.mostPopular ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-white hover:bg-gray-50 text-green-700'}
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="font-bold">Sign up to get started</span>
              </button>
              <Modal isOpen={showSignUpModal} onClose={() => setShowSignUpModal(false)}>
                <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">Sign up to get started</h2>
                <SignUpForm ctaText="Sign up to get started" />
              </Modal>
              <ul
                role="list"
                className={`mt-6 space-y-2 text-sm leading-6 ${
                  tier.mostPopular ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {allFeatures.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    {tier.features.includes(feature) ? (
                      <CheckIcon
                        className={`h-5 w-5 flex-none ${
                          tier.mostPopular ? 'text-green-400' : 'text-green-600'
                        }`}
                        aria-hidden="true"
                      />
                    ) : (
                      <div className={`h-5 w-5 flex-none rounded-full border ${
                        tier.mostPopular ? 'border-gray-600' : 'border-gray-300'
                      }`} />
                    )}
                    <span className={tier.features.includes(feature) ? '' : 'opacity-50'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}