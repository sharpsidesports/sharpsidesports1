import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { SubscriptionTier } from '../types/auth.js';
import React from 'react';
import ReactDOM from 'react-dom';

interface NavItem {
  to: string;
  label: string;
  requiredTier: SubscriptionTier;
}

function useDropdownPosition(open: boolean, buttonRef: React.RefObject<HTMLElement>) {
  const [coords, setCoords] = useState({ left: 0, top: 0, width: 220 });
  useEffect(() => {
    function updatePosition() {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setCoords({ left: rect.left, top: rect.bottom, width: rect.width });
      }
    }
    if (open) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [open, buttonRef]);
  return coords;
}

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    // Pro Tier Features (Betting Picks first)
    { to: '/expert-insights', label: 'Betting Picks', requiredTier: 'pro' },
    // Free Tier Features
    { to: '/reception-model', label: 'Reception Model', requiredTier: 'free' },
    // Basic Tier Features
    // { to: '/dashboard', label: 'Betting Model', requiredTier: 'basic' },
    // { to: '/matchups', label: 'Matchup Tool', requiredTier: 'basic' },
    // { to: '/three-ball', label: 'Three Ball Tool', requiredTier: 'basic' },
    // { to: '/fantasy', label: 'Fantasy Optimizer', requiredTier: 'basic' },
    // Pro Tier Features
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
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const coords = useDropdownPosition(open, buttonRef);

    const handleMouseEnter = () => {
      if (closeTimeout.current) {
        clearTimeout(closeTimeout.current);
        closeTimeout.current = null;
      }
      // No-op: useDropdownPosition handles coords
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
        <button ref={buttonRef} className={navLinkClass({ isActive: false }) + " flex items-center"}>
          Articles
          <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
        {open && ReactDOM.createPortal(
          <div
            className="bg-white border border-gray-200 rounded shadow-lg z-50 pt-2"
            style={{ position: 'fixed', left: coords.left, top: coords.top, minWidth: coords.width, pointerEvents: 'auto' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
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
          </div>,
          document.body
        )}
      </div>
    );
  }

  function NFLDropdown() {
    const [open, setOpen] = useState(false);
    const closeTimeout = React.useRef<NodeJS.Timeout | null>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const coords = useDropdownPosition(open, buttonRef);
    const handleMouseEnter = () => {
      if (closeTimeout.current) { clearTimeout(closeTimeout.current); closeTimeout.current = null; }
      // No-op: useDropdownPosition handles coords
      setOpen(true);
    };
    const handleMouseLeave = () => { closeTimeout.current = setTimeout(() => { setOpen(false); }, 500); };
    const [fantasyOpen, setFantasyOpen] = useState(false);
    const fantasyTimeout = React.useRef<NodeJS.Timeout | null>(null);
    const fantasyRef = React.useRef<HTMLDivElement>(null);
    const fantasyCoords = useDropdownPosition(fantasyOpen, fantasyRef);
    const handleFantasyEnter = () => { if (fantasyTimeout.current) { clearTimeout(fantasyTimeout.current); fantasyTimeout.current = null; } setFantasyOpen(true); };
    const handleFantasyLeave = () => { fantasyTimeout.current = setTimeout(() => { setFantasyOpen(false); }, 400); };
    const [redzoneOpen, setRedzoneOpen] = useState(false);
    const redzoneTimeout = React.useRef<NodeJS.Timeout | null>(null);
    const handleRedzoneEnter = () => { if (redzoneTimeout.current) { clearTimeout(redzoneTimeout.current); redzoneTimeout.current = null; } setRedzoneOpen(true); };
    const handleRedzoneLeave = () => { redzoneTimeout.current = setTimeout(() => { setRedzoneOpen(false); }, 400); };
    const [teamStatsOpen, setTeamStatsOpen] = useState(false);
    const teamStatsTimeout = React.useRef<NodeJS.Timeout | null>(null);
    const handleTeamStatsEnter = () => { if (teamStatsTimeout.current) { clearTimeout(teamStatsTimeout.current); teamStatsTimeout.current = null; } setTeamStatsOpen(true); };
    const handleTeamStatsLeave = () => { teamStatsTimeout.current = setTimeout(() => { setTeamStatsOpen(false); }, 400); };
    return (
      <div className="relative h-16 flex items-center" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <button ref={buttonRef} className={navLinkClass({ isActive: false }) + " flex items-center"}>NFL<svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg></button>
        {open && ReactDOM.createPortal(
          <div className="bg-white border border-gray-200 rounded shadow-lg z-50 pt-2" style={{ position: 'fixed', left: coords.left, top: coords.top, minWidth: coords.width, pointerEvents: 'auto' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div className="relative" ref={fantasyRef} onMouseEnter={handleFantasyEnter} onMouseLeave={handleFantasyLeave}>
              <Link to="/nfl/fantasy-projections" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium flex items-center justify-between">
                Fantasy Projections
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </Link>
              {fantasyOpen && ReactDOM.createPortal(
                <div className="bg-white border border-gray-200 rounded shadow-lg z-50 pt-2" style={{ position: 'fixed', left: fantasyCoords.left + fantasyCoords.width - 1, top: fantasyCoords.top - coords.top + coords.top, minWidth: 200, pointerEvents: 'auto' }}>
                  <Link to="/fantasy/qb-projections" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium">QB Projections</Link>
                  <Link to="/fantasy/wr-projections" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium">WR Projections</Link>
                  {/* Add more positions as needed */}
                </div>,
                document.body
              )}
            </div>
            <div className="relative" onMouseEnter={handleRedzoneEnter} onMouseLeave={handleRedzoneLeave}>
              <Link to="/nfl/redzone-stats" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium flex items-center justify-between">
                Redzone Stats
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </Link>
              {redzoneOpen && ReactDOM.createPortal(
                <div className="absolute left-full top-0 min-w-[200px] bg-white border border-gray-200 rounded shadow-lg z-50 pt-2" style={{ marginLeft: '-1px', pointerEvents: 'auto' }}>
                  <Link to="/redzone/rb" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium">RB Redzone Stats</Link>
                  <Link to="/redzone/wr" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium">WR Redzone Stats</Link>
                  <Link to="/redzone/te" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium">TE Redzone Stats</Link>
                </div>,
                document.body
              )}
            </div>
            <div className="relative" onMouseEnter={handleTeamStatsEnter} onMouseLeave={handleTeamStatsLeave}>
              <Link to="/nfl/team-stats" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium flex items-center justify-between">
                Team Stats
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </Link>
              {teamStatsOpen && ReactDOM.createPortal(
                <div className="absolute left-full top-0 min-w-[200px] bg-white border border-gray-200 rounded shadow-lg z-50 pt-2" style={{ marginLeft: '-1px', pointerEvents: 'auto' }}>
                  <Link to="/nfl/offense" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium">Offensive Stats</Link>
                  <Link to="/nfl/defense" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium">Defensive Stats</Link>
                  <Link to="/nfl/team-stats" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium">Team Overview</Link>
                </div>,
                document.body
              )}
            </div>
          </div>,
          document.body
        )}
      </div>
    );
  }

  function CFBDropdown() {
    const [open, setOpen] = useState(false);
    const closeTimeout = React.useRef<NodeJS.Timeout | null>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const coords = useDropdownPosition(open, buttonRef);
    const handleMouseEnter = () => {
      if (closeTimeout.current) { clearTimeout(closeTimeout.current); closeTimeout.current = null; }
      // No-op: useDropdownPosition handles coords
      setOpen(true);
    };
    const handleMouseLeave = () => { closeTimeout.current = setTimeout(() => { setOpen(false); }, 500); };
    return (
      <div className="relative h-16 flex items-center" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <button ref={buttonRef} className={navLinkClass({ isActive: false }) + " flex items-center"}>CFB<svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg></button>
        {open && ReactDOM.createPortal(
          <div className="bg-white border border-gray-200 rounded shadow-lg z-50 pt-2" style={{ position: 'fixed', left: coords.left, top: coords.top, minWidth: coords.width, pointerEvents: 'auto' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Link to="/cfb/sp-plus" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium">SP+</Link>
            <Link to="/cfb/wr-target-projections" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium">WR Target Projections</Link>
          </div>,
          document.body
        )}
      </div>
    );
  }

  function CBBDropdown() {
    const [open, setOpen] = useState(false);
    const closeTimeout = React.useRef<NodeJS.Timeout | null>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const coords = useDropdownPosition(open, buttonRef);
    const handleMouseEnter = () => {
      if (closeTimeout.current) { clearTimeout(closeTimeout.current); closeTimeout.current = null; }
      // No-op: useDropdownPosition handles coords
      setOpen(true);
    };
    const handleMouseLeave = () => { closeTimeout.current = setTimeout(() => { setOpen(false); }, 500); };
    return (
      <div className="relative h-16 flex items-center" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <button ref={buttonRef} className={navLinkClass({ isActive: false }) + " flex items-center"}>CBB<svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg></button>
        {open && ReactDOM.createPortal(
          <div className="bg-white border border-gray-200 rounded shadow-lg z-50 pt-2" style={{ position: 'fixed', left: coords.left, top: coords.top, minWidth: coords.width, pointerEvents: 'auto' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Link to="/cbb/player-ratings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium">Player Ratings</Link>
            <Link to="/cbb/lineup-ratings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium">Lineup Ratings</Link>
            <Link to="/cbb/pick-and-roll" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium">Pick & Roll</Link>
            <Link to="/cbb/spot-up-shooting" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium">Spot Up Shooting</Link>
            <Link to="/cbb/spot-up-defense" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium">Spot Up Defense</Link>
            <Link to="/cbb/pick-and-roll-defense" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium">Pick & Roll Defense</Link>
            <Link to="/cbb/team-ratings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium">Team Ratings</Link>
          </div>,
          document.body
        )}
      </div>
    );
  }

  function GolfDropdown() {
    // Instead of dropdown, redirect to sharpsidegolf.com/dashboard
    const handleGolfClick = (e: React.MouseEvent) => {
      e.preventDefault();
      window.location.href = 'https://sharpsidegolf.com/dashboard';
    };
    return (
      <div className="relative h-16 flex items-center">
        <button
          className={navLinkClass({ isActive: false }) + " flex items-center"}
          onClick={handleGolfClick}
        >
          Golf
          <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
      </div>
    );
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 h-16">
          <NavLink to="/expert-insights" className={navLinkClass}>Betting Picks</NavLink>
          <GolfDropdown />
          <NFLDropdown />
          <NavLink to="/reception-model" className={navLinkClass}>NFL Reception Model</NavLink>
          <CFBDropdown />
          <CBBDropdown />
          <NavLink to="/subscription" className={navLinkClass}>Pricing</NavLink>
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
            {/* Golf Section - redirect */}
            <div className="relative">
              <NavLink
                to="#"
                className={mobileNavLinkClass}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = 'https://sharpsidegolf.com/dashboard';
                }}
              >
                Golf Dashboard
              </NavLink>
            </div>
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
              to="/reception-model"
              className={mobileNavLinkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              NFL Reception Model
            </NavLink>
            <NavLink
              to="/subscription"
              className={mobileNavLinkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </NavLink>
            <div className="relative">
              <NavLink
                to="/nfl/redzone-stats"
                className={mobileNavLinkClass}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Redzone Stats
              </NavLink>
              <div className="pl-4">
                <NavLink to="/redzone/rb" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
                  RB Redzone Stats
                </NavLink>
                <NavLink to="/redzone/wr" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
                  WR Redzone Stats
                </NavLink>
                <NavLink to="/redzone/te" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
                  TE Redzone Stats
                </NavLink>
              </div>
            </div>
            <div className="relative">
              <NavLink
                to="/nfl/team-stats"
                className={mobileNavLinkClass}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Team Stats
              </NavLink>
              <div className="pl-4">
                <NavLink to="/nfl/offense" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
                  Offensive Stats
                </NavLink>
                <NavLink to="/nfl/defense" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
                  Defensive Stats
                </NavLink>
                <NavLink to="/nfl/team-stats" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
                  Team Overview
                </NavLink>
              </div>
            </div>
            {/* Move ArticlesDropdown to the very end of the mobile menu */}
          </div>
          <ArticlesDropdown />
        </div>
      )}
    </nav>
  );
}