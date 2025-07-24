// This file is part of the Sharpside project, which is licensed under the MIT License.
import { useState, useEffect } from 'react';
import { useGolfStore } from '../store/useGolfStore.js';
import { Golfer } from '../types/golf.js';
import { datagolfService } from '../services/api/datagolfService.js';

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
  const [selectedPosition, setSelectedPosition] = useState<'p1' | 'p2' | 'p3'>('p1');
  const [selectedFilterBookmaker, setSelectedFilterBookmaker] = useState<string>('');
  const [showOnlyPositiveEdge, setShowOnlyPositiveEdge] = useState<boolean>(false);

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
        // Placeholder: No real DataGolf API, show static message
        setEventName('Example Event');
        setLastUpdated('2023-10-27T10:00:00Z');
        setThreeBallOdds([
          {
            odds: {
              datagolf: { p1: 100, p2: 200, p3: 300 },
              bookmakerA: { p1: 110, p2: 220, p3: 330 },
              bookmakerB: { p1: 95, p2: 190, p3: 285 },
            },
            p1_player_name: 'Player 1',
            p2_player_name: 'Player 2',
            p3_player_name: 'Player 3',
            ties: 'dead heat',
          },
          {
            odds: {
              datagolf: { p1: 150, p2: 250, p3: 350 },
              bookmakerA: { p1: 160, p2: 260, p3: 360 },
              bookmakerB: { p1: 145, p2: 245, p3: 345 },
            },
            p1_player_name: 'Player 4',
            p2_player_name: 'Player 5',
            p3_player_name: 'Player 6',
            ties: 'dead heat',
          },
        ]);
        setError('');
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
    if (selectedMatchup && selectedBookmaker && selectedMatchup.odds[selectedBookmaker]) {
      // Odds will be updated automatically through getCurrentOdds()
      runSimulation();
    }
  }, [selectedPosition, selectedBookmaker, selectedMatchup, runSimulation]);

  const getAvailableBookmakers = (matchup: ThreeBallOdds | null): string[] => {
    if (!matchup) return [];
    // Get all bookmakers except datagolf
    return Object.keys(matchup.odds).filter(book => book !== 'datagolf');
  };

  const getMatchupKey = (matchup: ThreeBallOdds) => {
    return `${matchup.p1_player_name}-${matchup.p2_player_name}-${matchup.p3_player_name}`;
  };

  const getMatchupDisplayText = (matchup: ThreeBallOdds) => {
    const tieText = matchup.ties === "dead heat" ? "(Ties: Dead Heat)" : "(Ties: " + (matchup.ties || "Dead Heat") + ")";
    return `${matchup.p1_player_name} vs ${matchup.p2_player_name} vs ${matchup.p3_player_name} ${tieText}`;
  };

  const handleMatchupSelect = (value: string) => {
    // value format: "p1Name|p2Name|p3Name"
    const [p1Name, p2Name, p3Name] = value.split('|');
    
    const matchup = getFilteredMatchups().find(m => 
      m.p1_player_name === p1Name && 
      m.p2_player_name === p2Name &&
      m.p3_player_name === p3Name
    );

    if (!matchup) {
      setError(`No three-ball matchup found. Please select a different matchup.`);
      return;
    }

    // Clear any previous errors since we found a valid matchup
    setError('');
    
    console.log('Matchup found:', matchup);
      
    // Set the selected matchup and default to player 1
    setSelectedMatchup(matchup);
    setSelectedPosition('p1');

    // Get available bookmakers and select the first one
    const bookmakers = getAvailableBookmakers(matchup);
    const firstBook = bookmakers[0] || '';
    setSelectedBookmaker(firstBook);

    // Find golfers in our data
    const g1 = golfers.find(g => g.name.toLowerCase() === matchup.p1_player_name.toLowerCase());
    const g2 = golfers.find(g => g.name.toLowerCase() === matchup.p2_player_name.toLowerCase());
    const g3 = golfers.find(g => g.name.toLowerCase() === matchup.p3_player_name.toLowerCase());
    
    setGolfer1(g1 || null);
    setGolfer2(g2 || null);
    setGolfer3(g3 || null);
  };

  const calculateEdge = () => {
    if (!selectedMatchup || !selectedBookmaker) return null;

    // Get DataGolf's odds for the selected player
    const dgOdds = selectedMatchup.odds.datagolf;
    if (!dgOdds) return null;

    // Get selected bookmaker's odds
    const bookOdds = selectedMatchup.odds[selectedBookmaker];
    if (!bookOdds) return null;

    // Convert DataGolf's American odds to implied probability
    const dgOddsStr = dgOdds[selectedPosition].toString();
    const dgOddsNum = parseInt(dgOddsStr);
    const dgImpliedProb = dgOddsNum > 0
      ? (100 / (dgOddsNum + 100))
      : (Math.abs(dgOddsNum) / (Math.abs(dgOddsNum) + 100));

    // Convert bookmaker's American odds to implied probability
    const bookOddsStr = bookOdds[selectedPosition].toString();
    const bookOddsNum = parseInt(bookOddsStr);
    const bookImpliedProb = bookOddsNum > 0
      ? (100 / (bookOddsNum + 100))
      : (Math.abs(bookOddsNum) / (Math.abs(bookOddsNum) + 100));

    // Calculate edge: datagolf implied prob - bookmaker implied prob
    // Multiply by 100 to convert to percentage
    const edge = (dgImpliedProb - bookImpliedProb) * 100;
    
    // For debugging
    console.log('Selected position:', selectedPosition);
    console.log('DataGolf odds:', dgOddsNum, 'implied prob:', dgImpliedProb);
    console.log('Bookmaker odds:', bookOddsNum, 'implied prob:', bookImpliedProb);
    console.log('Edge:', edge);

    return edge;
  };

  const getCurrentOdds = () => {
    if (!selectedMatchup || !selectedBookmaker) return null;
    
    const bookmakerOdds = selectedMatchup.odds[selectedBookmaker];
    if (!bookmakerOdds) return null;

    return bookmakerOdds[selectedPosition];
  };

  const getSelectedGolferName = () => {
    if (!selectedMatchup) return '';
    
    if (selectedPosition === 'p1') return selectedMatchup.p1_player_name;
    if (selectedPosition === 'p2') return selectedMatchup.p2_player_name;
    if (selectedPosition === 'p3') return selectedMatchup.p3_player_name;
    
    return '';
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

  const getAllAvailableBookmakers = () => {
    const bookmakers = new Set<string>();
    threeBallOdds.forEach(matchup => {
      Object.keys(matchup.odds).forEach(book => {
        if (book !== 'datagolf') {
          bookmakers.add(book);
        }
      });
    });
    return Array.from(bookmakers).sort();
  };

  const calculateEdgeForMatchup = (matchup: ThreeBallOdds, position: 'p1' | 'p2' | 'p3') => {
    // Get DataGolf's odds
    const dgOdds = matchup.odds.datagolf;
    if (!dgOdds) return 0;

    // Get the best odds from available bookmakers
    let bestBookOdds = -Infinity;
    Object.entries(matchup.odds).forEach(([bookmaker, odds]) => {
      if (bookmaker === 'datagolf') return;
      
      const oddsNum = odds[position];
      
      // Convert to decimal odds for comparison
      const decimalOdds = oddsNum > 0 ? (oddsNum + 100) / 100 : (100 / Math.abs(oddsNum)) + 1;
      if (decimalOdds > bestBookOdds) {
        bestBookOdds = decimalOdds;
      }
    });

    // Get DataGolf's implied probability
    const dgOddsNum = dgOdds[position];
    const dgImpliedProb = dgOddsNum > 0
      ? (100 / (dgOddsNum + 100))
      : (Math.abs(dgOddsNum) / (Math.abs(dgOddsNum) + 100));

    // Convert best book odds to implied probability
    const bookImpliedProb = 1 / bestBookOdds;

    // Calculate edge
    return (dgImpliedProb - bookImpliedProb) * 100;
  };

  const getFilteredMatchups = () => {
    return threeBallOdds.filter(matchup => {
      const p1InGolfers = golfers.some(g => g.name.toLowerCase() === matchup.p1_player_name.toLowerCase());
      const p2InGolfers = golfers.some(g => g.name.toLowerCase() === matchup.p2_player_name.toLowerCase());
      const p3InGolfers = golfers.some(g => g.name.toLowerCase() === matchup.p3_player_name.toLowerCase());

      // Add sportsbook filter
      const matchesSportsbook = !selectedFilterBookmaker || 
        (matchup.odds[selectedFilterBookmaker] !== undefined);

      // Add positive edge filter
      let hasPositiveEdge = true;
      if (showOnlyPositiveEdge) {
        // Check edge for all three players in the matchup
        const p1Edge = calculateEdgeForMatchup(matchup, 'p1');
        const p2Edge = calculateEdgeForMatchup(matchup, 'p2');
        const p3Edge = calculateEdgeForMatchup(matchup, 'p3');
        hasPositiveEdge = (p1Edge > 0 || p2Edge > 0 || p3Edge > 0);
      }

      return p1InGolfers && p2InGolfers && p3InGolfers && matchesSportsbook && hasPositiveEdge;
    });
  };

  const edge = calculateEdge();
  const payout = calculatePayout();

  // Function to get tie handling information
  const getTieHandlingText = (matchup: ThreeBallOdds | null) => {
    if (!matchup) return '';
    
    // Three-ball matchups typically have "dead heat" rules for ties
    // Dead heat means if there's a tie for 1st place, the payout is divided
    return matchup.ties || 'dead heat';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sharpside-green"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Three Ball Tool</h2>
        <div className="text-center text-red-500 py-12">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Three Ball Tool</h2>
      
      {/* Event Information */}
      {eventName && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2">{eventName}</h3>
          {lastUpdated && (
            <p className="text-sm text-gray-600">{lastUpdated}</p>
          )}
        </div>
      )}

      {/* Matchup Selection */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Select Matchup</h3>
        <select
          value={selectedMatchup ? getMatchupKey(selectedMatchup) : ''}
          onChange={(e) => handleMatchupSelect(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sharpside-green"
        >
          <option value="">Select a three-ball matchup</option>
          {getFilteredMatchups().map((matchup) => (
            <option key={getMatchupKey(matchup)} value={getMatchupKey(matchup)}>
              {getMatchupDisplayText(matchup)}
            </option>
          ))}
        </select>
      </div>

      {/* Selected Matchup Analysis */}
      {selectedMatchup && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Matchup Analysis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Player 1 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">{selectedMatchup.p1_player_name}</h4>
              {(() => {
                const player = golfers.find(g => g.name === selectedMatchup.p1_player_name);
                if (!player) return <p className="text-sm text-gray-500">No data available</p>;
                
                return (
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>SG Total:</span>
                      <span>{player.strokesGainedTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Win %:</span>
                      <span>{player.simulationStats.winPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Top 10 %:</span>
                      <span>{player.simulationStats.top10Percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Player 2 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">{selectedMatchup.p2_player_name}</h4>
              {(() => {
                const player = golfers.find(g => g.name === selectedMatchup.p2_player_name);
                if (!player) return <p className="text-sm text-gray-500">No data available</p>;
                
                return (
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>SG Total:</span>
                      <span>{player.strokesGainedTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Win %:</span>
                      <span>{player.simulationStats.winPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Top 10 %:</span>
                      <span>{player.simulationStats.top10Percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Player 3 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">{selectedMatchup.p3_player_name}</h4>
              {(() => {
                const player = golfers.find(g => g.name === selectedMatchup.p3_player_name);
                if (!player) return <p className="text-sm text-gray-500">No data available</p>;
                
                return (
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>SG Total:</span>
                      <span>{player.strokesGainedTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Win %:</span>
                      <span>{player.simulationStats.winPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Top 10 %:</span>
                      <span>{player.simulationStats.top10Percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Odds Comparison */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Available Odds</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 border">Bookmaker</th>
                    <th className="px-4 py-2 border">{selectedMatchup.p1_player_name}</th>
                    <th className="px-4 py-2 border">{selectedMatchup.p2_player_name}</th>
                    <th className="px-4 py-2 border">{selectedMatchup.p3_player_name}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(selectedMatchup.odds).map(([bookmaker, odds]) => (
                    <tr key={bookmaker} className="border-t">
                      <td className="px-4 py-2 border font-medium">{bookmaker}</td>
                      <td className="px-4 py-2 border text-center">{odds.p1}</td>
                      <td className="px-4 py-2 border text-center">{odds.p2}</td>
                      <td className="px-4 py-2 border text-center">{odds.p3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Betting Interface */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Betting Calculator</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bet Amount ($)
                </label>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sharpside-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Player
                </label>
                <select
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value as 'p1' | 'p2' | 'p3')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sharpside-green"
                >
                  <option value="p1">Player 1</option>
                  <option value="p2">Player 2</option>
                  <option value="p3">Player 3</option>
                </select>
              </div>
            </div>
            
            {selectedMatchup && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Current Odds:</span>
                  <span className="font-medium">{getCurrentOdds()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Potential Payout:</span>
                  <span className="font-medium">${payout || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Edge:</span>
                  <span className={`font-medium ${(edge || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(edge || 0) > 0 ? '+' : ''}{(edge || 0).toFixed(2)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Available Matchups List */}
      {threeBallOdds.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">All Available Three-Ball Matchups</h3>
          <div className="space-y-4">
            {getFilteredMatchups().map((matchup, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{getMatchupDisplayText(matchup)}</span>
                  <span className="text-sm text-gray-500">
                    {Object.keys(matchup.odds).length} bookmakers
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {getTieHandlingText(matchup)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ThreeBallTool;