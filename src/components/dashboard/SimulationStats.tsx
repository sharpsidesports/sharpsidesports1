import React, { useState } from 'react';
import { useGolfStore } from '../../store/useGolfStore';
import { Golfer } from '../../types/golf';
import GolferProfileModal from './GolferProfileModal';

export default function SimulationStats() {
  const { golfers } = useGolfStore();
  const [selectedGolfer, setSelectedGolfer] = useState<Golfer | null>(null);

  const sortedGolfers = [...golfers].sort((a, b) => 
    a.simulationStats.averageFinish - b.simulationStats.averageFinish
  );

  const getWinPercentageColor = (winPercentage: number, impliedProbability: number) => {
    if (winPercentage > impliedProbability) {
      return 'text-green-600';
    } else if (winPercentage < impliedProbability) {
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Golfer
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Average Finish
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Win %
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                FanDuel Odds
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Implied Win %
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedGolfers.map((golfer) => (
              <tr 
                key={golfer.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedGolfer(golfer)}
              >
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
                      <div className="font-medium text-gray-900">{golfer.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {golfer.simulationStats.averageFinish.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getWinPercentageColor(
                    golfer.simulationStats.winPercentage,
                    golfer.simulationStats.impliedProbability
                  )}`}>
                    {golfer.simulationStats.winPercentage.toFixed(1)}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {golfer.odds > 0 ? '+' : ''}{golfer.odds}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {golfer.simulationStats.impliedProbability.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedGolfer && (
        <GolferProfileModal
          golfer={selectedGolfer}
          onClose={() => setSelectedGolfer(null)}
        />
      )}
    </>
  );
}