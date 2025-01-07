import React from 'react';
import { SharpsideMetric } from '../../types/metrics';
import MetricSlider from './MetricSlider';

interface MetricGroupProps {
  title: string;
  metrics: { metric: SharpsideMetric; weight: number }[];
  onWeightChange: (metric: SharpsideMetric, weight: number) => void;
  onRemoveMetric: (metric: SharpsideMetric) => void;
}

export default function MetricGroup({ title, metrics, onWeightChange, onRemoveMetric }: MetricGroupProps) {
  if (metrics.length === 0) return null;

  return (
    <div className="mb-6 last:mb-0">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      <div className="space-y-4">
        {metrics.map(({ metric, weight }) => (
          <MetricSlider
            key={metric}
            metric={metric}
            weight={weight}
            onWeightChange={(w) => onWeightChange(metric, w)}
            onRemove={() => onRemoveMetric(metric)}
          />
        ))}
      </div>
    </div>
  );
}