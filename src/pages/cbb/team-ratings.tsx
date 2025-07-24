import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

interface TeamRating {
  Rank: string;
  Team: string;
  OBPR: string;
  DBPR: string;
  Overall: string;
  'Opponent Adjust': string;
  'Pace Adjust': string;
  'Off. ranking': string;
  'Def. ranking': string;
  Tempo: string;
  'Tempo Ranking': string;
  'Injury Ranking': string;
  'Home Ranking': string;
  'Roster Rank': string;
  '10-0 Runs/Gm': string;
  '10-0 Runs Conceded/Gm': string;
  '10-0 Runs Margin': string;
  'Total 10-0 runs': string;
  'Total 10-0 Runs Conceded': string;
  Wins: string;
  Losses: string;
}

export default function CBBTeamRatings() {
  const [data, setData] = useState<TeamRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TeamRating;
    direction: 'asc' | 'desc';
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://docs.google.com/spreadsheets/d/1Aisf3gZlJYoU9ZRAaw_LugtkRUmq7vU2qxhPznP5iqI/export?format=csv&gid=1815475747'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const csvText = await response.text();
        const result = Papa.parse(csvText, { header: true });
        
        if (result.data && Array.isArray(result.data)) {
          setData(result.data as TeamRating[]);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (key: keyof TeamRating) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      // Handle numeric sorting
      const aNum = parseFloat(aValue);
      const bNum = parseFloat(bValue);
      
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
      }
      
      // Handle string sorting
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const getSortIcon = (key: keyof TeamRating) => {
    if (!sortConfig || sortConfig.key !== key) {
      return '';
    }
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">Loading team ratings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">CBB Team Ratings</h1>
        <p className="text-gray-600 mb-6">
          Comprehensive team ratings and rankings for College Basketball. Click any column header to sort.
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-sharpside-green">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('Rank')}>RANK {getSortIcon('Rank')}</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('Team')}>TEAM {getSortIcon('Team')}</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('OBPR')}>OBPR {getSortIcon('OBPR')}</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('DBPR')}>DBPR {getSortIcon('DBPR')}</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('Overall')}>OVERALL {getSortIcon('Overall')}</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('Opponent Adjust')}>OPPONENT ADJUST {getSortIcon('Opponent Adjust')}</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('Pace Adjust')}>PACE ADJUST {getSortIcon('Pace Adjust')}</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('Off. ranking')}>OFF. RANK {getSortIcon('Off. ranking')}</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('Def. ranking')}>DEF. RANK {getSortIcon('Def. ranking')}</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('Tempo')}>TEMPO {getSortIcon('Tempo')}</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('Tempo Ranking')}>TEMPO RANK {getSortIcon('Tempo Ranking')}</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('Injury Ranking')}>INJURY RANK {getSortIcon('Injury Ranking')}</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('Home Ranking')}>HOME RANK {getSortIcon('Home Ranking')}</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('Roster Rank')}>ROSTER RANK {getSortIcon('Roster Rank')}</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('10-0 Runs/Gm')}>10-0 RUNS/GM {getSortIcon('10-0 Runs/Gm')}</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('10-0 Runs Conceded/Gm')}>10-0 RUNS CONC./GM {getSortIcon('10-0 Runs Conceded/Gm')}</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('10-0 Runs Margin')}>10-0 RUNS MARGIN {getSortIcon('10-0 Runs Margin')}</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('Total 10-0 runs')}>TOTAL 10-0 RUNS {getSortIcon('Total 10-0 runs')}</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('Total 10-0 Runs Conceded')}>TOTAL 10-0 RUNS CONC. {getSortIcon('Total 10-0 Runs Conceded')}</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('Wins')}>WINS {getSortIcon('Wins')}</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('Losses')}>LOSSES {getSortIcon('Losses')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((team, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{team.Rank}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{team.Team}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{parseFloat(team.OBPR).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{parseFloat(team.DBPR).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{parseFloat(team.Overall).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team['Opponent Adjust']}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team['Pace Adjust']}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team['Off. ranking']}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team['Def. ranking']}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{parseFloat(team.Tempo).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team['Tempo Ranking']}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team['Injury Ranking']}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team['Home Ranking']}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team['Roster Rank']}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team['10-0 Runs/Gm']}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team['10-0 Runs Conceded/Gm']}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team['10-0 Runs Margin']}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team['Total 10-0 runs']}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team['Total 10-0 Runs Conceded']}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team.Wins}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team.Losses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-4">
        <p>Data updates automatically from Google Sheets</p>
      </div>
    </div>
  );
} 