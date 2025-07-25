import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function TeamStatsLanding() {
  // SEO: Update document title and meta tags
  useEffect(() => {
    // Update document title
    document.title = "NFL Team Stats 2024 - Passing Yards, Rushing Stats, Defense Rankings | SharpSide Sports";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Comprehensive NFL team statistics for 2024 season. View passing yards per game, rushing stats, defensive rankings, yards per play, and complete team performance data. Updated weekly.');
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = 'Comprehensive NFL team statistics for 2024 season. View passing yards per game, rushing stats, defensive rankings, yards per play, and complete team performance data. Updated weekly.';
      document.head.appendChild(newMetaDescription);
    }

    // Add structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "NFL Team Stats 2024",
      "description": "Comprehensive NFL team statistics including passing yards per game, rushing stats, defensive rankings, and yards per play for all 32 teams.",
      "url": window.location.href,
      "mainEntity": {
        "@type": "ItemList",
        "name": "NFL Team Statistics Categories",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Passing Yards per Game",
            "url": "/nfl/passing-yards-per-game"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Rushing Yards per Game",
            "url": "/nfl/rushing-yards-per-game"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Yards per Play",
            "url": "/nfl/yards-per-play"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Points per Game",
            "url": "/nfl/points-per-game"
          },
          {
            "@type": "ListItem",
            "position": 5,
            "name": "Defensive Rankings",
            "url": "/nfl/defense"
          }
        ]
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
      { name: 'keywords', content: 'NFL team stats, passing yards per game, rushing yards per game, yards per play, NFL defense rankings, team statistics 2024, football stats, offensive rankings, defensive stats' },
      { name: 'author', content: 'SharpSide Sports' },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: 'NFL Team Stats 2024 - Complete Team Statistics & Rankings' },
      { property: 'og:description', content: 'View comprehensive NFL team statistics including passing yards per game, rushing stats, defensive rankings, and yards per play for all 32 teams.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'NFL Team Stats 2024 - Complete Team Statistics & Rankings' },
      { name: 'twitter:description', content: 'View comprehensive NFL team statistics including passing yards per game, rushing stats, defensive rankings, and yards per play for all 32 teams.' }
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

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-8">
      {/* SEO-optimized heading structure */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          NFL Team Stats 2024 - Complete Team Statistics & Rankings
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          Comprehensive NFL team statistics for the 2024 season. View detailed passing yards per game, rushing stats, defensive rankings, yards per play, and complete team performance data for all 32 teams.
        </p>
        <p className="text-gray-600">
          Updated weekly with the latest NFL team statistics including offensive and defensive rankings, scoring leaders, and advanced metrics.
        </p>
      </header>
      
      {/* Main Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link 
          to="/nfl/offense" 
          className="block w-full text-center py-4 px-6 bg-sharpside-green text-white rounded-lg hover:bg-green-700 font-semibold text-lg transition-colors shadow-lg"
        >
          Overall Offense Rankings
        </Link>
        <Link 
          to="/nfl/defense" 
          className="block w-full text-center py-4 px-6 bg-sharpside-green text-white rounded-lg hover:bg-green-700 font-semibold text-lg transition-colors shadow-lg"
        >
          Overall Defense Rankings
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Offensive Stats - SEO optimized */}
        <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">NFL Offensive Statistics</h2>
          <div className="space-y-3">
            <Link to="/nfl/points-per-game" className="block text-gray-700 hover:text-sharpside-green">
              Points per Game
            </Link>
            <Link to="/nfl/yards-per-game" className="block text-gray-700 hover:text-sharpside-green">
              Yards per Game
            </Link>
            <Link to="/nfl/yards-per-play" className="block text-gray-700 hover:text-sharpside-green">
              Yards per Play
            </Link>
            <Link to="/nfl/rushing-yards-per-game" className="block text-gray-700 hover:text-sharpside-green">
              Rushing Yards per Game
            </Link>
            <Link to="/nfl/rushing-attempts-per-game" className="block text-gray-700 hover:text-sharpside-green">
              Rushing Attempts per Game
            </Link>
            <Link to="/nfl/passing-yards-per-game" className="block text-gray-700 hover:text-sharpside-green">
              Passing Yards per Game
            </Link>
            <Link to="/nfl/pass-attempts-per-game" className="block text-gray-700 hover:text-sharpside-green">
              Pass Attempts per Game
            </Link>
            <Link to="/nfl/completions-per-game" className="block text-gray-700 hover:text-sharpside-green">
              Completions per Game
            </Link>
            <Link to="/nfl/yards-per-pass-attempt" className="block text-gray-700 hover:text-sharpside-green">
              Yards per Pass Attempt
            </Link>
            <Link to="/nfl/yards-per-completion" className="block text-gray-700 hover:text-sharpside-green">
              Yards per Completion
            </Link>
          </div>
        </div>

        {/* Defensive Stats - SEO optimized */}
        <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">NFL Defensive Statistics</h2>
          <div className="space-y-3">
            <Link to="/nfl/defense/points-per-game" className="block text-gray-700 hover:text-sharpside-green">
              Points Allowed per Game
            </Link>
            <Link to="/nfl/defense/yards-per-game" className="block text-gray-700 hover:text-sharpside-green">
              Yards Allowed per Game
            </Link>
            <Link to="/nfl/defense/yards-per-play" className="block text-gray-700 hover:text-sharpside-green">
              Yards Allowed per Play
            </Link>
            <Link to="/nfl/defense/rushing-yards-per-game" className="block text-gray-700 hover:text-sharpside-green">
              Rushing Yards Allowed
            </Link>
            <Link to="/nfl/defense/rushing-attempts-per-game" className="block text-gray-700 hover:text-sharpside-green">
              Rushing Attempts Allowed
            </Link>
            <Link to="/nfl/defense/passing-yards-per-game" className="block text-gray-700 hover:text-sharpside-green">
              Passing Yards Allowed
            </Link>
            <Link to="/nfl/defense/pass-attempts-per-game" className="block text-gray-700 hover:text-sharpside-green">
              Pass Attempts Allowed
            </Link>
            <Link to="/nfl/defense/completions-per-game" className="block text-gray-700 hover:text-sharpside-green">
              Completions Allowed
            </Link>
            <Link to="/nfl/defense/yards-per-pass-attempt" className="block text-gray-700 hover:text-sharpside-green">
              Yards per Pass Attempt Allowed
            </Link>
            <Link to="/nfl/defense/yards-per-completion" className="block text-gray-700 hover:text-sharpside-green">
              Yards per Completion Allowed
            </Link>
          </div>
        </div>

        {/* Team Overview - SEO optimized */}
        <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">NFL Team Overview & Rankings</h2>
          <div className="space-y-3">
            <Link to="/nfl/offense" className="block text-gray-700 hover:text-sharpside-green">
              Offensive Rankings
            </Link>
            <Link to="/nfl/defense" className="block text-gray-700 hover:text-sharpside-green">
              Defensive Rankings
            </Link>
            <Link to="/nfl/points-per-game" className="block text-gray-700 hover:text-sharpside-green">
              Scoring Leaders
            </Link>
            <Link to="/nfl/defense/points-per-game" className="block text-gray-700 hover:text-sharpside-green">
              Scoring Defense
            </Link>
            <Link to="/nfl/yards-per-game" className="block text-gray-700 hover:text-sharpside-green">
              Total Offense
            </Link>
            <Link to="/nfl/defense/yards-per-game" className="block text-gray-700 hover:text-sharpside-green">
              Total Defense
            </Link>
          </div>
        </div>
      </div>

      {/* Additional SEO content */}
      <section className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">NFL Team Statistics Guide</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 mb-4">
            Our comprehensive NFL team statistics database provides detailed analysis of all 32 teams' performance across offensive and defensive categories. 
            Whether you're looking for <strong>passing yards per game</strong>, <strong>rushing statistics</strong>, <strong>defensive rankings</strong>, 
            or <strong>yards per play</strong> metrics, we have the data you need.
          </p>
          <p className="text-gray-700 mb-4">
            Key statistics include <strong>NFL team stats</strong> for scoring offense and defense, total yards gained and allowed, 
            rushing and passing efficiency metrics, and advanced analytics like yards per play and completion percentages. 
            All data is updated weekly throughout the NFL season.
          </p>
          <p className="text-gray-700">
            Use these statistics for fantasy football research, sports betting analysis, or general NFL team performance evaluation. 
            Our rankings help identify the best offensive and defensive teams in the league across multiple statistical categories.
          </p>
        </div>
      </section>
    </div>
  );
} 