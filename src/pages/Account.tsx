import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Account() {
  const { user } = useAuthContext();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Please sign in to view your account</h2>
          <Link
            to="/auth"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const subscriptionTier = user.user_metadata?.subscription_tier || 'free';
  const subscriptionStatus = user.user_metadata?.subscription_status || 'inactive';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Details</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Email</h3>
                <p className="mt-1 text-gray-600">{user.email}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">Subscription</h3>
                <div className="mt-2">
                  <div className="flex items-center">
                    <span className="px-3 py-1 text-sm font-medium rounded-full capitalize
                      ${subscriptionTier === 'pro' ? 'bg-green-100 text-green-800' : 
                        subscriptionTier === 'enterprise' ? 'bg-purple-100 text-purple-800' : 
                        'bg-gray-100 text-gray-800'}">
                      {subscriptionTier}
                    </span>
                    <span className="ml-2 px-3 py-1 text-sm font-medium rounded-full capitalize
                      ${subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                      {subscriptionStatus}
                    </span>
                  </div>
                </div>
              </div>

              {subscriptionTier === 'free' && (
                <div className="mt-6">
                  <Link
                    to="/pricing"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                  >
                    Upgrade to Pro
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 