import NflPlayerAvatar from './NflPlayerAvatar.js';
import Badge from './Badge.js';
import type { TdModelRow } from '../../lib/nfl/tdModelData.js';
import { formatOdds, formatTdDebt } from '../../lib/nfl/formatters.js';

interface TopPlaysCarouselProps {
  rows: TdModelRow[];
  onSelect: (playerId: string) => void;
}

const MIN_CARDS = 3;
const MAX_CARDS = 6;

// Horizontally scrollable highlight row — the best combined Volume + TD Debt
// plays. Falls back to the top-ranked players overall if fewer than
// MIN_CARDS actually qualify as a "Top Play" (e.g. early season, thin pool).
export default function TopPlaysCarousel({ rows, onSelect }: TopPlaysCarouselProps) {
  const qualifying = rows.filter((r) => r.isTopPlay).sort((a, b) => b.combinedScore - a.combinedScore);
  const fallback = [...rows].sort((a, b) => b.combinedScore - a.combinedScore);
  const picks = (qualifying.length >= MIN_CARDS ? qualifying : fallback).slice(0, MAX_CARDS);

  if (picks.length === 0) return null;

  return (
    <div>
      <h2 className="mb-2 flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-gray-700">
        <span aria-hidden="true">⭐</span> Top Plays
      </h2>
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
        {picks.map((r) => (
          <button
            key={r.player_id}
            type="button"
            onClick={() => onSelect(r.player_id)}
            className="w-60 shrink-0 snap-start rounded-xl bg-white p-3 text-left shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <NflPlayerAvatar name={r.player_name} espnId={r.player_id} size={36} className="shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-gray-900">{r.player_name}</div>
                <div className="truncate text-xs text-gray-500">
                  {r.position} · {r.team} vs {r.opponent}
                </div>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {r.isDue && <Badge label="🔥 Due" tone="green" />}
              {r.isHighVolume && <Badge label="📈 High Volume" tone="blue" />}
              {r.isTopPlay && <Badge label="⭐ Top Play" tone="amber" />}
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-600">
              <span>
                Vol <span className="font-semibold tabular-nums text-gray-900">{r.volume}</span>
              </span>
              <span>
                Debt{' '}
                <span
                  className={`font-semibold tabular-nums ${r.td_debt !== null && r.td_debt > 0 ? 'text-sharpside-green' : 'text-gray-900'}`}
                >
                  {formatTdDebt(r.td_debt)}
                </span>
              </span>
              <span>
                Odds <span className="font-semibold tabular-nums text-gray-900">{formatOdds(r.consensus_american_odds)}</span>
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
