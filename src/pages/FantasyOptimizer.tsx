import React, { useState } from 'react';
import { useGolfStore } from '../store/useGolfStore';
import LineupBuilder from '../components/fantasy/LineupBuilder';
import OptimizationSettings from '../components/fantasy/OptimizationSettings';
import GeneratedLineups from '../components/fantasy/GeneratedLineups';
import PlayerPool from '../components/fantasy/PlayerPool';
import { FantasyLineup, FantasySettings } from '../types/fantasy';

export default function FantasyOptimizer() {
  const { golfers } = useGolfStore();
  const [settings, setSettings] = useState<FantasySettings>({
    site: 'draftkings',
    lineups: 1,
    maxExposure: 100,
    budget: 50000,
    minSalary: 45000,
  });
  const [generatedLineups, setGeneratedLineups] = useState<FantasyLineup[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [lockedPlayers, setLockedPlayers] = useState<string[]>([]);
  const [excludedPlayers, setExcludedPlayers] = useState<string[]>([]);

  const handleOptimize = () => {
    // Optimization logic will be implemented in a separate utility
    const optimizedLineups = []; // TODO: Implement optimization algorithm
    setGeneratedLineups(optimizedLineups);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Fantasy Golf Optimizer</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <OptimizationSettings 
              settings={settings}
              onSettingsChange={setSettings}
            />
            <div className="mt-6">
              <LineupBuilder
                lockedPlayers={lockedPlayers}
                onLockPlayer={setLockedPlayers}
                excludedPlayers={excludedPlayers}
                onExcludePlayer={setExcludedPlayers}
              />
            </div>
          </div>

          <PlayerPool
            golfers={golfers}
            selectedPlayers={selectedPlayers}
            onSelectPlayer={setSelectedPlayers}
            lockedPlayers={lockedPlayers}
            excludedPlayers={excludedPlayers}
          />
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleOptimize}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Generate Optimal Lineups
          </button>
        </div>

        {generatedLineups.length > 0 && (
          <div className="mt-8">
            <GeneratedLineups lineups={generatedLineups} />
          </div>
        )}
      </div>
    </div>
  );
}