import React, { useState } from 'react';
import { useGolfStore } from '../../store/useGolfStore.js';
import { Golfer } from '../../types/golf.js';
import GolferProfileModal from './GolferProfileModal.js';
import { formatAmericanOdds } from '../../utils/calculations/oddsCalculator.js';

export default function SimulationStats() {
  const { golfers } = useGolfStore();
  const [selectedGolfer, setSelectedGolfer] = useState<Golfer | null>(null);
  const sortedGolfers = [...golfers].sort((a, b) => 
    a.simulationStats.averageFinish - b.simulationStats.averageFinish
  );

  const getWinPercentageColor = (winPercentage: number, impliedProbability: number) => {
    // If there's no implied probability, use the default text color
    if (!impliedProbability) return 'text-gray-500';
    
    if (winPercentage > impliedProbability) {
      return 'text-green-600';
    } else if (winPercentage < impliedProbability) {
      return 'text-red-600';
    }
    return 'text-gray-500';
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
              {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Average Finish
              </th> */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Win %
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Top 10 %
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
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {golfer.simulationStats.averageFinish.toFixed(2)}
                </td> */}
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${getWinPercentageColor(golfer.simulationStats.winPercentage, golfer.simulationStats.impliedProbability)}`}>
                  {golfer.simulationStats.winPercentage.toFixed(1)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {golfer.simulationStats.top10Percentage.toFixed(1)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {golfer.odds?.fanduel ? formatAmericanOdds(golfer.odds.fanduel) : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {golfer.odds?.impliedProbability ? 
                    `${(golfer.odds.impliedProbability * 100).toFixed(1)}%` : 
                    'N/A'
                  }
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