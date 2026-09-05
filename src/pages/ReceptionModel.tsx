import React, { useEffect, useState } from 'react';

const VIP_PASSWORDS = ['cfbweek1', 'brodie25', 'ssports25', 'chris25', 'josh25']; // Array of valid VIP passwords

interface ReceptionProjectionRow {
  playerName: string;
  team: string;
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
  dataSeason: number;
  dataWeek: number;
  dataLastUpdated: string | null;
  confidence: 'high' | 'medium' | 'low';
  fallbacksUsed: string[];
  warnings: string[];
  skipped?: 'OUT' | 'BYE';
}

const CONFIDENCE_STYLES: Record<string, string> = {
  high: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-gray-200 text-gray-700',
};

// projectionDifference is FinalProjectedReceptions - EspnProjectedReceptions
// (see calculateProjectionDifference.ts) — expressed here as a percentage
// of the ESPN baseline rather than a raw reception count.
function formatDiffPct(diff: number | null, espnProjectedReceptions: number | null): string {
  if (diff === null || espnProjectedReceptions === null || espnProjectedReceptions === 0) return '—';
  const pct = (diff / espnProjectedReceptions) * 100;
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}%`;
}

function DetailRow({ row }: { row: ReceptionProjectionRow }) {
  return (
    <tr className="bg-gray-50">
      <td colSpan={5} className="px-6 py-4 text-xs text-gray-600">
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 sm:grid-cols-3 lg:grid-cols-4">
          <div>ESPN projected: <span className="font-semibold text-gray-900">{row.espnProjectedReceptions ?? '—'}</span></div>
          <div>Target share: <span className="font-semibold text-gray-900">{row.expectedTargetShare !== null ? `${(row.expectedTargetShare * 100).toFixed(1)}%` : '—'}</span></div>
          <div>Team pass att.: <span className="font-semibold text-gray-900">{row.projectedTeamPassAttempts ?? '—'}</span></div>
          <div>Projected targets: <span className="font-semibold text-gray-900">{row.projectedTargets ?? '—'}</span></div>
          <div>Catch rate: <span className="font-semibold text-gray-900">{row.expectedCatchRate !== null ? `${(row.expectedCatchRate * 100).toFixed(1)}%` : '—'}</span></div>
          <div>nflverse model: <span className="font-semibold text-gray-900">{row.nflverseProjectedReceptions ?? '—'}</span></div>
          <div>Final (raw): <span className="font-semibold text-gray-900">{row.finalProjectedReceptionsRaw ?? '—'}</span></div>
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

function TeamTable({ team, rows, unlocked, onVipClick }: { team: string; rows: ReceptionProjectionRow[]; unlocked: boolean; onVipClick: (e: React.MouseEvent) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const midIdx = Math.floor(rows.length / 2);

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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projected Receptions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reception Edge</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sportsbooks Proj</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row, idx) => {
              const isBlurred = !unlocked;
              const cellCls = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900 relative';
              return (
                <React.Fragment key={row.playerName}>
                  <tr className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.playerName}</td>
                    <td className={cellCls}>
                      {isBlurred && <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-0" />}
                      {isBlurred && idx === midIdx && (
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                          <button className="px-3 py-2 text-xs bg-green-600 text-white rounded hover:bg-green-700 shadow" onClick={onVipClick} type="button">
                            <div className="text-center"><div>enter vip</div><div>password</div><div>to view</div></div>
                          </button>
                        </div>
                      )}
                      <span className={isBlurred ? 'blur-sm' : ''}>
                        {row.skipped ? <span className="text-gray-400 italic">{row.skipped}</span> : row.projectedReceptions ?? '—'}
                      </span>
                    </td>
                    <td className={cellCls}>
                      <span className={isBlurred ? 'blur-sm' : ''}>
                        {row.projectionDifference !== null && row.espnProjectedReceptions ? (
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${CONFIDENCE_STYLES[row.confidence]}`}>
                            {formatDiffPct(row.projectionDifference, row.espnProjectedReceptions)}
                          </span>
                        ) : '—'}
                      </span>
                    </td>
                    <td className={cellCls}>
                      <span className={isBlurred ? 'blur-sm' : ''}>
                        {row.espnProjectedReceptions !== null ? row.espnProjectedReceptions.toFixed(1) : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {unlocked && (
                        <button
                          className="text-xs text-sharpside-green hover:underline"
                          onClick={() => setExpanded(expanded === row.playerName ? null : row.playerName)}
                          type="button"
                        >
                          {expanded === row.playerName ? 'Hide detail' : 'Detail'}
                        </button>
                      )}
                    </td>
                  </tr>
                  {unlocked && expanded === row.playerName && <DetailRow row={row} />}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
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
  const [week] = useState(1);

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

  const byTeam = React.useMemo(() => {
    const map = new Map<string, ReceptionProjectionRow[]>();
    for (const row of rows) {
      const list = map.get(row.team) ?? [];
      list.push(row);
      map.set(row.team, list);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [rows]);

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
          {byTeam.map(([team, teamRows]) => (
            <TeamTable key={team} team={team} rows={teamRows} unlocked={showVIP} onVipClick={handleVIPClick} />
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
