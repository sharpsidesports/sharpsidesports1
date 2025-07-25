import { useState, forwardRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CheckIcon } from '@heroicons/react/24/outline';
import { useAuthContext } from '../../context/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase.js';
import BettingTicketsGrid from '../BettingTicketsGrid.js';
import { trackEvent } from '../../utils/metaPixel.js';

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

const allAccessFeatures = [
  'All sports coverage',
  'Betting picks',
  'All tools & models',
  'Priority support',
];

const footballFeatures = [
  'NFL betting picks',
  'CFB betting picks',
  'Football models & tools',
  'Season-long access',
];

const golfFeatures = [
  'Golf betting picks',
  'All golf tools',
  'Course fit analysis',
  'Priority support',
];

const tiers = [
  {
    id: 'all-access',
    name: 'All Access',
    description: 'Complete access to all sports and tools',
    price: {
      weekly: '99.99',
      monthly: '299.99',
      yearly: '1199.99',
    },
    features: allAccessFeatures,
    cta: 'Start All Access Plan',
    mostPopular: true,
  },
  {
    id: 'football-season',
    name: 'Football Season',
    description: 'Complete NFL & CFB coverage for the entire season',
    price: {
      season: '799.99',
    },
    features: footballFeatures,
    cta: 'Get Season Subscription',
    mostPopular: false,
    isSeasonPass: true,
  },
  {
    id: 'golf-only',
    name: 'Golf Only',
    description: 'Complete golf analytics and betting tools',
    price: {
      weekly: '59.99',
      monthly: '239.99',
      yearly: '599.99',
    },
    features: golfFeatures,
    cta: 'Start Golf Plan',
    mostPopular: false,
  },
];

const PricingPlans = forwardRef<HTMLDivElement>((props, ref) => {
  const [selectedInterval, setSelectedInterval] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  async function createCheckoutSession(
    plan: string,
    billingInterval: 'weekly' | 'monthly' | 'yearly' | 'season'
  ) {
    const {
      data: { session }
    } = await supabase.auth.getSession();
    const token = session?.access_token;
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

  const handleSubscribe = async (plan: string) => {
    if (plan === 'free') return;
    
    // Track subscription initiation
    const tier = tiers.find(t => t.id === plan);
    const key = tier?.isSeasonPass ? 'season' : selectedInterval;
    const price = tier?.price[key as keyof typeof tier.price] || '0';
    trackEvent('InitiateCheckout', {
      content_name: `${tier?.name || plan} Plan`,
      content_category: 'subscription',
      value: parseFloat(price),
      currency: 'USD'
    });
    
    if (!user) {
      sessionStorage.setItem('selectedPlan', JSON.stringify({ plan, interval: tier?.isSeasonPass ? 'season' : selectedInterval }));
      navigate('/auth');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const billingInterval = tier?.isSeasonPass ? 'season' : selectedInterval as 'weekly' | 'monthly' | 'yearly' | 'season';
      const sessionId = await createCheckoutSession(plan, billingInterval);
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
    <div className="bg-white py-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {error && (
          <div className="mx-auto max-w-4xl mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        <BettingTicketsGrid />
        {/* Removed headline and subheadline to avoid duplication with the hero section */}

        <div id="plans" className="h-0 scroll-mt-24" />
        
        {/* All Access Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">All Access</h3>
            <p className="text-gray-600">Complete access to all sports and tools</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {billingIntervals.map((interval) => {
              const allAccessTier = tiers.find(t => t.id === 'all-access');
              const allAccessPrice = allAccessTier?.price[interval.id as keyof typeof allAccessTier.price] || '0';
              const isPopular = interval.id === 'monthly';
              
              return (
                <div
                  key={interval.id}
                  className={`rounded-lg shadow-lg border-2 p-6 relative ${
                    isPopular ? 'border-green-500 bg-white' : 'border-gray-200 bg-white'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                  </span>
              </div>
                  )}
                  <div className="text-center">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{interval.name}</h4>
                    <p className="text-4xl font-bold text-gray-900 mb-1">${allAccessPrice}</p>
                    <p className="text-gray-500 mb-6">per {interval.id}</p>
              <button
                      onClick={() => {
                        const urls = {
                          weekly: 'https://www.winible.com/checkout/1359269787951190914?store_url=/sharpsidesports&interval=week',
                          monthly: 'https://www.winible.com/checkout/1359269787951190914?store_url=/sharpsidesports&interval=month',
                          yearly: 'https://www.winible.com/checkout/1359269787951190914?store_url=/sharpsidesports&interval=year'
                        };
                        window.location.href = urls[interval.id as keyof typeof urls];
                      }}
                      className={`w-full py-3 px-6 rounded-md transition-colors ${
                        isPopular 
                          ? 'bg-green-500 hover:bg-green-600 text-white' 
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      }`}
              >
                      {`Start ${interval.name}`}
              </button>
                  </div>
                  <ul className="mt-6 space-y-3 text-sm text-gray-600">
                    {allAccessFeatures.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Football Season Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Football Season</h3>
            <p className="text-gray-600">Complete NFL & CFB coverage for the entire season</p>
          </div>
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-lg border-2 border-blue-500 p-6">
                              <div className="text-center">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Season Pass</h4>
                  <p className="text-4xl font-bold text-gray-900 mb-1">$799.99</p>
                  <p className="text-gray-500 mb-6">for the entire season</p>
                  <button 
                    onClick={() => window.location.href = 'https://www.winible.com/checkout/1378745735868076494?pid=1378745735876465103'}
                    className="w-full py-3 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Get Season Subscription
                  </button>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                {footballFeatures.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Golf Only Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Golf Only</h3>
            <p className="text-gray-600">Complete golf analytics and betting tools</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {billingIntervals.map((interval) => {
              const golfTier = tiers.find(t => t.id === 'golf-only');
              const golfPrice = golfTier?.price[interval.id as keyof typeof golfTier.price] || '0';
              const isPopular = interval.id === 'monthly';
              
              return (
                <div
                  key={interval.id}
                  className={`rounded-lg shadow-lg border-2 p-6 relative ${
                    isPopular ? 'border-green-500 bg-white' : 'border-gray-200 bg-white'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Best Value
                      </span>
                    </div>
                  )}
                  <div className="text-center">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{interval.name}</h4>
                    <p className="text-4xl font-bold text-gray-900 mb-1">${golfPrice}</p>
                    <p className="text-gray-500 mb-6">per {interval.id}</p>
                    <button 
                      onClick={() => {
                        const urls = {
                          weekly: 'https://www.winible.com/checkout/1378395472007287051?store_url=/sharpsidesports&interval=week',
                          monthly: 'https://www.winible.com/checkout/1378395472007287051?store_url=/sharpsidesports&interval=month',
                          yearly: 'https://www.winible.com/checkout/1378395472007287051?store_url=/sharpsidesports&interval=year'
                        };
                        window.location.href = urls[interval.id as keyof typeof urls];
                      }}
                      className={`w-full py-3 px-6 rounded-md transition-colors ${
                        isPopular 
                          ? 'bg-green-500 hover:bg-green-600 text-white' 
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      }`}
                    >
                      {`Start ${interval.name}`}
                    </button>
                  </div>
                  <ul className="mt-6 space-y-3 text-sm text-gray-600">
                    {golfFeatures.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

export default PricingPlans;