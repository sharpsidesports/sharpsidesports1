import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function FantasyProjectionsLanding() {
  // SEO: Update document title and meta tags
  useEffect(() => {
    // Update document title
    document.title = "NFL Fantasy Projections 2024 - ADP Rankings, PPR & Standard League Rankings | SharpSide Sports";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'NFL fantasy projections for 2024 season. View ADP rankings, PPR and standard league projections, player rankings, and fantasy football draft data. Updated with sportsbook projections and real-time draft data.');
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = 'NFL fantasy projections for 2024 season. View ADP rankings, PPR and standard league projections, player rankings, and fantasy football draft data. Updated with sportsbook projections and real-time draft data.';
      document.head.appendChild(newMetaDescription);
    }

    // Add structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "NFL Fantasy Projections 2024",
      "description": "NFL fantasy football projections including ADP rankings, PPR and standard league projections for all positions.",
      "url": window.location.href,
      "mainEntity": {
        "@type": "ItemList",
        "name": "NFL Fantasy Projections Categories",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "QB Projections",
            "url": "/fantasy/qb-projections"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "WR Projections",
            "url": "/fantasy/wr-projections"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "RB Projections",
            "url": "/fantasy/rb-projections"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "TE Projections",
            "url": "/fantasy/te-projections"
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
      { name: 'keywords', content: 'NFL fantasy projections, fantasy football projections, ADP rankings, PPR projections, standard league projections, fantasy draft rankings, fantasy football ADP, player projections, fantasy rankings' },
      { name: 'author', content: 'SharpSide Sports' },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: 'NFL Fantasy Projections 2024 - ADP Rankings, PPR & Standard League Rankings' },
      { property: 'og:description', content: 'NFL fantasy projections for 2024 season. View ADP rankings, PPR and standard league projections, player rankings, and fantasy football draft data.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'NFL Fantasy Projections 2024 - ADP Rankings, PPR & Standard League Rankings' },
      { name: 'twitter:description', content: 'NFL fantasy projections for 2024 season. View ADP rankings, PPR and standard league projections, player rankings, and fantasy football draft data.' }
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
      {/* SEO-optimized header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-sharpside-green mb-4 text-center">
          2024 NFL Fantasy Projections
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          Comprehensive <strong>NFL fantasy projections</strong> for the 2024 season. View detailed <strong>ADP rankings</strong>, 
          <strong>PPR projections</strong>, <strong>standard league projections</strong>, and fantasy football draft data for all positions.
        </p>
        <p className="text-gray-600">
          Updated daily with the latest <strong>fantasy football projections</strong> including current ADP trends, 
          league-specific rankings, and real-time draft data analysis.
      </p>
      </header>

      {/* Position Cards - Moved to top */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link 
          to="/fantasy/qb-projections" 
          className="block bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition p-6 text-center font-semibold text-lg text-sharpside-green hover:bg-green-50"
        >
          <div className="font-bold text-gray-900">QB Projections</div>
        </Link>
        
        <Link 
          to="/fantasy/wr-projections" 
          className="block bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition p-6 text-center font-semibold text-lg text-sharpside-green hover:bg-green-50"
        >
          <div className="font-bold text-gray-900">WR Projections</div>
        </Link>
        
        <Link 
          to="/fantasy/rb-projections" 
          className="block bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition p-6 text-center font-semibold text-lg text-sharpside-green hover:bg-green-50"
        >
          <div className="font-bold text-gray-900">RB Projections</div>
        </Link>
        
        <Link 
          to="/fantasy/te-projections" 
          className="block bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition p-6 text-center font-semibold text-lg text-sharpside-green hover:bg-green-50"
        >
          <div className="font-bold text-gray-900">TE Projections</div>
        </Link>
      </div>

      {/* Methodology Section */}
      <section className="bg-blue-50 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Fantasy Projection Methodology</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 mb-4">
            Our <strong>fantasy projections</strong> combine <strong>sportsbook projections</strong> with <strong>real-time fantasy draft data</strong> 
            to provide the most accurate rankings for your <strong>PPR leagues</strong> and <strong>standard leagues</strong>. 
            We analyze betting odds, player props, and live <strong>ADP data</strong> from major fantasy platforms.
          </p>
          <p className="text-gray-700 mb-4">
            Our <strong>ADP rankings</strong> are updated continuously throughout the draft season, incorporating data from 
            ESPN, Yahoo, CBS, and other major fantasy platforms. We combine this with <strong>sportsbook projections</strong> 
            for passing yards, rushing yards, receptions, and touchdowns to create comprehensive <strong>fantasy football projections</strong>.
          </p>
          <p className="text-gray-700">
            Whether you're drafting in <strong>PPR leagues</strong>, <strong>standard leagues</strong>, or custom scoring formats, 
            our projections account for your league's specific scoring rules and provide actionable insights for your fantasy draft strategy.
          </p>
        </div>
      </section>

      {/* Additional SEO content */}
      <section className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Fantasy Football Projection Guide</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 mb-4">
            Our comprehensive <strong>fantasy projections</strong> database provides detailed analysis for all positions 
            across multiple scoring formats. Whether you're playing in <strong>PPR leagues</strong>, <strong>standard leagues</strong>, 
            or custom scoring formats, we have the projections you need.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>ADP rankings</strong> (Average Draft Position) help you understand where players are being drafted 
            across all major fantasy platforms. Our <strong>fantasy football projections</strong> combine this ADP data 
            with <strong>sportsbook projections</strong> to give you the most accurate rankings for your draft.
          </p>
          <p className="text-gray-700">
            Use these <strong>fantasy projections</strong> for your draft preparation, trade analysis, and weekly lineup decisions. 
            Our rankings are updated continuously throughout the season to reflect the latest <strong>ADP trends</strong> 
            and <strong>sportsbook projections</strong>.
          </p>
        </div>
      </section>
    </div>
  );
} 