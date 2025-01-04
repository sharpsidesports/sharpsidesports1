import React from 'react';
import { useGolfStore } from '../../store/useGolfStore';
import { Golfer } from '../types/golf';

// Define the calculateProximityScore function directly in this file
const calculateProximityScore = (golfer: Golfer): number => {
  const weights = {
    '100-125': 0.25,
    '125-150': 0.20,
    '175-200': 0.30,
    '200-225': 0.15,
    '225plus': 0.10
  };

  return Object.entries(weights).reduce((score, [range, weight]) => {
    return score + (golfer.proximityStats[range as keyof typeof golfer.proximityStats] * weight);
  }, 0);
};

export default function ProximityLeaderboard() {
  const { golfers } = useGolfStore();
  
  const sortedGolfers = [...golfers]
    .sort((a, b) => calculateProximityScore(b) - calculateProximityScore(a))
    .slice(0, 10);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Top 10 Players by Proximity</h2>
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
                100-125
              </th>
              <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                125-150
              </th>
              <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                175-200
              </th>
              <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                200-225
              </th>
              <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                225+
              </th>
              <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Overall
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
                  {golfer.proximityStats['100-125'].toFixed(1)}'
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  {golfer.proximityStats['125-150'].toFixed(1)}'
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  {golfer.proximityStats['175-200'].toFixed(1)}'
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  {golfer.proximityStats['200-225'].toFixed(1)}'
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  {golfer.proximityStats['225plus'].toFixed(1)}'
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-green-600">
                  {calculateProximityScore(golfer).toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}