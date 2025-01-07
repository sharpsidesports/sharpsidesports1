import React from 'react';
import { Golfer } from '../../types/golf';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface GolferProfileModalProps {
  golfer: Golfer;
  onClose: () => void;
}

function GolferProfileModal({ golfer, onClose }: GolferProfileModalProps) {
  // const finishPositionData = golfer.recentRounds.map(round => ({
  //   date: new Date(round.date).toLocaleDateString(),
  //   position: round.position
  // }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center">
              <img 
                src={golfer.imageUrl} 
                alt={golfer.name}
                className="h-20 w-20 rounded-full object-cover mr-4"
              />
              <div>
                <h2 className="text-2xl font-bold">{golfer.name}</h2>
                <p className="text-gray-600">World Rank: {golfer.rank}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Strokes Gained Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Off the Tee:</span>
                  <span className="font-medium">{golfer.strokesGainedTee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Approach:</span>
                  <span className="font-medium">{golfer.strokesGainedApproach.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Around the Green:</span>
                  <span className="font-medium">{golfer.strokesGainedAround.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Putting:</span>
                  <span className="font-medium">{golfer.strokesGainedPutting.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Driving Accuracy:</span>
                  <span className="font-medium">{golfer.drivingAccuracy.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Driving Distance:</span>
                  <span className="font-medium">{golfer.drivingDistance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span>Total:</span>
                  <span className="font-bold">{golfer.strokesGainedTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Proximity Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>100-125 yards:</span>
                  <span className="font-medium">{golfer.proximityMetrics['100-125'].toFixed(1)}'</span>
                </div>
                <div className="flex justify-between">
                  <span>125-150 yards:</span>
                  <span className="font-medium">{golfer.proximityMetrics['125-150'].toFixed(1)}'</span>
                </div>
                <div className="flex justify-between">
                  <span>175-200 yards:</span>
                  <span className="font-medium">{golfer.proximityMetrics['175-200'].toFixed(1)}'</span>
                </div>
                <div className="flex justify-between">
                  <span>200-225 yards:</span>
                  <span className="font-medium">{golfer.proximityMetrics['200-225'].toFixed(1)}'</span>
                </div>
                <div className="flex justify-between">
                  <span>225+ yards:</span>
                  <span className="font-medium">{golfer.proximityMetrics['225plus'].toFixed(1)}'</span>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Recent Performance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={finishPositionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis reversed />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="position" 
                    stroke="#16a34a" 
                    name="Finish Position"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div> */}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Simulation Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-600">Average Finish</div>
                <div className="text-2xl font-bold">
                  {golfer.simulationStats.averageFinish.toFixed(1)}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-600">Win Percentage</div>
                <div className="text-2xl font-bold">
                  {golfer.simulationStats.winPercentage.toFixed(1)}%
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-600">FanDuel Odds</div>
                <div className="text-2xl font-bold">
                  {golfer.odds > 0 ? '+' : ''}{golfer.odds}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GolferProfileModal;