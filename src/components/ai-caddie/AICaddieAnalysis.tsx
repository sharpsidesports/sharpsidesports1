import StrokesGainedBreakdown from './StrokesGainedBreakdown.js';
import ApproachDistributionBreakdown from './ApproachDistributionBreakdown.js';
import StrokesGainedTable from './tables/StrokesGainedTable.js';
import ApproachDistributionTable from './tables/ApproachDistributionTable.js';
import ProximityRankingsTable from './tables/ProximityRankingsTable.js';

export default function AICaddieAnalysis() {
  return (
    <div className="space-y-12">
      {/* SG Pie Chart & Analysis */}
      <StrokesGainedBreakdown />

      {/* Approach Distribution Pie Chart & Analysis */}
      <ApproachDistributionBreakdown />

      {/* Rankings Section */}
      <div className="space-y-8">
        {/* SG Rankings */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Top 10 Players by Strokes Gained</h2>
          <StrokesGainedTable />
        </div>

        {/* Proximity Rankings by Range */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Proximity Rankings by Distance</h2>
          <ProximityRankingsTable />
        </div>

        {/* Overall Approach Distribution Rankings */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Top 10 Players by Approach Distribution</h2>
          <p className="text-sm text-gray-500 mb-4">
            Score is calculated using 90% proximity metrics and 10% SG: Approach
          </p>
          <ApproachDistributionTable />
        </div>
      </div>
    </div>
  );
} 