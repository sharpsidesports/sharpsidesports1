import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Papa from 'papaparse';

// Define the Google Sheet URLs for each defensive stat
// Note: These are placeholder URLs - you'll need to provide the actual defensive stat sheet URLs
const SHEET_URLS = {
  ppg: 'https://docs.google.com/spreadsheets/d/1XaNV0jZIckbAJdlsesNYMkGHz_MDiYpsCr6h1-09Neo/gviz/tq?tqx=out:csv', // Points Per Game Allowed
  ypg: 'https://docs.google.com/spreadsheets/d/1HgZyriKIkP4liKBg7TsQdhk4QS5y5z3eRA6B6aQ6pNc/gviz/tq?tqx=out:csv', // Yards Per Game Allowed
  ypp: 'https://docs.google.com/spreadsheets/d/1a2SoBZ2qBluQkWEVt9B-noskRdjSGd_QOKwzhTU8SIg/gviz/tq?tqx=out:csv', // Yards Per Play Allowed
  rushAtt: 'https://docs.google.com/spreadsheets/d/1bcq0JdSUqaPd8Ylz7wAoCkxY6SO7yJA5J8IJXjgWk1k/gviz/tq?tqx=out:csv', // Rushing Attempts Allowed Per Game
  rushYds: 'https://docs.google.com/spreadsheets/d/1fnP2VEmDJKIA29Lgn1q5HgjD9DiN6mCQcare27EElIo/gviz/tq?tqx=out:csv', // Rushing Yards Allowed Per Game
  passAtt: 'https://docs.google.com/spreadsheets/d/1ouZ5jiMMqU68vPP7iNOy8MePtizLFVW6ufsoWD2Xe94/gviz/tq?tqx=out:csv', // Pass Attempts Allowed Per Game
  comp: 'https://docs.google.com/spreadsheets/d/1_ycL4DDRZrStH50pqSr_iPJ-GVqKACBgMZR7utJ_GeI/gviz/tq?tqx=out:csv', // Completions Allowed Per Game
  ypa: 'https://docs.google.com/spreadsheets/d/1UeJvN8loAvvo-HSfxQySUit1c-tEservRbxvtvOx_iU/gviz/tq?tqx=out:csv', // Yards Per Pass Attempt Allowed
  ypc: 'https://docs.google.com/spreadsheets/d/1zds7XCyf91uy6vBudxb6tRribPm-JbtorCxavOZD488/gviz/tq?tqx=out:csv', // Yards Per Completion Allowed
  passYds: 'https://docs.google.com/spreadsheets/d/1fMlA3mpS6Wbu_Kq05GIiAOEGePE6s5t8z3fUsMzAaPs/gviz/tq?tqx=out:csv', // Passing Yards Allowed Per Game
};

// Add a type for the defensive stats with an index signature
interface DefenseStats {
  team: string;
  ppg: number;
  ypg: number;
  ypp: number;
  rushAtt: number;
  rushYds: number;
  passAtt: number;
  comp: number;
  ypa: number;
  ypc: number;
  passYds: number;
  [key: string]: string | number; // index signature for dynamic access
}

const defenseHeaders = [
  { label: "Team", key: "team" },
  { label: "PPG Allowed", key: "ppg" },
  { label: "Yds/G Allowed", key: "ypg" },
  { label: "Yds/Play Allowed", key: "ypp" },
  { label: "Rush Att/G Allowed", key: "rushAtt" },
  { label: "Rush Yds/G Allowed", key: "rushYds" },
  { label: "Pass Att/G Allowed", key: "passAtt" },
  { label: "Comp/G Allowed", key: "comp" },
  { label: "Yds/Pass Att Allowed", key: "ypa" },
  { label: "Yds/Comp Allowed", key: "ypc" },
  { label: "Pass Yds/G Allowed", key: "passYds" },
];

const defenseStatLinks = [
  { label: "Points per Game Allowed", url: "/nfl/defense/points-per-game" },
  { label: "Yards per Game Allowed", url: "/nfl/defense/yards-per-game" },
  { label: "Yards per Play Allowed", url: "/nfl/defense/yards-per-play" },
  { label: "Rushing Attempts per Game Allowed", url: "/nfl/defense/rushing-attempts-per-game" },
  { label: "Rushing Yards per Game Allowed", url: "/nfl/defense/rushing-yards-per-game" },
  { label: "Pass Attempts per Game Allowed", url: "/nfl/defense/pass-attempts-per-game" },
  { label: "Completions per Game Allowed", url: "/nfl/defense/completions-per-game" },
  { label: "Yards per Pass Attempt Allowed", url: "/nfl/defense/yards-per-pass-attempt" },
  { label: "Yards per Completion Allowed", url: "/nfl/defense/yards-per-completion" },
  { label: "Passing Yards per Game Allowed", url: "/nfl/defense/passing-yards-per-game" },
];

