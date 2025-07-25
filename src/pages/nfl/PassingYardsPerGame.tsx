import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1HuRTl2Jr6P1ukAsUtuqZltEU41DtMFgNOPhka7zfQWs/gviz/tq?tqx=out:csv';

export default function PassingYardsPerGame() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // SEO: Update document title and meta tags
  useEffect(() => {
    // Update document title
    document.title = "NFL Passing Yards per Game 2024 - Team Passing Statistics & Rankings | SharpSide Sports";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'NFL passing yards per game statistics for 2024 season. View team passing rankings, passing yards per game leaders, and complete passing statistics for all 32 NFL teams. Updated weekly.');
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = 'NFL passing yards per game statistics for 2024 season. View team passing rankings, passing yards per game leaders, and complete passing statistics for all 32 NFL teams. Updated weekly.';
      document.head.appendChild(newMetaDescription);
    }

    // Add structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "NFL Passing Yards per Game 2024",
      "description": "NFL team passing yards per game statistics and rankings for the 2024 season. View passing leaders and complete passing statistics.",
      "url": window.location.href,
      "mainEntity": {
        "@type": "Dataset",
        "name": "NFL Passing Yards per Game Statistics",
        "description": "Comprehensive passing yards per game statistics for all NFL teams",
        "variableMeasured": "Passing Yards per Game",
        "temporalCoverage": "2024 NFL Season"
      }
    };

    // Remove existing structured data if present
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Add additional meta tags for SEO
    const metaTags = [
      { name: 'keywords', content: 'NFL passing yards per game, passing yards per game 2024, NFL passing stats, team passing rankings, passing yards leaders, NFL passing statistics, football passing stats' },
      { name: 'author', content: 'SharpSide Sports' },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: 'NFL Passing Yards per Game 2024 - Team Passing Statistics & Rankings' },
      { property: 'og:description', content: 'NFL passing yards per game statistics for 2024 season. View team passing rankings, passing yards per game leaders, and complete passing statistics for all 32 NFL teams.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'NFL Passing Yards per Game 2024 - Team Passing Statistics & Rankings' },
      { name: 'twitter:description', content: 'NFL passing yards per game statistics for 2024 season. View team passing rankings, passing yards per game leaders, and complete passing statistics for all 32 NFL teams.' }
    ];

    metaTags.forEach(tag => {
      const existingTag = document.querySelector(`meta[${tag.name ? 'name' : 'property'}="${tag.name || tag.property}"]`);
      if (existingTag) {
        existingTag.setAttribute('content', tag.content);
      } else {
        const newTag = document.createElement('meta');
        if (tag.name) newTag.name = tag.name;
        if (tag.property) newTag.setAttribute('property', tag.property);
        newTag.content = tag.content;
        document.head.appendChild(newTag);
      }
    });

    return () => {
      // Cleanup: restore original title when component unmounts
      document.title = 'sharpside golf';
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
        let data = parsed.data;
        // Hardcoded header
        const hardcodedHeaders = ['Rank','Team','2024','Last 3','Last 1','Home','Away','2023'];
        data = data.map(row => row.map(cell => (cell || '').trim()));
        // Find the first non-empty row as the header
        const headerRowIdx = data.findIndex(row => row.includes('Team') && row.includes('2024'));
        if (headerRowIdx === -1) {
          setError('Header row not found');
          setLoading(false);
          return;
        }
        // Use only the rows after the header row
        const dataRows = data.slice(headerRowIdx + 1).filter(row => row.some(cell => cell && cell.trim() !== ''));
        // Pad or trim each row to match header length
        const formattedRows = dataRows.map(row => {
          const newRow = [...row];
          while (newRow.length < hardcodedHeaders.length) newRow.push('');
          return newRow.slice(0, hardcodedHeaders.length);
        });
        setHeaders(hardcodedHeaders);
        setRows(formattedRows);
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
      {/* SEO-optimized header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          NFL Passing Yards per Game 2024 - Team Passing Statistics & Rankings
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          Comprehensive <strong>NFL passing yards per game</strong> statistics for the 2024 season. View detailed team passing rankings, 
          passing yards per game leaders, and complete passing statistics for all 32 NFL teams.
        </p>
        <p className="text-gray-600">
          Updated weekly with the latest <strong>NFL passing stats</strong> including current season totals, recent performance trends, 
          home and away splits, and historical comparisons.
        </p>
      </header>

      {loading ? (
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading passing yards per game data...</p>
        </div>
      ) : error ? (
        <div className="p-6 text-center text-red-600">{error}</div>
      ) : (
        <>
          {/* SEO-optimized table */}
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

          {/* Additional SEO content */}
          <section className="mt-12 bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">NFL Passing Yards per Game Analysis</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                Our comprehensive <strong>NFL passing yards per game</strong> database provides detailed analysis of all 32 teams' 
                passing performance throughout the 2024 season. This metric is crucial for understanding team offensive strategies, 
                quarterback performance, and overall offensive efficiency.
              </p>
              <p className="text-gray-700 mb-4">
                The <strong>passing yards per game</strong> statistic measures the average number of passing yards a team gains per game. 
                This includes all passing plays, whether they result in completions or incompletions. Teams with higher passing yards per game 
                typically have more explosive offenses and better quarterback play.
              </p>
              <p className="text-gray-700">
                Use these <strong>NFL passing stats</strong> for fantasy football research, sports betting analysis, or general team performance evaluation. 
                Our rankings help identify the most effective passing offenses in the league and track performance trends throughout the season.
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
} 