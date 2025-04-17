import { useState } from 'react';
import { FantasyPlayer } from '../../types/fantasy';

interface PlayerPoolProps {
  golfers: FantasyPlayer[];
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
  const [sortField, setSortField] = useState<'name' | 'salary' | 'projectedPoints' | 'ownership'>('projectedPoints');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredGolfers = golfers
    .filter(golfer => 
      golfer.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField] ?? 0;
      const bValue = b[sortField] ?? 0;
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

  const handleSort = (field: typeof sortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Player Pool</h2>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                  onClick={() => handleSort('salary')}
                  className="hover:text-gray-700"
                >
                  Salary
                </button>
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  onClick={() => handleSort('projectedPoints')}
                  className="hover:text-gray-700"
                >
                  Proj. Pts
                </button>
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  onClick={() => handleSort('ownership')}
                  className="hover:text-gray-700"
                >
                  Own%
                </button>
              </th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredGolfers.map((golfer) => (
              <tr 
                key={golfer.id}
                className={`
                  ${selectedPlayers.includes(golfer.id) ? 'bg-indigo-50' : ''}
                  ${lockedPlayers.includes(golfer.id) ? 'bg-green-50' : ''}
                  ${excludedPlayers.includes(golfer.id) ? 'bg-red-50' : ''}
                  hover:bg-gray-50
                `}
              >
                <td className="px-4 py-2 text-sm">{golfer.name}</td>
                <td className="px-4 py-2 text-sm">${(golfer.salary || 0).toLocaleString()}</td>
                <td className="px-4 py-2 text-sm">{typeof golfer.projectedPoints === 'number' ? golfer.projectedPoints.toFixed(1) : 'N/A'}</td>
                <td className="px-4 py-2 text-sm">
                  {golfer.ownership ? `${(golfer.ownership * 100).toFixed(1)}%` : 'N/A'}
                </td>
                <td className="px-4 py-2 text-sm space-x-2">
                  <button
                    onClick={() => onSelectPlayer(
                      selectedPlayers.includes(golfer.id)
                        ? selectedPlayers.filter(id => id !== golfer.id)
                        : [...selectedPlayers, golfer.id]
                    )}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    {selectedPlayers.includes(golfer.id) ? 'Remove' : 'Add'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}