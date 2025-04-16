import { useStrokesGainedData } from '../hooks/useStrokesGainedData.js';

export default function StrokesGainedMetrics() {
  const { strokesGainedData, courseWeights, lastUpdated } = useStrokesGainedData();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">Strokes Gained Impact Analysis</h3>
        {lastUpdated && (
          <span className="text-sm text-gray-500">
            Updated: {new Date(lastUpdated).toLocaleDateString()}
          </span>
        )}
      </div>
      
      {courseWeights && (
        <div className="bg-green-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-green-800">
            Course: {courseWeights.courseName}
          </p>
        </div>
      )}

      {strokesGainedData.map((metric) => (
        <div 
          key={metric.name}
          className="bg-gray-50 p-4 rounded-lg"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">{metric.name}</span>
            <span className="text-green-600 font-semibold">
              {(metric.percentage * 100).toFixed(1)}%
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {metric.description}
          </p>
        </div>
      ))}
    </div>
  );
}