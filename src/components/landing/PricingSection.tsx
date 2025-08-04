import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import BettingTicketsGrid from '../BettingTicketsGrid.js';
import { useAuthContext } from '../../context/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase.js'; // Added .js extension
import { trackEvent } from '../../utils/metaPixel.js';

// Initialize Stripe with the environment variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface PricingFeature {
  name: string;
  includedIn: ('all-access' | 'football-season' | 'golf-only')[];
}

type BillingInterval = 'weekly' | 'monthly' | 'yearly' | 'season';

const features: PricingFeature[] = [
  { name: 'All sports coverage', includedIn: ['all-access'] },
  { name: 'Betting picks', includedIn: ['all-access', 'football-season', 'golf-only'] },
  { name: 'All tools & models', includedIn: ['all-access'] },
  { name: 'Priority support', includedIn: ['all-access', 'golf-only'] },
  { name: 'NFL betting picks', includedIn: ['football-season'] },
  { name: 'CFB betting picks', includedIn: ['football-season'] },
  { name: 'Football models & tools', includedIn: ['football-season'] },
  { name: 'Season-long access', includedIn: ['football-season'] },
  { name: 'Golf betting picks', includedIn: ['golf-only'] },
  { name: 'All golf tools', includedIn: ['golf-only'] },
  { name: 'Course fit analysis', includedIn: ['golf-only'] },
];

const plans = [
  {
    id: 'all-access',
    name: 'All Access',
    description: 'Complete access to all sports and tools',
    price: {
      weekly: '99.99',
      monthly: '299.99',
      yearly: '1299.99'
    },
    buttonText: 'Start All Access Plan',
    buttonStyle: 'text-white bg-green-500 hover:bg-green-600',
    featured: true,
    tag: 'Most Popular'
  },
  {
    id: 'football-season',
    name: 'Football Season',
    description: 'Complete NFL & CFB coverage for the entire season',
    price: {
      season: '899.99'
    },
    buttonText: 'Get Season Subscription',
    buttonStyle: 'text-white bg-blue-500 hover:bg-blue-600',
    featured: false,
    isSeasonPass: true
  },
  {
    id: 'golf-only',
    name: 'Golf Only',
    description: 'Complete golf analytics and betting tools',
    price: {
      weekly: '59.99',
      monthly: '239.99',
      yearly: '599.99'
    },
    buttonText: 'Start Golf Plan',
    buttonStyle: 'text-white bg-green-500 hover:bg-green-600',
    featured: false,
    tag: 'Best Value'
  }
];

async function createCheckoutSession(
  plan: string,
  billingInterval: 'weekly' | 'monthly' | 'yearly' | 'season'
) {
  // Get Supabase session/token
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session?.access_token) {
      throw new Error(sessionError?.message || 'User must be logged in to subscribe');
  }
  const token = session.access_token;

  const res = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Add Authorization header
     },
    body: JSON.stringify({ plan, billingInterval }),
  });

  if (!res.ok) {
    const errorBody = await res.json(); // Read error body
    throw new Error(errorBody.error || `Server error: ${res.statusText}`);
  }
  return res.json() as Promise<{ sessionId: string }>; 
}

