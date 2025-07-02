import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { SubscriptionTier } from '../types/auth.js';
import React from 'react';

interface NavItem {
  to: string;
  label: string;
  requiredTier: SubscriptionTier;
}

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    // Pro Tier Features (Betting Picks first)
    { to: '/expert-insights', label: 'Betting Picks', requiredTier: 'pro' },
    // Free Tier Features
    { to: '/stats-model', label: 'Stats Model', requiredTier: 'free' },
    
    // Basic Tier Features
    { to: '/dashboard', label: 'Betting Model', requiredTier: 'basic' },
    { to: '/matchups', label: 'Matchup Tool', requiredTier: 'basic' },
    { to: '/three-ball', label: 'Three Ball Tool', requiredTier: 'basic' },
    { to: '/fantasy', label: 'Fantasy Optimizer', requiredTier: 'basic' },
    
    // Pro Tier Features
    { to: '/course-fit', label: 'Course Fit Tool', requiredTier: 'pro' },
    { to: '/ai-caddie', label: 'AI Caddie', requiredTier: 'pro' },
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

  function ArticlesDropdown() {
    const [open, setOpen] = useState(false);
    const closeTimeout = React.useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
      if (closeTimeout.current) {
        clearTimeout(closeTimeout.current);
        closeTimeout.current = null;
      }
      setOpen(true);
    };

    const handleMouseLeave = () => {
      closeTimeout.current = setTimeout(() => {
        setOpen(false);
      }, 500); // 500ms delay
    };

    return (
      <div
        className="relative h-16 flex items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button className={navLinkClass({ isActive: false }) + " flex items-center"}>
          Articles
          <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
        {open && (
          <div
            className="absolute left-1/2 transform -translate-x-1/2 top-full min-w-[220px] bg-white border border-gray-200 rounded shadow-lg z-50 pt-2"
            style={{ marginTop: '-8px', pointerEvents: 'auto' }}
          >
            <Link
              to="/articles/detroit-gc"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium"
            >
              What to know about Detroit GC
            </Link>
            <Link
              to="/articles/john-deere-classic"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium"
            >
              John Deere Classic Things To Know
            </Link>
            <Link
              to="/articles/john-deere-classic-betting-picks"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium"
            >
              John Deere Classic Betting Mega Preview
            </Link>
          </div>
        )}
      </div>
    );
  }

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
          <ArticlesDropdown />
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
            <ArticlesDropdown />
          </div>
        </div>
      )}
    </nav>
  );
}