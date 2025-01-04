import React from 'react';
import { useStrokesGainedData } from '../hooks/useStrokesGainedData';

export default function StrokesGainedMetrics() {
  const { strokesGainedData } = useStrokesGainedData();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-3">Strokes Gained Impact Analysis</h3>
      {strokesGainedData.map((metric) => (
        <div 
          key={metric.name}
          className="bg-gray-50 p-4 rounded-lg"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">{metric.name}</span>
            <span className="text-green-600 font-semibold">
              {(metric.percentage * 100).toFixed(1)}%
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