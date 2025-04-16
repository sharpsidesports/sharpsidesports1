// This file is part of the FantasySuccess component.

import SuccessCard from './fantasy/SuccessCard.js';

export default function FantasySuccess() {
  return (
    <div className="bg-gray-900 p-8 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-green-400">FANTASY SUCCESS</h2>
        <p className="text-gray-400 text-sm">RECENT WINS</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SuccessCard 
          title="DraftKings GPP Win"
          amount="$50,000"
          date="March 2024"
          tournament="Players Championship"
        />
        <SuccessCard 
          title="FanDuel GPP Win"
          amount="$25,000"
          date="February 2024"
          tournament="Phoenix Open"
        />
        <SuccessCard 
          title="PrizePicks Win"
          amount="$10,000"
          date="January 2024"
          tournament="Tournament of Champions"
        />
      </div>
    </div>
  );
}