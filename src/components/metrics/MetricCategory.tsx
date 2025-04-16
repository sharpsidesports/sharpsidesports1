import { SharpsideMetric } from '../../types/metrics.js';
import MetricSlider from './MetricSlider.js';

interface MetricCategoryProps {
  title: string;
  metrics: SharpsideMetric[];
  selectedMetrics: { metric: SharpsideMetric; weight: number }[];
  onWeightChange: (metric: SharpsideMetric, weight: number) => void;
  onRemoveMetric: (metric: SharpsideMetric) => void;
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