import type { ReactNode } from 'react';
import PicksNavigation from './PicksNavigation.js';

// Shared chrome for every page under /picks-preview — this micro-site is
// excluded from the main site's Header/Navigation/Footer (see App.tsx
// STANDALONE_ROUTES) and provides its own nav instead.
export default function PicksLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <PicksNavigation />
      {children}
    </div>
  );
}
