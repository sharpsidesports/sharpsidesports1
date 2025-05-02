import { useEffect, useState } from 'react';
// Removed useNavigate import as it's no longer used for automatic redirect
// import { useNavigate } from 'react-router-dom'; 
import { supabase } from '../lib/supabase.js'; // Import supabase client
import { useAuthContext } from '../context/AuthContext.js'; // Import auth context

const POLLING_INTERVAL = 2000; // Check every 2 seconds
const MAX_POLLING_TIME = 20000; // Stop after 20 seconds

export default function CheckoutSuccess() {
  // Removed navigate
  // const navigate = useNavigate(); 
  const { refreshAuthStatus } = useAuthContext(); // Get refreshAuthStatus from context
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

        if (user?.user_metadata?.subscription_tier && user.user_metadata.subscription_tier !== 'free') {
          // --- UPDATED: Set success message, don't navigate --- 
          setStatusMessage('You now have premium access!'); 
          setIsVerifying(false);
          if (pollingTimer) clearInterval(pollingTimer);
          if (timeoutTimer) clearTimeout(timeoutTimer);
          
          console.log('Subscription confirmed, refreshing context...');
          await refreshAuthStatus(); // Still refresh context
          console.log('Context refreshed.');
          // --- END UPDATE ---
        } else {
          elapsedTime += POLLING_INTERVAL;
          if (elapsedTime >= MAX_POLLING_TIME) {
            // --- UPDATED: Set timeout message, don't navigate --- 
            setStatusMessage('Verification timed out. Please refresh the page or navigate using the menu.');
            setIsVerifying(false);
            if (pollingTimer) clearInterval(pollingTimer);
             // --- END UPDATE ---
          }
        }
      } catch (error) {
        console.error('Error polling user status:', error);
        // --- UPDATED: Set error message, don't navigate --- 
        setStatusMessage('Error verifying subscription. Please try refreshing the page.');
        setIsVerifying(false);
        if (pollingTimer) clearInterval(pollingTimer);
        if (timeoutTimer) clearTimeout(timeoutTimer);
        // --- END UPDATE ---
      }
    };

    pollingTimer = setInterval(checkSubscriptionStatus, POLLING_INTERVAL);

    // Timeout logic no longer navigates, just stops polling and allows message update
    timeoutTimer = setTimeout(() => {
      if (pollingTimer) {
        clearInterval(pollingTimer);
        if (isVerifying) { 
           // Status message is set within checkSubscriptionStatus timeout logic
        }
      }
    }, MAX_POLLING_TIME);

    checkSubscriptionStatus(); 

    return () => {
      if (pollingTimer) clearInterval(pollingTimer);
      if (timeoutTimer) clearTimeout(timeoutTimer);
    };
    // Removed navigate from dependency array
  }, [refreshAuthStatus]); 

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
               <p className="text-green-600 font-semibold mb-4">{statusMessage}</p> // Make success message green
            )}
            {/* Updated final text */}
            <p className="text-sm text-gray-500">
              {isVerifying ? 'Please wait while we confirm your details.' : 'Your account access has been updated. You can navigate using the menu above.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 