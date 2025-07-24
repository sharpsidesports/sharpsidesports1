import React from 'react';

export default function WRTargetProjections() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            WR Target Projections
          </h1>
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Coming Soon
              </h2>
              <p className="text-gray-600 mb-6">
                Our advanced WR Target Projections model is currently in development. 
                This feature will provide detailed target projections for college football wide receivers.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-sm text-green-800">
                  <strong>What to expect:</strong> Target share analysis, route-specific projections, 
                  and matchup-based target predictions for college football WRs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 