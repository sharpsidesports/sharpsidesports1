import React from 'react';

export default function SimulationExplanation() {
  return (
    <div className="bg-gray-900 p-8 rounded-lg">
      <h2 className="text-xl font-semibold text-green-400 mb-6">HOW IT WORKS</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-white font-medium mb-2">Advanced Simulation Engine</h3>
          <p className="text-gray-400">
            Our proprietary simulation engine runs thousands of tournament scenarios using historical data, 
            course conditions, and player performance metrics to generate accurate predictions.
          </p>
        </div>
        
        <div>
          <h3 className="text-white font-medium mb-2">Machine Learning Models</h3>
          <p className="text-gray-400">
            We utilize state-of-the-art machine learning algorithms trained on millions of golf shots to 
            identify patterns and predict player performance with unprecedented accuracy.
          </p>
        </div>
        
        <div>
          <h3 className="text-white font-medium mb-2">Real-time Updates</h3>
          <p className="text-gray-400">
            Our models continuously update throughout tournaments, incorporating live scoring and conditions 
            to provide you with the most current and accurate predictions possible.
          </p>
        </div>
      </div>
    </div>
  );
}