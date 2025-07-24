import React, { useState } from 'react';
import { picksByYear, yearStats, Pick } from '../../data/nflPicksData.ts';

export default function NFLRecords() {
  const [showPicks, setShowPicks] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2024');

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          NFL Betting Record
        </h3>
        <p className="text-gray-600">
          5-year track record (2020-2024)
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-3xl font-bold text-green-600">322</div>
          <div className="text-sm text-gray-600">Wins</div>
        </div>
        
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-3xl font-bold text-black">214</div>
          <div className="text-sm text-gray-600">Losses</div>
        </div>
        
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-3xl font-bold text-green-600">1186%</div>
          <div className="text-sm text-gray-600">Return</div>
        </div>
        
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-3xl font-bold text-gray-900">60.1%</div>
          <div className="text-sm text-gray-600">Win Rate</div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <span className="text-sm text-gray-500 mb-4 block">
          536 total picks • 207.6 units profit
        </span>
        
        <button
          onClick={() => setShowPicks(!showPicks)}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {showPicks ? 'Hide Picks' : 'View All Picks'}
        </button>
      </div>

      {showPicks && (
        <div className="mt-6 border-t pt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">Complete Betting History</h4>
          
          {/* Year Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {Object.keys(picksByYear).map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  selectedYear === year
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {year} ({yearStats[year].wins}W-{yearStats[year].losses}L)
              </button>
            ))}
          </div>

          {/* Picks Table */}
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Week</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Pick</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-600">Result</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-600">Units</th>
                </tr>
              </thead>
              <tbody>
                {picksByYear[selectedYear].map((pick: Pick, index: number) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3 text-gray-700">{pick.date}</td>
                    <td className="py-2 px-3 text-gray-900 font-medium">{pick.pick}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        pick.result === 'W' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {pick.result}
                      </span>
                    </td>
                    <td className={`py-2 px-3 text-center font-medium ${
                      pick.unit.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {pick.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              {picksByYear[selectedYear].length} picks from {selectedYear} • {yearStats[selectedYear].return} return
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 