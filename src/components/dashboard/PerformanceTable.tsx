import React, { useState } from 'react';
import { useGolfStore } from '../../store/useGolfStore';
import GolferProfileModal from './GolferProfileModal';
import { Golfer } from '../../types/golf';

type SortField = 'name' | 'rank' | 'strokesGainedTotal' | 'strokesGainedTee' | 'strokesGainedApproach' | 
                 'strokesGainedAround' | 'strokesGainedPutting' | 'proximity100125' | 'proximity125150' |
                 'proximity175200' | 'proximity200225' | 'proximity225plus';
type SortDirection = 'asc' | 'desc';

function PerformanceTable() {
  const { golfers } = useGolfStore();
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedGolfer, setSelectedGolfer] = useState<Golfer | null>(null);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedGolfers = () => {
    return [...golfers].sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortField) {
        case 'name':
          return sortDirection === 'asc' 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        case 'rank':
          aValue = a.rank;
          bValue = b.rank;
          break;
        case 'strokesGainedTotal':
          aValue = a.strokesGainedTotal;
          bValue = b.strokesGainedTotal;
          break;
        case 'strokesGainedTee':
          aValue = a.strokesGainedTee;
          bValue = b.strokesGainedTee;
          break;
        case 'strokesGainedApproach':
          aValue = a.strokesGainedApproach;
          bValue = b.strokesGainedApproach;
          break;
        case 'strokesGainedAround':
          aValue = a.strokesGainedAround;
          bValue = b.strokesGainedAround;
          break;
        case 'strokesGainedPutting':
          aValue = a.strokesGainedPutting;
          bValue = b.strokesGainedPutting;
          break;
        case 'proximity100125':
          aValue = a.proximityStats['100-125'];
          bValue = b.proximityStats['100-125'];
          break;
        case 'proximity125150':
          aValue = a.proximityStats['125-150'];
          bValue = b.proximityStats['125-150'];
          break;
        case 'proximity175200':
          aValue = a.proximityStats['175-200'];
          bValue = b.proximityStats['175-200'];
          break;
        case 'proximity200225':
          aValue = a.proximityStats['200-225'];
          bValue = b.proximityStats['200-225'];
          break;
        case 'proximity225plus':
          aValue = a.proximityStats['225plus'];
          bValue = b.proximityStats['225plus'];
          break;
        default:
          return 0;
      }

      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
  };

  return (
    <>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('name')}
            >
              Golfer
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('strokesGainedTotal')}
            >
              SG: Total
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('strokesGainedTee')}
            >
              SG: Off the Tee
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('strokesGainedApproach')}
            >
              SG: Approach
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('strokesGainedAround')}
            >
              SG: Around
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('strokesGainedPutting')}
            >
              SG: Putting
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('proximity100125')}
            >
              Prox 100-125
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('proximity125150')}
            >
              Prox 125-150
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('proximity175200')}
            >
              Prox 175-200
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('proximity200225')}
            >
              Prox 200-225
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('proximity225plus')}
            >
              Prox 225+
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {getSortedGolfers().map((golfer) => (
            <tr 
              key={golfer.id} 
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedGolfer(golfer)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img 
                      className="h-10 w-10 rounded-full object-cover object-center" 
                      src={golfer.imageUrl} 
                      alt={golfer.name}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{golfer.name}</div>
                    <div className="text-sm text-gray-500">Rank: {golfer.rank}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {golfer.strokesGainedTotal.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {golfer.strokesGainedTee.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {golfer.strokesGainedApproach.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {golfer.strokesGainedAround.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {golfer.strokesGainedPutting.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {golfer.proximityStats['100-125'].toFixed(1)}'
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {golfer.proximityStats['125-150'].toFixed(1)}'
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {golfer.proximityStats['175-200'].toFixed(1)}'
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {golfer.proximityStats['200-225'].toFixed(1)}'
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {golfer.proximityStats['225plus'].toFixed(1)}'
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedGolfer && (
        <GolferProfileModal
          golfer={selectedGolfer}
          onClose={() => setSelectedGolfer(null)}
        />
      )}
    </>
  );
}

export default PerformanceTable;