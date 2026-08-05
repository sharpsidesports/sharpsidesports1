import { Lock } from 'lucide-react';

// Faux "locked" data rows used purely as a blurred decorative backdrop,
// mimicking a hidden results table behind the lock icon.
const DECORATIVE_ROWS = [
  ['w-1/4', 'w-1/6', 'w-1/5', 'w-1/6'],
  ['w-1/5', 'w-1/4', 'w-1/6', 'w-1/5'],
  ['w-1/6', 'w-1/5', 'w-1/4', 'w-1/6'],
  ['w-1/4', 'w-1/6', 'w-1/5', 'w-1/4'],
  ['w-1/5', 'w-1/4', 'w-1/6', 'w-1/5'],
];

export default function CalculatorTeaser() {
  const scrollToCalculator = () => {
    document.getElementById('profit-calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-2xl border-2 border-sharpside-green bg-black shadow-xl shadow-green-900/20">
          {/* Blurred decorative "locked" table backdrop */}
          <div aria-hidden="true" className="absolute inset-0 space-y-4 p-8 opacity-40 blur-sm">
            {DECORATIVE_ROWS.map((row, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                {row.map((w, j) => (
                  <span
                    key={j}
                    className={`h-3 rounded-full ${w} ${
                      j % 2 === 0 ? 'bg-sharpside-green/70' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Foreground overlay */}
          <div className="relative bg-black/70 px-6 py-14 text-center backdrop-blur-sm sm:px-12 sm:py-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sharpside-green to-emerald-400 shadow-lg">
              <Lock className="h-7 w-7 text-white" aria-hidden="true" />
            </div>

            <h2 className="mx-auto mt-6 max-w-xl text-2xl font-bold text-white sm:text-3xl">
              See How Much Money You Can Win With Sharpside Sports
            </h2>

            <button
              onClick={scrollToCalculator}
              className="mt-8 inline-flex items-center rounded-lg bg-sharpside-green px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
            >
              Calculate My Profit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
