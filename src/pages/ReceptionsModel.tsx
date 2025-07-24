import { useEffect, useState } from 'react';
import Papa from 'papaparse';

interface TeamTable {
  teamAndStats: string[];
  players: string[][];
}

export default function ReceptionsModel() {
  const [teams, setTeams] = useState<TeamTable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = 'https://docs.google.com/spreadsheets/d/1m2CNHJtFKKTFrbgjHXZs8J9oWNGcaKyJzdit25koybg/gviz/tq?tqx=out:csv';
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch data');
        const text = await response.text();
        const parsed = Papa.parse<string[]>(text, { skipEmptyLines: false });
        let rows = parsed.data;

        // Remove trailing empty columns and skip blank rows
        rows = rows.map(row => {
          let trimmed = row.map(cell => (cell || '').trim());
          while (trimmed.length > 0 && !trimmed[trimmed.length - 1]) trimmed.pop();
          return trimmed;
        }).filter(row => row.length > 0 && row.some(cell => cell));

        const teamsParsed: TeamTable[] = [];
        let currentTeam: TeamTable | null = null;

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const hashIdx = row.findIndex(cell => cell && cell.includes('#'));
          if (hashIdx !== -1) {
            if (currentTeam && currentTeam.players.length > 0) teamsParsed.push(currentTeam);
            currentTeam = { teamAndStats: row, players: [] };
            continue;
          }
          if (!currentTeam) continue;
          // Pad or trim player row to match header length
          let playerRow = [...row];
          while (playerRow.length < currentTeam.teamAndStats.length) playerRow.push('');
          if (playerRow.length > currentTeam.teamAndStats.length) playerRow = playerRow.slice(0, currentTeam.teamAndStats.length);
          currentTeam.players.push(playerRow);
        }
        if (currentTeam && currentTeam.players.length > 0) teamsParsed.push(currentTeam);
        setTeams(teamsParsed);
      } catch (error) {
        setTeams([]);
        console.error('ReceptionsModel error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Receptions Model</h1>
      {loading ? (
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading data...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {teams.map((team, idx) => (
            <div key={idx} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b bg-sharpside-green/10">
                <h2 className="text-xl font-semibold text-sharpside-green">{team.teamAndStats[0].replace('#', '').trim()}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {team.teamAndStats.map((col, i) => (
                        <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{i === 0 ? 'Player' : col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {team.players.map((row, idx2) => (
                      <tr key={idx2} className={idx2 % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {row.map((cell, j) => (
                          <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 