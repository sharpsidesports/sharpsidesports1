import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1vu0gSDpZU6oOxiKWJIyeNLYDTLSrxWkJiMtJBnH46PE/gviz/tq?tqx=out:csv';

export default function WRRedzoneStats() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(SHEET_CSV_URL);
        if (!response.ok) throw new Error('Failed to fetch data');
        const text = await response.text();
        const parsed = Papa.parse<string[]>(text, { skipEmptyLines: true });
        let data = parsed.data;
        // Remove empty trailing columns and trim
        data = data.map(row => {
          let trimmed = row.map(cell => (cell || '').trim());
          while (trimmed.length > 0 && !trimmed[trimmed.length - 1]) trimmed.pop();
          return trimmed;
        });
        setHeaders(data[0]);
        setRows(data.slice(1));
        setFilters(new Array(data[0].length).fill(''));
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Find key columns for highlighting
  const playerCol = headers.findIndex(h => h.toLowerCase().includes('player'));
  const tdCol = headers.findIndex(h => h.toLowerCase() === 'td');

  // Filtering logic
  const filteredRows = rows.filter(row =>
    filters.every((filter, colIdx) =>
      !filter || (row[colIdx] && row[colIdx].toLowerCase().includes(filter.toLowerCase()))
    )
  );

  // Sorting logic
  const sortedRows = React.useMemo(() => {
    if (sortColumn === null) return filteredRows;
    const isNumeric = filteredRows.every(row => !isNaN(Number(row[sortColumn])));
    const sorted = [...filteredRows].sort((a, b) => {
      const aVal = a[sortColumn] || '';
      const bVal = b[sortColumn] || '';
      if (isNumeric) {
        return (Number(aVal) - Number(bVal)) * (sortDirection === 'asc' ? 1 : -1);
      } else {
        return aVal.localeCompare(bVal, undefined, { numeric: true }) * (sortDirection === 'asc' ? 1 : -1);
      }
    });
    return sorted;
  }, [filteredRows, sortColumn, sortDirection]);

  const handleFilterChange = (idx: number, value: string) => {
    setFilters(filters => {
      const newFilters = [...filters];
      newFilters[idx] = value;
      return newFilters;
    });
  };

  const handleSort = (colIdx: number) => {
    if (sortColumn === colIdx) {
      setSortDirection(dir => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(colIdx);
      setSortDirection('desc');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Wide Receiver Redzone Stats</h1>
      {loading ? (
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading data...</p>
        </div>
      ) : error ? (
        <div className="p-6 text-center text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full text-sm font-medium">
            <thead className="bg-sharpside-green/90 text-white sticky top-0 z-10">
              <tr>
                {headers.map((col, i) => (
                  <th
                    key={i}
                    onClick={() => handleSort(i)}
                    className={
                      `px-4 py-3 text-left uppercase tracking-wider font-semibold whitespace-nowrap cursor-pointer select-none ` +
                      (i === playerCol ? 'bg-sharpside-green text-white sticky left-0 z-20 shadow-lg' : '') +
                      (i === tdCol ? ' text-green-700' : '')
                    }
                  >
                    <span className="flex items-center">
                      {col}
                      {sortColumn === i && (
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
              {sortedRows.map((row, idx) => (
                <tr
                  key={idx}
                  className={
                    (idx % 2 === 0 ? 'bg-white' : 'bg-gray-50') +
                    ' hover:bg-green-50 transition-colors duration-100'
                  }
                >
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={
                        `px-4 py-3 whitespace-nowrap` +
                        (j === playerCol ? ' font-bold bg-white sticky left-0 z-10 shadow-lg' : '') +
                        (j === tdCol ? ' text-green-700 font-bold' : '')
                      }
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-8 p-4 bg-gray-100 rounded text-gray-700 text-sm border border-gray-200">
        <strong>What are Red Zone Statistics?</strong><br />
        Red zone statistics specifically measure performance on offensive plays that occur inside the opponent’s 20-yard line. This includes all snaps taken from the 20-yard line to the goal line and is used to evaluate a player's efficiency in scoring touchdowns. Red zone metrics exclude plays outside the 20-yard line and are critical indicators of situational effectiveness, decision-making, and execution under pressure.
      </div>
    </div>
  );
} 