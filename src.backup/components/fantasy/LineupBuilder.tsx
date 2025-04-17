import { useGolfStore } from '../../store/useGolfStore';

interface LineupBuilderProps {
  selectedPlayers: string[];
  lockedPlayers: string[];
  onLockPlayer: (players: string[]) => void;
  excludedPlayers: string[];
  onExcludePlayer: (players: string[]) => void;
  onRemovePlayer: (playerId: string) => void;
}

export default function LineupBuilder({
  selectedPlayers,
  lockedPlayers,
  onLockPlayer,
  excludedPlayers,
  onExcludePlayer,
  onRemovePlayer
}: LineupBuilderProps) {
  const { fantasyPlayers } = useGolfStore();

  const getPlayerById = (id: string) => fantasyPlayers.find(p => p.id === id);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Lineup Builder</h2>
      
      <div className="space-y-6">
        {/* Current Lineup */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Current Lineup</h3>
          <div className="bg-gray-50 rounded-lg p-4 min-h-[100px]">
            {selectedPlayers.length === 0 ? (
              <p className="text-gray-500 text-sm">No players selected</p>
            ) : (
              <div className="space-y-2">
                {selectedPlayers.map(id => {
                  const player = getPlayerById(id);
                  return player ? (
                    <div key={id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                      <div>
                        <span className="font-medium">{player.name}</span>
                        <span className="text-sm text-gray-500 ml-2">${player.salary.toLocaleString()}</span>
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => onLockPlayer([...lockedPlayers, id])}
                          className={`text-green-600 hover:text-green-700 ${lockedPlayers.includes(id) ? 'hidden' : ''}`}
                        >
                          Lock
                        </button>
                        <button
                          onClick={() => onExcludePlayer([...excludedPlayers, id])}
                          className={`text-red-600 hover:text-red-700 ${excludedPlayers.includes(id) ? 'hidden' : ''}`}
                        >
                          Exclude
                        </button>
                        <button
                          onClick={() => onRemovePlayer(id)}
                          className="text-gray-600 hover:text-gray-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>

        {/* Locked Players */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Locked Players</h3>
          <div className="bg-gray-50 rounded-lg p-4 min-h-[100px]">
            {lockedPlayers.length === 0 ? (
              <p className="text-gray-500 text-sm">No locked players</p>
            ) : (
              <div className="space-y-2">
                {lockedPlayers.map(id => {
                  const player = getPlayerById(id);
                  return player ? (
                    <div key={id} className="flex justify-between items-center bg-green-50 p-2 rounded">
                      <div>
                        <span className="font-medium">{player.name}</span>
                        <span className="text-sm text-gray-500 ml-2">${player.salary.toLocaleString()}</span>
                      </div>
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

        {/* Excluded Players */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Excluded Players</h3>
          <div className="bg-gray-50 rounded-lg p-4 min-h-[100px]">
            {excludedPlayers.length === 0 ? (
              <p className="text-gray-500 text-sm">No excluded players</p>
            ) : (
              <div className="space-y-2">
                {excludedPlayers.map(id => {
                  const player = getPlayerById(id);
                  return player ? (
                    <div key={id} className="flex justify-between items-center bg-red-50 p-2 rounded">
                      <div>
                        <span className="font-medium">{player.name}</span>
                        <span className="text-sm text-gray-500 ml-2">${player.salary.toLocaleString()}</span>
                      </div>
                      <button
                        onClick={() => onExcludePlayer(excludedPlayers.filter(p => p !== id))}
                        className="text-gray-600 hover:text-gray-700"
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