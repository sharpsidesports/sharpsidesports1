import { useApproachDistributionData } from './hooks/useApproachDistributionData.js';
import ApproachDistributionChart from './charts/ApproachDistributionChart.js';
import ApproachDistributionMetrics from './metrics/ApproachDistributionMetrics.js';

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
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <h2 className="text-xl font-semibold mb-4 sm:mb-6">Approach Shot Distribution</h2>
      <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
        <div className="min-h-[300px] sm:min-h-[400px]">
          <ApproachDistributionChart />
        </div>
        <div className="border-t lg:border-t-0 lg:border-l border-gray-200 pt-6 lg:pt-0 lg:pl-8">
          <ApproachDistributionMetrics />
        </div>
      </div>
    </div>
  );
} 