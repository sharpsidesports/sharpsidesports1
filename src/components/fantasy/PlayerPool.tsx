import React, { useState } from 'react';
import { Golfer } from '../../types/golf';

interface PlayerPoolProps {
  golfers: Golfer[];
  selectedPlayers: string[];
  onSelectPlayer: (players: string[]) => void;
  lockedPlayers: string[];
  excludedPlayers: string[];
}

export default function PlayerPool({
  golfers,
  selectedPlayers,
  onSelectPlayer,
  lockedPlayers,
  excludedPlayers
}: PlayerPoolProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'name' | 'rank' | 'salary'>('rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredGolfers = golfers
    .filter(golfer => 
      golfer.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortDirection === 'asc') {
        return a[sortField] > b[sortField] ? 1 : -1;
      }
      return a[sortField] < b[sortField] ? 1 : -1;
    });

  const handleSort = (field: 'name' | 'rank' | 'salary') => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Player Pool</h2>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  onClick={() => handleSort('name')}
                  className="hover:text-gray-700"
                >
                  Name
                </button>
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  onClick={() => handleSort('rank')}
                  className="hover:text-gray-700"
                >
                  Rank
                </button>
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  onClick={() => handleSort('salary')}
                  className="hover:text-gray-700"
                >
                  Salary
                </button>
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredGolfers.map((golfer) => (
              <tr 
                key={golfer.id}
                className={`
                  hover:bg-gray-50 cursor-pointer
                  ${lockedPlayers.includes(golfer.id) ? 'bg-green-50' : ''}
                  ${excludedPlayers.includes(golfer.id) ? 'bg-red-50' : ''}
                `}
              >
                <td className="px-4 py-2 whitespace-nowrap">{golfer.name}</td>
                <td className="px-4 py-2 whitespace-nowrap">{golfer.rank}</td>
                <td className="px-4 py-2 whitespace-nowrap">${golfer.salary}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {lockedPlayers.includes(golfer.id) ? (
                    <span className="text-green-600">Locked</span>
                  ) : excludedPlayers.includes(golfer.id) ? (
                    <span className="text-red-600">Excluded</span>
                  ) : (
                    <span className="text-gray-400">Available</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}