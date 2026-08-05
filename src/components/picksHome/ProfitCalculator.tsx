import { useId, useState } from 'react';
import { useCountUp } from './useCountUp.js';
import { HISTORICAL_WIN_RATE, REALIZED_EDGE_ON_VOLUME, TRACK_RECORD_HEADLINE } from './trackRecordData.js';
import { tiers } from '../subscription/PricingPlans.js';

// ============================================================================
// Calculator assumptions
// ----------------------------------------------------------------------------
// REALIZED_EDGE_ON_VOLUME is sourced directly from trackRecordData.ts — it's
// the actual realized return on dollars wagered (total units won ÷ total
// picks tracked, at the site's 4%-win / 4.4%-stake unit convention), not an
// assumed odds price. Straight bets only.
// ============================================================================

// Real All Access monthly price, sourced from PricingPlans.tsx (the same
// tiers used by the live Subscription page) — not a placeholder.
const SUBSCRIPTION_MONTHLY_COST = Number(tiers.find((t) => t.id === 'all-access')!.price.monthly);

const MIN_VOLUME = 200;
const MAX_VOLUME = 10000;
const VOLUME_STEP = 100;
const DEFAULT_VOLUME = 6000;

const MIN_UNIT_SIZE = 0.01;
const MAX_UNIT_SIZE = 0.1;
const DEFAULT_UNIT_SIZE = 0.04; // 4% = 1 unit, matching the track record

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export default function ProfitCalculator() {
  const [monthlyVolume, setMonthlyVolume] = useState(DEFAULT_VOLUME);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [unitSize, setUnitSize] = useState(DEFAULT_UNIT_SIZE);

  const volumeInputId = useId();
  const unitSizeInputId = useId();

  // unitSize only affects how a "unit" is denominated for display purposes —
  // the ROI on volume wagered is driven entirely by the realized edge.
  const monthlyProfit = monthlyVolume * REALIZED_EDGE_ON_VOLUME;
  const annualProfit = monthlyProfit * 12;
  const subscriptionMultiple = monthlyProfit / SUBSCRIPTION_MONTHLY_COST;
  const unitValue = monthlyVolume * unitSize;

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
            Adjust your monthly betting volume below — the projection updates instantly.
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
              {/* Inputs */}
              <div className="space-y-8">
                <div>
                  <label htmlFor={volumeInputId} className="block text-sm font-semibold text-gray-900">
                    Monthly betting volume
                  </label>
                  <div className="mt-3 flex items-center gap-4">
                    <input
                      id={volumeInputId}
                      type="range"
                      min={MIN_VOLUME}
                      max={MAX_VOLUME}
                      step={VOLUME_STEP}
                      value={monthlyVolume}
                      onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-sharpside-green"
                      aria-describedby={`${volumeInputId}-value`}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                    <span>{currencyFormatter.format(MIN_VOLUME)}</span>
                    <span id={`${volumeInputId}-value`} className="text-base font-bold text-gray-900">
                      {currencyFormatter.format(monthlyVolume)} / mo
                    </span>
                    <span>{currencyFormatter.format(MAX_VOLUME)}</span>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setShowAdvanced((v) => !v)}
                    aria-expanded={showAdvanced}
                    aria-controls={`${unitSizeInputId}-panel`}
                    className="text-sm font-semibold text-sharpside-green hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-sharpside-green focus:ring-offset-1"
                  >
                    {showAdvanced ? 'Hide' : 'Show'} advanced options
                  </button>

                  {showAdvanced && (
                    <div id={`${unitSizeInputId}-panel`} className="mt-4">
                      <label htmlFor={unitSizeInputId} className="block text-sm font-semibold text-gray-900">
                        Average unit size (% of volume)
                      </label>
                      <div className="mt-3 flex items-center gap-4">
                        <input
                          id={unitSizeInputId}
                          type="range"
                          min={MIN_UNIT_SIZE}
                          max={MAX_UNIT_SIZE}
                          step={0.005}
                          value={unitSize}
                          onChange={(e) => setUnitSize(Number(e.target.value))}
                          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-sharpside-green"
                          aria-describedby={`${unitSizeInputId}-value`}
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                        <span>{formatPercent(MIN_UNIT_SIZE)}</span>
                        <span id={`${unitSizeInputId}-value`} className="text-base font-bold text-gray-900">
                          {formatPercent(unitSize)} = {currencyFormatter.format(unitValue)}/unit
                        </span>
                        <span>{formatPercent(MAX_UNIT_SIZE)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Outputs */}
              <div
                className="rounded-xl bg-gray-50 p-6 sm:p-8"
                aria-live="polite"
                aria-atomic="true"
              >
                <div>
                  <p className="text-sm font-medium text-gray-500">Projected monthly profit</p>
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
                  Volume × Win Rate Edge = Projected Profit, where Win Rate Edge ={' '}
                  {TRACK_RECORD_HEADLINE.totalUnits.toFixed(1)} units won ÷ {TRACK_RECORD_HEADLINE.totalPicks.toLocaleString()}{' '}
                  picks tracked, realized on volume wagered = {formatPercent(REALIZED_EDGE_ON_VOLUME)}
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
