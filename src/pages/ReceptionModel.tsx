import React, { useEffect, useState } from 'react';
import PlayerCard, { type PlayerCardTag } from '../components/nfl/PlayerCard.js';
import MatchupGroup from '../components/nfl/MatchupGroup.js';
import { groupByMatchup } from '../lib/nfl/groupByMatchup.js';
import { percentileRank } from '../lib/nfl/percentileRank.js';

const VIP_PASSWORDS = ['cfbweek1', 'brodie25', 'ssports25', 'chris25', 'josh25']; // Array of valid VIP passwords

interface ReceptionProjectionRow {
  espnId: string;
  playerName: string;
  team: string;
  opponentTeam: string | null;
  espnProjectedReceptions: number | null;
  expectedTargetShare: number | null;
  projectedTeamPassAttempts: number | null;
  projectedTargets: number | null;
  expectedCatchRate: number | null;
  nflverseProjectedReceptions: number | null;
  finalProjectedReceptionsRaw: number | null;
  projectedReceptions: number | null;
  receptionEdgeScore: number | null;
  projectionDifference: number | null;
  impliedTeamTotal: number | null;
  opponentTdRateAllowed: number | null;
  opponentCatchPctAllowed: number | null;
  targetsPerGame: number | null;
  catchPctSeason: number | null;
  receptionDebt: number | null;
  sharpScore: number | null;
  dataSeason: number;
  dataWeek: number;
  dataLastUpdated: string | null;
  confidence: 'high' | 'medium' | 'low';
  fallbacksUsed: string[];
  warnings: string[];
  skipped?: 'OUT' | 'BYE';
}

// High-volume/plus-matchup/trending thresholds are presentation-only
// judgment calls against this week's pool — not part of the Sharp Score
// calculation itself.
const HIGH_VOLUME_PERCENTILE = 0.8;
const PLUS_MATCHUP_PERCENTILE = 0.7;
const TRENDING_DEBT_THRESHOLD = 2;

function tagsForRow(
  row: ReceptionProjectionRow,
  allTargetsPerGame: (number | null)[],
  allOppCatchPct: (number | null)[]
): PlayerCardTag[] {
  if (row.skipped === 'OUT') return [{ label: 'OUT', tone: 'gray' }];
  if (row.skipped === 'BYE') return [{ label: 'BYE', tone: 'gray' }];

  const tags: PlayerCardTag[] = [];
  const volumePctl = percentileRank(row.targetsPerGame, allTargetsPerGame);
  if (volumePctl !== null && volumePctl >= HIGH_VOLUME_PERCENTILE) tags.push({ label: 'High Volume', tone: 'green' });

  const matchupPctl = percentileRank(row.opponentCatchPctAllowed, allOppCatchPct);
  if (matchupPctl !== null && matchupPctl >= PLUS_MATCHUP_PERCENTILE) tags.push({ label: 'Plus Matchup', tone: 'blue' });

  if (row.receptionDebt !== null && row.receptionDebt >= TRENDING_DEBT_THRESHOLD) {
    tags.push({ label: 'Trending Up', tone: 'amber' });
  } else if (row.receptionDebt !== null && row.receptionDebt <= -TRENDING_DEBT_THRESHOLD) {
    tags.push({ label: 'Trending Down', tone: 'gray' });
  }

  return tags;
}

