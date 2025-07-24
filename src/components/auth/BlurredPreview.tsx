// This component is used to show a blurred preview of content that requires a subscription level to access.
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext.js';
import { useState } from 'react';

interface BlurredPreviewProps {
  children: React.ReactNode;
  requiredSubscription?: 'free' | 'basic' | 'pro';
}

// TEMPORARY OVERRIDE: Disable blur/upgrade gating during development
const DISABLE_BLUR = false; // TODO: revert to false when re-enabling gating

export default function BlurredPreview({ children, requiredSubscription = 'free' }: BlurredPreviewProps) {
  const { user } = useAuthContext();
  console.log('user in BlurredPreview', user);
  const userTier = user?.subscription_tier || 'free';
  const subscriptionLevels = { free: 0, basic: 1, pro: 2 };

  // VIP password modal state
  const [showPrompt, setShowPrompt] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState('');
  const [showVIP, setShowVIP] = useState(false);
  const VIP_PASSWORD = 'vip2024'; // Keep in sync with ExpertInsightContent

  // If blur is disabled OR user has sufficient subscription level, show content normally
  if (DISABLE_BLUR || (user && subscriptionLevels[userTier] >= subscriptionLevels[requiredSubscription]) || showVIP) {
    return <>{children}</>;
  }

  // Password submit handler
  const handleVIPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwInput === VIP_PASSWORD) {
      setShowVIP(true);
      setShowPrompt(false);
      setPwInput('');
      setPwError('');
    } else {
      setPwError('Incorrect password');
    }
  };

  return (
    <div className="relative">
      {/* VIP Password Modal for Betting Picks */}
      {showPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setShowPrompt(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-green-700">VIP Access</h3>
            <form onSubmit={handleVIPSubmit}>
              <input
                type="password"
                className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                placeholder="Enter VIP password"
                value={pwInput}
                onChange={e => setPwInput(e.target.value)}
                autoFocus
              />
              {pwError && <div className="text-red-600 text-sm mb-2">{pwError}</div>}
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold"
              >
                Unlock
              </button>
            </form>
          </div>
        </div>
      )}
      {/* VIP Button replaces upgrade prompt for Betting Picks only */}
      {requiredSubscription === 'pro' ? (
        <div className="sticky top-0 z-50 pt-4 pb-6">
          <div className="text-center max-w-md mx-auto p-4 bg-white/95 rounded-lg shadow-lg backdrop-blur-sm">
            <button
              className="w-full bg-green-600 text-white py-2 rounded font-semibold text-lg hover:bg-green-700 shadow"
              onClick={() => setShowPrompt(true)}
              type="button"
            >
              Enter VIP password for access
            </button>
          </div>
        </div>
      ) : (
        // Default upgrade/sign in prompt for other pages
        <div className="sticky top-0 z-50 pt-4 pb-6">
          <div className="text-center max-w-md mx-auto p-4 bg-white/95 rounded-lg shadow-lg backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {user ? 'Upgrade to Access Premium Features' : 'Get Access to Premium Features'}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {user 
                ? `Upgrade your plan to access ${requiredSubscription} tier features and more.`
                : 'Choose a plan that fits your needs and get access to all our professional golf analysis tools.'}
            </p>
            <div className="space-x-4">
              <Link
                to="/subscription"
                className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {user ? 'Upgrade Plan' : 'View Plans'}
              </Link>
              {!user && (
                <Link
                  to="/auth"
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Content with blur effect */}
      <div className="relative">
        <div className="absolute inset-0 backdrop-blur-[3.5px] bg-white/20 z-40" />
        <div className="blur-[3.5px] pointer-events-none">
          {children}
        </div>
      </div>
    </div>
  );
}