export default function PricingSection() {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleSubscribe = async (plan: string) => {
    if (plan === 'free') return;
    
    const selectedPlan = plans.find(p => p.id === plan);
    const interval = selectedPlan?.isSeasonPass ? 'season' : billingInterval;
    const price = selectedPlan?.price[interval as keyof typeof selectedPlan.price] || '0';
    
    // Track subscription initiation
    trackEvent('InitiateCheckout', {
      content_name: `${selectedPlan?.name || plan} Plan`,
      content_category: 'subscription',
      value: parseFloat(price),
      currency: 'USD'
    });
    
    if (!user) {
      sessionStorage.setItem('selectedPlan', JSON.stringify({ plan, interval }));
      navigate('/auth');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const session = await createCheckoutSession(plan, interval);
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
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
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mx-auto max-w-4xl mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
          <p className="mt-4 text-lg text-gray-500">
            Select the plan that best fits your betting strategy
          </p>
        </div>

        {/* All Access Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">All Access</h3>
            <p className="text-gray-600">Complete access to all sports and tools</p>
        </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {['weekly', 'monthly', 'yearly'].map((interval) => {
              const plan = plans.find(p => p.id === 'all-access');
              const price = plan?.price[interval as keyof typeof plan.price] || '0';
              const isPopular = interval === 'monthly';
              
              return (
              <div
                  key={interval}
                  className={`bg-white rounded-lg shadow-lg border-2 p-6 relative ${
                    isPopular ? 'border-green-500' : 'border-gray-200'
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
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{interval.charAt(0).toUpperCase() + interval.slice(1)}</h4>
                    <p className="text-4xl font-bold text-gray-900 mb-1">${price}</p>
                    <p className="text-gray-500 mb-6">per {interval}</p>
                  <button
                      onClick={() => {
                        const urls = {
                          weekly: 'https://www.winible.com/checkout/1359269787951190914?store_url=/sharpsidesports&interval=week',
                          monthly: 'https://www.winible.com/checkout/1359269787951190914?store_url=/sharpsidesports&interval=month',
                          yearly: 'https://www.winible.com/checkout/1359269787951190914?store_url=/sharpsidesports&interval=year'
                        };
                        window.location.href = urls[interval as keyof typeof urls];
                      }}
                      className={`w-full py-3 px-6 rounded-md transition-colors ${
                        isPopular 
                          ? 'bg-green-500 hover:bg-green-600 text-white' 
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      }`}
                  >
                      {`Start ${interval.charAt(0).toUpperCase() + interval.slice(1)}`}
                  </button>
                </div>
                  <ul className="mt-6 space-y-3 text-sm text-gray-600">
                    {features.filter(f => f.includedIn.includes('all-access')).map((feature) => (
                      <li key={feature.name} className="flex items-center">
                        <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        {feature.name}
                        </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Football Season Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Football Season</h3>
            <p className="text-gray-600">Complete NFL & CFB coverage for the entire season</p>
          </div>
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-lg border-2 border-blue-500 p-6">
              <div className="text-center">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Season Pass</h4>
                <p className="text-4xl font-bold text-gray-900 mb-1">$899.99</p>
                <p className="text-gray-500 mb-6">for the entire season</p>
                <button
                  onClick={() => window.location.href = 'https://www.winible.com/checkout/1378745735868076494?pid=1378745735880659408'}
                  className="w-full py-3 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Get Season Subscription
                </button>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                {features.filter(f => f.includedIn.includes('football-season')).map((feature) => (
                  <li key={feature.name} className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {feature.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Golf Only Section */}
        <div>
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Golf Only</h3>
            <p className="text-gray-600">Complete golf analytics and betting tools</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {['weekly', 'monthly', 'yearly'].map((interval) => {
              const plan = plans.find(p => p.id === 'golf-only');
              const price = plan?.price[interval as keyof typeof plan.price] || '0';
              const isPopular = interval === 'yearly';
              
              return (
                <div
                  key={interval}
                  className={`bg-white rounded-lg shadow-lg border-2 p-6 relative ${
                    isPopular ? 'border-green-500' : 'border-gray-200'
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
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{interval.charAt(0).toUpperCase() + interval.slice(1)}</h4>
                    <p className="text-4xl font-bold text-gray-900 mb-1">${price}</p>
                    <p className="text-gray-500 mb-6">per {interval}</p>
          <button 
                      onClick={() => {
                        const urls = {
                          weekly: 'https://www.winible.com/checkout/1378395472007287051?store_url=/sharpsidesports&interval=week',
                          monthly: 'https://www.winible.com/checkout/1378395472007287051?store_url=/sharpsidesports&interval=month',
                          yearly: 'https://www.winible.com/checkout/1378395472007287051?store_url=/sharpsidesports&interval=year'
                        };
                        window.location.href = urls[interval as keyof typeof urls];
                      }}
                      className={`w-full py-3 px-6 rounded-md transition-colors ${
                        isPopular 
                          ? 'bg-green-500 hover:bg-green-600 text-white' 
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
            }`}
          >
                      {`Start ${interval.charAt(0).toUpperCase() + interval.slice(1)}`}
          </button>
                  </div>
                  <ul className="mt-6 space-y-3 text-sm text-gray-600">
                    {features.filter(f => f.includedIn.includes('golf-only')).map((feature) => (
                      <li key={feature.name} className="flex items-center">
                        <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {feature.name}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">How It Works</h3>
            <p className="text-gray-600">Simple steps to get started with your winning picks</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-lg">1</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Plan</h4>
                <p className="text-gray-600 text-sm">Choose your subscription plan and sign up with your email.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-lg">2</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Get Winning Picks</h4>
                <p className="text-gray-600 text-sm">Get winning picks and projections sent directly to your inbox.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-lg">3</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Access Everything</h4>
                <p className="text-gray-600 text-sm">Or log in with your password to access everything on the site.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-lg">4</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Backed by Data</h4>
                <p className="text-gray-600 text-sm">Backed by data models and years of betting experience.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}