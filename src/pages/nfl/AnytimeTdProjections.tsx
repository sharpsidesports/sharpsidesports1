import React, { useEffect, useState, useCallback } from 'react';

interface PlayerProjection {
  player_id: string;
  player_name: string;
  team: string;
  position: 'QB' | 'RB' | 'WR' | 'TE';
  opponent: string;
  projected_pass_td: number;
  projected_rush_td: number;
  projected_rec_td: number;
  projected_anytime_td: number;
  td_probability: number;
  fair_american_odds: number | null;
}

interface ApiResponse {
  season: number;
  week: number;
  generatedAt: string;
  available: boolean;
  playerCount: number;
  players: PlayerProjection[];
  cached?: boolean;
  stale?: boolean;
  error?: string;
  details?: string;
}

const POSITIONS: Array<'ALL' | 'QB' | 'RB' | 'WR' | 'TE'> = ['ALL', 'QB', 'RB', 'WR', 'TE'];

function formatOdds(odds: number | null): string {
  if (odds === null) return '—';
  return odds > 0 ? `+${odds}` : `${odds}`;
}

export default function AnytimeTdProjections() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [positionFilter, setPositionFilter] = useState<'ALL' | 'QB' | 'RB' | 'WR' | 'TE'>('ALL');
  const [sortColumn, setSortColumn] = useState<'anytime' | 'probability' | 'odds'>('anytime');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const load = useCallback(async (refresh: boolean) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/nfl-projections?week=1&season=2026${refresh ? '&refresh=1' : ''}`);
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

  const handleSort = (col: 'anytime' | 'probability' | 'odds') => {
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
    return [...filtered].sort((a, b) => {
      if (sortColumn === 'anytime') return (a.projected_anytime_td - b.projected_anytime_td) * dir;
      if (sortColumn === 'probability') return (a.td_probability - b.td_probability) * dir;
      // Fair odds: treat missing odds as least likely
      const aOdds = a.fair_american_odds ?? Infinity;
      const bOdds = b.fair_american_odds ?? Infinity;
      return (aOdds - bOdds) * dir * -1; // more negative odds = more likely, so flip for "desc = most likely first"
    });
  }, [filtered, sortColumn, sortDirection]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">NFL Week 1 Anytime TD Projections</h1>
          <p className="text-gray-600 text-sm">
            Sourced directly from ESPN Fantasy's Week 1 player projections. Anytime TD = projected rushing TD +
            projected receiving TD (passing TDs excluded).
          </p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing || loading}
          className="shrink-0 rounded-lg bg-sharpside-green px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-700 disabled:opacity-50"
        >
          {refreshing ? 'Refreshing…' : 'Refresh from ESPN'}
        </button>
      </div>

      {loading ? (
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading ESPN projections...</p>
        </div>
      ) : error ? (
        <div className="p-6 text-center text-red-600">{error}</div>
      ) : !data?.available ? (
        <div className="p-6 text-center text-gray-700 bg-yellow-50 border border-yellow-200 rounded-lg">
          ESPN has not published Week 1 {data?.season ?? ''} projections yet. Check back closer to the season —
          this page will show real data as soon as it's available (no placeholder numbers are shown).
        </div>
      ) : (
        <>
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
              {sorted.length} players · updated {new Date(data.generatedAt).toLocaleString()}
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
                  <th
                    onClick={() => handleSort('anytime')}
                    className="px-4 py-3 text-center uppercase tracking-wider font-semibold whitespace-nowrap cursor-pointer select-none"
                  >
                    ESPN Projected TD{sortColumn === 'anytime' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                  </th>
                  <th
                    onClick={() => handleSort('probability')}
                    className="px-4 py-3 text-center uppercase tracking-wider font-semibold whitespace-nowrap cursor-pointer select-none"
                  >
                    TD Probability{sortColumn === 'probability' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                  </th>
                  <th
                    onClick={() => handleSort('odds')}
                    className="px-4 py-3 text-center uppercase tracking-wider font-semibold whitespace-nowrap cursor-pointer select-none"
                  >
                    Fair Odds{sortColumn === 'odds' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                  </th>
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
                    <td className="px-4 py-3 text-center whitespace-nowrap text-green-700 font-bold">
                      {p.projected_anytime_td.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">{(p.td_probability * 100).toFixed(1)}%</td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">{formatOdds(p.fair_american_odds)}</td>
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
