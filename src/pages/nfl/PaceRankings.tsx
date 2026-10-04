import { useEffect, useMemo, useState } from 'react';
import { usePageSeo } from '../../hooks/usePageSeo.js';

interface TeamPaceRow {
  team: string;
  gamesPlayed: number;
  offensePlaysPerGame: number;
  defensePlaysPerGame: number | null;
}

type SortKey = 'team' | 'offensePlaysPerGame' | 'defensePlaysPerGame';

export default function PaceRankings() {
  usePageSeo({
    title: 'NFL Pace Rankings — Plays Per Game | SharpSide Sports',
    description:
      'NFL team pace rankings — offensive plays run per game and defensive plays faced per game, season-to-date. A key input for NFL player props: faster offenses and defenses mean more betting volume.',
    keywords: 'nfl pace rankings, nfl plays per game, nfl player props, nfl betting',
    canonicalPath: '/picks-preview/nfl-models/pace-rankings',
  });

  const [teams, setTeams] = useState<TeamPaceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('offensePlaysPerGame');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/nfl-pace?season=2026`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setTeams(data.teams ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load pace rankings');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = useMemo(() => {
    const dir = sortDir === 'asc' ? 1 : -1;
    const valueFor = (r: TeamPaceRow): number | string => {
      switch (sortKey) {
        case 'team':
          return r.team;
        case 'defensePlaysPerGame':
          return r.defensePlaysPerGame ?? -Infinity;
        case 'offensePlaysPerGame':
        default:
          return r.offensePlaysPerGame;
      }
    };
    return [...teams].sort((a, b) => {
      const av = valueFor(a);
      const bv = valueFor(b);
      if (typeof av === 'string' || typeof bv === 'string') {
        return String(av).localeCompare(String(bv)) * dir;
      }
      return (av - bv) * dir;
    });
  }, [teams, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sortIndicator = (key: SortKey) => (sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '');

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
      <div>
        <h1 className="mb-1 text-2xl font-bold text-gray-900">NFL Pace Rankings</h1>
        <p className="text-sm text-gray-600">
          Plays run per game (pass attempts + carries + sacks suffered), season-to-date. A fast offense means more
          player-prop volume; a fast defense faced means more plays run against it.
        </p>
      </div>

      {error && <div className="p-6 text-center text-red-600">{error}</div>}

      {!error && (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="cursor-pointer whitespace-nowrap px-3 py-2" onClick={() => handleSort('team')}>
                  Team{sortIndicator('team')}
                </th>
                <th className="whitespace-nowrap px-3 py-2 text-right">Games</th>
                <th
                  className="cursor-pointer whitespace-nowrap px-3 py-2 text-right"
                  onClick={() => handleSort('offensePlaysPerGame')}
                >
                  Offense Plays/Game{sortIndicator('offensePlaysPerGame')}
                </th>
                <th
                  className="cursor-pointer whitespace-nowrap px-3 py-2 text-right"
                  onClick={() => handleSort('defensePlaysPerGame')}
                >
                  Defense Plays Faced/Game{sortIndicator('defensePlaysPerGame')}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-3 py-10 text-center text-sm text-gray-400">
                    Loading…
                  </td>
                </tr>
              ) : sorted.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-10 text-center text-sm text-gray-400">
                    No data available yet.
                  </td>
                </tr>
              ) : (
                sorted.map((r, idx) => (
                  <tr key={r.team} className={`border-t border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                    <td className="whitespace-nowrap px-3 py-2 font-semibold text-gray-900">{r.team}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-gray-700">{r.gamesPlayed}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-gray-900">
                      {r.offensePlaysPerGame.toFixed(1)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-gray-900">
                      {r.defensePlaysPerGame === null ? '—' : r.defensePlaysPerGame.toFixed(1)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
