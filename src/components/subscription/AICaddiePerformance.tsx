import { generatePerformanceData } from './performance/data.js';
import Metrics from './performance/Metrics.js';
import Graph from './performance/Graph.js';

export default function AICaddiePerformance() {
  const data = generatePerformanceData();

  return (
    <div className="bg-gray-900 p-8 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-green-400">PRO PACKAGE PERFORMANCE</h2>
        <p className="text-gray-400 text-sm">HISTORICAL RESULTS</p>
      </div>
      
      <Metrics data={data} />
      <div className="mt-8">
        <Graph data={data} />
      </div>
      
      <p className="text-gray-500 text-xs mt-4 italic">
        *Past performance is for informational purposes, it doesn't predict future results.
      </p>
    </div>
  );
}