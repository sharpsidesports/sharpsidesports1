import { SharpsideMetric, METRIC_LABELS } from '../../types/metrics.js';

interface MetricSliderProps {
  metric: SharpsideMetric;
  weight: number;
  onWeightChange: (weight: number) => void;
  onRemove: () => void;
}

export default function MetricSlider({ metric, weight, onWeightChange, onRemove }: MetricSliderProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium">SG: {METRIC_LABELS[metric]}</span>
        <button
          onClick={onRemove}
          className="text-red-600 hover:text-red-700"
        >
          Remove
        </button>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min="0"
          max="100"
          value={weight}
          onChange={(e) => onWeightChange(parseInt(e.target.value))}
          className="flex-1"
        />
        <input
          type="number"
          min="0"
          max="100"
          value={weight}
          onChange={(e) => onWeightChange(Number(e.target.value))}
          className="w-16 text-right font-medium border border-gray-300 rounded px-2 py-1"
        />
        <span className="text-gray-500">%</span>
      </div>
    </div>
  );
}