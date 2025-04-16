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

      // Get available bookmakers and select the first one
      const bookmakers = getAvailableBookmakers(matchup);
      const firstBook = bookmakers[0] || '';
      setSelectedBookmaker(firstBook);

      // Set odds based on selected bookmaker
      if (firstBook && matchup.odds[firstBook]) {
        setOdds(matchup.odds[firstBook].p1);
      }

      // Find golfers in our simulation data
      const golfer1 = golfers.find(g => g.name.toLowerCase() === p1Name.toLowerCase());
      const golfer2 = golfers.find(g => g.name.toLowerCase() === p2Name.toLowerCase());

      setSelectedGolfer1(golfer1 || null);
      setSelectedGolfer2(golfer2 || null);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Matchup Analysis Tool</h2>
      
      {/* <button
        onClick={runSimulation}
        className="bg-sharpside-green text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
      >
        Run Simulation
      </button> */}

      <div className="mb-6">
        <div className="text-sm text-gray-600">
          Event: {eventName}
        </div>
        <div className="text-sm text-gray-600">
          Last Updated: {lastUpdated}
        </div>
      </div>

      {/* Add Sportsbook Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Sportsbook
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedFilterBookmaker('')}
            className={`px-4 py-2 rounded-lg text-sm ${
              !selectedFilterBookmaker
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Sportsbooks
          </button>
          {getAllAvailableBookmakers().map(book => (
            <button
              key={book}
              onClick={() => setSelectedFilterBookmaker(book)}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedFilterBookmaker === book
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {book}
              <span className="ml-2 text-xs">
                ({matchups.filter(m => m.odds[book]).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Add Positive Edge Filter */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOnlyPositiveEdge(!showOnlyPositiveEdge)}
            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
              showOnlyPositiveEdge
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showOnlyPositiveEdge ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
            Show Only Positive Edge Matchups
          </button>
          {showOnlyPositiveEdge && (
            <span className="text-sm text-gray-500">
              Showing {filteredMatchups.length} matchups with positive edge
            </span>
          )}
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
              Select Matchup
            </label>
            {selectedGolfer1 && selectedGolfer2 && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                getValueIndicator(selectedGolfer1, selectedGolfer2) 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {getValueIndicator(selectedGolfer1, selectedGolfer2) || 'Even Matchup'}
              </span>
            )}
          </div>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={selectedMatchup ? `${selectedMatchup.p1_player_name}|${selectedMatchup.p2_player_name}|${selectedMatchup.ties}` : ''}
            onChange={(e) => handlePlayerSelect(e.target.value)}
          >
            <option value="">Select Matchup</option>
            {filteredMatchups.map((matchup) => (
              <option 
                key={getMatchupKey(matchup)} 
                value={`${matchup.p1_player_name}|${matchup.p2_player_name}|${matchup.ties}`}
              >
                {getMatchupDisplayText(matchup)}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Your Pick
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsYourPickP1(true)}
                className={`px-3 py-1 text-xs rounded-full ${isYourPickP1 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700'}`}
              >
                {selectedMatchup?.p1_player_name || 'Player 1'}
              </button>
              <button
                onClick={() => setIsYourPickP1(false)}
                className={`px-3 py-1 text-xs rounded-full ${!isYourPickP1 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700'}`}
              >
                {selectedMatchup?.p2_player_name || 'Player 2'}
              </button>
            </div>
          </div>
          <div className="text-center p-2 bg-gray-100 rounded-md">
            {selectedMatchup ? (
              <span className="font-medium">
                {isYourPickP1 ? selectedMatchup.p1_player_name : selectedMatchup.p2_player_name}
              </span>
            ) : (
              <span className="text-gray-500">Select a matchup first</span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Odds for Your Pick (e.g., +120 or -110)
          </label>
          <input
            type="text"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={odds}
            readOnly
          />
          {selectedMatchup && (
            <div className="mt-1 text-sm text-gray-500">
              Ties: {selectedMatchup.ties === "void" ? (
                <span className="text-orange-600">Void (push if tied)</span>
              ) : (
                <span className="text-purple-600">
                  Separate bet available
                  {selectedMatchup.odds.bet365?.tie && ` (${selectedMatchup.odds.bet365.tie})`}
                </span>
              )}
            </div>
          )}
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

      {selectedMatchup && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Available Sportsbooks</label>
          <div className="mt-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredBookmakers.map(book => (
              <button
                key={book}
                onClick={() => {
                  setSelectedBookmaker(book);
                  setOdds(isYourPickP1 
                    ? selectedMatchup.odds[book].p1 
                    : selectedMatchup.odds[book].p2
                  );
                }}
                className={`p-3 rounded-lg border ${
                  selectedBookmaker === book 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-green-300'
                } ${
                  book === bestOddsBookmaker 
                    ? 'ring-2 ring-green-500' 
                    : ''
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{book}</span>
                  <span className={`text-sm ${
                    book === bestOddsBookmaker 
                      ? 'text-green-600 font-semibold' 
                      : 'text-gray-500'
                  }`}>
                    {isYourPickP1 
                      ? selectedMatchup.odds[book].p1 
                      : selectedMatchup.odds[book].p2
                    }
                    {book === bestOddsBookmaker && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Best Odds
                      </span>
                    )}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedGolfer1 && selectedGolfer2 && odds && (
        <div className="col-span-1 md:col-span-2">
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
                      {selectedGolfer1.name} {isYourPickP1 && '(Your Pick)'}
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {selectedGolfer2.name} {!isYourPickP1 && '(Your Pick)'}
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Edge
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      SG: Total
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                      isStatFavorable(selectedGolfer1.strokesGainedTotal, selectedGolfer2.strokesGainedTotal)
                        ? 'text-green-600 font-semibold'
                        : 'text-gray-500'
                    }`}>
                      {selectedGolfer1.strokesGainedTotal.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                      isStatFavorable(selectedGolfer2.strokesGainedTotal, selectedGolfer1.strokesGainedTotal)
                        ? 'text-green-600 font-semibold'
                        : 'text-gray-500'
                    }`}>
                      {selectedGolfer2.strokesGainedTotal.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        Math.abs(selectedGolfer1.strokesGainedTotal - selectedGolfer2.strokesGainedTotal) > 0.5
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {Math.abs(selectedGolfer1.strokesGainedTotal - selectedGolfer2.strokesGainedTotal).toFixed(2)}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Top 10 %
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                      isStatFavorable(selectedGolfer1.simulationStats.top10Percentage, selectedGolfer2.simulationStats.top10Percentage)
                        ? 'text-green-600 font-semibold'
                        : 'text-gray-500'
                    }`}>
                      {selectedGolfer1.simulationStats.top10Percentage.toFixed(1)}%
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                      isStatFavorable(selectedGolfer2.simulationStats.top10Percentage, selectedGolfer1.simulationStats.top10Percentage)
                        ? 'text-green-600 font-semibold'
                        : 'text-gray-500'
                    }`}>
                      {selectedGolfer2.simulationStats.top10Percentage.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        Math.abs(selectedGolfer1.simulationStats.top10Percentage - selectedGolfer2.simulationStats.top10Percentage) > 5
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {Math.abs(selectedGolfer1.simulationStats.top10Percentage - selectedGolfer2.simulationStats.top10Percentage).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedGolfer1 && selectedGolfer2 && odds && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 col-span-2">
          <div className={`p-4 rounded-lg ${edge && edge > 0 ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'}`}>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Model Edge</h3>
            <p className={`text-2xl font-bold ${edge && edge > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {edge ? `${edge.toFixed(1)}%` : '-'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {edge && edge > 0 ? (
                <span className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Favorable Edge
                </span>
              ) : 'Unfavorable Edge'}
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
    </div>
  );
}

export default MatchupTool;