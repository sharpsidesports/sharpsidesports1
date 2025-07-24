import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1SNLfSpzs2m13PQO8tb9tyeN9D9sACOcHBJHsAsVy-tA/gviz/tq?tqx=out:csv';

export default function CompletionsPerGame() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        // Hardcoded header
        const hardcodedHeaders = ['Rank','Team','2024','Last 3','Last 1','Home','Away','2023'];
        data = data.map(row => row.map(cell => (cell || '').trim()));
        data = data.map(row => {
          while (row.length > 0 && !row[row.length - 1]) row.pop();
          return row;
        });
        setHeaders(hardcodedHeaders);
        setRows(
          data.slice(1).map(row => {
            const newRow = [...row];
            while (newRow.length < hardcodedHeaders.length) newRow.push('');
            return newRow.slice(0, hardcodedHeaders.length);
          })
        );
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

  // Sorting logic
  const sortedRows = React.useMemo(() => {
    if (sortColumn === null) return rows;
    const isNumeric = rows.every(row => !isNaN(Number(row[sortColumn])));
    const sorted = [...rows].sort((a, b) => {
      const aVal = a[sortColumn] || '';
      const bVal = b[sortColumn] || '';
      if (isNumeric) {
        return (Number(aVal) - Number(bVal)) * (sortDirection === 'asc' ? 1 : -1);
      } else {
        return aVal.localeCompare(bVal, undefined, { numeric: true }) * (sortDirection === 'asc' ? 1 : -1);
      }
    });
    return sorted;
  }, [rows, sortColumn, sortDirection]);

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
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Completions per Game</h1>
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
                      `px-4 py-3 text-center uppercase tracking-wider font-semibold whitespace-nowrap cursor-pointer select-none bg-sharpside-green text-white` +
                      (i === 0 ? ' sticky left-0 z-20 shadow-lg' : '')
                    }
                  >
                    <span className="flex items-center justify-center">
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
                        `px-4 py-3 text-center whitespace-nowrap` +
                        (j === 2 ? ' font-bold bg-white sticky left-0 z-10 shadow-lg' : '')
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
    </div>
  );
} 