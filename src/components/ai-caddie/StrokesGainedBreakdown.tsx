import React from 'react';
import StrokesGainedChart from './charts/StrokesGainedChart';
import StrokesGainedMetrics from './metrics/StrokesGainedMetrics';

export default function StrokesGainedBreakdown() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Strokes Gained Distribution</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StrokesGainedChart />
        <StrokesGainedMetrics />
      </div>
    </div>
  );
}