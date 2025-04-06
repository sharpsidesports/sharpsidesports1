import React from 'react';
import { TournamentWin } from '../../types/testimonials';

interface TournamentWinsProps {
  wins: TournamentWin[];
}

export default function TournamentWins({ wins }: TournamentWinsProps) {
  return (
    <div className="mt-4 space-y-2">
      {wins.map((win, index) => (
        <div 
          key={index}
          className="bg-gray-700 rounded-md p-2 text-sm flex justify-between items-center"
        >
          <div>
            <span className="text-green-400">{win.tournament}</span>
            <span className="text-gray-300 mx-2">•</span>
            <span className="text-white">{win.player}</span>
          </div>
          <div className="text-green-400 font-mono">{win.odds}</div>
        </div>
      ))}
    </div>
  );
}