import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext.js';
import { SubscriptionTier } from '../types/auth.js';

interface NavItem {
  to: string;
  label: string;
  requiredTier: SubscriptionTier;
}

export default function Navigation() {
  const { user } = useAuthContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    // Free Tier Features
    { to: '/stats', label: 'Strokes Gained Stats', requiredTier: 'free' },
    
    // Basic Tier Features
    { to: '/dashboard', label: 'Model Dashboard', requiredTier: 'basic' },
    { to: '/matchups', label: 'Matchup Tool', requiredTier: 'basic' },
    { to: '/three-ball', label: 'Three Ball Tool', requiredTier: 'basic' },
    { to: '/fantasy', label: 'Fantasy Optimizer', requiredTier: 'basic' },
    
    // Pro Tier Features
    { to: '/course-fit', label: 'Course Fit Tool', requiredTier: 'pro' },
    { to: '/ai-caddie', label: 'AI Caddie', requiredTier: 'pro' },
    { to: '/expert-insights', label: 'Expert Insights', requiredTier: 'pro' },
  ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
      isActive
        ? 'border-sharpside-green text-gray-900'
        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded-md text-base font-medium ${
      isActive
        ? 'bg-green-50 text-green-700'
        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
    }`;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 h-16">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/subscription" className={navLinkClass}>
            Pricing
          </NavLink>
        </div>

        {/* Mobile Navigation Button */}
        <div className="md:hidden flex items-center justify-between h-16">
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {/* Hamburger Icon */}
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={mobileNavLinkClass}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/subscription"
              className={mobileNavLinkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}