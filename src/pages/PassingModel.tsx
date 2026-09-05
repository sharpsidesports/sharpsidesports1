import React, { useEffect, useState } from 'react';

interface PassingProjectionRow {
  playerName: string;
  team: string;
  opponentTeam: string | null;
  espnProjectedAttempts: number | null;
  espnProjectedPassingYards: number | null;
  projectedTeamPassAttempts: number | null;
  expectedTotalPlays: number | null;
  expectedPassRate: number | null;
  expectedAttempts: number | null;
  attemptsOverExpected: number | null;
  expectedYardsPerAttempt: number | null;
  expectedPassingYards: number | null;
  projectedPassingYards: number | null;
  yardsOverExpected: number | null;
  vegasSpread: number | null;
  vegasTotal: number | null;
  dataLastUpdated: string | null;
  confidence: 'high' | 'medium' | 'low';
  fallbacksUsed: string[];
  warnings: string[];
  skipped?: 'OUT' | 'BYE';
}

// Attempts/Yards Over Expected are relative-to-baseline by construction, so
// unlike the reception model's confidence badge, this colors by sign — over
// expected (more volume than a script-neutral baseline predicts) is the
// signal worth surfacing at a glance.
function signStyle(value: number | null): string {
  if (value === null) return 'bg-gray-200 text-gray-700';
  if (value > 0) return 'bg-green-100 text-green-800';
  if (value < 0) return 'bg-red-100 text-red-800';
  return 'bg-gray-200 text-gray-700';
}

function formatSigned(value: number | null, decimals = 1): string {
  if (value === null) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}`;
}

function DetailRow({ row }: { row: PassingProjectionRow }) {
  return (
    <tr className="bg-gray-50">
      <td colSpan={6} className="px-6 py-4 text-xs text-gray-600">
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 sm:grid-cols-3 lg:grid-cols-4">
          <div>ESPN projected attempts: <span className="font-semibold text-gray-900">{row.espnProjectedAttempts ?? '—'}</span></div>
          <div>ESPN projected yards: <span className="font-semibold text-gray-900">{row.espnProjectedPassingYards ?? '—'}</span></div>
          <div>Expected total plays: <span className="font-semibold text-gray-900">{row.expectedTotalPlays ?? '—'}</span></div>
          <div>Expected pass rate: <span className="font-semibold text-gray-900">{row.expectedPassRate !== null ? `${(row.expectedPassRate * 100).toFixed(1)}%` : '—'}</span></div>
          <div>Expected attempts: <span className="font-semibold text-gray-900">{row.expectedAttempts ?? '—'}</span></div>
          <div>Expected yards/attempt: <span className="font-semibold text-gray-900">{row.expectedYardsPerAttempt ?? '—'}</span></div>
          <div>Expected passing yards: <span className="font-semibold text-gray-900">{row.expectedPassingYards ?? '—'}</span></div>
          <div>Vegas spread: <span className="font-semibold text-gray-900">{row.vegasSpread ?? '—'}</span></div>
          <div>Vegas total: <span className="font-semibold text-gray-900">{row.vegasTotal ?? '—'}</span></div>
          <div>Data updated: <span className="font-semibold text-gray-900">{row.dataLastUpdated ? new Date(row.dataLastUpdated).toLocaleString() : '—'}</span></div>
          {row.fallbacksUsed.length > 0 && (
            <div className="col-span-full">Fallbacks: <span className="font-semibold text-gray-900">{row.fallbacksUsed.join(', ')}</span></div>
          )}
          {row.warnings.length > 0 && (
            <div className="col-span-full text-amber-700">Warnings: <span className="font-semibold">{row.warnings.join(', ')}</span></div>
          )}
        </div>
      </td>
    </tr>
  );
}

function TeamTable({ team, rows }: { team: string; rows: PassingProjectionRow[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const cellCls = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900';

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b bg-sharpside-green/10">
        <h2 className="text-xl font-semibold text-sharpside-green">{team}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projected Attempts</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attempts Over Expected</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projected Passing Yards</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yards Over Expected</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row, idx) => (
              <React.Fragment key={row.playerName}>
                <tr className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.playerName}</td>
                  <td className={cellCls}>
                    {row.skipped ? <span className="text-gray-400 italic">{row.skipped}</span> : row.projectedTeamPassAttempts ?? '—'}
                  </td>
                  <td className={cellCls}>
                    {row.attemptsOverExpected !== null ? (
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${signStyle(row.attemptsOverExpected)}`}>
                        {formatSigned(row.attemptsOverExpected)}
                      </span>
                    ) : '—'}
                  </td>
                  <td className={cellCls}>
                    {row.skipped ? <span className="text-gray-400 italic">{row.skipped}</span> : row.projectedPassingYards ?? '—'}
                  </td>
                  <td className={cellCls}>
                    {row.yardsOverExpected !== null ? (
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${signStyle(row.yardsOverExpected)}`}>
                        {formatSigned(row.yardsOverExpected)}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      className="text-xs text-sharpside-green hover:underline"
                      onClick={() => setExpanded(expanded === row.playerName ? null : row.playerName)}
                      type="button"
                    >
                      {expanded === row.playerName ? 'Hide detail' : 'Detail'}
                    </button>
                  </td>
                </tr>
                {expanded === row.playerName && <DetailRow row={row} />}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function PassingModel() {
  const [rows, setRows] = useState<PassingProjectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [season] = useState(2026);
  const [week] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/passing-model?season=${season}&week=${week}`)
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

  const byTeam = React.useMemo(() => {
    const map = new Map<string, PassingProjectionRow[]>();
    for (const row of rows) {
      const list = map.get(row.team) ?? [];
      list.push(row);
      map.set(row.team, list);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [rows]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Passing Model</h1>

      {loading && (
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading projections...</p>
        </div>
      )}
      {error && <div className="p-6 text-center text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="space-y-8">
          {byTeam.map(([team, teamRows]) => (
            <TeamTable key={team} team={team} rows={teamRows} />
          ))}
        </div>
      )}
    </div>
  );
}
