import React, { useCallback, useEffect, useState } from 'react';
import RegressionWatchCarousel from '../components/nfl/RegressionWatchCarousel.js';
import TargetShareCatchRateScatter from '../components/nfl/TargetShareCatchRateScatter.js';
import ReceptionModelTable from '../components/nfl/ReceptionModelTable.js';
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
