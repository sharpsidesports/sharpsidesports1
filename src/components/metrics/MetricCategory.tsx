import React from 'react';
import { SGMetric } from '../../types/metrics';
import MetricSlider from './MetricSlider';

interface MetricCategoryProps {
  title: string;
  metrics: SGMetric[];
  selectedMetrics: { metric: SGMetric; weight: number }[];
  onWeightChange: (metric: SGMetric, weight: number) => void;
  onRemoveMetric: (metric: SGMetric) => void;
}

export default function MetricCategory({
  title,
  metrics,
  selectedMetrics,
  onWeightChange,
  onRemoveMetric
}: MetricCategoryProps) {
  const selectedMetricsInCategory = selectedMetrics.filter(m => 
    metrics.includes(m.metric)
  );

  if (selectedMetricsInCategory.length === 0) return null;

  return (
    <div className="mb-6 last:mb-0">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      <div className="space-y-4">
        {selectedMetricsInCategory.map(({ metric, weight }) => (
          <MetricSlider
            key={metric}
            metric={metric}
            weight={weight}
            onWeightChange={(weight) => onWeightChange(metric, weight)}
            onRemove={() => onRemoveMetric(metric)}
          />
        ))}
      </div>
    </div>
  );
}