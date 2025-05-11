import { useState } from 'react';
import { useGolfStore } from '../../store/useGolfStore.js';
import { SharpsideMetric, METRIC_CATEGORIES, METRIC_LABELS, MetricWeight } from '../../types/metrics.js';
import MetricCategory from '../metrics/MetricCategory.js';
import AnalyticalModelActions from './AnalyticalModelActions.js';

export default function AnalyticalModel() {
  const { weights, updateWeights } = useGolfStore();
  const [showAddMetric, setShowAddMetric] = useState(false);

  // Calculate total weight for error handling
  const totalWeight = weights.reduce((sum: number, m: MetricWeight) => sum + m.weight, 0);
  const showWeightError = totalWeight > 100;

  const handleWeightChange = (metricToUpdate: SharpsideMetric, newValue: number) => {
    // Only update the selected metric's weight, do not adjust others
    const updatedMetrics = weights.map((m: MetricWeight) =>
      m.metric === metricToUpdate ? { ...m, weight: newValue } : m
    );
    updateWeights(updatedMetrics);
  };


  
  const handleAddMetric = (metric: SharpsideMetric) => {
    const newMetrics = [...weights, { metric, weight: 0 }];
    const weightPerMetric = Math.floor(100 / newMetrics.length);

    const updatedMetrics = newMetrics.map((m, index) => ({
      metric: m.metric,
      weight: index === newMetrics.length - 1
        ? 100 - (weightPerMetric * (newMetrics.length - 1))
        : weightPerMetric
    }));

    updateWeights(updatedMetrics);
    setShowAddMetric(false);
  };

  const handleRemoveMetric = (metricToRemove: SharpsideMetric) => {
    if (weights.length <= 2) {
      alert('You must maintain at least 2 metrics');
      return;
    }

    const remainingMetrics = weights.filter((m: MetricWeight) => m.metric !== metricToRemove);
    const weightPerMetric = Math.floor(100 / remainingMetrics.length);

    const updatedMetrics = remainingMetrics.map((m: MetricWeight, index: number) => ({
      metric: m.metric,
      weight: index === remainingMetrics.length - 1
        ? 100 - (weightPerMetric * (remainingMetrics.length - 1))
        : weightPerMetric
    }));

    updateWeights(updatedMetrics);
  };

  const unusedMetrics = Object.values(METRIC_CATEGORIES)
    .flat()
    .filter(metric => !weights.some((m: MetricWeight) => m.metric === metric));

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      {showWeightError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded font-semibold text-center">
          Total weighting cannot exceed 100%.
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Analytical Model</h2>
        <div className="flex items-center gap-4">
          {unusedMetrics.length > 0 && (
            <button
              onClick={() => setShowAddMetric(!showAddMetric)}
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              + Add Performance Metric
            </button>
          )}
          <AnalyticalModelActions />
        </div>
      </div>

      {showAddMetric && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Add New Metric</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {unusedMetrics.map(metric => (
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
          title="Base Performance Metrics"
          metrics={METRIC_CATEGORIES.COURSE}
          selectedMetrics={weights}
          onWeightChange={handleWeightChange}
          onRemoveMetric={handleRemoveMetric}
        />

        {weights.some((m: MetricWeight) => METRIC_CATEGORIES.PROXIMITY.includes(m.metric)) && (
          <MetricCategory
            title="Proximity Performance"
            metrics={METRIC_CATEGORIES.PROXIMITY}
            selectedMetrics={weights}
            onWeightChange={handleWeightChange}
            onRemoveMetric={handleRemoveMetric}
          />
        )}

        <MetricCategory
          title="Scoring Performance"
          metrics={METRIC_CATEGORIES.SCORING}
          selectedMetrics={weights}
          onWeightChange={handleWeightChange}
          onRemoveMetric={handleRemoveMetric}
        />
      </div>
    </div>
  );
}