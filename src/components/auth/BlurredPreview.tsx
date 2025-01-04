import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from './AuthProvider';

interface BlurredPreviewProps {
  children: React.ReactNode;
}

export default function BlurredPreview({ children }: BlurredPreviewProps) {
  const { user } = useAuthContext();

  if (user) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Sign in prompt positioned at the top with some padding */}
      <div className="sticky top-0 z-50 pt-4 pb-6">
        <div className="text-center max-w-md mx-auto p-4 bg-white/95 rounded-lg shadow-lg backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Sign in to Access
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Create an account or sign in to view this content and access all our features.
          </p>
          <Link
            to="/auth"
            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Sign In / Sign Up
          </Link>
        </div>
      </div>

      {/* Content with blur effect */}
      <div className="relative">
        <div className="absolute inset-0 backdrop-blur-[2px] bg-white/20 z-40" />
        <div className="blur-[2px] pointer-events-none">
          {children}
        </div>
      </div>
    </div>
  );
}