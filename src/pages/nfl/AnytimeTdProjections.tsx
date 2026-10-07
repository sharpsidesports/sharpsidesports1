import React, { useEffect, useState, useCallback } from 'react';
import TopPlaysCarousel from '../../components/nfl/TopPlaysCarousel.js';
import VolumeTdDebtScatter from '../../components/nfl/VolumeTdDebtScatter.js';
import TdModelTable from '../../components/nfl/TdModelTable.js';
import PageExplainer from '../../components/nfl/PageExplainer.js';
import { TopPlayCardSkeleton } from '../../components/nfl/Skeleton.js';
import { deriveTdModelRows, type ApiResponse } from '../../lib/nfl/tdModelData.js';
import { usePageSeo } from '../../hooks/usePageSeo.js';

const POSITIONS: Array<'ALL' | 'QB' | 'RB' | 'WR' | 'TE'> = ['ALL', 'QB', 'RB', 'WR', 'TE'];

export default function AnytimeTdProjections() {
  usePageSeo({
    title: 'NFL Player Props: Anytime TD Projections & Odds | SharpSide Sports',
    description:
      'NFL player props for the Anytime Touchdown Scorer market — Sharpside projections compared against live sportsbook odds for every RB, WR, TE, and QB, with volume and TD Deficit signals to find betting value.',
    keywords: 'nfl player props, anytime touchdown scorer, nfl betting, td props, nfl prop bets',
    canonicalPath: '/picks-preview/nfl-models/touchdown-model',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: 'NFL Anytime TD Player Props',
      description: 'Weekly NFL anytime touchdown scorer projections compared against sportsbook player props odds.',
      keywords: ['nfl player props', 'anytime touchdown scorer', 'nfl betting'],
      temporalCoverage: '2026 NFL Season',
    },
  });

  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [positionFilter, setPositionFilter] = useState<'ALL' | 'QB' | 'RB' | 'WR' | 'TE'>('ALL');
  const [highlightedPlayerId, setHighlightedPlayerId] = useState<string | null>(null);

  // Unchanged data-fetching logic — this redesign is presentation-layer only.
  const load = useCallback(async (refresh: boolean) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/nfl-odds?week=5&season=2026${refresh ? '&refresh=1' : ''}`);
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
  const positionFiltered = positionFilter === 'ALL' ? players : players.filter((p) => p.position === positionFilter);

  // Volume + percentiles/tiers/badges, derived against the position-filtered
  // pool (the table's own search box filters further without re-deriving
  // percentiles, so typing a search query doesn't shift anyone's percentile).
  const derivedRows = React.useMemo(() => deriveTdModelRows(positionFiltered), [positionFiltered]);

  const handleSelectPlayer = useCallback((playerId: string) => {
    setHighlightedPlayerId(playerId);
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-gray-900">NFL Week 1 Anytime TD Projections vs. Sportsbook Odds</h1>
          <p className="text-sm text-gray-600">
            Sharpside's Week 1 projections compared against the sportsbook consensus Anytime TD Scorer price. Volume
            and TD Deficit are ranked against the current position filter so the strongest signals stand out — not fixed
            thresholds.
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

      <PageExplainer storageKey="tdModelExplainerSeen">
        <p>
          <strong>Sharp Score</strong> (0-100) is our composite ranking of how good an Anytime TD play this player is
          this week — higher is better.
        </p>
        <p>
          <strong>Volume</strong> and <strong>TD Deficit</strong> are ranked against the current position filter, not
          fixed thresholds — the strongest signals in the current pool stand out.
        </p>
        <ul className="list-disc space-y-1 pl-4">
          <li><strong>🔥 Due</strong> — Elite TD Deficit: this player's expected TDs are well above his actual TDs scored. He's due for positive regression.</li>
          <li><strong>📈 High Volume</strong> — Elite touch volume (carries + targets) near the goal line and beyond.</li>
          <li><strong>⭐ Top Play</strong> — Strong or better in both Volume and TD Deficit, with a neutral or positive betting edge.</li>
        </ul>
        <p>Click <strong>Detail</strong> on any player to see the zone-by-zone breakdown behind the projection.</p>
      </PageExplainer>

      {error ? (
        <div className="p-6 text-center text-red-600">{error}</div>
      ) : !loading && !data?.espnAvailable ? (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center text-gray-700">
          Sharpside has not published Week 1 {data?.season ?? ''} projections yet. Check back closer to the season.
        </div>
      ) : (
        <>
          {!loading && data?.oddsApiConfigured === false && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-gray-700">
              Sportsbook odds aren't configured yet (no <code>ODDS_API_KEY</code>) — showing Sharpside projections only.
              Consensus and edge will appear once the key is added.
            </div>
          )}
          {!loading && data?.oddsApiConfigured && data.oddsError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              Sportsbook odds are temporarily unavailable: {data.oddsError}
            </div>
          )}
          {!loading && data?.oddsApiConfigured && !data.oddsError && data.matchedPlayerCount === 0 && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-gray-700">
              No sportsbook has posted Anytime TD Scorer lines yet ({data.eventsChecked} games checked). This page will
              fill in with consensus odds and edge as books open those markets closer to kickoff.
            </div>
          )}

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-2">
              {POSITIONS.map((pos) => (
                <button
                  key={pos}
                  onClick={() => setPositionFilter(pos)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
                    positionFilter === pos
                      ? 'border-sharpside-green bg-sharpside-green text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
            {!loading && data && (
              <p className="text-xs text-gray-500">
                {positionFiltered.length} players · {data.matchedPlayerCount} with sportsbook odds · updated{' '}
                {new Date(data.generatedAt).toLocaleString()}
                {data.cached ? ' (cached)' : ''}
              </p>
            )}
          </div>

          {loading ? (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <TopPlayCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <TopPlaysCarousel rows={derivedRows} onSelect={handleSelectPlayer} />
          )}

          {!loading && <VolumeTdDebtScatter rows={derivedRows} onSelect={handleSelectPlayer} />}

          <TdModelTable
            rows={derivedRows}
            loading={loading}
            highlightedPlayerId={highlightedPlayerId}
            onHighlightHandled={() => setHighlightedPlayerId(null)}
          />
        </>
      )}
    </div>
  );
}
