import { getTier } from '../../lib/nfl/tiers.js';

interface HeatCellProps {
  value: string;
  percentile: number | null; // 0-1, this row's rank within the current filtered pool
}

const BAR_RGB = '60, 179, 113'; // sharpside-green

// Heat-map table cell: an inline bar (magnitude = percentile) sits behind a
// right-aligned tabular-numeral value; Elite/Strong get bolder/larger text,
// Low is muted — never color alone (size/weight carries the signal too).
export default function HeatCell({ value, percentile }: HeatCellProps) {
  const tier = getTier(percentile);
  const pct = percentile === null ? 0 : Math.max(0, Math.min(100, percentile * 100));

  const textCls =
    tier === 'elite'
      ? 'text-sharpside-green font-bold text-sm'
      : tier === 'strong'
        ? 'text-sharpside-green font-semibold text-sm'
        : tier === 'low'
          ? 'text-gray-400 font-normal'
          : 'text-gray-700 font-medium';

  const barOpacity = tier === 'low' || percentile === null ? 0 : 0.1 + (pct / 100) * 0.25;

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
