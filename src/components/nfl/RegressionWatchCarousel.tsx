import NflPlayerAvatar from './NflPlayerAvatar.js';
import Badge from './Badge.js';
import type { ReceptionModelRow } from '../../lib/nfl/receptionModelData.js';
import { formatPct } from '../../lib/nfl/formatters.js';

interface RegressionWatchCarouselProps {
  rows: ReceptionModelRow[];
  onSelect: (playerId: string) => void;
}

const MIN_CARDS = 3;
const MAX_CARDS = 6;

// Horizontally scrollable highlight row — the players with the largest gap
// between recent target share and recent catch rate, in either direction
// (Buy Low: high share / low catch rate; Unsustainable: low share / high
// catch rate). Falls back to the most extreme gaps overall if fewer than
// MIN_CARDS actually qualify for either badge.
export default function RegressionWatchCarousel({ rows, onSelect }: RegressionWatchCarouselProps) {
  const qualifying = rows
    .filter((r) => r.isBuyLow || r.isUnsustainable)
    .sort((a, b) => Math.abs(b.regressionGap) - Math.abs(a.regressionGap));
  // Fallback also requires a real recent sample — otherwise a 1-target/1-catch
  // blip (100% catch rate on nothing) would fill empty carousel slots.
  const fallback = rows
    .filter((r) => r.recentTargets >= 3)
    .sort((a, b) => Math.abs(b.regressionGap) - Math.abs(a.regressionGap));
  const picks = (qualifying.length >= MIN_CARDS ? qualifying : fallback).slice(0, MAX_CARDS);

  if (picks.length === 0) return null;

  return (
    <div>
      <h2 className="mb-2 flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-gray-700">
        <span aria-hidden="true">🎯</span> Regression Watch
      </h2>
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
        {picks.map((r) => (
          <button
            key={r.espnId}
            type="button"
            onClick={() => onSelect(r.espnId)}
            className="w-60 shrink-0 snap-start rounded-xl bg-white p-3 text-left shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <NflPlayerAvatar name={r.playerName} espnId={r.espnId} size={36} className="shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-gray-900">{r.playerName}</div>
                <div className="truncate text-xs text-gray-500">
                  WR · {r.team} vs {r.opponentTeam ?? '—'}
                </div>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {r.isBuyLow && <Badge label="🎯 Buy Low" tone="green" />}
              {r.isUnsustainable && <Badge label="⚠️ Unsustainable" tone="amber" />}
              {r.isRoleClimbing && <Badge label="📈 Role Climbing" tone="blue" />}
              {r.isRoleFading && <Badge label="📉 Role Fading" tone="gray" />}
              {r.isOverlooked && <Badge label="🏃 Overlooked" tone="blue" />}
              {r.isPassRateRebound && <Badge label="🔄 Pass Rate Rebound" tone="green" />}
              {r.isPassRateCooling && <Badge label="⚠️ Pass Rate Cooling" tone="amber" />}
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-600">
              <span>
                Tgt Share <span className="font-semibold tabular-nums text-gray-900">{formatPct(r.recentTargetShare)}</span>
              </span>
              <span>
                Catch % <span className="font-semibold tabular-nums text-gray-900">{formatPct(r.recentCatchPct)}</span>
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
