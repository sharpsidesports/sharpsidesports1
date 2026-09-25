interface StatBarProps {
  label: string;
  value: string; // pre-formatted display value, e.g. "42.5%" or "27.1 pts"
  fillPct: number | null; // 0-100, this player's percentile within this week's pool
  tone?: 'green' | 'blue' | 'amber';
}

const BAR_TONES: Record<NonNullable<StatBarProps['tone']>, string> = {
  green: 'bg-sharpside-green',
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
};

// One row of the "component breakdown" — a label/value pair plus a bar
// showing where this player ranks against the rest of the current week's
// pool on that stat (not the raw value scaled to some arbitrary max).
export default function StatBar({ label, value, fillPct, tone = 'green' }: StatBarProps) {
  const clamped = fillPct === null ? 0 : Math.max(0, Math.min(100, fillPct));
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span>{label}</span>
        <span className="font-semibold text-gray-900">{value}</span>
      </div>
      <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100">
        {fillPct !== null && (
          <div className={`h-1.5 rounded-full ${BAR_TONES[tone]}`} style={{ width: `${clamped}%` }} />
        )}
      </div>
    </div>
  );
}
