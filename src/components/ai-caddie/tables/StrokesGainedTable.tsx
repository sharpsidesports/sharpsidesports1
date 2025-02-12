import React from 'react';
import { useGolfStore } from '../../../store/useGolfStore';
import { Golfer } from '../../../types/golf';

export default function StrokesGainedTable() {
  const { golfers } = useGolfStore();

  // Define the calculateStrokesGainedScore function here
  const calculateStrokesGainedScore = (golfer: Golfer) => {
    const weights = {
      total: 0.20,
      tee: 0.15,
      approach: 0.25,
      around: 0.15,
      putting: 0.10,
      ballStriking: 0.15, // Combined tee and approach
      gir: 0.05,
      drivingAccuracy: 0.05,
      drivingDistance: 0.10
    };

    const ballStrikingScore = (golfer.strokesGainedTee + golfer.strokesGainedApproach) / 2;

    return (
      golfer.strokesGainedTotal * weights.total +
      golfer.strokesGainedTee * weights.tee +
      golfer.strokesGainedApproach * weights.approach +
      golfer.strokesGainedAround * weights.around +
      golfer.strokesGainedPutting * weights.putting +
      golfer.gir * weights.gir +
      golfer.drivingAccuracy * weights.drivingAccuracy +
      golfer.drivingDistance * weights.drivingDistance +
      ballStrikingScore * weights.ballStriking
    );
  };

  const sortedGolfers = [...golfers]
    .sort((a, b) => calculateStrokesGainedScore(b) - calculateStrokesGainedScore(a))
    .slice(0, 10);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rank
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Player
            </th>
            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Driving Distance
            </th>
            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Driving Accuracy
            </th>
            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Approach
            </th>
            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Around Green
            </th>
            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Putting
            </th>
            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Score
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedGolfers.map((golfer, index) => (
            <tr key={golfer.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {index + 1}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img 
                      className="h-10 w-10 rounded-full object-cover" 
                      src={golfer.imageUrl} 
                      alt={golfer.name} 
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {golfer.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                {golfer.drivingDistance.toFixed(1)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                {(golfer.drivingAccuracy * 100).toFixed(1)}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                {golfer.strokesGainedApproach.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                {golfer.strokesGainedAround.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                {golfer.strokesGainedPutting.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                {calculateStrokesGainedScore(golfer).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}