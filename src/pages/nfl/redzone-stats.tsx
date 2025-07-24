import React from "react";
import { Link } from "react-router-dom";

export default function RedzoneStatsLanding() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">NFL Redzone Stats</h1>
      <p className="text-gray-700 mb-6">
        Explore detailed redzone stats for each position. Click a position below to view sortable, live-updated stats for every player.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link to="/redzone/rb" className="block bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition p-6 text-center font-semibold text-lg text-sharpside-green hover:bg-green-50">
          RB Redzone Stats
        </Link>
        <Link to="/redzone/wr" className="block bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition p-6 text-center font-semibold text-lg text-sharpside-green hover:bg-green-50">
          WR Redzone Stats
        </Link>
        <Link to="/redzone/te" className="block bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition p-6 text-center font-semibold text-lg text-sharpside-green hover:bg-green-50">
          TE Redzone Stats
        </Link>
      </div>
    </div>
  );
} 