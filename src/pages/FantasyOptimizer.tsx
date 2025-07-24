import { useState, useEffect } from 'react';
import { useGolfStore } from '../store/useGolfStore.js';
import LineupBuilder from '../components/fantasy/LineupBuilder.js';
import OptimizationSettings from '../components/fantasy/OptimizationSettings.js';
import GeneratedLineups from '../components/fantasy/GeneratedLineups.js';
import PlayerPool from '../components/fantasy/PlayerPool.js';
import { FantasyLineup, FantasySettings, DFSSite } from '../types/fantasy.js';
import { datagolfService } from '../services/api/datagolfService.js';
import { transformGolferData } from '../utils/transformers/golferTransformer.js';
import { loadScoringStats } from '../utils/data/scoringStatsLoader.js';
import { generateOptimalLineups } from '../utils/optimizers/lineupOptimizer.js';

export default function FantasyOptimizer() {
  const { 
    golfers, 
    fantasyPlayers,
    loading,
    dfsEventData,
    fetchDFSProjections,
    fetchGolferData,
    updateFantasyPlayers,
    setGolfers 
  } = useGolfStore();

  const [settings, setSettings] = useState<FantasySettings>({
    site: 'draftkings',
    lineups: 1,
    maxExposure: 100,
    budget: 50000,
    minSalary: 5000,
  });
  const [generatedLineups, setGeneratedLineups] = useState<FantasyLineup[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [lockedPlayers, setLockedPlayers] = useState<string[]>([]);
  const [excludedPlayers, setExcludedPlayers] = useState<string[]>([]);

  // Fetch DFS projections on component mount and when site changes
  useEffect(() => {
    fetchDFSProjections(settings.site as DFSSite);
  }, [fetchDFSProjections, settings.site]);

  // Update budget when site changes
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      budget: prev.site === 'draftkings' ? 80000 : 80000
    }));
  }, [settings.site]);

  // Fetch top 10 players if golfers are not available
  useEffect(() => {
    const fetchTopPlayers = async () => {
      if (golfers.length === 0) {
        try {
          // Fetch real Data Golf data
          await fetchGolferData();
        } catch (error) {
          console.error('Error fetching top players:', error);
        }
      }
    };

    fetchTopPlayers();
  }, [golfers.length, fetchGolferData]);

  // Update fantasy players when DFS data or golfers change
  useEffect(() => {
    if (golfers.length > 0 && !loading) {
      updateFantasyPlayers(golfers);
    }
  }, [golfers, updateFantasyPlayers, loading]);

  const handleOptimize = () => {
    try {
      const optimizedLineups = generateOptimalLineups(
        fantasyPlayers,
        settings,
        lockedPlayers,
        excludedPlayers
      );
      setGeneratedLineups(optimizedLineups);
    } catch (error) {
      console.error('Failed to generate lineups:', error);
      // TODO: Show error to user
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sharpside-green mx-auto mb-4"></div>
          <div className="text-gray-600">Loading DFS projections...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Fantasy Optimizer</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Optimization Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DFS Site
                </label>
                <select
                  value={settings.site}
                  onChange={(e) => setSettings(prev => ({ ...prev, site: e.target.value as DFSSite }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sharpside-green"
                >
                  <option value="draftkings">DraftKings</option>
                  <option value="fanduel">FanDuel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Lineups
                </label>
                <input
                  type="number"
                  value={settings.lineups}
                  onChange={(e) => setSettings(prev => ({ ...prev, lineups: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sharpside-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget
                </label>
                <input
                  type="number"
                  value={settings.budget}
                  onChange={(e) => setSettings(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sharpside-green"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Player Pool */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Player Pool ({fantasyPlayers.length} players)</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {fantasyPlayers.map((player) => (
                <div key={player.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <span className="font-medium">{player.name}</span>
                    <span className="text-sm text-gray-500 ml-2">${player.salary.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{player.projectedPoints.toFixed(1)} pts</div>
                    <div className="text-sm text-gray-500">{player.position}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generated Lineups */}
      {generatedLineups.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Generated Lineups</h3>
          <div className="space-y-4">
            {generatedLineups.map((lineup, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-2">Lineup {index + 1}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {lineup.players.map((playerId, playerIndex) => {
                    const player = fantasyPlayers.find(p => p.id === playerId);
                    return player ? (
                      <div key={playerIndex} className="text-sm">
                        <span className="font-medium">{player.name}</span>
                        <span className="text-gray-500 ml-2">${player.salary.toLocaleString()}</span>
                      </div>
                    ) : null;
                  })}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Total Salary: ${lineup.totalSalary.toLocaleString()} | 
                  Projected Points: {lineup.projectedPoints.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optimize Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleOptimize}
          className="bg-sharpside-green text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Generate Optimal Lineups
        </button>
      </div>
    </div>
  );
}