export interface BadgeProps {
  label: string; // includes its own emoji, e.g. "🔥 Due"
  tone?: 'green' | 'blue' | 'amber' | 'gray';
}

const TONE_STYLES: Record<NonNullable<BadgeProps['tone']>, string> = {
  green: 'bg-sharpside-green/10 text-sharpside-green',
  blue: 'bg-blue-50 text-blue-700',
  amber: 'bg-amber-50 text-amber-700',
  gray: 'bg-gray-100 text-gray-600',
};

// Shared pill badge — icon + label, never color alone, per the brief's own
// accessibility requirement.
export default function Badge({ label, tone = 'gray' }: BadgeProps) {
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${TONE_STYLES[tone]}`}>
      {label}
    </span>
  );
}
