import React, { useEffect, useState, useCallback } from 'react';
import PlayerCard, { type PlayerCardTag } from '../../components/nfl/PlayerCard.js';
import MatchupGroup from '../../components/nfl/MatchupGroup.js';
import StatBar from '../../components/nfl/StatBar.js';
import { groupByMatchup } from '../../lib/nfl/groupByMatchup.js';
import { percentileRank } from '../../lib/nfl/percentileRank.js';

function pctlFill(pctl: number | null): number | null {
  return pctl === null ? null : pctl * 100;
}

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
  implied_team_total: number | null;
  matchup_td_rate_allowed: number | null;
  sharp_score: number | null;
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

const POSITIONS: Array<'ALL' | 'QB' | 'RB' | 'WR' | 'TE'> = ['ALL', 'QB', 'RB', 'WR', 'TE'];

// Presentation-only judgment calls against this week's pool, not part of the
// Sharp Score calculation itself.
const PLUS_MATCHUP_PERCENTILE = 0.7;
const HIGH_TOTAL_PERCENTILE = 0.75;
const VALUE_EDGE_THRESHOLD = 0.03; // edge is a probability delta (e.g. 0.03 = +3 points of edge)

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

function tagsForPlayer(
  p: CombinedPlayer,
  allMatchupRates: (number | null)[],
  allImpliedTotals: (number | null)[]
): PlayerCardTag[] {
  const tags: PlayerCardTag[] = [];

  const matchupPctl = percentileRank(p.matchup_td_rate_allowed, allMatchupRates);
  if (matchupPctl !== null && matchupPctl >= PLUS_MATCHUP_PERCENTILE) tags.push({ label: 'Plus Matchup', tone: 'blue' });

  const totalPctl = percentileRank(p.implied_team_total, allImpliedTotals);
  if (totalPctl !== null && totalPctl >= HIGH_TOTAL_PERCENTILE) tags.push({ label: 'High Total', tone: 'green' });

  if (p.edge !== null && p.edge >= VALUE_EDGE_THRESHOLD) tags.push({ label: 'Value', tone: 'amber' });

  return tags;
}

interface StatPools {
  espnTdProbability: (number | null)[];
  consensusTdProbability: (number | null)[];
  edge: (number | null)[];
  impliedTeamTotal: (number | null)[];
  matchupTdRateAllowed: (number | null)[];
}

