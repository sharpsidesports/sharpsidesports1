import { useEffect, useState } from 'react';
import { useGolfStore } from '../store/useGolfStore.js';
import { SharpsideMetric, METRIC_LABELS, METRICS } from '../types/metrics.js';
import { Golfer } from '../types/golf.js';

export default function RawStatsLeaderboard() {
  const { golfers, fetchGolferData } = useGolfStore();
  const [sortMetric, setSortMetric] = useState<SharpsideMetric>('Total');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!golfers || golfers.length === 0) {
      setLoading(true);
      fetchGolferData().finally(() => setLoading(false));
    }
  }, [fetchGolferData, golfers]);

  const getMetricValue = (golfer: Golfer, metric: SharpsideMetric): number => {
    switch (metric) {
      case 'Total': return golfer.strokesGainedTotal;
      case 'OTT': return golfer.strokesGainedTee;
      case 'APP': return golfer.strokesGainedApproach;
      case 'ARG': return golfer.strokesGainedAround;
      case 'P': return golfer.strokesGainedPutting;
      case 'T2G': return golfer.strokesGainedTee + golfer.strokesGainedApproach + golfer.strokesGainedAround;
      case 'DrivingDist': return golfer.drivingDistance;
      case 'DrivingAcc': return golfer.drivingAccuracy;
      case 'gir': return golfer.gir;
      case 'Prox100_125': return golfer.proximityMetrics['100-125'];
      case 'Prox125_150': return golfer.proximityMetrics['125-150'];
      case 'Prox150_175': return golfer.proximityMetrics['150-175'];
      case 'Prox175_200': return golfer.proximityMetrics['175-200'];
      case 'Prox200_225': return golfer.proximityMetrics['200-225'];
      case 'Prox225Plus': return golfer.proximityMetrics['225plus'];
      case 'BogeyAvoid': return golfer.scoringStats.bogeyAvoidance;
      case 'TotalBirdies': return golfer.scoringStats.totalBirdies;
      case 'Par3BirdieOrBetter': return golfer.scoringStats.par3BirdieOrBetter;
      case 'Par4BirdieOrBetter': return golfer.scoringStats.par4BirdieOrBetter;
      case 'Par5BirdieOrBetter': return golfer.scoringStats.par5BirdieOrBetter;
      case 'BirdieConversion': return golfer.scoringStats.birdieOrBetterConversion;
      case 'Par3Scoring': return golfer.scoringStats.par3ScoringAvg;
      case 'Par4Scoring': return golfer.scoringStats.par4ScoringAvg;
      case 'Par5Scoring': return golfer.scoringStats.par5ScoringAvg;
      case 'EaglesPerHole': return golfer.scoringStats.eaglesPerHole;
      case 'BirdieAvg': return golfer.scoringStats.birdieAverage;
      case 'BirdieOrBetterPct': return golfer.scoringStats.birdieOrBetterPercentage;
      default: return 0;
    }
  };

  const sortedGolfers = [...golfers].sort((a, b) => {
    const aValue = getMetricValue(a, sortMetric);
    const bValue = getMetricValue(b, sortMetric);
    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Raw Stats Leaderboard</h1>
        <div className="mb-4 flex flex-wrap gap-2 items-center justify-center">
          <span className="font-semibold">Sort by:</span>
          <select
            value={sortMetric}
            onChange={e => setSortMetric(e.target.value as SharpsideMetric)}
            className="border rounded px-2 py-1"
          >
            {METRICS.map(metric => (
              <option key={metric} value={metric}>{METRIC_LABELS[metric]}</option>
            ))}
          </select>
          <button
            onClick={() => setSortDirection(d => d === 'asc' ? 'desc' : 'asc')}
            className="ml-2 px-2 py-1 border rounded"
          >
            {sortDirection === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>
        </div>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Player</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{METRIC_LABELS[sortMetric]}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {sortedGolfers.map((golfer, idx) => (
                  <tr key={golfer.id}>
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2 font-medium">{golfer.name}</td>
                    <td className="px-4 py-2">{getMetricValue(golfer, sortMetric).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 