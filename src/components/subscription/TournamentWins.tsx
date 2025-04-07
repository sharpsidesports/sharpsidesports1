import React from 'react';
import WinsCard from './tournament/WinsCard';

export default function TournamentWins() {
  return (
    <div className="bg-gray-900 p-8 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-green-400">TOURNAMENT WINS</h2>
        <p className="text-gray-400 text-sm">RECENT RESULTS</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <WinsCard 
          tournament="Players Championship"
          date="March 2024"
          winnings="$50,000"
          picks={["Scottie Scheffler", "Wyndham Clark", "Sam Burns"]}
        />
        <WinsCard 
          tournament="Phoenix Open"
          date="February 2024"
          winnings="$25,000"
          picks={["Nick Taylor", "Jordan Spieth", "Justin Thomas"]}
        />
        <WinsCard 
          tournament="Tournament of Champions"
          date="January 2024"
          winnings="$10,000"
          picks={["Chris Kirk", "Brian Harman", "Collin Morikawa"]}
        />
      </div>
    </div>
  );
}