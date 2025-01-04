import React from 'react';
import CourseDistanceBreakdown from '../components/ai-caddie/CourseDistanceBreakdown';
import ProximityLeaderboard from '../components/ai-caddie/ProximityLeaderboard';
import StrokesGainedBreakdown from '../components/ai-caddie/StrokesGainedBreakdown';
import StrokesGainedLeaderboard from '../components/ai-caddie/StrokesGainedLeaderboard';

export default function AICaddie() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-2">AI Caddie Analysis</h1>
        <p className="text-gray-600 mb-6">Course-specific insights and player performance metrics</p>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Course Distance Analysis</h2>
            <CourseDistanceBreakdown />
          </div>
          
          <div className="my-8">
            <hr className="border-gray-200" />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Proximity Performance</h2>
            <ProximityLeaderboard />
          </div>
          
          <div className="my-8">
            <hr className="border-gray-200" />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Strokes Gained Analysis</h2>
            <StrokesGainedBreakdown />
          </div>
          
          <div className="my-8">
            <hr className="border-gray-200" />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Strokes Gained Rankings</h2>
            <StrokesGainedLeaderboard />
          </div>
        </div>
      </div>
    </div>
  );
}