import React, { useState, useEffect } from 'react';
import { useGolfStore } from '../store/useGolfStore.js';
import LineupBuilder from '../components/fantasy/LineupBuilder.js';
import OptimizationSettings from '../components/fantasy/OptimizationSettings.js';
import GeneratedLineups from '../components/fantasy/GeneratedLineups.js';
import PlayerPool from '../components/fantasy/PlayerPool.js';
import { FantasyLineup, FantasySettings } from '../types/fantasy.js';
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
          const rankingsResponse = await datagolfService.getPlayerRankings();
          
          if (!rankingsResponse?.rankings || !Array.isArray(rankingsResponse.rankings)) {
            throw new Error('Invalid rankings data received');
          }

          // Sort rankings by datagolf_rank and take only top 10
          const top10Rankings = rankingsResponse.rankings
            .sort((a, b) => (a.datagolf_rank || 0) - (b.datagolf_rank || 0))
            .slice(0, 10);

          const scoringStats = loadScoringStats();

          const enrichedData = await transformGolferData(
            top10Rankings,
            [], // No odds data
            [], // No approach stats
            [], // No selected courses
            scoringStats
          );

          setGolfers(enrichedData);
        } catch (error) {
          console.error('Error fetching top players:', error);
        }
      }
    };

    fetchTopPlayers();
  }, [golfers.length, setGolfers]);

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
          <div className="text-gray-600">Loading DFS projections...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-2">Fantasy Golf Optimizer</h1>
        {dfsEventData && (
          <div className="text-sm text-gray-600 mb-6">
            <div>Event: {dfsEventData.event_name}</div>
            <div>Last Updated: {new Date(dfsEventData.last_updated).toLocaleString()}</div>
            {dfsEventData.note && <div className="text-green-600">{dfsEventData.note}</div>}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <OptimizationSettings 
              settings={settings}
              onSettingsChange={setSettings}
            />
            <div className="mt-6">
              <LineupBuilder
                selectedPlayers={selectedPlayers}
                lockedPlayers={lockedPlayers}
                onLockPlayer={setLockedPlayers}
                excludedPlayers={excludedPlayers}
                onExcludePlayer={setExcludedPlayers}
                onRemovePlayer={(playerId) => setSelectedPlayers(selectedPlayers.filter(id => id !== playerId))}
              />
            </div>
          </div>

          <PlayerPool
            golfers={fantasyPlayers}
            selectedPlayers={selectedPlayers}
            onSelectPlayer={setSelectedPlayers}
            lockedPlayers={lockedPlayers}
            excludedPlayers={excludedPlayers}
          />
        </div>

        <div className="mt-6">
          <button
            onClick={handleOptimize}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Generate Optimal Lineups
          </button>
        </div>

        {generatedLineups.length > 0 && (
          <GeneratedLineups
            lineups={generatedLineups}
            players={fantasyPlayers}
          />
        )}
      </div>
    </div>
  );
}