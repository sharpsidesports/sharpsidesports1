import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';

// Real checkout URL for the picks-preview "Start Free Trial" CTAs (nav +
// Hero + FinalCTA all share this single source of truth).
export const FREE_TRIAL_CHECKOUT_URL =
  'https://www.winible.com/checkout/1359269787951190914?pid=1359269787984745349&store_url=sharpsidesports&C=NFL3';

const NFL_MODELS = [
  { label: 'Touchdown Model', to: '/picks-preview/nfl-models/touchdown-model' },
  { label: 'Receiving Model', to: '/picks-preview/nfl-models/receiving-model' },
  { label: 'Passing Model', to: '/picks-preview/nfl-models/passing-model' },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-semibold transition-colors ${isActive ? 'text-sharpside-green' : 'text-gray-700 hover:text-sharpside-green'}`;

export default function PicksNavigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modelsOpen, setModelsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/picks-preview" className="text-2xl font-bold tracking-tight">
          <span className="text-sharpside-black">Sharpside</span>
          <span className="text-sharpside-green"> Sports</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="https://sharpsidesports.com/expert-insights" className="text-sm font-semibold text-gray-700 transition-colors hover:text-sharpside-green">
            Betting Picks
          </a>

          <div
            className="relative"
            onMouseEnter={() => setModelsOpen(true)}
            onMouseLeave={() => setModelsOpen(false)}
          >
            <button
              type="button"
              aria-expanded={modelsOpen}
              aria-haspopup="true"
              onClick={() => setModelsOpen((v) => !v)}
              className="flex items-center gap-1 text-sm font-semibold text-gray-700 transition-colors hover:text-sharpside-green"
            >
              NFL Models
              <ChevronDown className={`h-4 w-4 transition-transform ${modelsOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>

            {modelsOpen && (
              <div className="absolute left-0 top-full w-56 rounded-lg border border-gray-100 bg-white py-2 shadow-lg">
                {NFL_MODELS.map((model) => (
                  <Link
                    key={model.to}
                    to={model.to}
                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-sharpside-green"
                  >
                    {model.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <NavLink to="/picks-preview/articles" className={navLinkClass}>
            Articles
          </NavLink>
          <NavLink to="/picks-preview/pricing" className={navLinkClass}>
            Pricing
          </NavLink>
        </nav>

        <div className="hidden md:block">
          <a
            href={FREE_TRIAL_CHECKOUT_URL}
            className="inline-flex items-center rounded-lg bg-sharpside-green px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-sharpside-green focus:ring-offset-2"
          >
            Start Free Trial
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
          className="text-gray-700 md:hidden"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a href="https://sharpsidesports.com/expert-insights" className="text-sm font-semibold text-gray-700 transition-colors hover:text-sharpside-green" onClick={() => setMobileOpen(false)}>
              Betting Picks
            </a>

            <div>
              <span className="text-sm font-semibold text-gray-900">NFL Models</span>
              <div className="mt-2 flex flex-col gap-3 pl-3">
                {NFL_MODELS.map((model) => (
                  <Link
                    key={model.to}
                    to={model.to}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-gray-600 hover:text-sharpside-green"
                  >
                    {model.label}
                  </Link>
                ))}
              </div>
            </div>

            <NavLink to="/picks-preview/articles" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              Articles
            </NavLink>
            <NavLink to="/picks-preview/pricing" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              Pricing
            </NavLink>

            <a
              href={FREE_TRIAL_CHECKOUT_URL}
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-sharpside-green px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-600"
            >
              Start Free Trial
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
