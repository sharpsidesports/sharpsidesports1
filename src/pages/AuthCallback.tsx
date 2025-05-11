import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

// Helper to poll for a valid session
async function waitForSession(maxWait = 5000) {
  const start = Date.now();
  while (Date.now() - start < maxWait) {
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session?.access_token) {
      return sessionData.session.access_token;
    }
    await new Promise(res => setTimeout(res, 200));
  }
  throw new Error('Session not available after sign-up/sign-in');
}

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const accessToken = await waitForSession();
        const stored = sessionStorage.getItem('selectedPlan');
        if (stored) {
          sessionStorage.removeItem('selectedPlan');
          const { plan, interval } = JSON.parse(stored);
          const res = await fetch('/api/stripe/create-checkout-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({ plan, billingInterval: interval })
          });
          if (!res.ok) throw new Error('Failed to create checkout session');
          const { sessionId } = await res.json();
          const stripe = await stripePromise;
          if (stripe) {
            await stripe.redirectToCheckout({ sessionId });
            return;
          }
        }
        // If no plan or error, go to dashboard
        navigate('/dashboard', { replace: true });
      } catch (err) {
        navigate('/dashboard', { replace: true });
      }
    })();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  );
} 