import React from 'react';
import { useApproachDistributionData } from './hooks/useApproachDistributionData';
import ApproachDistributionChart from './charts/ApproachDistributionChart';
import ApproachDistributionMetrics from './metrics/ApproachDistributionMetrics';

export default function ApproachDistributionBreakdown() {
  const { isLoading } = useApproachDistributionData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sharpside-green"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Approach Shot Distribution</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ApproachDistributionChart />
        <ApproachDistributionMetrics />
      </div>
    </div>
  );
} 