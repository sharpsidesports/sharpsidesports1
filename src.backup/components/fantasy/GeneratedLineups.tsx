import React from 'react';
import { FantasyLineup } from '../../types/fantasy';
import { useGolfStore } from '../../store/useGolfStore';

interface GeneratedLineupsProps {
  lineups: FantasyLineup[];
}

export default function GeneratedLineups({ lineups }: GeneratedLineupsProps) {
  const { fantasyPlayers } = useGolfStore();

  const getPlayerById = (id: string) => fantasyPlayers.find(p => p.id === id);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Generated Lineups</h3>
        <p className="mt-1 text-sm text-gray-500">
          {lineups.length} optimal lineup{lineups.length !== 1 ? 's' : ''} generated
        </p>
      </div>

      <div className="border-t border-gray-200">
        <div className="overflow-x-auto">
          {lineups.map((lineup, index) => (
            <div key={lineup.id} className="border-b border-gray-200 last:border-b-0">
              <div className="px-4 py-4 sm:px-6 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-gray-900">Lineup {index + 1}</h4>
                  <div className="text-sm text-gray-500">
                    <span className="mr-4">Salary: ${lineup.totalSalary.toLocaleString()}</span>
                    <span>Projected: {lineup.projectedPoints.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <div className="px-4 py-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lineup.players.map(playerId => {
                    const player = getPlayerById(playerId);
                    return player ? (
                      <div key={playerId} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                          {player.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{player.name}</div>
                          <div className="text-sm text-gray-500">${player.salary.toLocaleString()}</div>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}