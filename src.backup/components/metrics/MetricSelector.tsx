import { SharpsideMetric, METRIC_CATEGORIES, METRIC_LABELS } from '../../types/metrics';

interface MetricSelectorProps {
  unusedMetrics: SharpsideMetric[];
  onSelect: (metric: SharpsideMetric) => void;
  onCancel: () => void;
}

export default function MetricSelector({ unusedMetrics, onSelect, onCancel }: MetricSelectorProps) {
  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex gap-2">
        <select
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          onChange={(e) => onSelect(e.target.value as SharpsideMetric)}
          value=""
        >
          <option value="" disabled>Select a metric</option>
          {Object.entries(METRIC_CATEGORIES).map(([category, metrics]) => (
            <optgroup key={category} label={category}>
              {metrics
                .filter(m => unusedMetrics.includes(m))
                .map((metric) => (
                  <option key={metric} value={metric}>
                    SG: {METRIC_LABELS[metric]}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}