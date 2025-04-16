import React, { useState, useEffect } from 'react';
import { useGolfStore } from '../store/golfStore.js';
import type { Golfer } from '../store/golfStore.js';

interface KeyMetric {
  name: string;
  value: number;
  rank: number;
  percentile: number;
  trend: 'up' | 'down' | 'stable';
}

interface GolferMetrics {
  golfer: Golfer;
  metrics: KeyMetric[];
}

export default function KeyMetrics() {
  const { golfers, fetchGolfers } = useGolfStore();
  const [selectedGolfers, setSelectedGolfers] = useState<Golfer[]>([]);
  const [metrics, setMetrics] = useState<GolferMetrics[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGolfers();
  }, [fetchGolfers]);

  const handleGolferSelect = (golfer: Golfer) => {
    if (selectedGolfers.some(g => g.id === golfer.id)) {
      setSelectedGolfers(selectedGolfers.filter(g => g.id !== golfer.id));
    } else {
      setSelectedGolfers([...selectedGolfers, golfer]);
    }
  };

  const handleAnalyze = () => {
    if (selectedGolfers.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        // Generate sample metrics data
        const newMetrics: GolferMetrics[] = selectedGolfers.map(golfer => {
          const metrics: KeyMetric[] = [
            {
              name: 'Driving Distance',
              value: golfer.stats.drivingDistance,
              rank: Math.floor(Math.random() * 100) + 1,
              percentile: Math.random() * 100,
              trend: Math.random() > 0.5 ? 'up' : 'down'
            },
            {
              name: 'Greens in Regulation',
              value: golfer.stats.greensInRegulation,
              rank: Math.floor(Math.random() * 100) + 1,
              percentile: Math.random() * 100,
              trend: Math.random() > 0.5 ? 'up' : 'down'
            },
            {
              name: 'Putting Average',
              value: golfer.stats.puttingAverage,
              rank: Math.floor(Math.random() * 100) + 1,
              percentile: Math.random() * 100,
              trend: Math.random() > 0.5 ? 'up' : 'down'
            }
          ];
          
          return {
            golfer,
            metrics
          };
        });
        
        setMetrics(newMetrics);
      } catch (err) {
        setError('Failed to generate metrics');
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Key Metrics Analysis</h1>
        <p className="mt-2 text-gray-600">Compare key performance metrics across golfers</p>

        <div className="mt-6">
          <h2 className="text-lg font-medium text-gray-900">Select Golfers</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {golfers.map((golfer) => (
              <div 
                key={golfer.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedGolfers.some(g => g.id === golfer.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
                onClick={() => handleGolferSelect(golfer)}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={golfer.imageUrl}
                    alt={golfer.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-medium">{golfer.name}</h4>
                    <p className="text-xs text-gray-500">
                      World Rank: #{golfer.worldRanking || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleAnalyze}
            disabled={selectedGolfers.length === 0 || loading}
            className={`bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
              (selectedGolfers.length === 0 || loading) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Analyzing...' : 'Analyze Metrics'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-800 rounded-md">
            {error}
          </div>
        )}

        {metrics.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900">Metrics Results</h2>
            <div className="mt-4 space-y-6">
              {metrics.map((golferMetrics) => (
                <div key={golferMetrics.golfer.id} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <img
                      src={golferMetrics.golfer.imageUrl}
                      alt={golferMetrics.golfer.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-medium">{golferMetrics.golfer.name}</h3>
                      <p className="text-sm text-gray-500">
                        World Rank: #{golferMetrics.golfer.worldRanking || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {golferMetrics.metrics.map((metric, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-medium text-gray-900">{metric.name}</h4>
                          <span className={`text-sm ${
                            metric.trend === 'up' ? 'text-green-600' :
                            metric.trend === 'down' ? 'text-red-600' :
                            'text-gray-600'
                          }`}>
                            {metric.trend === 'up' ? '↑' :
                             metric.trend === 'down' ? '↓' :
                             '→'}
                          </span>
                        </div>
                        <p className="mt-2 text-2xl font-semibold text-gray-900">
                          {metric.value.toFixed(1)}
                        </p>
                        <div className="mt-2 text-sm text-gray-500">
                          <p>Rank: #{metric.rank}</p>
                          <p>Percentile: {metric.percentile.toFixed(1)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 