export default function NFLTeamDefenseStatsPage() {
  const [defenseStats, setDefenseStats] = useState<DefenseStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string>('ppg');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc'); // Default to ascending for defensive stats (lower is better)

  // Function to fetch and parse a single Google Sheet
  const fetchSheetData = async (url: string, statKey: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${statKey} data`);
      const text = await response.text();
      const parsed = Papa.parse<string[]>(text, { skipEmptyLines: true });
      let data = parsed.data;
      
      // Find the header row dynamically
      const headerRowIdx = data.findIndex(
        row => row.includes('Team') && row.includes('2024')
      );
      if (headerRowIdx === -1) throw new Error(`Header row not found for ${statKey}`);
      
      // Extract team names and 2024 stats
      const dataRows = data.slice(headerRowIdx + 1).filter(row => row.some(cell => cell && cell.trim() !== ''));
      const teamStats = new Map<string, number>();
      
      dataRows.forEach(row => {
        if (row.length >= 3) { // Ensure we have Team and 2024 columns
          const team = row[1]?.trim(); // Team column
          const statValue = row[2]?.trim(); // 2024 column
          if (team && statValue && !isNaN(Number(statValue))) {
            teamStats.set(team, Number(statValue));
          }
        }
      });
      
      return teamStats;
    } catch (err: any) {
      console.error(`Error fetching ${statKey}:`, err);
      return new Map<string, number>();
    }
  };

  // Function to fetch all sheets and merge data
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all sheets in parallel
      const promises = Object.entries(SHEET_URLS).map(([statKey, url]) => 
        fetchSheetData(url, statKey)
      );
      
      const results = await Promise.all(promises);
      const statKeys = Object.keys(SHEET_URLS);
      
      // Get all unique team names from all sheets
      const allTeams = new Set<string>();
      results.forEach(teamStats => {
        teamStats.forEach((_, team) => allTeams.add(team));
      });
      
      // Merge data by team
      const mergedStats: DefenseStats[] = Array.from(allTeams).map(team => {
        const stats: DefenseStats = { team } as DefenseStats;
        
        results.forEach((teamStats, index) => {
          const statKey = statKeys[index];
          stats[statKey] = teamStats.get(team) || 0;
        });
        
        return stats;
      });
      
      setDefenseStats(mergedStats);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  // Sorting logic
  const sortedStats = React.useMemo(() => {
    return [...defenseStats].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * (sortDirection === 'asc' ? 1 : -1);
      } else if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * (sortDirection === 'asc' ? 1 : -1);
      }
      return 0;
    });
  }, [defenseStats, sortColumn, sortDirection]);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(dir => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc'); // Default to ascending for defensive stats (lower is better)
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">NFL Team Defense Stats</h1>
      
      {loading ? (
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading live data...</p>
        </div>
      ) : error ? (
        <div className="p-6 text-center text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full text-sm font-medium">
            <thead className="bg-sharpside-green/90 text-white sticky top-0 z-10">
              <tr>
                {defenseHeaders.map((col, i) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={
                      "px-4 py-3 text-left uppercase tracking-wider font-semibold whitespace-nowrap cursor-pointer select-none " +
                      (i === 0
                        ? "bg-sharpside-green text-white sticky left-0 z-20 shadow-lg"
                        : i === 1
                        ? "text-green-700"
                        : "")
                    }
                  >
                    <span className="flex items-center">
                      {col.label}
                      {sortColumn === col.key && (
                        <span className="ml-1 text-xs">
                          {sortDirection === 'asc' ? '▲' : '▼'}
                        </span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedStats.map((team, idx) => (
                <tr
                  key={team.team}
                  className={
                    (idx % 2 === 0 ? "bg-white" : "bg-gray-50") +
                    " hover:bg-green-50 transition-colors duration-100"
                  }
                >
                  {defenseHeaders.map((col, i) => (
                    <td
                      key={col.key}
                      className={
                        "px-4 py-3 whitespace-nowrap" +
                        (i === 0
                          ? " font-bold bg-white sticky left-0 z-10 shadow-lg"
                          : i === 1
                          ? " text-green-700 font-bold"
                          : "")
                      }
                    >
                      {typeof team[col.key] === 'number' 
                        ? Number(team[col.key]).toFixed(1)
                        : team[col.key]
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Individual Defensive Stat Pages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {defenseStatLinks.map(stat =>
            stat.url.startsWith("/") ? (
              <Link
                key={stat.label}
                to={stat.url}
                className="block bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition p-6 text-lg font-semibold text-center text-green-700 hover:bg-green-50 cursor-pointer"
              >
                {stat.label}
              </Link>
            ) : (
              <a
                key={stat.label}
                href={stat.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition p-6 text-lg font-semibold text-center text-green-700 hover:bg-green-50 cursor-pointer"
              >
                {stat.label}
              </a>
            )
          )}
        </div>
      </div>
    </div>
  );
} 