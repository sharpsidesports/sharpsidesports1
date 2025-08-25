import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/14zPJpGCtqn04vyF4IXgOTHE7ymfCOPfb90SNBM0zLDg/gviz/tq?tqx=out:csv';

interface SPPlusData {
  team: string;
  spPlusRank: number;
  spPlusOff: number;
  spPlusOffRank: number;
  spPlusDef: number;
  spPlusDefRank: number;
  spPlusST: number;
  spPlusSTRank: number;
  avgW: number;
  sosRank: number;
}

export default function SPPlus() {
  const [data, setData] = useState<SPPlusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof SPPlusData;
    direction: 'asc' | 'desc';
  }>({ key: 'spPlusRank', direction: 'asc' });

  // SEO: Update document title and meta tags
  useEffect(() => {
    document.title = "College Football SP+ Rankings 2025 - Team Efficiency Ratings & Predictions | SharpSide Sports";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'College Football SP+ rankings for 2025 season. View team efficiency ratings, offensive/defensive rankings, strength of schedule, and win predictions for all FBS teams. Updated weekly.');
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = 'College Football SP+ rankings for 2025 season. View team efficiency ratings, offensive/defensive rankings, strength of schedule, and win predictions for all FBS teams. Updated weekly.';
      document.head.appendChild(newMetaDescription);
    }

    // Add structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "College Football SP+ Rankings 2025",
      "description": "College Football SP+ rankings for 2025 season. View team efficiency ratings, offensive/defensive rankings, strength of schedule, and win predictions for all FBS teams.",
      "url": "https://sharpsidesports.com/cfb/sp-plus",
      "mainEntity": {
        "@type": "Dataset",
        "name": "College Football SP+ Rankings 2025",
        "description": "Comprehensive SP+ efficiency ratings for all FBS college football teams"
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
        const response = await fetch(SHEET_CSV_URL);
        if (!response.ok) throw new Error('Failed to fetch data');
        const text = await response.text();
        const parsed = Papa.parse<string[]>(text, { skipEmptyLines: true });
        
        const dataRows = parsed.data.slice(1); // Skip header row
        const formattedData: SPPlusData[] = dataRows
          .filter(row => row.length >= 7 && row[0] && row[0].trim() !== '')
          .map(row => {
            // Extract rank from team name (e.g., "2. Alabama" -> rank: 1, team: "Alabama")
            const teamMatch = row[0]?.match(/^(\d+)\.\s*(.+)$/);
            const spPlusRank = teamMatch ? Math.max(1, parseInt(teamMatch[1]) - 1) : 0;
            const team = teamMatch ? teamMatch[2].trim() : row[0]?.trim() || '';
            
            // Parse SP+ values and their ranks
            const spPlusOff = parseFloat(row[1]) || 0;
            const spPlusOffRank = parseInt(row[1]?.match(/\((\d+)\)/)?.[1] || '0') || 0;
            const spPlusDef = parseFloat(row[2]) || 0;
            const spPlusDefRank = parseInt(row[2]?.match(/\((\d+)\)/)?.[1] || '0') || 0;
            const spPlusST = parseFloat(row[3]) || 0;
            const spPlusSTRank = parseInt(row[3]?.match(/\((\d+)\)/)?.[1] || '0') || 0;
            const avgW = parseFloat(row[4]) || 0;
            const sosRank = parseInt(row[5]) || 0;

            return {
              team,
              spPlusRank,
              spPlusOff,
              spPlusOffRank,
              spPlusDef,
              spPlusDefRank,
              spPlusST,
              spPlusSTRank,
              avgW,
              sosRank
            };
          });

        setData(formattedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (key: keyof SPPlusData) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const getSortIcon = (key: keyof SPPlusData) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading data: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">College Football SP+ Rankings 2025</h1>
        <p className="text-gray-600 mb-6">
          SP+ is a tempo- and opponent-adjusted measure of college football efficiency. 
          It is a predictive measure of the most sustainable and predictable aspects of football.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900">SP+ Rating</h3>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900">Offensive SP+</h3>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-900">Defensive SP+</h3>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-900">Special Teams</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('spPlusRank')}
                >
                  Rank {getSortIcon('spPlusRank')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('team')}
                >
                  Team {getSortIcon('team')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('spPlusOff')}
                >
                  Off. SP+ {getSortIcon('spPlusOff')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('spPlusDef')}
                >
                  Def. SP+ {getSortIcon('spPlusDef')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('spPlusST')}
                >
                  ST SP+ {getSortIcon('spPlusST')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('avgW')}
                >
                  Avg. Wins {getSortIcon('avgW')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('sosRank')}
                >
                  SOS Rank {getSortIcon('sosRank')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((team, index) => (
                <tr key={team.team} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {team.spPlusRank}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {team.team}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <span className="font-medium">{team.spPlusOff.toFixed(1)}</span>
                      <span className="text-gray-500 ml-1">({team.spPlusOffRank})</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <span className="font-medium">{team.spPlusDef.toFixed(1)}</span>
                      <span className="text-gray-500 ml-1">({team.spPlusDefRank})</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <span className="font-medium">{team.spPlusST.toFixed(1)}</span>
                      <span className="text-gray-500 ml-1">({team.spPlusSTRank})</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {team.avgW.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {team.sosRank}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 