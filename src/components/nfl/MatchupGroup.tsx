import React, { useState } from 'react';

interface MatchupGroupProps {
  teamA: string;
  teamB: string;
  children: React.ReactNode; // pre-rendered, already-sorted PlayerCard elements
}

const INITIAL_COUNT = 5;

// One game's section: "TEAM vs TEAM" header, top 5 players by score, then a
// "show all" expand — keeps a ~15-20-player game scannable without losing
// the rest of the roster.
export default function MatchupGroup({ teamA, teamB, children }: MatchupGroupProps) {
  const [showAll, setShowAll] = useState(false);
  const items = React.Children.toArray(children);
  const visible = showAll ? items : items.slice(0, INITIAL_COUNT);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700">
          {teamA} <span className="font-normal text-gray-400">vs</span> {teamB}
        </h3>
        <span className="text-xs text-gray-400">{items.length} players</span>
      </div>
      <div className="space-y-2">{visible}</div>
      {!showAll && items.length > INITIAL_COUNT && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="text-sm font-semibold text-sharpside-green hover:underline"
        >
          Show all {items.length} players
        </button>
      )}
    </div>
  );
}
