import React, { useState } from 'react';
import { useGolfStore } from '../../store/useGolfStore';

export default function PlayerFitList() {
  const { golfers } = useGolfStore();
  const [sortBy, setSortBy] = useState<'fit' | 'name' | 'rank'>('fit');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedGolfers = [...golfers].sort((a, b) => {
    const modifier = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'name') return a.name.localeCompare(b.name) * modifier;
    if (sortBy === 'fit') return (b.simulatedRank - a.simulatedRank) * modifier;
    return (a.rank - b.rank) * modifier;
  });

  const handleSort = (field: typeof sortBy) => {
    if (field === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Player Course Fit Rankings</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Player
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('fit')}
              >
                Course Fit Score
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('rank')}
              >
                World Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Key Stats
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedGolfers.map((golfer) => (
              <tr key={golfer.id} className="hover:bg-gray-50">
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-green-600">
                    {(100 - golfer.simulatedRank).toFixed(1)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {golfer.rank}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    SG: OTT {golfer.strokesGainedTee.toFixed(2)} | 
                    APP {golfer.strokesGainedApproach.toFixed(2)} | 
                    ARG {golfer.strokesGainedAround.toFixed(2)} | 
                    P {golfer.strokesGainedPutting.toFixed(2)} | 
                    GIR {golfer.gir.toFixed(2)} |
                    Driving Acc {golfer.drivingAccuracy.toFixed(2)} | 
                    Driving Dist {golfer.drivingDistance.toFixed(2)}  
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}