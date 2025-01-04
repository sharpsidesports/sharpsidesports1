import React from 'react';
import { useGolfStore } from '../../store/useGolfStore';

interface LineupBuilderProps {
  lockedPlayers: string[];
  onLockPlayer: (players: string[]) => void;
  excludedPlayers: string[];
  onExcludePlayer: (players: string[]) => void;
}

export default function LineupBuilder({
  lockedPlayers,
  onLockPlayer,
  excludedPlayers,
  onExcludePlayer
}: LineupBuilderProps) {
  const { golfers } = useGolfStore();

  const getGolferById = (id: string) => golfers.find(g => g.id === id);

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Lineup Builder</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Locked Players</h3>
          <div className="bg-white rounded-lg p-4 min-h-[100px]">
            {lockedPlayers.length === 0 ? (
              <p className="text-gray-500 text-sm">No locked players</p>
            ) : (
              <div className="space-y-2">
                {lockedPlayers.map(id => {
                  const golfer = getGolferById(id);
                  return golfer ? (
                    <div key={id} className="flex justify-between items-center bg-green-50 p-2 rounded">
                      <span>{golfer.name}</span>
                      <button
                        onClick={() => onLockPlayer(lockedPlayers.filter(p => p !== id))}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Excluded Players</h3>
          <div className="bg-white rounded-lg p-4 min-h-[100px]">
            {excludedPlayers.length === 0 ? (
              <p className="text-gray-500 text-sm">No excluded players</p>
            ) : (
              <div className="space-y-2">
                {excludedPlayers.map(id => {
                  const golfer = getGolferById(id);
                  return golfer ? (
                    <div key={id} className="flex justify-between items-center bg-red-50 p-2 rounded">
                      <span>{golfer.name}</span>
                      <button
                        onClick={() => onExcludePlayer(excludedPlayers.filter(p => p !== id))}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}