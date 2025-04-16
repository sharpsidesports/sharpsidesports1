import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import { CheckIcon } from '@heroicons/react/24/outline';
import { User } from '../types/auth.js';
import { createCustomerPortalSession } from '../services/stripe.js';

interface Features {
  [key: string]: string[];
  free: string[];
  basic: string[];
  pro: string[];
}

export default function Account() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/subscription');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <p className="text-center text-gray-600">
            Please <a href="/auth/signin" className="text-green-600 hover:text-green-500">sign in</a> to view your account.
          </p>
        </div>
      </div>
    );
  }

  const features: Features = {
    free: [
      'Basic golf stats tracking',
      'Limited historical data',
      'Community forum access'
    ],
    basic: [
      'Advanced stats tracking',
      'Full historical data',
      'Performance insights',
      'Priority support'
    ],
    pro: [
      'All Basic features',
      'AI-powered swing analysis',
      'Custom reporting',
      'Personal coach dashboard',
      '24/7 premium support'
    ]
  };

  const userSubscriptionTier = user.subscription_tier || 'free';
  const currentFeatures = features[userSubscriptionTier];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Account Details
            </h3>

            <div className="mt-5 border-t border-gray-200">
              <dl className="divide-y divide-gray-200">
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {user.email}
                  </dd>
                </div>

                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Member since</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(user.created_at).toLocaleDateString()}
                  </dd>
                </div>

                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Subscription</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span className="capitalize">{user.subscription_tier || 'Free'}</span>
                    {' - '}
                    <span className="capitalize">{user.subscription_status || 'Active'}</span>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-8">
              <h4 className="text-lg font-medium text-gray-900">Your Features</h4>
              <ul className="mt-4 space-y-3">
                {currentFeatures.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              {(user.subscription_tier === 'free' || !user.subscription_tier) && (
                <button
                  onClick={handleUpgrade}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Upgrade Account
                </button>
              )}
              
              {user.subscription_tier && user.subscription_tier !== 'free' && (
                <button
                  onClick={() => createCustomerPortalSession()}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Manage Subscription
                </button>
              )}
              
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 