import React, { useState, useEffect } from 'react';
import { useGolfStore } from '../store/useGolfStore';
import LineupBuilder from '../components/fantasy/LineupBuilder';
import OptimizationSettings from '../components/fantasy/OptimizationSettings';
import GeneratedLineups from '../components/fantasy/GeneratedLineups';
import PlayerPool from '../components/fantasy/PlayerPool';
import { FantasyLineup, FantasySettings } from '../types/fantasy';
import { datagolfService } from '../services/api/datagolfService';
import { transformGolferData } from '../utils/transformers/golferTransformer';
import { loadScoringStats } from '../utils/data/scoringStatsLoader';
import { generateOptimalLineups } from '../utils/optimizers/lineupOptimizer';

export default function FantasyOptimizer() {
  const { 
    golfers, 
    dfsEvents, 
    currentEvent, 
    fantasyPlayers,
    loading,
    fetchDFSEvents, 
    setCurrentEvent, 
    fetchDFSEventData,
    updateFantasyPlayers,
    setGolfers 
  } = useGolfStore();

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

  // Fetch DFS events on component mount
  useEffect(() => {
    fetchDFSEvents();
  }, [fetchDFSEvents]);

  // Fetch event data when current event changes
  useEffect(() => {
    if (currentEvent) {
      fetchDFSEventData(currentEvent);
    }
  }, [currentEvent, fetchDFSEventData]);

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

  if (!currentEvent || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading DFS events...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Fantasy Golf Optimizer</h1>
        
        {/* Event Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Event</label>
          <select 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={currentEvent.event_id}
            onChange={(e) => {
              const event = dfsEvents.find(ev => ev.event_id === parseInt(e.target.value));
              if (event) setCurrentEvent(event);
            }}
          >
            {dfsEvents.map(event => (
              <option key={`${event.event_id}-${event.calendar_year}`} value={event.event_id}>
                {event.event_name} ({new Date(event.date).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>
        
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