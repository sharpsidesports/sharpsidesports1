import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useApproachDistributionData } from '../hooks/useApproachDistributionData.js';

// Use the same green color scheme as SG chart
const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'];

export default function ApproachDistributionMetrics() {
  const { approachDistributionData, isLoading, weights, lastUpdated } = useApproachDistributionData();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const data = approachDistributionData.map(metric => ({
    name: metric.name.replace('Proximity ', ''),  // Simplify labels
    value: Math.round(metric.percentage * 100),
    description: metric.description
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">Approach Shot Impact Analysis</h3>
        {lastUpdated && (
          <span className="text-sm text-gray-500">
            Updated: {new Date(lastUpdated).toLocaleDateString()}
          </span>
        )}
      </div>
      
      {weights.courseName && (
        <div className="bg-green-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-green-800">
            Course: {weights.courseName}
          </p>
        </div>
      )}

      {data.map((metric) => (
        <div 
          key={metric.name}
          className="bg-gray-50 p-4 rounded-lg"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">{metric.name}</span>
            <span className="text-green-600 font-semibold">
              {metric.value.toFixed(1)}%
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {metric.description}
          </p>
        </div>
      ))}
    </div>
  );
} 