function DetailPanel({ row }: { row: ReceptionProjectionRow }) {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-gray-600 sm:grid-cols-3 lg:grid-cols-4">
      <div>ESPN projected: <span className="font-semibold text-gray-900">{row.espnProjectedReceptions ?? '—'}</span></div>
      <div>Target share: <span className="font-semibold text-gray-900">{row.expectedTargetShare !== null ? `${(row.expectedTargetShare * 100).toFixed(1)}%` : '—'}</span></div>
      <div>Team pass att.: <span className="font-semibold text-gray-900">{row.projectedTeamPassAttempts ?? '—'}</span></div>
      <div>Projected targets: <span className="font-semibold text-gray-900">{row.projectedTargets ?? '—'}</span></div>
      <div>Catch rate: <span className="font-semibold text-gray-900">{row.expectedCatchRate !== null ? `${(row.expectedCatchRate * 100).toFixed(1)}%` : '—'}</span></div>
      <div>nflverse model: <span className="font-semibold text-gray-900">{row.nflverseProjectedReceptions ?? '—'}</span></div>
      <div>Final (raw): <span className="font-semibold text-gray-900">{row.finalProjectedReceptionsRaw ?? '—'}</span></div>
      <div>Edge Score (legacy): <span className="font-semibold text-gray-900">{row.receptionEdgeScore ?? '—'}</span></div>
      <div>Implied team total: <span className="font-semibold text-gray-900">{row.impliedTeamTotal ?? '—'}</span></div>
      <div>Matchup (opp TD/g allowed): <span className="font-semibold text-gray-900">{row.opponentTdRateAllowed ?? '—'}</span></div>
      <div>Opp catch % allowed: <span className="font-semibold text-gray-900">{row.opponentCatchPctAllowed !== null ? `${(row.opponentCatchPctAllowed * 100).toFixed(1)}%` : '—'}</span></div>
      <div>Targets/game (season): <span className="font-semibold text-gray-900">{row.targetsPerGame ?? '—'}</span></div>
      <div>Catch % (season): <span className="font-semibold text-gray-900">{row.catchPctSeason !== null ? `${(row.catchPctSeason * 100).toFixed(1)}%` : '—'}</span></div>
      <div>Reception debt: <span className="font-semibold text-gray-900">{row.receptionDebt ?? '—'}</span></div>
      <div>Data updated: <span className="font-semibold text-gray-900">{row.dataLastUpdated ? new Date(row.dataLastUpdated).toLocaleString() : '—'}</span></div>
      {row.fallbacksUsed.length > 0 && (
        <div className="col-span-full">Fallbacks: <span className="font-semibold text-gray-900">{row.fallbacksUsed.join(', ')}</span></div>
      )}
      {row.warnings.length > 0 && (
        <div className="col-span-full text-amber-700">Warnings: <span className="font-semibold">{row.warnings.join(', ')}</span></div>
      )}
    </div>
  );
}

export default function ReceptionModel() {
  // VIP password gate temporarily disabled — flip back to false to re-enable.
  const [showVIP, setShowVIP] = useState(true);
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);

  const [rows, setRows] = useState<ReceptionProjectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [season] = useState(2026);
  const [week] = useState(3);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/reception-model?season=${season}&week=${week}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setRows(data.players ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load projections');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [season, week]);

  const handleVIPClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPrompt(true);
    setPwInput('');
    setPwError('');
  };

  const handleVIPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (VIP_PASSWORDS.includes(pwInput)) {
      setShowVIP(true);
      setShowPrompt(false);
      setPwInput('');
      setPwError('');
    } else {
      setPwError('Incorrect password');
    }
  };

  // Global rank by Sharp Score across the whole week's pool — shown on each
  // card regardless of which matchup group it ends up in, same idea as a
  // week-wide leaderboard position.
  const rankByPlayer = React.useMemo(() => {
    const ranked = [...rows]
      .filter((r) => r.sharpScore !== null)
      .sort((a, b) => (b.sharpScore ?? 0) - (a.sharpScore ?? 0));
    const map = new Map<string, number>();
    ranked.forEach((row, idx) => map.set(row.espnId, idx + 1));
    return map;
  }, [rows]);

  const matchups = React.useMemo(
    () =>
      groupByMatchup(
        rows,
        (r) => r.team,
        (r) => r.opponentTeam,
        (r) => r.sharpScore
      ).sort((a, b) => a.key.localeCompare(b.key)),
    [rows]
  );

  const allTargetsPerGame = React.useMemo(() => rows.map((r) => r.targetsPerGame), [rows]);
  const allOppCatchPct = React.useMemo(() => rows.map((r) => r.opponentCatchPctAllowed), [rows]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Reception Model</h1>

      {loading && (
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading projections...</p>
        </div>
      )}
      {error && <div className="p-6 text-center text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="space-y-8">
          {matchups.map((matchup) => (
            <MatchupGroup key={matchup.key} teamA={matchup.teamA} teamB={matchup.teamB}>
              {matchup.players.map((row) => (
                <PlayerCard
                  key={row.espnId}
                  rank={rankByPlayer.get(row.espnId) ?? 0}
                  name={row.playerName}
                  espnId={row.espnId}
                  subtitle={`WR · ${row.team} vs ${row.opponentTeam}`}
                  tags={tagsForRow(row, allTargetsPerGame, allOppCatchPct)}
                  score={row.sharpScore}
                  blurred={!showVIP}
                  onUnlockClick={handleVIPClick}
                >
                  <DetailPanel row={row} />
                </PlayerCard>
              ))}
            </MatchupGroup>
          ))}
        </div>
      )}

      {showPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form onSubmit={handleVIPSubmit} className="bg-white p-6 rounded shadow-lg flex flex-col items-center">
            <label className="mb-2 font-semibold">Enter VIP Password</label>
            <input
              type="password"
              value={pwInput}
              onChange={(e) => setPwInput(e.target.value)}
              className="border px-3 py-2 rounded mb-2"
              autoFocus
            />
            {pwError && <div className="text-red-500 text-xs mb-2">{pwError}</div>}
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Submit
              </button>
              <button
                type="button"
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowPrompt(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
