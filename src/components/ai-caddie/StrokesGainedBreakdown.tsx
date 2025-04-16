import React from 'react';
import StrokesGainedChart from './charts/StrokesGainedChart.js';
import StrokesGainedMetrics from './metrics/StrokesGainedMetrics.js';
import { useStrokesGainedData } from './hooks/useStrokesGainedData.js';

export default function StrokesGainedBreakdown() {
  const { isLoading } = useStrokesGainedData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sharpside-green"></div>
      </div>
    );
  }

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