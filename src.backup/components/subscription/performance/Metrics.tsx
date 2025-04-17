import { PerformanceDataPoint, calculateMetrics } from './data';

interface MetricsProps {
  data: PerformanceDataPoint[];
}

export default function Metrics({ data }: MetricsProps) {
  const metrics = calculateMetrics(data);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-gray-400 text-sm font-medium">Percentage Gained</h3>
        <p className="text-2xl font-bold text-green-500">{metrics.percentageGained}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-gray-400 text-sm font-medium">Weekly ROI</h3>
        <p className="text-2xl font-bold text-green-500">{metrics.weeklyROI}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-gray-400 text-sm font-medium">Total Units</h3>
        <p className="text-2xl font-bold text-green-500">+{metrics.totalUnits}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-gray-400 text-sm font-medium">ROI per Wager</h3>
        <p className="text-2xl font-bold text-green-500">{metrics.roiPerWager}%</p>
      </div>
    </div>
  );
}