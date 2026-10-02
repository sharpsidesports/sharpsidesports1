import { getTier } from '../../lib/nfl/tiers.js';

interface HeatCellProps {
  value: string;
  percentile: number | null; // 0-1, this row's rank within the current filtered pool
}

const BAR_RGB = '60, 179, 113'; // sharpside-green, used only for the background tint

// Heat-map table cell: an inline bar (magnitude = percentile) sits behind a
// right-aligned tabular-numeral value; Elite/Strong get bolder/larger text,
// Low is muted — never color alone (size/weight carries the signal too).
//
// Text uses a darker green than the background tint (same hue family, not
// the same color) — using sharpside-green for both made Elite/Strong values
// blend into their own highlight instead of standing out.
export default function HeatCell({ value, percentile }: HeatCellProps) {
  const tier = getTier(percentile);
  const pct = percentile === null ? 0 : Math.max(0, Math.min(100, percentile * 100));

  const textCls =
    tier === 'elite'
      ? 'text-[#15803D] font-extrabold text-base'
      : tier === 'strong'
        ? 'text-[#15803D] font-bold text-sm'
        : tier === 'low'
          ? 'text-gray-400 font-normal'
          : 'text-gray-700 font-medium';

  // Capped lower than before so the tint stays a light backdrop — the darker
  // text color above is what should carry the emphasis, not a near-solid fill.
  const barOpacity = tier === 'low' || percentile === null ? 0 : 0.08 + (pct / 100) * 0.14;

  return (
    <div className="relative min-w-[64px] overflow-hidden rounded">
      <div
        className="absolute inset-y-0 left-0"
        style={{ width: `${pct}%`, backgroundColor: `rgba(${BAR_RGB}, ${barOpacity})` }}
        aria-hidden="true"
      />
      <span className={`relative block px-2 py-1 text-right tabular-nums ${textCls}`}>{value}</span>
    </div>
  );
}
