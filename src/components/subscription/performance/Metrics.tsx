import React from 'react';
import { PerformanceDataPoint, calculateMetrics } from './data';

interface MetricsProps {
  data: PerformanceDataPoint[];
}

export default function Metrics({ data }: MetricsProps) {
  const { totalUnits, roiPerWager } = calculateMetrics(data);

  return (
    <div className="flex gap-8">
      <div>
        <p className="text-gray-400">TOTAL UNITS</p>
        <p className="text-green-400 text-xl font-bold">+{totalUnits}u</p>
      </div>
      <div>
        <p className="text-gray-400">ROI PER WAGER</p>
        <p className="text-green-400 text-xl font-bold">{roiPerWager}%</p>
      </div>
    </div>
  );
}