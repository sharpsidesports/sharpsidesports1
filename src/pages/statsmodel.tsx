import { useState } from 'react';
import { useGolfStore } from '../store/useGolfStore.js';
import { SharpsideMetric, METRIC_CATEGORIES, METRIC_LABELS, MetricWeight } from '../types/metrics.js';
import MetricCategory from '../components/metrics/MetricCategory.js';
import GolferAvatar from '../components/GolferAvatar.js';

export default function StatsModel() {
  const { golfers, weights, updateWeights } = useGolfStore();
  const [showAddMetric, setShowAddMetric] = useState(false);

  // Error handling for weights
  const totalWeight = weights.reduce((sum: number, m: MetricWeight) => sum + m.weight, 0);
  const showWeightError = totalWeight > 100;

  // Add/Remove/Change metric weights
  const handleWeightChange = (metricToUpdate: SharpsideMetric, newValue: number) => {
    const updatedMetrics = weights.map((m: MetricWeight) =>
      m.metric === metricToUpdate ? { ...m, weight: newValue } : m
    );
    updateWeights(updatedMetrics);
  };

  const handleAddMetric = (metric: SharpsideMetric) => {
    const newMetrics = [...weights, { metric, weight: 0 }];
    updateWeights(newMetrics);
    setShowAddMetric(false);
  };

  const handleRemoveMetric = (metricToRemove: SharpsideMetric) => {
    if (weights.length <= 2) {
      alert('You must maintain at least 2 metrics');
      return;
    }
    const remainingMetrics = weights.filter((m: MetricWeight) => m.metric !== metricToRemove);
    updateWeights(remainingMetrics);
  };

  const unusedMetrics = Object.values(METRIC_CATEGORIES)
    .flat()
    .filter(metric => !weights.some((m: MetricWeight) => m.metric === metric));

  // Calculate weighted sum for each golfer
  const getMetricValue = (golfer: any, metric: SharpsideMetric): number => {
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

  const golfersWithScore = golfers.map((golfer: any) => {
    const score = weights.reduce((sum: number, w: MetricWeight) => {
      const value = getMetricValue(golfer, w.metric);
      return sum + (value * (w.weight / 100));
    }, 0);
    return { ...golfer, statsModelScore: score };
  });

  const sortedGolfers = [...golfersWithScore].sort((a, b) => b.statsModelScore - a.statsModelScore);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 max-w-6xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Stats Model</h2>
      {showWeightError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded font-semibold text-center">
          Total weighting cannot exceed 100%.
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          {unusedMetrics.length > 0 && (
            <button
              onClick={() => setShowAddMetric(!showAddMetric)}
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              + Add Performance Metric
            </button>
          )}
        </div>
      </div>
      {showAddMetric && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Add New Metric</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {unusedMetrics.map((metric: SharpsideMetric) => (
              <button
                key={metric}
                onClick={() => handleAddMetric(metric)}
                className="text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                {METRIC_LABELS[metric]}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="space-y-6">
        <MetricCategory
          title="Selected Metrics"
          metrics={weights.map((w: MetricWeight) => w.metric)}
          selectedMetrics={weights}
          onWeightChange={handleWeightChange}
          onRemoveMetric={handleRemoveMetric}
        />
      </div>
      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Player</th>
              {weights.map((w: MetricWeight) => (
                <th key={w.metric} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  {METRIC_LABELS[w.metric]}
                </th>
              ))}
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Weighted Score</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {sortedGolfers.map((golfer: any, idx: number) => (
              <tr key={golfer.id}>
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2 font-medium">
                  <span className="inline-flex items-center gap-2">
                    <GolferAvatar name={golfer.name} dg_id={golfer.dg_id} size={32} />
                    {golfer.name}
                  </span>
                </td>
                {weights.map((w: MetricWeight) => (
                  <td key={w.metric} className="px-4 py-2">{getMetricValue(golfer, w.metric).toFixed(2)}</td>
                ))}
                <td className="px-4 py-2 font-bold">{golfer.statsModelScore.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 