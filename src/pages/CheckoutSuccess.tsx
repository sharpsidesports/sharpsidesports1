import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js'; // Import supabase client
import { useAuthContext } from '../context/AuthContext.js'; // Import auth context

const POLLING_INTERVAL = 2000; // Check every 2 seconds
const MAX_POLLING_TIME = 20000; // Stop after 20 seconds

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const { refreshAuthStatus } = useAuthContext(); // Get the refresh function from context
  const [statusMessage, setStatusMessage] = useState('Verifying your subscription...');
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
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
  }, [navigate, refreshAuthStatus]);

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Thank you for your subscription!
            </h2>
            {isVerifying ? (
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                <p className="text-gray-600">{statusMessage}</p>
              </div>
            ) : (
               <p className="text-gray-600 mb-4">{statusMessage}</p>
            )}
            <p className="text-sm text-gray-500">
              {isVerifying ? 'Please wait while we confirm your details.' : 'You can now close this page or wait to be redirected.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 