function DetailPanel({ p, pools }: { p: CombinedPlayer; pools: StatPools }) {
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Component Breakdown</div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          <StatBar
            label="Sharpside TD %"
            value={formatPct(p.espn_td_probability)}
            fillPct={pctlFill(percentileRank(p.espn_td_probability, pools.espnTdProbability))}
          />
          <StatBar
            label="Consensus TD %"
            value={formatPct(p.consensus_td_probability)}
            fillPct={pctlFill(percentileRank(p.consensus_td_probability, pools.consensusTdProbability))}
            tone="blue"
          />
          <StatBar
            label="Implied Team Total"
            value={p.implied_team_total === null ? '—' : `${p.implied_team_total.toFixed(1)} pts`}
            fillPct={pctlFill(percentileRank(p.implied_team_total, pools.impliedTeamTotal))}
          />
          <StatBar
            label="Matchup (opp TD/g allowed)"
            value={p.matchup_td_rate_allowed === null ? '—' : p.matchup_td_rate_allowed.toFixed(2)}
            fillPct={pctlFill(percentileRank(p.matchup_td_rate_allowed, pools.matchupTdRateAllowed))}
            tone="blue"
          />
          <StatBar
            label="Edge vs. Market"
            value={formatEdge(p.edge)}
            fillPct={pctlFill(percentileRank(p.edge, pools.edge))}
            tone="amber"
          />
        </div>
      </div>

      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Full Data</div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-gray-600 sm:grid-cols-3 lg:grid-cols-4">
          <div>Sharpside projected TD: <span className="font-semibold text-gray-900">{p.projected_anytime_td.toFixed(2)}</span></div>
          <div>
            Consensus odds:{' '}
            <span className="font-semibold text-gray-900">
              {formatOdds(p.consensus_american_odds)}
              {p.sportsbook_count > 0 && <span className="ml-1 text-gray-400">({p.sportsbook_count} books)</span>}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnytimeTdProjections() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [positionFilter, setPositionFilter] = useState<'ALL' | 'QB' | 'RB' | 'WR' | 'TE'>('ALL');

  const load = useCallback(async (refresh: boolean) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/nfl-odds?week=3&season=2026${refresh ? '&refresh=1' : ''}`);
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

  const players = data?.players ?? [];

  // Global rank by Sharp Score across the whole week's pool (unfiltered by
  // position), shown on each card the same way regardless of which matchup
  // group or position filter is active.
  const rankByPlayer = React.useMemo(() => {
    const ranked = [...players]
      .filter((p) => p.sharp_score !== null)
      .sort((a, b) => (b.sharp_score ?? 0) - (a.sharp_score ?? 0));
    const map = new Map<string, number>();
    ranked.forEach((p, idx) => map.set(p.player_id, idx + 1));
    return map;
  }, [players]);

  const filtered = positionFilter === 'ALL' ? players : players.filter((p) => p.position === positionFilter);

  const matchups = React.useMemo(
    () =>
      groupByMatchup(
        filtered,
        (p) => p.team,
        (p) => p.opponent,
        (p) => p.sharp_score
      ).sort((a, b) => a.key.localeCompare(b.key)),
    [filtered]
  );

  const allMatchupRates = React.useMemo(() => players.map((p) => p.matchup_td_rate_allowed), [players]);
  const allImpliedTotals = React.useMemo(() => players.map((p) => p.implied_team_total), [players]);

  const statPools: StatPools = React.useMemo(
    () => ({
      espnTdProbability: players.map((p) => p.espn_td_probability),
      consensusTdProbability: players.map((p) => p.consensus_td_probability),
      edge: players.map((p) => p.edge),
      impliedTeamTotal: allImpliedTotals,
      matchupTdRateAllowed: allMatchupRates,
    }),
    [players, allImpliedTotals, allMatchupRates]
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-8 px-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">NFL Week 1 Anytime TD Projections vs. Sportsbook Odds</h1>
          <p className="text-gray-600 text-sm">
            Sharpside's Week 1 projections compared against the sportsbook consensus Anytime TD Scorer price. Edge =
            Sharpside TD probability minus the sportsbook consensus probability.
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
          Sharpside has not published Week 1 {data?.season ?? ''} projections yet. Check back closer to the season.
        </div>
      ) : (
        <>
          {!data.oddsApiConfigured && (
            <div className="p-4 text-sm text-gray-700 bg-yellow-50 border border-yellow-200 rounded-lg">
              Sportsbook odds aren't configured yet (no <code>ODDS_API_KEY</code>) — showing Sharpside projections only.
              Consensus and edge will appear once the key is added.
            </div>
          )}
          {data.oddsApiConfigured && data.oddsError && (
            <div className="p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">
              Sportsbook odds are temporarily unavailable: {data.oddsError}
            </div>
          )}
          {data.oddsApiConfigured && !data.oddsError && data.matchedPlayerCount === 0 && (
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
              {filtered.length} players · {data.matchedPlayerCount} with sportsbook odds · updated{' '}
              {new Date(data.generatedAt).toLocaleString()}
              {data.cached ? ' (cached)' : ''}
            </p>
          </div>

          <div className="space-y-8">
            {matchups.map((matchup) => (
              <MatchupGroup key={matchup.key} teamA={matchup.teamA} teamB={matchup.teamB}>
                {matchup.players.map((p) => (
                  <PlayerCard
                    key={p.player_id}
                    rank={rankByPlayer.get(p.player_id) ?? 0}
                    name={p.player_name}
                    espnId={p.player_id}
                    subtitle={`${p.position} · ${p.team} vs ${p.opponent}`}
                    tags={tagsForPlayer(p, allMatchupRates, allImpliedTotals)}
                    score={p.sharp_score}
                  >
                    <DetailPanel p={p} pools={statPools} />
                  </PlayerCard>
                ))}
              </MatchupGroup>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
