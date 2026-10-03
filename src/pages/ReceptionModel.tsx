import React, { useCallback, useEffect, useState } from 'react';
import RegressionWatchCarousel from '../components/nfl/RegressionWatchCarousel.js';
import TargetShareCatchRateScatter from '../components/nfl/TargetShareCatchRateScatter.js';
import ReceptionModelTable from '../components/nfl/ReceptionModelTable.js';
import PageExplainer from '../components/nfl/PageExplainer.js';
import { TopPlayCardSkeleton } from '../components/nfl/Skeleton.js';
import { deriveReceptionModelRows, type ReceptionProjectionRow } from '../lib/nfl/receptionModelData.js';

export default function ReceptionModel() {
  const [rows, setRows] = useState<ReceptionProjectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [season] = useState(2026);
  const [week] = useState(4);
  const [highlightedPlayerId, setHighlightedPlayerId] = useState<string | null>(null);

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

  // Active (non-skipped) players only — OUT/BYE players have no numeric
  // signals to rank, filter, or plot.
  const activeRows = React.useMemo(() => rows.filter((r) => !r.skipped), [rows]);

  const derivedRows = React.useMemo(() => deriveReceptionModelRows(activeRows), [activeRows]);

  const handleSelectPlayer = useCallback((playerId: string) => {
    setHighlightedPlayerId(playerId);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-1 text-2xl font-bold text-gray-900">Reception Model</h1>
        <p className="text-sm text-gray-600">
          Target Share and Catch Rate below are last-3-game actuals, ranked against the current pool — a role change
          shows up immediately instead of being smoothed out by the season average.
        </p>
      </div>

      <PageExplainer storageKey="receptionModelExplainerSeen">
        <p>
          <strong>Sharp Score</strong> (0-100) is our composite ranking of how good a target this player is this week —
          higher is better. It's not a prediction of catches, just a ranking.
        </p>
        <p>
          <strong>Target Share</strong> and <strong>Catch %</strong> are this player's last 3 games, not a season
          average — a role change shows up right away instead of being smoothed out.
        </p>
        <ul className="list-disc space-y-1 pl-4">
          <li><strong>🎯 Buy Low</strong> — getting a lot of targets but not converting many into catches yet. More catches are likely coming.</li>
          <li><strong>⚠️ Unsustainable</strong> — not getting many targets but catching almost everything thrown his way. Hard to keep up without more volume.</li>
          <li><strong>📈/📉 Role Climbing/Fading</strong> — his share of targets the last 2 games is trending up or down compared to his season average.</li>
          <li><strong>🏃 Overlooked</strong> — on the field a lot (high snap share) but not getting targeted much yet.</li>
        </ul>
        <p>Click <strong>Detail</strong> on any player to see the full breakdown, including matchup and advanced stats.</p>
      </PageExplainer>

      {error && <div className="p-6 text-center text-red-600">{error}</div>}

      {!error && (
        <>
          {loading ? (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <TopPlayCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <RegressionWatchCarousel rows={derivedRows} onSelect={handleSelectPlayer} />
          )}

          {!loading && <TargetShareCatchRateScatter rows={derivedRows} onSelect={handleSelectPlayer} />}

          <ReceptionModelTable
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
