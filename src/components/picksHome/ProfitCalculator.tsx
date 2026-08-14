import { useId, useState } from 'react';
import { useCountUp } from './useCountUp.js';
import { HISTORICAL_WIN_RATE, TRACK_RECORD_HEADLINE } from './trackRecordData.js';
import { tiers } from '../subscription/PricingPlans.js';

// ============================================================================
// Calculator assumptions
// ----------------------------------------------------------------------------
// The only input is average unit size (in dollars) — the dollar amount a
// bettor risks on a single 1-unit play. Everything else is derived from the
// real, tracked record in trackRecordData.ts:
//
//   - Net units won per pick = total units won ÷ total picks tracked
//     (already accounts for wins and losses, straight bets only).
//   - Picks per month is a flat assumption (PICKS_PER_MONTH below) — a
//     reasonable volume for someone following the full slate of picks.
//
// Monthly profit = unit size × picks/month × net units won per pick.
// ============================================================================

// Real All Access monthly price, sourced from PricingPlans.tsx (the same
// tiers used by the live Subscription page) — not a placeholder.
const SUBSCRIPTION_MONTHLY_COST = Number(tiers.find((t) => t.id === 'all-access')!.price.monthly);

const NET_UNITS_PER_PICK = TRACK_RECORD_HEADLINE.totalUnits / TRACK_RECORD_HEADLINE.totalPicks;

const PICKS_PER_MONTH = 120;

const MIN_UNIT_SIZE = 10;
const MAX_UNIT_SIZE = 500;
const UNIT_SIZE_STEP = 10;
const DEFAULT_UNIT_SIZE = 100;

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export default function ProfitCalculator() {
  const [unitSize, setUnitSize] = useState(DEFAULT_UNIT_SIZE);

  const unitSizeInputId = useId();

  const monthlyProfit = unitSize * PICKS_PER_MONTH * NET_UNITS_PER_PICK;
  const annualProfit = monthlyProfit * 12;
  const subscriptionMultiple = monthlyProfit / SUBSCRIPTION_MONTHLY_COST;

  const animatedMonthlyProfit = useCountUp(monthlyProfit);
  const animatedAnnualProfit = useCountUp(annualProfit);
  const animatedMultiple = useCountUp(subscriptionMultiple);

  const isPositive = monthlyProfit >= 0;
  const profitColorClass = isPositive ? 'text-sharpside-green' : 'text-red-600';

  return (
    <section id="profit-calculator" className="relative px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            See what an edge is actually worth
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Set your average unit size below — the projection updates instantly.
          </p>
        </div>

        <div className="relative mt-12">
          {/* Gradient accent glow behind the card */}
          <div
            aria-hidden="true"
            className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-green-200 via-emerald-100 to-white opacity-70 blur-2xl"
          />

          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
            <div className="h-1.5 w-full bg-gradient-to-r from-sharpside-green to-emerald-400" />

            <div className="grid grid-cols-1 gap-10 p-6 sm:p-10 lg:grid-cols-2">
              {/* Input */}
              <div className="flex flex-col justify-center space-y-8">
                <div>
                  <label htmlFor={unitSizeInputId} className="block text-sm font-semibold text-gray-900">
                    Average unit size
                  </label>
                  <div className="mt-3 flex items-center gap-4">
                    <input
                      id={unitSizeInputId}
                      type="range"
                      min={MIN_UNIT_SIZE}
                      max={MAX_UNIT_SIZE}
                      step={UNIT_SIZE_STEP}
                      value={unitSize}
                      onChange={(e) => setUnitSize(Number(e.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-sharpside-green"
                      aria-describedby={`${unitSizeInputId}-value`}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                    <span>{currencyFormatter.format(MIN_UNIT_SIZE)}</span>
                    <span id={`${unitSizeInputId}-value`} className="text-base font-bold text-gray-900">
                      {currencyFormatter.format(unitSize)}/unit
                    </span>
                    <span>{currencyFormatter.format(MAX_UNIT_SIZE)}</span>
                  </div>
                  <p className="mt-3 text-sm text-gray-500">
                    Based on following the full slate of picks (~{PICKS_PER_MONTH}/month).
                  </p>
                </div>
              </div>

              {/* Outputs */}
              <div
                className="rounded-xl bg-gray-50 p-6 sm:p-8"
                aria-live="polite"
                aria-atomic="true"
              >
                <div>
                  <p className="text-sm font-medium text-gray-500">Projected profit per month</p>
                  <p className={`mt-1 text-4xl font-bold tabular-nums sm:text-5xl ${profitColorClass}`}>
                    {isPositive ? '+' : ''}
                    {currencyFormatter.format(animatedMonthlyProfit)}
                  </p>
                </div>

                <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-200 pt-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Projected annual profit</dt>
                    <dd className={`mt-1 text-xl font-bold tabular-nums ${profitColorClass}`}>
                      {isPositive ? '+' : ''}
                      {currencyFormatter.format(animatedAnnualProfit)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Multiple of subscription</dt>
                    <dd className="mt-1 text-xl font-bold tabular-nums text-gray-900">
                      {animatedMultiple.toFixed(1)}x
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                  <p className="text-sm text-emerald-900">
                    Based on a{' '}
                    <span className="font-semibold">{formatPercent(HISTORICAL_WIN_RATE)} historical win rate</span>{' '}
                    across {TRACK_RECORD_HEADLINE.totalPicks.toLocaleString()}+ tracked picks since{' '}
                    {TRACK_RECORD_HEADLINE.firstYear}.
                  </p>
                </div>

                <p className="mt-6 rounded-md bg-white px-3 py-2 font-mono text-xs text-gray-500 ring-1 ring-gray-200">
                  Unit size × {PICKS_PER_MONTH} picks/mo × Net Units Won/Pick = Projected Monthly Profit, where Net
                  Units Won/Pick = {TRACK_RECORD_HEADLINE.totalUnits.toFixed(1)} units won ÷{' '}
                  {TRACK_RECORD_HEADLINE.totalPicks.toLocaleString()} picks tracked ={' '}
                  {NET_UNITS_PER_PICK.toFixed(3)} units/pick
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-gray-500">
          Based on realized results from {TRACK_RECORD_HEADLINE.firstYear}–present tracked performance data —
          not an assumed odds price. Betting involves risk; past results don&apos;t guarantee future returns.
        </p>
      </div>
    </section>
  );
}
