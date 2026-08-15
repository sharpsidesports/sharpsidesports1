import React, { useEffect, useState, useCallback } from 'react';

interface CombinedPlayer {
  player_id: string;
  player_name: string;
  team: string;
  position: 'QB' | 'RB' | 'WR' | 'TE';
  opponent: string;
  projected_anytime_td: number;
  espn_td_probability: number;
  fanduel_odds: number | null;
  draftkings_odds: number | null;
  betmgm_odds: number | null;
  caesars_odds: number | null;
  sportsbook_count: number;
  consensus_td_probability: number | null;
  consensus_american_odds: number | null;
  edge: number | null;
}

interface ApiResponse {
  season: number;
  week: number;
  generatedAt: string;
  espnAvailable: boolean;
  oddsApiConfigured: boolean;
  oddsError: string | null;
  eventsChecked: number;
  eventsWithOdds: number;
  playerCount: number;
  matchedPlayerCount: number;
  unmatchedSportsbookPlayers: Array<{ name: string; bookmaker: string; price: number }>;
  players: CombinedPlayer[];
  cached?: boolean;
  stale?: boolean;
  error?: string;
  details?: string;
}

type SortKey = 'edge' | 'projected' | 'espnProb' | 'consensusProb' | 'consensusOdds';

const POSITIONS: Array<'ALL' | 'QB' | 'RB' | 'WR' | 'TE'> = ['ALL', 'QB', 'RB', 'WR', 'TE'];

function formatOdds(odds: number | null): string {
  if (odds === null) return '—';
  return odds > 0 ? `+${odds}` : `${odds}`;
}

function formatPct(p: number | null): string {
  if (p === null) return '—';
  return `${(p * 100).toFixed(1)}%`;
}

function formatEdge(edge: number | null): string {
  if (edge === null) return '—';
  const pct = edge * 100;
  return pct > 0 ? `+${pct.toFixed(1)}%` : `${pct.toFixed(1)}%`;
}

