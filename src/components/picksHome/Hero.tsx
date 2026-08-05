import { TRACK_RECORD_HEADLINE } from './trackRecordData.js';

interface HeroProps {
  onCtaClick: () => void;
}

const HERO_TRUST_STATS = [
  {
    label: `Win Rate (${TRACK_RECORD_HEADLINE.firstYear}–present)`,
    value: `${(TRACK_RECORD_HEADLINE.winRate * 100).toFixed(1)}%`,
  },
  {
    label: 'Picks Tracked',
    value: `${TRACK_RECORD_HEADLINE.totalPicks.toLocaleString()}+`,
  },
  {
    label: `Units Won (since ${TRACK_RECORD_HEADLINE.firstYear})`,
    value: `+${TRACK_RECORD_HEADLINE.totalUnits.toFixed(1)}u`,
  },
];

export default function Hero({ onCtaClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          Data-driven picks.
          <br />
          <span className="text-sharpside-green">Real, positive-EV betting.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
          Our model scans every line, every day, to find bets where the market is wrong — then hands you the
          math behind each one. No guessing, no gut calls.
        </p>

        <div className="mt-8 flex justify-center">
          <button
            onClick={onCtaClick}
            className="inline-flex items-center rounded-lg bg-sharpside-green px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-green-600/20 transition-transform hover:scale-[1.02] hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-sharpside-green focus:ring-offset-2"
          >
            Start Free Trial
          </button>
        </div>

        <dl className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
          {HERO_TRUST_STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-full border border-gray-200 bg-white px-3 py-2 shadow-sm"
            >
              <dd className="text-base font-bold text-gray-900 sm:text-lg">{stat.value}</dd>
              <dt className="text-[11px] font-medium uppercase tracking-wide text-gray-500 sm:text-xs">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
        <p className="mx-auto mt-4 max-w-xl text-xs text-gray-400">
          Units calculated at 4% = 1 unit. Full season-by-season breakdown below.
        </p>
      </div>
    </section>
  );
}
