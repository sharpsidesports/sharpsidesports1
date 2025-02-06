import React, { useState, useEffect } from 'react';
import { useGolfStore } from '../store/useGolfStore';
import { Golfer } from '../types/golf';
import { datagolfService } from '../services/api/datagolfService';

interface Matchup {
  p1_player_name: string;
  p2_player_name: string;
  odds: {
    [bookmaker: string]: {
      p1: string;
      p2: string;
    };
  };
}

interface MatchupResponse {
  event_name: string;
  last_updated: string;
  market: string;
  match_list: Matchup[] | string;
}

function MatchupTool() {
  const { golfers, runSimulation, fetchGolferData } = useGolfStore();
  const [matchups, setMatchups] = useState<Matchup[]>([]);
  const [selectedMatchup, setSelectedMatchup] = useState<Matchup | null>(null);
  const [odds, setOdds] = useState<string>('');
  const [betAmount, setBetAmount] = useState<string>('100');
  const [isYourPickP1, setIsYourPickP1] = useState<boolean>(true);
  const [selectedGolfer1, setSelectedGolfer1] = useState<Golfer | null>(null);
  const [selectedGolfer2, setSelectedGolfer2] = useState<Golfer | null>(null);
  const [error, setError] = useState<string>('');
  const [eventName, setEventName] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      await fetchGolferData();
      runSimulation();
    };
    init();
  }, [fetchGolferData, runSimulation]);

  useEffect(() => {
    const fetchMatchups = async () => {
      try {
        const response = await datagolfService.getMatchups() as MatchupResponse;

        setEventName(response.event_name);
        setLastUpdated(response.last_updated);

        if (typeof response.match_list === 'string') {
          setError(response.match_list);
          setMatchups([]);
        } else {
          setMatchups(response.match_list || []);
          setError('');
        }
      } catch (error) {
        console.error('Error fetching matchups:', error);
        setError('Failed to fetch matchups. Please try again later.');
        setMatchups([]);
      }
    };
    fetchMatchups();
  }, []);

  useEffect(() => {
    if (selectedGolfer1 && selectedGolfer2) {
      runSimulation();
    }
  }, [selectedGolfer1, selectedGolfer2, runSimulation]);

  const getFilteredMatchups = () => {
    return matchups.filter(matchup => {
      const p1InGolfers = golfers.some(g => g.name.toLowerCase() === matchup.p1_player_name.toLowerCase());
      const p2InGolfers = golfers.some(g => g.name.toLowerCase() === matchup.p2_player_name.toLowerCase());
      return p1InGolfers && p2InGolfers;
    });
  };

  const filteredMatchups = getFilteredMatchups();

  const handlePlayerSelect = (playerName: string) => {
    const matchup = filteredMatchups.find(m =>
      m.p1_player_name === playerName || m.p2_player_name === playerName
    );

    if (matchup) {
      setSelectedMatchup(matchup);
      const isP1 = playerName === matchup.p1_player_name;
      setIsYourPickP1(isP1);

      // Set odds based on selection (using bet365 odds if available, otherwise first available book)
      if (matchup.odds.bet365) {
        setOdds(isP1 ? matchup.odds.bet365.p1 : matchup.odds.bet365.p2);
      } else {
        const firstBook = Object.keys(matchup.odds)[0];
        if (firstBook) {
          setOdds(isP1 ? matchup.odds[firstBook].p1 : matchup.odds[firstBook].p2);
        }
      }

      // Find golfers in our simulation data
      const golfer1 = golfers.find(g =>
        g.name.toLowerCase() === (isP1 ? matchup.p1_player_name : matchup.p2_player_name).toLowerCase()
      );
      const golfer2 = golfers.find(g =>
        g.name.toLowerCase() === (isP1 ? matchup.p2_player_name : matchup.p1_player_name).toLowerCase()
      );

      setSelectedGolfer1(golfer1 || null);
      setSelectedGolfer2(golfer2 || null);
      runSimulation();
    }
  };

  const calculateEdge = () => {
    if (!selectedGolfer1 || !selectedGolfer2 || !odds) return null;

    const projectedWinProb = selectedGolfer1.simulationStats.winPercentage /
      (selectedGolfer1.simulationStats.winPercentage + selectedGolfer2.simulationStats.winPercentage);

    const oddsDecimal = parseInt(odds);
    const impliedProb = oddsDecimal > 0
      ? 100 / (oddsDecimal + 100)
      : Math.abs(oddsDecimal) / (Math.abs(oddsDecimal) + 100);

    return (projectedWinProb - impliedProb) * 100;
  };

  const calculatePayout = () => {
    if (!odds || !betAmount) return null;

    const amount = parseFloat(betAmount);
    const oddsNum = parseInt(odds);

    if (oddsNum > 0) {
      return (amount * (oddsNum / 100)).toFixed(2);
    } else {
      return (amount * (100 / Math.abs(oddsNum))).toFixed(2);
    }
  };

  const edge = calculateEdge();
  const payout = calculatePayout();

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Matchup Analysis Tool</h2>
      
      <button
        onClick={runSimulation}
        className="bg-sharpside-green text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
      >
        Run Simulation
      </button>

      <div className="mb-6">
        <div className="text-sm text-gray-600">
          Event: {eventName}
        </div>
        <div className="text-sm text-gray-600">
          Last Updated: {lastUpdated}
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">No {error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Your Pick (Golfer to Bet On)
            </label>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Selected to Win
            </span>
          </div>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={selectedMatchup ? (isYourPickP1 ? selectedMatchup.p1_player_name : selectedMatchup.p2_player_name) : ''}
            onChange={(e) => handlePlayerSelect(e.target.value)}
          >
            <option value="">Select Golfer</option>
            {filteredMatchups.map((matchup) => (
              <>
                <option key={matchup.p1_player_name} value={matchup.p1_player_name}>
                  {matchup.p1_player_name}
                </option>
                <option key={matchup.p2_player_name} value={matchup.p2_player_name}>
                  {matchup.p2_player_name}
                </option>
              </>
            ))}
          </select>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Opponent
            </label>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Betting Against
            </span>
          </div>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={selectedMatchup ? (isYourPickP1 ? selectedMatchup.p2_player_name : selectedMatchup.p1_player_name) : ''}
            disabled
          >
            <option value="">Select Golfer</option>
            {filteredMatchups.map((matchup) => (
              <>
                <option key={matchup.p1_player_name} value={matchup.p1_player_name}>
                  {matchup.p1_player_name}
                </option>
                <option key={matchup.p2_player_name} value={matchup.p2_player_name}>
                  {matchup.p2_player_name}
                </option>
              </>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Odds for Your Pick (e.g., +120 or -110)
          </label>
          <input
            type="text"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={odds}
            onChange={(e) => setOdds(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bet Amount ($)
          </label>
          <input
            type="number"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
          />
        </div>
      </div>

      {selectedGolfer1 && selectedGolfer2 && odds && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Projected Win Probability</h3>
            <p className="text-2xl font-bold text-gray-900">
              {((selectedGolfer1.simulationStats.winPercentage /
                (selectedGolfer1.simulationStats.winPercentage + selectedGolfer2.simulationStats.winPercentage)) * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500 mt-1">
              For {selectedGolfer1.name}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Model Edge</h3>
            <p className={`text-2xl font-bold ${edge && edge > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {edge ? `${edge.toFixed(1)}%` : '-'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {edge && edge > 0 ? 'Favorable Edge' : 'Unfavorable Edge'}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Potential Payout</h3>
            <p className="text-2xl font-bold text-gray-900">
              ${payout || '-'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              If {selectedGolfer1?.name} wins
            </p>
          </div>
        </div>
      )}
      {selectedGolfer1 && selectedGolfer2 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Head-to-Head Comparison</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metric
                  </th>
                  <th className="px-6 py-3 bg-green-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {selectedGolfer1.name} (Your Pick)
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {selectedGolfer2.name}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    SG: Total
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 bg-green-50">
                    {selectedGolfer1.strokesGainedTotal.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    {selectedGolfer2.strokesGainedTotal.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Win Probability
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 bg-green-50">
                    {selectedGolfer1.simulationStats.winPercentage.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    {selectedGolfer2.simulationStats.winPercentage.toFixed(1)}%
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Average Finish
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 bg-green-50">
                    {selectedGolfer1.simulationStats.averageFinish.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    {selectedGolfer2.simulationStats.averageFinish.toFixed(1)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default MatchupTool;