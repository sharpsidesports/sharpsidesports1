import React, { useState, useEffect } from 'react';
import { useGolfStore } from '../store/useGolfStore';
import { Golfer } from '../types/golf';
import { datagolfService } from '../services/api/datagolfService';

interface ThreeBallOdds {
  odds: {
    [bookmaker: string]: {
      p1: number;
      p2: number;
      p3: number;
    };
  };
  p1_player_name: string;
  p2_player_name: string;
  p3_player_name: string;
  ties?: string;
}

interface ThreeBallResponse {
  event_name: string;
  last_updated: string;
  market: string;
  match_list: ThreeBallOdds[] | string;
}

function ThreeBallTool() {
  const { golfers, runSimulation, fetchGolferData } = useGolfStore();
  const [golfer1, setGolfer1] = useState<Golfer | null>(null);
  const [golfer2, setGolfer2] = useState<Golfer | null>(null);
  const [golfer3, setGolfer3] = useState<Golfer | null>(null);
  const [selectedBookmaker, setSelectedBookmaker] = useState<string>('');
  const [threeBallOdds, setThreeBallOdds] = useState<ThreeBallOdds[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [betAmount, setBetAmount] = useState<string>('100');
  const [eventName, setEventName] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [selectedMatchup, setSelectedMatchup] = useState<ThreeBallOdds | null>(null);
  const [selectedGolfer, setSelectedGolfer] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      try {
        await fetchGolferData();  // First get all golfer data including odds
        runSimulation();  // Run simulation once on initial load
      } catch (error) {
        console.error('Error fetching golfer data:', error);
        setError('Failed to fetch golfer data. Please try again later.');
      }
    };
    init();
  }, [fetchGolferData, runSimulation]);

  useEffect(() => {
    const fetchThreeBallData = async () => {
      if (golfers.length === 0) return; // Wait for golfers to be loaded

      try {
        setLoading(true);
        const response = await datagolfService.getThreeBallOdds() as ThreeBallResponse;
        
        setEventName(response.event_name);
        setLastUpdated(response.last_updated);

        if (typeof response.match_list === 'string') {
          setError(response.match_list);
          setThreeBallOdds([]);
        } else {
          setThreeBallOdds(response.match_list || []);
          setError('');
        }
      } catch (err) {
        setError('Failed to fetch odds. Please try again later.');
        console.error('Error fetching three ball odds:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchThreeBallData();
  }, [golfers.length]); // Only run when golfers are loaded

  useEffect(() => {
    if (selectedGolfer && selectedMatchup) {
      runSimulation();
    }
  }, [selectedGolfer, selectedMatchup, runSimulation]);

  const calculateThreeBallProbability = () => {
    if (!golfer1 || !golfer2 || !golfer3) return null;

    const total = golfer1.simulationStats.winPercentage + 
                 golfer2.simulationStats.winPercentage + 
                 golfer3.simulationStats.winPercentage;

    return (golfer1.simulationStats.winPercentage / total) * 100;
  };

  const getAvailableBookmakers = (matchup: ThreeBallOdds | null): string[] => {
    if (!matchup) return [];
    // Get all bookmakers except datagolf
    return Object.keys(matchup.odds).filter(book => book !== 'datagolf');
  };

  const handleGolferSelect = (playerName: string) => {
    console.log('Selected player:', playerName);
    const matchup = getFilteredMatchups().find(m =>
      m.p1_player_name === playerName || 
      m.p2_player_name === playerName || 
      m.p3_player_name === playerName
    );

    if (!matchup) {
      setError(`No three-ball matchup found for ${playerName}. Please select a different golfer.`);
      return;
    }

    // Clear any previous errors since we found a valid matchup
    setError('');
    
    console.log('Matchup found:', matchup);
      
    // Find which position (p1, p2, p3) the selected player is in
    let selectedPosition = '1';
    if (matchup.p2_player_name === playerName) selectedPosition = '2';
    if (matchup.p3_player_name === playerName) selectedPosition = '3';
    
    // Set the selected golfer and matchup
    setSelectedMatchup(matchup);
    setSelectedGolfer(playerName);

    // Get available bookmakers and select the first one
    const bookmakers = getAvailableBookmakers(matchup);
    const firstBook = bookmakers[0] || '';
    setSelectedBookmaker(firstBook);

    // Find golfers in our data
    let g1, g2, g3;
    
    if (selectedPosition === '1') {
      g1 = golfers.find(g => g.name.toLowerCase() === matchup.p1_player_name.toLowerCase());
      g2 = golfers.find(g => g.name.toLowerCase() === matchup.p2_player_name.toLowerCase());
      g3 = golfers.find(g => g.name.toLowerCase() === matchup.p3_player_name.toLowerCase());
    } else if (selectedPosition === '2') {
      g1 = golfers.find(g => g.name.toLowerCase() === matchup.p2_player_name.toLowerCase());
      g2 = golfers.find(g => g.name.toLowerCase() === matchup.p1_player_name.toLowerCase());
      g3 = golfers.find(g => g.name.toLowerCase() === matchup.p3_player_name.toLowerCase());
    } else {
      g1 = golfers.find(g => g.name.toLowerCase() === matchup.p3_player_name.toLowerCase());
      g2 = golfers.find(g => g.name.toLowerCase() === matchup.p1_player_name.toLowerCase());
      g3 = golfers.find(g => g.name.toLowerCase() === matchup.p2_player_name.toLowerCase());
    }

    setGolfer1(g1 || null);
    setGolfer2(g2 || null);
    setGolfer3(g3 || null);
  };

  const calculateEdge = () => {
    if (!selectedMatchup || !selectedBookmaker || !selectedGolfer) return null;

    // Get DataGolf's odds for the selected player
    const dgOdds = selectedMatchup.odds.datagolf;
    if (!dgOdds) return null;

    // Get selected bookmaker's odds
    const bookOdds = selectedMatchup.odds[selectedBookmaker];
    if (!bookOdds) return null;

    // Find which position (p1, p2, p3) the selected golfer is in
    let position = 'p1';
    if (selectedMatchup.p2_player_name === selectedGolfer) position = 'p2';
    if (selectedMatchup.p3_player_name === selectedGolfer) position = 'p3';

    // Convert DataGolf's American odds to implied probability
    const dgOddsStr = dgOdds[position].toString();
    const dgOddsNum = parseInt(dgOddsStr);
    const dgImpliedProb = dgOddsNum > 0
      ? (100 / (dgOddsNum + 100))
      : (Math.abs(dgOddsNum) / (Math.abs(dgOddsNum) + 100));

    // Convert bookmaker's American odds to implied probability
    const bookOddsStr = bookOdds[position].toString();
    const bookOddsNum = parseInt(bookOddsStr);
    const bookImpliedProb = bookOddsNum > 0
      ? (100 / (bookOddsNum + 100))
      : (Math.abs(bookOddsNum) / (Math.abs(bookOddsNum) + 100));

    // Calculate edge: datagolf implied prob - bookmaker implied prob
    // Multiply by 100 to convert to percentage
    const edge = (dgImpliedProb - bookImpliedProb) * 100;
    
    // For debugging
    console.log('Selected position:', position);
    console.log('DataGolf odds:', dgOddsNum, 'implied prob:', dgImpliedProb);
    console.log('Bookmaker odds:', bookOddsNum, 'implied prob:', bookImpliedProb);
    console.log('Edge:', edge);

    return edge;
  };

  const calculatePayout = () => {
    if (!betAmount) return null;
    
    const americanOdds = getCurrentOdds();
    if (!americanOdds) return null;

    const amount = parseFloat(betAmount);
    if (americanOdds > 0) {
      return ((amount * americanOdds) / 100).toFixed(2);
    } else {
      return ((amount * 100) / Math.abs(americanOdds)).toFixed(2);
    }
  };

  const getCurrentOdds = () => {
    if (!selectedMatchup || !selectedBookmaker || !selectedGolfer) return null;
    
    const bookmakerOdds = selectedMatchup.odds[selectedBookmaker];
    if (!bookmakerOdds) return null;

    // Find which position (p1, p2, p3) the selected golfer is in
    if (selectedMatchup.p1_player_name === selectedGolfer) return bookmakerOdds.p1;
    if (selectedMatchup.p2_player_name === selectedGolfer) return bookmakerOdds.p2;
    if (selectedMatchup.p3_player_name === selectedGolfer) return bookmakerOdds.p3;

    return null;
  };

  const getFilteredMatchups = () => {
    return threeBallOdds.filter(matchup => {
      const p1InGolfers = golfers.some(g => g.name.toLowerCase() === matchup.p1_player_name.toLowerCase());
      const p2InGolfers = golfers.some(g => g.name.toLowerCase() === matchup.p2_player_name.toLowerCase());
      const p3InGolfers = golfers.some(g => g.name.toLowerCase() === matchup.p3_player_name.toLowerCase());
      return p1InGolfers && p2InGolfers && p3InGolfers;
    });
  };

  const edge = calculateEdge();
  const payout = calculatePayout();
  const winProbability = calculateThreeBallProbability();

  // Function to get tie handling information
  const getTieHandlingText = (matchup: ThreeBallOdds | null) => {
    if (!matchup) return '';
    
    // Three-ball matchups typically have "dead heat" rules for ties
    // Dead heat means if there's a tie for 1st place, the payout is divided
    return matchup.ties || 'dead heat';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-2">Three Ball Analysis Tool</h2>
        {eventName && (
          <div className="text-sm text-gray-600 mb-4">
            Event: {eventName}<br />
            Last Updated: {new Date(lastUpdated).toLocaleString()}
          </div>
        )}
        
        {loading && <div className="text-center">Loading odds...</div>}
        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              value={golfer1?.name || ''}
              onChange={(e) => handleGolferSelect(e.target.value)}
            >
              <option value="">Select Golfer</option>
              {golfers.map((golfer) => (
                <option key={golfer.id} value={golfer.name}>
                  {golfer.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Opponent 1
              </label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Betting Against
              </span>
            </div>
            <div className="w-full p-2 bg-gray-100 rounded-md border border-gray-300">
              {golfer2?.name || 'Auto-selected based on your pick'}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Opponent 2
              </label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Betting Against
              </span>
            </div>
            <div className="w-full p-2 bg-gray-100 rounded-md border border-gray-300">
              {golfer3?.name || 'Auto-selected based on your pick'}
            </div>
          </div>

          <div className="col-span-1 md:col-span-3">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Odds for Your Pick (e.g., +120 or -110)
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  value={getCurrentOdds() || ''}
                  readOnly
                />
                {selectedMatchup && (
                  <div className="mt-1 text-sm text-gray-500">
                    Ties: {getTieHandlingText(selectedMatchup) === "dead heat" ? (
                      <span className="text-blue-600">Dead Heat (payout divided if tied)</span>
                    ) : (
                      <span className="text-purple-600">{getTieHandlingText(selectedMatchup)}</span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bet Amount ($)
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  placeholder="100"
                />
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-3">
            {selectedMatchup && (
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Bookmaker
                </label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  value={selectedBookmaker}
                  onChange={(e) => setSelectedBookmaker(e.target.value)}
                >
                  <option value="">Select Bookmaker</option>
                  {getAvailableBookmakers(selectedMatchup).map(book => (
                    <option key={book} value={book}>{book}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {selectedMatchup && selectedBookmaker && (
          <div className="col-span-1 md:col-span-3 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Win Probability</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {winProbability ? `${winProbability.toFixed(1)}%` : '-'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  For {golfer1?.name}
                </p>
              </div> */}

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
                  If {golfer1?.name} wins
                </p>
              </div>
            </div>
          </div>
        )}

        {golfer1 && golfer2 && golfer3 && (
          <div className="col-span-1 md:col-span-3 mt-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Three Ball Comparison</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Metric
                      </th>
                      <th className="px-6 py-3 bg-green-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {golfer1.name} (Your Pick)
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {golfer2.name}
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {golfer3.name}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        SG: Total
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 bg-green-50">
                        {golfer1.strokesGainedTotal.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                        {golfer2.strokesGainedTotal.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                        {golfer3.strokesGainedTotal.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Top 10 %
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 bg-green-50">
                        {golfer1.simulationStats.top10Percentage.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                        {golfer2.simulationStats.top10Percentage.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                        {golfer3.simulationStats.top10Percentage.toFixed(1)}%
                      </td>
                    </tr>
                    {/* <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Win Probability
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 bg-green-50">
                        {golfer1.simulationStats.winPercentage.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                        {golfer2.simulationStats.winPercentage.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                        {golfer3.simulationStats.winPercentage.toFixed(1)}%
                      </td>
                    </tr> */}
                    {/* <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Average Finish
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 bg-green-50">
                        {golfer1.simulationStats.averageFinish.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                        {golfer2.simulationStats.averageFinish.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                        {golfer3.simulationStats.averageFinish.toFixed(1)}
                      </td>
                    </tr> */}

                  </tbody>
                </table>
              </div>
            </div>
        </div>
          )}
      </div>
    </div>
  );
}

export default ThreeBallTool;