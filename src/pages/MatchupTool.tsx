// Description: A React component for analyzing golf matchups using odds from various sportsbooks and simulation data.
import { useState, useEffect } from 'react';
import { useGolfStore } from '../store/useGolfStore.js';
import { Golfer } from '../types/golf.js';
import { datagolfService } from '../services/api/datagolfService.js';

interface Matchup {
  p1_player_name: string;
  p2_player_name: string;
  odds: {
    [bookmaker: string]: {
      p1: string;
      p2: string;
      tie?: string;
    };
  };
  ties: "void" | "separate bet offered";
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
  const [loading, setLoading] = useState<boolean>(false);
  const [eventName, setEventName] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [selectedBookmaker, setSelectedBookmaker] = useState<string>('');
  const [filteredBookmakers, setFilteredBookmakers] = useState<string[]>([]);
  const [bestOddsBookmaker, setBestOddsBookmaker] = useState<string>('');
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
    const fetchMatchups = async () => {
      if (golfers.length === 0) return; // Wait for golfers to be loaded

      try {
        // Placeholder: No real DataGolf API, show static message
        setEventName('Tournament Name');
        setLastUpdated('Last Updated: 2023-10-27 10:00 AM');
        setMatchups([
          {
            p1_player_name: 'Tiger Woods',
            p2_player_name: 'Phil Mickelson',
            odds: {
              bet365: { p1: '+120', p2: '-110', tie: 'Push' },
              pinnacle: { p1: '+110', p2: '-105', tie: 'Push' },
              draftkings: { p1: '+115', p2: '-100', tie: 'Push' },
            },
            ties: 'void',
          },
          {
            p1_player_name: 'Rory McIlroy',
            p2_player_name: 'Jordan Spieth',
            odds: {
              bet365: { p1: '+150', p2: '-130', tie: 'Push' },
              pinnacle: { p1: '+140', p2: '-120', tie: 'Push' },
              draftkings: { p1: '+145', p2: '-125', tie: 'Push' },
            },
            ties: 'separate bet offered',
          },
          {
            p1_player_name: 'Dustin Johnson',
            p2_player_name: 'Justin Thomas',
            odds: {
              bet365: { p1: '+200', p2: '-180', tie: 'Push' },
              pinnacle: { p1: '+190', p2: '-170', tie: 'Push' },
              draftkings: { p1: '+195', p2: '-175', tie: 'Push' },
            },
            ties: 'void',
          },
        ]);
          setError('');
      } catch (error) {
        console.error('Error fetching matchups:', error);
        setError('Failed to fetch matchups. Please try again later.');
        setMatchups([]);
      }
    };
    fetchMatchups();
  }, [golfers.length]); // Only run when golfers are loaded

  useEffect(() => {
    if (selectedGolfer1 && selectedGolfer2) {
      // Keep this empty - no automatic simulation on golfer selection
    }
  }, [selectedGolfer1, selectedGolfer2]);

  useEffect(() => {
    if (selectedMatchup && selectedBookmaker && selectedMatchup.odds[selectedBookmaker]) {
      // Update odds based on which player is selected
      setOdds(isYourPickP1 
        ? selectedMatchup.odds[selectedBookmaker].p1 
        : selectedMatchup.odds[selectedBookmaker].p2
      );
    }
  }, [isYourPickP1, selectedBookmaker, selectedMatchup]);

  // Add function to get all available bookmakers across all matchups
  const getAllAvailableBookmakers = () => {
    const bookmakers = new Set<string>();
    matchups.forEach(matchup => {
      Object.keys(matchup.odds).forEach(book => {
        if (book !== 'datagolf') {
          bookmakers.add(book);
        }
      });
    });
    return Array.from(bookmakers).sort();
  };

  // Modify getFilteredMatchups to include sportsbook filtering and positive edge filter
  const getFilteredMatchups = () => {
    console.log('Total matchups before filtering:', matchups.length);
    console.log('Total golfers in data:', golfers.length);

    const missingGolfers = new Set<string>();
    
    const filtered = matchups.filter(matchup => {
      const p1InGolfers = golfers.some(g => g.name.toLowerCase() === matchup.p1_player_name.toLowerCase());
      const p2InGolfers = golfers.some(g => g.name.toLowerCase() === matchup.p2_player_name.toLowerCase());
      
      if (!p1InGolfers) {
        missingGolfers.add(matchup.p1_player_name);
      }
      if (!p2InGolfers) {
        missingGolfers.add(matchup.p2_player_name);
      }

      // Add sportsbook filter
      const matchesSportsbook = !selectedFilterBookmaker || 
        (matchup.odds[selectedFilterBookmaker] !== undefined);

      // Add positive edge filter
      let hasPositiveEdge = true;
      if (showOnlyPositiveEdge) {
        // Check edge for both players in the matchup
        const p1Edge = calculateEdgeForMatchup(matchup, true);
        const p2Edge = calculateEdgeForMatchup(matchup, false);
        hasPositiveEdge = (p1Edge > 0 || p2Edge > 0);
      }

      return p1InGolfers && p2InGolfers && matchesSportsbook && hasPositiveEdge;
    });

    console.log('Matchups after filtering:', filtered.length);
    console.log('Players missing from golfer data:', Array.from(missingGolfers).sort());

    // Log some sample golfer names to help debug potential name mismatches
    console.log('Sample golfer names in our data:', golfers.slice(0, 5).map(g => g.name));
    
    return filtered;
  };

  // Add helper function to calculate edge for a specific matchup and player
  const calculateEdgeForMatchup = (matchup: Matchup, isP1: boolean) => {
    // Get DataGolf's odds
    const dgOdds = matchup.odds.datagolf;
    if (!dgOdds) return 0;

    // Get the best odds from available bookmakers
    let bestBookOdds = -Infinity;
    Object.entries(matchup.odds).forEach(([bookmaker, odds]) => {
      if (bookmaker === 'datagolf') return;
      
      const oddsStr = isP1 ? odds.p1 : odds.p2;
      const oddsNum = parseInt(oddsStr);
      
      // Convert to decimal odds for comparison
      const decimalOdds = oddsNum > 0 ? (oddsNum + 100) / 100 : (100 / Math.abs(oddsNum)) + 1;
      if (decimalOdds > bestBookOdds) {
        bestBookOdds = decimalOdds;
      }
    });

    // Get DataGolf's implied probability
    const dgOddsStr = isP1 ? dgOdds.p1 : dgOdds.p2;
    const dgOddsNum = parseInt(dgOddsStr);
    const dgImpliedProb = dgOddsNum > 0
      ? (100 / (dgOddsNum + 100))
      : (Math.abs(dgOddsNum) / (Math.abs(dgOddsNum) + 100));

    // Convert best book odds to implied probability
    const bookImpliedProb = 1 / bestBookOdds;

    // Calculate edge
    return (dgImpliedProb - bookImpliedProb) * 100;
  };

  const filteredMatchups = getFilteredMatchups();

  const getMatchupKey = (matchup: Matchup) => {
    return `${matchup.p1_player_name}-${matchup.p2_player_name}-${matchup.ties}`;
  };

  const getMatchupDisplayText = (matchup: Matchup) => {
    const tieText = matchup.ties === "void" ? "(Tie: Void)" : "(Tie: Offered)";
    return `${matchup.p1_player_name} vs ${matchup.p2_player_name} ${tieText}`;
  };

  const findBestOdds = (matchup: Matchup | null, isP1: boolean) => {
    if (!matchup) return { bookmaker: '', odds: '' };
    
    let bestOdds = -Infinity;
    let bestBookmaker = '';
    
    Object.entries(matchup.odds).forEach(([bookmaker, odds]) => {
      if (bookmaker === 'datagolf') return; // Skip datagolf odds
      
      const currentOdds = parseInt(isP1 ? odds.p1 : odds.p2);
      if (currentOdds > bestOdds) {
        bestOdds = currentOdds;
        bestBookmaker = bookmaker;
      }
    });

    return {
      bookmaker: bestBookmaker,
      odds: bestOdds.toString()
    };
  };

  const getAvailableBookmakers = (matchup: Matchup | null): string[] => {
    if (!matchup) return [];
    
    // Get all bookmakers except datagolf
    const bookmakers = Object.keys(matchup.odds)
      .filter(book => book !== 'datagolf')
      .sort((a, b) => {
        const aOdds = parseInt(isYourPickP1 ? matchup.odds[a].p1 : matchup.odds[a].p2);
        const bOdds = parseInt(isYourPickP1 ? matchup.odds[b].p1 : matchup.odds[b].p2);
        return bOdds - aOdds; // Sort descending (best odds first)
      });
    
    return bookmakers;
  };

  const handlePlayerSelect = (value: string) => {
    // value format: "p1Name|p2Name|tieTerms"
    const [p1Name, p2Name, tieTerm] = value.split('|');
    
    const matchup = filteredMatchups.find(m => 
      m.p1_player_name === p1Name && 
      m.p2_player_name === p2Name && 
      m.ties === tieTerm
    );

    if (matchup) {
      setSelectedMatchup(matchup);
      setIsYourPickP1(true);

      // Get available bookmakers and select the first one with valid odds
      const bookmakers = getAvailableBookmakers(matchup);
      const firstBook = bookmakers.find(book => matchup.odds[book] && matchup.odds[book].p1 && matchup.odds[book].p2) || '';
      setSelectedBookmaker(firstBook);

      // Set odds based on selected bookmaker, fallback to empty string if not available
      if (firstBook && matchup.odds[firstBook]) {
        setOdds(matchup.odds[firstBook].p1 || '');
      } else {
        setOdds('');
      }

      // Find golfers in our simulation data
      const golfer1 = golfers.find(g => g.name.toLowerCase() === p1Name.toLowerCase());
      const golfer2 = golfers.find(g => g.name.toLowerCase() === p2Name.toLowerCase());

      setSelectedGolfer1(golfer1 || null);
      setSelectedGolfer2(golfer2 || null);
    } else {
      // If no matchup found, reset state
      setSelectedMatchup(null);
      setSelectedBookmaker('');
      setOdds('');
      setSelectedGolfer1(null);
      setSelectedGolfer2(null);
    }
  };

  useEffect(() => {
    if (selectedMatchup && golfers.length > 0) {
      const golfer1Name = isYourPickP1 ? selectedMatchup.p1_player_name : selectedMatchup.p2_player_name;
      const golfer2Name = isYourPickP1 ? selectedMatchup.p2_player_name : selectedMatchup.p1_player_name;
      
      const golfer1 = golfers.find(g => g.name.toLowerCase() === golfer1Name.toLowerCase());
      const golfer2 = golfers.find(g => g.name.toLowerCase() === golfer2Name.toLowerCase());

      setSelectedGolfer1(golfer1 || null);
      setSelectedGolfer2(golfer2 || null);
    }
  }, [golfers, selectedMatchup, isYourPickP1]);

  useEffect(() => {
    if (selectedMatchup) {
      const bookmakers = getAvailableBookmakers(selectedMatchup);
      setFilteredBookmakers(bookmakers);
      
      const { bookmaker, odds } = findBestOdds(selectedMatchup, isYourPickP1);
      setBestOddsBookmaker(bookmaker);
      
      // If no bookmaker is selected, select the one with best odds
      if (!selectedBookmaker && bookmaker) {
        setSelectedBookmaker(bookmaker);
        setOdds(odds);
      }
    }
  }, [selectedMatchup, isYourPickP1]);

  const calculateEdge = () => {
    if (!selectedMatchup || !selectedBookmaker) return null;

    // Get DataGolf's odds for the selected player
    const dgOdds = selectedMatchup.odds.datagolf;
    if (!dgOdds) return null;

    // Get selected bookmaker's odds
    const bookOdds = selectedMatchup.odds[selectedBookmaker];
    if (!bookOdds) return null;

    // Get the right odds based on which player was picked
    const dgOddsStr = isYourPickP1 ? dgOdds.p1 : dgOdds.p2;
    const bookOddsStr = isYourPickP1 ? bookOdds.p1 : bookOdds.p2;

    // Convert DataGolf's American odds to implied probability
    const dgOddsNum = parseInt(dgOddsStr);
    const dgImpliedProb = dgOddsNum > 0
      ? (100 / (dgOddsNum + 100))
      : (Math.abs(dgOddsNum) / (Math.abs(dgOddsNum) + 100));

    // Convert bookmaker's American odds to implied probability
    const bookOddsNum = parseInt(bookOddsStr);
    const bookImpliedProb = bookOddsNum > 0
      ? (100 / (bookOddsNum + 100))
      : (Math.abs(bookOddsNum) / (Math.abs(bookOddsNum) + 100));

    // Calculate edge: datagolf implied prob - bookmaker implied prob
    // Multiply by 100 to convert to percentage
    const edge = (dgImpliedProb - bookImpliedProb) * 100;
    
    // For debugging
    console.log('DataGolf odds:', dgOddsNum, 'implied prob:', dgImpliedProb * 100);
    console.log('Bookmaker odds:', bookOddsNum, 'implied prob:', bookImpliedProb * 100);
    console.log('Edge:', edge);

    return edge;
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

  // Add new function to determine value indicators
  const getValueIndicator = (golfer1: Golfer, golfer2: Golfer) => {
    const sg1 = golfer1.strokesGainedTotal;
    const sg2 = golfer2.strokesGainedTotal;
    const top10_1 = golfer1.simulationStats.top10Percentage;
    const top10_2 = golfer2.simulationStats.top10Percentage;
    
    const sgDiff = sg1 - sg2;
    const top10Diff = top10_1 - top10_2;
    
    if (sgDiff > 0.5 && top10Diff > 5) return 'Strong Value';
    if (sgDiff > 0.2 || top10Diff > 2) return 'Potential Value';
    return null;
  };

  // Add function to determine if a stat comparison is favorable
  const isStatFavorable = (stat1: number, stat2: number) => {
    return stat1 > stat2;
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
        <h2 className="text-2xl font-bold mb-6">Matchup Analysis Tool</h2>
        <div className="text-center text-red-500 py-12">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Matchup Analysis Tool</h2>
      
      {/* Player Selection */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Player 1
            </label>
            <select
              value={selectedGolfer1?.name || ''}
              onChange={(e) => handlePlayerSelect(`${e.target.value}|${selectedGolfer2?.name || ''}|${selectedMatchup?.ties}`)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sharpside-green"
            >
              <option value="">Select Player 1</option>
              {golfers.map((golfer) => (
                <option key={golfer.id} value={golfer.name}>
                  {golfer.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Player 2
            </label>
            <select
              value={selectedGolfer2?.name || ''}
              onChange={(e) => handlePlayerSelect(`${selectedGolfer1?.name || ''}|${e.target.value}|${selectedMatchup?.ties}`)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sharpside-green"
            >
              <option value="">Select Player 2</option>
              {golfers.map((golfer) => (
                <option key={golfer.id} value={golfer.name}>
                  {golfer.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Matchup Analysis */}
      {selectedGolfer1 && selectedGolfer2 && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Matchup Analysis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Player 1 Stats */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">{selectedGolfer1.name}</h4>
              {(() => {
                const player1 = golfers.find(g => g.name === selectedGolfer1.name);
                if (!player1) return <p className="text-gray-500">Player not found</p>;
                
                return (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Strokes Gained Total:</span>
                      <span className={isStatFavorable(player1.strokesGainedTotal, 0) ? 'text-green-600' : 'text-red-600'}>
                        {player1.strokesGainedTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Top 10 %:</span>
                      <span className={isStatFavorable(player1.simulationStats.top10Percentage, 0) ? 'text-green-600' : 'text-red-600'}>
                        {player1.simulationStats.top10Percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Win %:</span>
                      <span className={isStatFavorable(player1.simulationStats.winPercentage, 0) ? 'text-green-600' : 'text-red-600'}>
                        {player1.simulationStats.winPercentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Player 2 Stats */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">{selectedGolfer2.name}</h4>
              {(() => {
                const player2 = golfers.find(g => g.name === selectedGolfer2.name);
                if (!player2) return <p className="text-gray-500">Player not found</p>;
                
                return (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Strokes Gained Total:</span>
                      <span className={isStatFavorable(player2.strokesGainedTotal, 0) ? 'text-green-600' : 'text-red-600'}>
                        {player2.strokesGainedTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Top 10 %:</span>
                      <span className={isStatFavorable(player2.simulationStats.top10Percentage, 0) ? 'text-green-600' : 'text-red-600'}>
                        {player2.simulationStats.top10Percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Win %:</span>
                      <span className={isStatFavorable(player2.simulationStats.winPercentage, 0) ? 'text-green-600' : 'text-red-600'}>
                        {player2.simulationStats.winPercentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Value Analysis */}
          {(() => {
            const player1 = golfers.find(g => g.name === selectedGolfer1.name);
            const player2 = golfers.find(g => g.name === selectedGolfer2.name);
            
            if (!player1 || !player2) return null;
            
            const valueIndicator = getValueIndicator(player1, player2);
            
            return (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">Value Analysis</h4>
                {valueIndicator ? (
                  <p className="text-blue-700 font-medium">{valueIndicator}</p>
                ) : (
                  <p className="text-gray-600">No clear value edge detected</p>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Available Matchups */}
      {matchups.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Available Matchups</h3>
          <div className="space-y-4">
            {getFilteredMatchups().map((matchup, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{getMatchupDisplayText(matchup)}</span>
                  <span className="text-sm text-gray-500">
                    {matchup.odds && Object.keys(matchup.odds).length > 0 ? 
                      `${Object.keys(matchup.odds).length} bookmakers` : 
                      'No odds available'
                    }
                  </span>
                </div>
                
                {matchup.odds && Object.keys(matchup.odds).length > 0 && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">{matchup.p1_player_name}:</span>
                      <div className="space-y-1 mt-1">
                        {Object.entries(matchup.odds).map(([bookmaker, odds]) => (
                          <div key={bookmaker} className="flex justify-between">
                            <span className="text-gray-600">{bookmaker}:</span>
                            <span>{odds.p1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">{matchup.p2_player_name}:</span>
                      <div className="space-y-1 mt-1">
                        {Object.entries(matchup.odds).map(([bookmaker, odds]) => (
                          <div key={bookmaker} className="flex justify-between">
                            <span className="text-gray-600">{bookmaker}:</span>
                            <span>{odds.p2}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MatchupTool;