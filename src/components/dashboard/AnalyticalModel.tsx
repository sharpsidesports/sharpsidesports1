import React, { useState } from 'react';
import { useGolfStore } from '../../store/useGolfStore';
import { SharpsideMetric, METRIC_CATEGORIES, METRIC_LABELS, MetricWeight } from '../../types/metrics';
import MetricCategory from '../metrics/MetricCategory';
import AnalyticalModelActions from './AnalyticalModelActions';

export default function AnalyticalModel() {
  const { weights, updateWeights } = useGolfStore();
  const [showAddMetric, setShowAddMetric] = useState(false);

  const handleWeightChange = (metricToUpdate: SharpsideMetric, newValue: number) => {
    const totalWeight = 100;
    const currentMetric = weights.find(m => m.metric === metricToUpdate);
    if (!currentMetric) return;
  
    const weightDifference = newValue - currentMetric.weight;
    const updatedMetrics = weights.map(m => {
      if (m.metric === metricToUpdate) {
        return { ...m, weight: newValue };
      }
      const adjustedWeight = m.weight - weightDifference / (weights.length - 1);
      return { ...m, weight: Math.max(0, adjustedWeight) };
    });
  
    const totalAdjustedWeight = updatedMetrics.reduce((sum, m) => sum + m.weight, 0);
    const adjustmentFactor = totalWeight / totalAdjustedWeight;
  
    const finalMetrics = updatedMetrics.map(m => ({
      ...m,
      weight: Math.round(m.weight * adjustmentFactor)
    }));
  
    updateWeights(finalMetrics);
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
    if (weights.length <= 5) {
      alert('You must maintain at least 5 base metrics');
      return;
    }

    const remainingMetrics = weights.filter(m => m.metric !== metricToRemove);
    const weightPerMetric = Math.floor(100 / remainingMetrics.length);

    const updatedMetrics = remainingMetrics.map((m, index) => ({
      metric: m.metric,
      weight: index === remainingMetrics.length - 1
        ? 100 - (weightPerMetric * (remainingMetrics.length - 1))
        : weightPerMetric
    }));

    updateWeights(updatedMetrics);
  };

  const unusedMetrics = Object.values(METRIC_CATEGORIES)
    .flat()
    .filter(metric => !weights.some(m => m.metric === metric));

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
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

      {showAddMetric && unusedMetrics.length > 0 && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex gap-2">
            <select
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              onChange={(e) => handleAddMetric(e.target.value as SharpsideMetric)}
              value=""
            >
              <option value="" disabled>Select a metric</option>
              {Object.entries(METRIC_CATEGORIES).map(([category, metrics]) => (
                <optgroup key={category} label={category}>
                  {metrics
                    .filter(m => unusedMetrics.includes(m))
                    .map((metric) => (
                      <option key={metric} value={metric}>
                        {METRIC_LABELS[metric]}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
            <button
              onClick={() => setShowAddMetric(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="h-[400px] overflow-y-auto">
        <div className="space-y-6">
          <MetricCategory
            title="Base Performance Metrics"
            metrics={METRIC_CATEGORIES.COURSE}
            selectedMetrics={weights}
            onWeightChange={handleWeightChange}
            onRemoveMetric={handleRemoveMetric}
          />

        
          {/* {weights.some(m => METRIC_CATEGORIES.PAR3.includes(m.metric)) && (
            <MetricCategory
              title="Par 3 Performance"
              metrics={METRIC_CATEGORIES.PAR3}
              selectedMetrics={weights}
              onWeightChange={handleWeightChange}
              onRemoveMetric={handleRemoveMetric}
            />
          )} */}

          {/* {weights.some(m => METRIC_CATEGORIES.PAR4.includes(m.metric)) && (
            <MetricCategory
              title="Par 4 Performance"
              metrics={METRIC_CATEGORIES.PAR4}
              selectedMetrics={weights}
              onWeightChange={handleWeightChange}
              onRemoveMetric={handleRemoveMetric}
            />
          )}

          {weights.some(m => METRIC_CATEGORIES.PAR5.includes(m.metric)) && (
            <MetricCategory
              title="Par 5 Performance"
              metrics={METRIC_CATEGORIES.PAR5}
              selectedMetrics={weights}
              onWeightChange={handleWeightChange}
              onRemoveMetric={handleRemoveMetric}
            />
          )} */}



          {weights.some(m => METRIC_CATEGORIES.PROXIMITY.includes(m.metric)) && (
            <MetricCategory
              title="Proximity Performance"
              metrics={METRIC_CATEGORIES.PROXIMITY}
              selectedMetrics={weights}
              onWeightChange={handleWeightChange}
              onRemoveMetric={handleRemoveMetric}
            />
          )}

          {weights.some(m => METRIC_CATEGORIES.SCORING.includes(m.metric)) && (
            <MetricCategory
              title="Scoring Performance"
              metrics={METRIC_CATEGORIES.SCORING}
              selectedMetrics={weights}
              onWeightChange={handleWeightChange}
              onRemoveMetric={handleRemoveMetric}
            />
          )}
        </div>
      </div>
    </div>
  );
}