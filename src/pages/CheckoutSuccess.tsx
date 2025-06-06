import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase.js'; // Import supabase client
import { useAuthContext } from '../context/AuthContext.js'; // Import auth context
import { trackPurchase } from '../utils/metaPixel.js';

const POLLING_INTERVAL = 2000; // Check every 2 seconds
const MAX_POLLING_TIME = 20000; // Stop after 20 seconds

// Pricing mapping for Meta Pixel tracking
const SUBSCRIPTION_PRICES = {
  basic: {
    weekly: 17.99,
    monthly: 59.99,
    yearly: 599.99
  },
  pro: {
    weekly: 59.99,
    monthly: 239.99,
    yearly: 599.99
  }
};

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshAuthStatus } = useAuthContext(); // Get the refresh function from context
  const [statusMessage, setStatusMessage] = useState('Verifying your subscription...');
  const [isVerifying, setIsVerifying] = useState(true);

  // Check for test parameter and fire test purchase event
  useEffect(() => {
    const testParam = searchParams.get('test');
    if (testParam === '1') {
      console.log('🧪 TEST MODE: Firing test purchase event for $1');
      trackPurchase(1, 'USD', 'Test Purchase');
      setStatusMessage('Test purchase event fired! Check Meta Pixel Helper.');
      setIsVerifying(false);
      return; // Exit early, don't run normal polling logic
    }
  }, [searchParams]);

  useEffect(() => {
    // Skip normal polling if in test mode
    const testParam = searchParams.get('test');
    if (testParam === '1') {
      return;
    }

    let pollingTimer: ReturnType<typeof setInterval> | null = null;
    let timeoutTimer: ReturnType<typeof setTimeout> | null = null;
    let elapsedTime = 0;

    const checkSubscriptionStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Polling user status:', user?.user_metadata);

        // Check if metadata exists and tier is updated (not free)
        if (user?.user_metadata?.subscription_tier && user.user_metadata.subscription_tier !== 'free') {
          setStatusMessage('Subscription confirmed!');
          setIsVerifying(false);
          if (pollingTimer) clearInterval(pollingTimer);
          if (timeoutTimer) clearTimeout(timeoutTimer);
          
          // Track purchase with Meta Pixel
          const tier = user.user_metadata.subscription_tier as 'basic' | 'pro';
          // Default to monthly if no interval found, could be improved by storing this in metadata
          const defaultPrice = SUBSCRIPTION_PRICES[tier]?.monthly || 99.99;
          const contentName = `${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan`;
          
          console.log('Tracking purchase:', { value: defaultPrice, contentName });
          trackPurchase(defaultPrice, 'USD', contentName);
          
          // Refresh context state BEFORE navigating
          console.log('Refreshing auth context before navigation...');
          await refreshAuthStatus(); 
          console.log('Auth context refreshed.');
          
          navigate('/dashboard');
        } else {
          // Keep polling if time allows
          elapsedTime += POLLING_INTERVAL;
          if (elapsedTime >= MAX_POLLING_TIME) {
            setStatusMessage('Verification timed out. Please check your account or refresh.');
            setIsVerifying(false);
            if (pollingTimer) clearInterval(pollingTimer);
          }
        }
      } catch (error) {
        console.error('Error polling user status:', error);
        setStatusMessage('Error verifying subscription. Please refresh.');
        setIsVerifying(false);
        if (pollingTimer) clearInterval(pollingTimer);
        if (timeoutTimer) clearTimeout(timeoutTimer);
      }
    };

    // Start polling
    pollingTimer = setInterval(checkSubscriptionStatus, POLLING_INTERVAL);

    // Set max timeout
    timeoutTimer = setTimeout(() => {
      if (pollingTimer) {
        clearInterval(pollingTimer);
        if (isVerifying) { // Check if still verifying when timeout hits
           setStatusMessage('Verification taking longer than expected. Redirecting now...');
           // Decide whether to redirect anyway or show error
           navigate('/dashboard'); 
        }
      }
    }, MAX_POLLING_TIME);

    // Initial check immediately
    checkSubscriptionStatus(); 

    // Cleanup timers on component unmount
    return () => {
      if (pollingTimer) clearInterval(pollingTimer);
      if (timeoutTimer) clearTimeout(timeoutTimer);
    };
    // Run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [navigate, refreshAuthStatus, searchParams]);

  const testParam = searchParams.get('test');
  const isTestMode = testParam === '1';

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {isTestMode ? (
              <>
                <h2 className="text-2xl font-bold text-orange-600 mb-4">
                  🧪 Test Mode Active
                </h2>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <p className="text-orange-800 font-semibold">Test Purchase Event Fired!</p>
                  <p className="text-sm text-orange-600 mt-2">
                    Value: $1.00 USD<br/>
                    Content: Test Purchase<br/>
                    Check your Meta Pixel Helper and Events Manager
                  </p>
                </div>
                <button
                  onClick={() => trackPurchase(1, 'USD', 'Manual Test Purchase')}
                  className="mb-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  Fire Another Test Event
                </button>
              </>
            ) : (
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Thank you for your subscription!
              </h2>
            )}
            
            {isVerifying && !isTestMode ? (
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                <p className="text-gray-600">{statusMessage}</p>
              </div>
            ) : (
               <p className="text-gray-600 mb-4">{statusMessage}</p>
            )}
            
            <p className="text-sm text-gray-500">
              {isTestMode 
                ? 'This is a test page. Remove ?test=1 from URL for normal behavior.'
                : isVerifying 
                  ? 'Please wait while we confirm your details.' 
                  : 'You can now close this page or wait to be redirected.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 