export default function AnytimeTdProjections() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [positionFilter, setPositionFilter] = useState<'ALL' | 'QB' | 'RB' | 'WR' | 'TE'>('ALL');
  const [sortColumn, setSortColumn] = useState<SortKey>('edge');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const load = useCallback(async (refresh: boolean) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/nfl-odds?week=1&season=2026${refresh ? '&refresh=1' : ''}`);
      const json: ApiResponse = await res.json();
      if (!res.ok) {
        throw new Error(json.details || json.error || 'Failed to load projections');
      }
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  const handleSort = (col: SortKey) => {
    if (sortColumn === col) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(col);
      setSortDirection('desc');
    }
  };

  const players = data?.players ?? [];
  const filtered = positionFilter === 'ALL' ? players : players.filter((p) => p.position === positionFilter);

  const sorted = React.useMemo(() => {
    const dir = sortDirection === 'asc' ? 1 : -1;
    const valueFor = (p: CombinedPlayer): number | null => {
      switch (sortColumn) {
        case 'edge':
          return p.edge;
        case 'projected':
          return p.projected_anytime_td;
        case 'espnProb':
          return p.espn_td_probability;
        case 'consensusProb':
          return p.consensus_td_probability;
        case 'consensusOdds':
          return p.consensus_american_odds;
      }
    };
    return [...filtered].sort((a, b) => {
      const av = valueFor(a);
      const bv = valueFor(b);
      // Players with no sportsbook data sort to the bottom regardless of direction.
      if (av === null && bv === null) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;
      return (av - bv) * dir;
    });
  }, [filtered, sortColumn, sortDirection]);

  const sortHeader = (label: string, col: SortKey) => (
    <th
      onClick={() => handleSort(col)}
      className="px-4 py-3 text-center uppercase tracking-wider font-semibold whitespace-nowrap cursor-pointer select-none"
    >
      {label}
      {sortColumn === col && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
    </th>
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">NFL Week 1 Anytime TD Projections vs. Sportsbook Odds</h1>
          <p className="text-gray-600 text-sm">
            ESPN's Week 1 projections compared against the sportsbook consensus Anytime TD Scorer price. Edge = ESPN TD
            probability minus the sportsbook consensus probability.
          </p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing || loading}
          className="shrink-0 rounded-lg bg-sharpside-green px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-700 disabled:opacity-50"
        >
          {refreshing ? 'Refreshing…' : 'Refresh odds'}
        </button>
      </div>

      {loading ? (
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading projections and odds...</p>
        </div>
      ) : error ? (
        <div className="p-6 text-center text-red-600">{error}</div>
      ) : !data?.espnAvailable ? (
        <div className="p-6 text-center text-gray-700 bg-yellow-50 border border-yellow-200 rounded-lg">
          ESPN has not published Week 1 {data?.season ?? ''} projections yet. Check back closer to the season.
        </div>
      ) : (
        <>
          {!data.oddsApiConfigured && (
            <div className="p-4 text-sm text-gray-700 bg-yellow-50 border border-yellow-200 rounded-lg">
              Sportsbook odds aren't configured yet (no <code>ODDS_API_KEY</code>) — showing ESPN projections only.
              Consensus and edge will appear once the key is added.
            </div>
          )}
          {data.oddsApiConfigured && data.matchedPlayerCount === 0 && (
            <div className="p-4 text-sm text-gray-700 bg-yellow-50 border border-yellow-200 rounded-lg">
              No sportsbook has posted Anytime TD Scorer lines for Week 1 yet ({data.eventsChecked} games checked).
              This table will fill in with consensus odds and edge as books open those markets closer to kickoff.
            </div>
          )}

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-2">
              {POSITIONS.map((pos) => (
                <button
                  key={pos}
                  onClick={() => setPositionFilter(pos)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                    positionFilter === pos
                      ? 'bg-sharpside-green text-white border-sharpside-green'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              {sorted.length} players · {data.matchedPlayerCount} with sportsbook odds · updated{' '}
              {new Date(data.generatedAt).toLocaleString()}
              {data.cached ? ' (cached)' : ''}
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full text-sm font-medium">
              <thead className="bg-sharpside-green/90 text-white sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left uppercase tracking-wider font-semibold whitespace-nowrap bg-sharpside-green text-white sticky left-0 z-20 shadow-lg">
                    Player
                  </th>
                  <th className="px-4 py-3 text-center uppercase tracking-wider font-semibold whitespace-nowrap">Team</th>
                  <th className="px-4 py-3 text-center uppercase tracking-wider font-semibold whitespace-nowrap">Pos</th>
                  <th className="px-4 py-3 text-center uppercase tracking-wider font-semibold whitespace-nowrap">Opp</th>
                  {sortHeader('ESPN Projected TD', 'projected')}
                  {sortHeader('ESPN TD %', 'espnProb')}
                  {sortHeader('Consensus Odds', 'consensusOdds')}
                  {sortHeader('Consensus TD %', 'consensusProb')}
                  {sortHeader('Edge', 'edge')}
                </tr>
              </thead>
              <tbody>
                {sorted.map((p, idx) => (
                  <tr
                    key={p.player_id}
                    className={(idx % 2 === 0 ? 'bg-white' : 'bg-gray-50') + ' hover:bg-green-50 transition-colors duration-100'}
                  >
                    <td className="px-4 py-3 text-left whitespace-nowrap font-bold bg-white sticky left-0 z-10 shadow-lg">
                      {p.player_name}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">{p.team}</td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">{p.position}</td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">{p.opponent}</td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">{p.projected_anytime_td.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">{formatPct(p.espn_td_probability)}</td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      {formatOdds(p.consensus_american_odds)}
                      {p.sportsbook_count > 0 && (
                        <span className="ml-1 text-xs text-gray-400">({p.sportsbook_count})</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">{formatPct(p.consensus_td_probability)}</td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      {p.edge === null ? (
                        <span className="text-gray-400">—</span>
                      ) : (
                        <span
                          className={`inline-block min-w-[64px] rounded-full px-2.5 py-1 font-bold ${
                            p.edge > 0
                              ? 'bg-green-100 text-green-800'
                              : p.edge < 0
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {formatEdge(p.edge)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
