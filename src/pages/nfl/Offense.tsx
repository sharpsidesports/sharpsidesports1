import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Papa from 'papaparse';

// Define the Google Sheet URLs for each stat
const SHEET_URLS = {
  ppg: 'https://docs.google.com/spreadsheets/d/1FTkFtYLTfmiHaRtxynd0RvKjWLBUqpBaeziesOWcKQA/gviz/tq?tqx=out:csv',
  ypg: 'https://docs.google.com/spreadsheets/d/1jiAtbezZcYMXSJpQQVpquNS97s9cz4R5UBTM3talN80/gviz/tq?tqx=out:csv',
  ypp: 'https://docs.google.com/spreadsheets/d/1GBFBqJUj_XdT2yiabRKqrYb5qKtXLOaFhh8EG2QiyAg/gviz/tq?tqx=out:csv&gid=1231597821',
  rushAtt: 'https://docs.google.com/spreadsheets/d/1PJzd0KAdk__jO9kK8QnLAdiXdDck9hxwadTngRu-8MQ/gviz/tq?tqx=out:csv',
  rushYds: 'https://docs.google.com/spreadsheets/d/1aj8fCdMtOk6b5X7RpqhU3J3ci_AO-GSf0-dOPZbP9DM/gviz/tq?tqx=out:csv',
  passAtt: 'https://docs.google.com/spreadsheets/d/1YKqdoOCCcuYtpHKs3fP9gGw_3fXCHJVDkwZ4R9UJ6sw/gviz/tq?tqx=out:csv',
  comp: 'https://docs.google.com/spreadsheets/d/1SNLfSpzs2m13PQO8tb9tyeN9D9sACOcHBJHsAsVy-tA/gviz/tq?tqx=out:csv',
  ypa: 'https://docs.google.com/spreadsheets/d/1wXJvJmUMnOUZLhX5EmPNUs6GgoQcKXU2zdxl78dhFHc/gviz/tq?tqx=out:csv',
  ypc: 'https://docs.google.com/spreadsheets/d/16i0MlJbszQdNt93Vch1HBK03YWgNOPKhFbGRG7w0zvQ/gviz/tq?tqx=out:csv',
  passYds: 'https://docs.google.com/spreadsheets/d/1HuRTl2Jr6P1ukAsUtuqZltEU41DtMFgNOPhka7zfQWs/gviz/tq?tqx=out:csv',
};

// Add a type for the offense stats with an index signature
interface OffenseStats {
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

const offenseHeaders = [
  { label: "Team", key: "team" },
  { label: "PPG", key: "ppg" },
  { label: "Yds/G", key: "ypg" },
  { label: "Yds/Play", key: "ypp" },
  { label: "Rush Att/G", key: "rushAtt" },
  { label: "Rush Yds/G", key: "rushYds" },
  { label: "Pass Att/G", key: "passAtt" },
  { label: "Comp/G", key: "comp" },
  { label: "Yds/Pass Att", key: "ypa" },
  { label: "Yds/Comp", key: "ypc" },
  { label: "Pass Yds/G", key: "passYds" },
];

const offenseStatLinks = [
  { label: "Points per Game", url: "/nfl/points-per-game" },
  { label: "Yards per Game", url: "/nfl/yards-per-game" },
  { label: "Yards per Play", url: "/nfl/yards-per-play" },
  { label: "Rushing Attempts per Game", url: "/nfl/rushing-attempts-per-game" },
  { label: "Rushing Yards per Game", url: "/nfl/rushing-yards-per-game" },
  { label: "Pass Attempts per Game", url: "/nfl/pass-attempts-per-game" },
  { label: "Completions per Game", url: "/nfl/completions-per-game" },
  { label: "Yards per Pass Attempt", url: "/nfl/yards-per-pass-attempt" },
  { label: "Yards per Completion", url: "/nfl/yards-per-completion" },
  { label: "Passing Yards per Game", url: "/nfl/passing-yards-per-game" },
];

export default function NFLTeamOffenseStatsPage() {
  const [offenseStats, setOffenseStats] = useState<OffenseStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string>('ppg');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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
      const mergedStats: OffenseStats[] = Array.from(allTeams).map(team => {
        const stats: OffenseStats = { team } as OffenseStats;
        
        results.forEach((teamStats, index) => {
          const statKey = statKeys[index];
          stats[statKey] = teamStats.get(team) || 0;
        });
        
        return stats;
      });
      
      setOffenseStats(mergedStats);
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
    return [...offenseStats].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * (sortDirection === 'asc' ? 1 : -1);
      } else if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * (sortDirection === 'asc' ? 1 : -1);
      }
      return 0;
    });
  }, [offenseStats, sortColumn, sortDirection]);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(dir => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(columnKey);
      setSortDirection('desc');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">NFL Team Offense Stats</h1>
      
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
                {offenseHeaders.map((col, i) => (
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
                  {offenseHeaders.map((col, i) => (
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Individual Stat Pages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {offenseStatLinks.map(stat =>
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