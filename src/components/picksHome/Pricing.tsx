import {
  ALL_ACCESS_CHECKOUT_URLS,
  billingIntervals,
  FOOTBALL_SEASON_CHECKOUT_URL,
  tiers,
} from '../subscription/PricingPlans.js';

// Real pricing — sourced directly from src/components/subscription/PricingPlans.tsx
// (the same tiers, prices, and checkout links used on the live Subscription page).
// Only the sports-betting-relevant tiers (All Access, Football Season) are shown
// here; the golf-only tier lives on the golf side of the site.
const allAccessTier = tiers.find((t) => t.id === 'all-access')!;
const footballTier = tiers.find((t) => t.id === 'football-season')!;

function CheckIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-sharpside-green" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Pricing() {
  return (
    <section className="bg-gray-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{allAccessTier.name}</h2>
          <p className="mt-4 text-lg text-gray-600">{allAccessTier.description}</p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          {billingIntervals.map((interval) => {
            const price = allAccessTier.price[interval.id as keyof typeof allAccessTier.price];
            const isPopular = interval.id === 'monthly';

            return (
              <div
                key={interval.id}
                className={`relative rounded-2xl bg-white p-8 shadow-sm ring-1 ${
                  isPopular ? 'ring-2 ring-sharpside-green' : 'ring-gray-100'
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-sharpside-green px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-gray-900">{interval.name}</h3>
                <p className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">${price}</span>
                  <span className="ml-1 text-sm text-gray-500">per {interval.id}</span>
                </p>
                <ul className="mt-6 space-y-3">
                  {allAccessTier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckIcon />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    window.location.href = ALL_ACCESS_CHECKOUT_URLS[interval.id as keyof typeof ALL_ACCESS_CHECKOUT_URLS];
                  }}
                  className={`mt-8 w-full rounded-lg px-6 py-3 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-sharpside-green focus:ring-offset-2 ${
                    isPopular
                      ? 'bg-sharpside-green text-white hover:bg-green-600'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  Start {interval.name}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-16 max-w-2xl text-center">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900">{footballTier.name}</h3>
          <p className="mt-3 text-gray-600">{footballTier.description}</p>
        </div>

        <div className="mx-auto mt-8 max-w-md rounded-2xl bg-white p-8 shadow-sm ring-2 ring-gray-900">
          <h4 className="text-lg font-semibold text-gray-900">Season Pass</h4>
          <p className="mt-4">
            <span className="text-4xl font-bold text-gray-900">${footballTier.price.season}</span>
            <span className="ml-1 text-sm text-gray-500">for the entire season</span>
          </p>
          <ul className="mt-6 space-y-3">
            {footballTier.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckIcon />
                {feature}
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              window.location.href = FOOTBALL_SEASON_CHECKOUT_URL;
            }}
            className="mt-8 w-full rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sharpside-green focus:ring-offset-2"
          >
            {footballTier.cta}
          </button>
        </div>
      </div>
    </section>
  );
}
