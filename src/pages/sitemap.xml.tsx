import React from 'react';

const Sitemap: React.FC = () => {
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/</loc>
    <lastmod>2024-08-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Main Pages -->
  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/subscription</loc>
    <lastmod>2024-08-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/subscription-management</loc>
    <lastmod>2024-08-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/terms</loc>
    <lastmod>2024-08-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- NFL Articles (High Priority for SEO) -->
  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/articles/holdouts-performance</loc>
    <lastmod>2024-08-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/articles/best-nfl-betting-spot</loc>
    <lastmod>2024-08-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/articles/wr-highest-upside</loc>
    <lastmod>2024-08-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/articles/nfl-player-massive-year</loc>
    <lastmod>2024-08-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/articles/nfl-win-totals-first-time-coaches</loc>
    <lastmod>2025-09-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/articles/nfl-bets-before-week-1</loc>
  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/articles/recapping-nfl-bets-week-2</loc>
    <lastmod>2025-09-17</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
    <lastmod>2025-09-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- NFL Stats Pages -->
  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/nfl/team-stats</loc>
    <lastmod>2024-08-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/nfl/fantasy-projections</loc>
    <lastmod>2024-08-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/nfl/PassingYardsPerGame</loc>
    <lastmod>2024-08-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/nfl/YardsPerPlay</loc>
    <lastmod>2024-08-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/nfl/PointsPerGame</loc>
    <lastmod>2024-08-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/nfl/RushingYardsPerGame</loc>
    <lastmod>2024-08-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- NFL Fantasy Projections -->
  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/fantasy/QBProjections</loc>
    <lastmod>2024-08-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/fantasy/WRProjections</loc>
    <lastmod>2024-08-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- NFL Tools -->
  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/FantasyOptimizer</loc>
    <lastmod>2024-08-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/MatchupTool</loc>
    <lastmod>2024-08-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Golf Pages -->
  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/Dashboard</loc>
    <lastmod>2024-08-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/AICaddie</loc>
    <lastmod>2024-08-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/CourseFitTool</loc>
    <lastmod>2024-08-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/ExpertInsights</loc>
    <lastmod>2024-08-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- College Football Pages -->
  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/cfb/sp-plus</loc>
    <lastmod>2025-09-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Account Pages -->
  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/Account</loc>
    <lastmod>2024-08-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/Auth</loc>
    <lastmod>2024-08-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>

  <!-- Success Pages -->
  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/CheckoutSuccess</loc>
    <lastmod>2024-08-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>

  <!-- Legacy Golf Articles (Lower Priority) -->
  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/articles/detroit-gc</loc>
    <lastmod>2024-08-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>

  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/articles/john-deere-classic</loc>
    <lastmod>2024-08-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>

  <url>
    <loc>https://ssgolf-vercel-3-17fd4xi5y-john-abbeys-projects.vercel.app/articles/john-deere-classic-betting-picks</loc>
    <lastmod>2024-08-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
</urlset>`;

  return (
    <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '12px' }}>
      {sitemapContent}
    </div>
  );
};

export default Sitemap; 