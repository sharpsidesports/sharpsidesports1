import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

const SHEET_CSV_URL = 'https://api.allorigins.win/raw?url=https://docs.google.com/spreadsheets/d/14PUFT76LIYnJxLKoWGs7GD9KDNuqIVY0HuqwfRPeYD0/gviz/tq?tqx=out:csv';

interface WRData {
  player: string;
  position: string;
  team: string;
  games: number;
  targets: number;
  catchPercentage: number;
  receptions: number;
  yards: number;
  yardsPerCatch: number;
  firstDowns: number;
  longest: number;
  touchdowns: number;
}

export default function WRTargetProjections() {
  const [data, setData] = useState<WRData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof WRData;
    direction: 'asc' | 'desc';
  }>({ key: 'targets', direction: 'desc' });
  const [filterPosition, setFilterPosition] = useState<string>('all');

  // SEO: Update document title and meta tags
  useEffect(() => {
    document.title = "College Football WR Target Projections 2025 - Receiving Statistics & Rankings | SharpSide Sports";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'College Football WR target projections for 2025 season. View receiving statistics, catch percentages, yards per catch, and target analysis for all college football wide receivers. Updated weekly.');
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = 'College Football WR target projections for 2025 season. View receiving statistics, catch percentages, yards per catch, and target analysis for all college football wide receivers. Updated weekly.';
      document.head.appendChild(newMetaDescription);
    }

    // Add structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "College Football WR Target Projections 2025",
      "description": "College Football WR target projections for 2025 season. View receiving statistics, catch percentages, yards per catch, and target analysis for all college football wide receivers.",
      "url": "https://sharpsidesports.com/cfb/wr-target-projections",
      "mainEntity": {
        "@type": "Dataset",
        "name": "College Football WR Target Projections 2025",
        "description": "Comprehensive receiving statistics and target projections for college football wide receivers"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching data from:", SHEET_CSV_URL);
        const response = await fetch(SHEET_CSV_URL);
        console.log("Response status:", response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        console.log("Response text length:", text.length);
        console.log("First 500 chars:", text.substring(0, 500));
        
        const parsed = Papa.parse<string[]>(text, { skipEmptyLines: true });
        console.log("Parsed data rows:", parsed.data.length);
        console.log("First few rows:", parsed.data.slice(0, 3));
        
        const dataRows = parsed.data.slice(1); // Skip header row
        const formattedData: WRData[] = dataRows
          .filter(row => row.length >= 12 && row[0] && row[0].trim() !== '')
          .map(row => ({
            player: row[0]?.trim() || '',
            position: row[1]?.trim() || '',
            team: row[2]?.trim() || '',
            games: parseInt(row[3]) || 0,
            targets: parseInt(row[4]) || 0,
            catchPercentage: parseFloat(row[5]) || 0,
            receptions: parseInt(row[6]) || 0,
            yards: parseInt(row[7]) || 0,
            yardsPerCatch: parseFloat(row[8]) || 0,
            firstDowns: parseInt(row[9]) || 0,
            longest: parseInt(row[10]) || 0,
            touchdowns: parseInt(row[11]) || 0
          }));

        console.log("Formatted data count:", formattedData.length);
        console.log("Sample formatted data:", formattedData.slice(0, 2));
        setData(formattedData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (key: keyof WRData) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key: keyof WRData) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const filteredData = data.filter(player => 
    filterPosition === 'all' || player.position === filterPosition
  );

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' 
        ? aValue - bValue
        : bValue - aValue;
    }
    
    return 0;
  });

  const positions = ['all', 'WR', 'TE', 'HB'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading CFB data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading data: {error}</p>
        <p className="text-gray-500 mt-2">Please check the browser console for more details.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">College Football WR Target Projections 2025</h1>
        <p className="text-gray-600 mb-6">
          Comprehensive receiving statistics and target analysis for college football wide receivers, tight ends, and running backs.
        </p>
        
        {/* Position Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Position:</label>
          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {positions.map(pos => (
              <option key={pos} value={pos}>
                {pos === 'all' ? 'All Positions' : pos}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('player')}
                >
                  Player {getSortIcon('player')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('position')}
                >
                  Pos {getSortIcon('position')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('team')}
                >
                  Team {getSortIcon('team')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('games')}
                >
                  Games {getSortIcon('games')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('targets')}
                >
                  Targets {getSortIcon('targets')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('catchPercentage')}
                >
                  Catch % {getSortIcon('catchPercentage')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('receptions')}
                >
                  Receptions {getSortIcon('receptions')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('yards')}
                >
                  Yards {getSortIcon('yards')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('yardsPerCatch')}
                >
                  YPC {getSortIcon('yardsPerCatch')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('firstDowns')}
                >
                  1st Downs {getSortIcon('firstDowns')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('longest')}
                >
                  Long {getSortIcon('longest')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('touchdowns')}
                >
                  TDs {getSortIcon('touchdowns')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((player, index) => (
                <tr key={`${player.player}-${player.team}-${index}`} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {player.player}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {player.position}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {player.team}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {player.games}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {player.targets}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {player.catchPercentage}%
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {player.receptions}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {player.yards}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {player.yardsPerCatch}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {player.firstDowns}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {player.longest}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {player.touchdowns}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {sortedData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No data available for the selected position.</p>
          </div>
        )}
      </div>
    </div>
  );
}
// Cache bust Thu Sep 18 12:49:20 EDT 2025
// Force refresh 1758214353
