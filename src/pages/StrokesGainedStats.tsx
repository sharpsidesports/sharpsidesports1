import React, { useState, useEffect } from 'react';
import { StrokesGainedData } from '../types/StrokesGainedTypes.js';

export default function StrokesGainedStats() {
  const [data, setData] = useState<StrokesGainedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRounds, setSelectedRounds] = useState<12 | 24 | 36>(36);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof StrokesGainedData;
    direction: 'asc' | 'desc';
  }>({ key: 'sgTotal', direction: 'desc' });

  useEffect(() => {
    fetchData();
  }, [selectedRounds]);

  const fetchData = async () => {
    let tabName = 'SG per RD'; // Default value
    
    try {
      const SHEET_ID = '1h-SPBOePxPYQ76akCtgA741kxNvW2luuyIvdy6q8bUQ';
      
      // Get the correct tab name based on selected rounds
      switch (selectedRounds) {
        case 12:
          tabName = 'SG per RD last 12';
          break;
        case 24:
          tabName = 'SG per RD last 24';
          break;
        case 36:
          tabName = 'SG per RD';
          break;
      }
      
      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
      
      setLoading(true);
      console.log('Fetching from tab:', tabName); // Debug log
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const text = await response.text();
      const rows = text.split('\n');
      
      // Skip header row and process the data
      const formattedData: StrokesGainedData[] = rows
        .slice(1) // Skip header row
        .filter(row => row.trim()) // Remove empty rows
        .map(row => {
          const columns = row.split(',').map(col => col.replace(/"/g, '').trim());
          return {
            playerName: columns[0],
            rounds: parseInt(columns[1]) || 0,
            sgTotal: parseFloat(columns[2]) || 0,
            sgTeeToGreen: parseFloat(columns[3]) || 0,
            sgBallStriking: parseFloat(columns[4]) || 0,
            sgOffTheTee: parseFloat(columns[5]) || 0,
            sgApproach: parseFloat(columns[6]) || 0,
            sgAroundGreen: parseFloat(columns[7]) || 0,
            sgPutting: parseFloat(columns[8]) || 0
          };
        })
        .filter(player => player.playerName && !isNaN(player.rounds));
      
      console.log(`Fetched ${formattedData.length} players from ${tabName}`);
      setData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      console.error('Tab attempted:', tabName);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: keyof StrokesGainedData) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'desc' ? 'asc' : 'desc',
    });
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] < b[sortConfig.key] ? -1 : 1;
    }
    return a[sortConfig.key] > b[sortConfig.key] ? -1 : 1;
  });

  const renderSortIcon = (key: keyof StrokesGainedData) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'desc' ? '↓' : '↑';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Strokes Gained Stats</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Round Range:</span>
          <div className="flex rounded-md shadow-sm" role="group">
            {[12, 24, 36].map((rounds) => (
              <button
                key={rounds}
                onClick={() => setSelectedRounds(rounds as 12 | 24 | 36)}
                className={`
                  px-4 py-2 text-sm font-medium
                  ${rounds === selectedRounds
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'}
                  ${rounds === 12 ? 'rounded-l-md' : ''}
                  ${rounds === 36 ? 'rounded-r-md' : ''}
                  border border-gray-300
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                `}
              >
                {rounds} Rounds
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading stats...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('playerName')}
                  >
                    Player {renderSortIcon('playerName')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('rounds')}
                  >
                    Rounds {renderSortIcon('rounds')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('sgTotal')}
                  >
                    SG: Total {renderSortIcon('sgTotal')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('sgTeeToGreen')}
                  >
                    SG: T2G {renderSortIcon('sgTeeToGreen')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('sgBallStriking')}
                  >
                    SG: BS {renderSortIcon('sgBallStriking')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('sgOffTheTee')}
                  >
                    SG: OTT {renderSortIcon('sgOffTheTee')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('sgApproach')}
                  >
                    SG: APP {renderSortIcon('sgApproach')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('sgAroundGreen')}
                  >
                    SG: ARG {renderSortIcon('sgAroundGreen')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('sgPutting')}
                  >
                    SG: PUTT {renderSortIcon('sgPutting')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedData.map((player, idx) => (
                  <tr key={player.playerName} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {player.playerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {player.rounds}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${player.sgTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {player.sgTotal.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${player.sgTeeToGreen >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {player.sgTeeToGreen.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${player.sgBallStriking >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {player.sgBallStriking.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${player.sgOffTheTee >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {player.sgOffTheTee.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${player.sgApproach >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {player.sgApproach.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${player.sgAroundGreen >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {player.sgAroundGreen.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${player.sgPutting >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {player.sgPutting.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 