import React, { useEffect } from 'react';

export default function NFLWinTotalsFirstTimeCoaches() {
  // SEO: Update document title and meta tags
  useEffect(() => {
    document.title = "Target These NFL Teams To Go Over Their Win Total - First Time Head Coaches | SharpSide Sports";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover which NFL teams to target for going over their win totals. First-time head coaches with offensive backgrounds have a 54% success rate. Learn about Ben Johnson (Bears), Kellen Moore (Saints), and Liam Coen (Jaguars).');
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = 'Discover which NFL teams to target for going over their win totals. First-time head coaches with offensive backgrounds have a 54% success rate. Learn about Ben Johnson (Bears), Kellen Moore (Saints), and Liam Coen (Jaguars).';
      document.head.appendChild(newMetaDescription);
    }

    // Add structured data for SEO and Google News
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": "Target These NFL Teams To Go Over Their Win Total",
      "image": [
        "https://files.constantcontact.com/f381eaf7701/21bf6110-5660-4eaf-93e7-8dc73b6384a2.jpg"
      ],
      "datePublished": "2025-09-02T12:00:00-04:00",
      "dateModified": "2025-09-02T12:00:00-04:00",
      "author": [{
        "@type": "Person",
        "name": "SharpSide Sports",
        "url": "https://sharpsidesports.com"
      }],
      "publisher": {
        "@type": "Organization",
        "name": "SharpSide Sports",
        "logo": {
          "@type": "ImageObject",
          "url": "https://sharpsidesports.com/sharpside-logo.svg"
        }
      },
      "mainEntity": {
        "@type": "WebPage",
        "name": "NFL Win Totals - First Time Head Coaches Analysis"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Target These NFL Teams To Go Over Their Win Total
        </h1>
        <div className="flex items-center space-x-4 text-gray-600 mb-6">
          <span>September 2, 2025</span>
          <span>•</span>
          <span>NFL Betting</span>
          <span>•</span>
          <span>Win Totals</span>
        </div>
        <img 
          src="https://files.constantcontact.com/f381eaf7701/21bf6110-5660-4eaf-93e7-8dc73b6384a2.jpg" 
          alt="NFL teams to target for going over win totals - first time head coaches analysis"
          className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-700 leading-relaxed mb-6">
          There is a notion out there that you should "fade" first time head coaches. This could not be further from the truth.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          In fact, you should actively look to back these coaches when it comes to season long win totals.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8 rounded-r-lg">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">The Numbers Don't Lie</h2>
          <p className="text-lg text-blue-800 mb-4">
            Coaches making their NFL head coaching debut are <strong>53-39-6 O/U</strong> when looking at the closing line for preseason win totals.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">54%</div>
              <div className="text-blue-800">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">+0.4</div>
              <div className="text-blue-800">Average Margin</div>
            </div>
          </div>
        </div>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          But let's take it one step further.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          If the coach is coming directly from an "offensive" background they are even more profitable.
        </p>

        <div className="bg-green-50 border-l-4 border-green-500 p-6 my-8 rounded-r-lg">
          <h2 className="text-2xl font-bold text-green-900 mb-4">Offensive Background = Success</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-green-800 font-semibold">Offensive Coordinators:</span>
              <span className="text-green-900 font-bold">25-11-3</span>
            </div>
            <div className="text-green-700 text-sm">
              Clearing their preseason win totals by an average of <strong>+0.7 wins</strong>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-green-800 font-semibold">Offensive Assistants:</span>
              <span className="text-green-900 font-bold">4-1-1</span>
            </div>
            <div className="text-green-700 text-sm">
              Clearing their preseason win totals by an average of <strong>+2.0 wins</strong>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-green-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">29-12-4</div>
              <div className="text-green-800">Overall Record Since 2003</div>
              <div className="text-green-700 text-sm mt-1">A massive edge with a decent sample size</div>
            </div>
          </div>
        </div>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          So who are these coaches?
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          The coaches that fit this mold are:
        </p>

        {/* Coach Profiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          {/* Ben Johnson - Bears */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-orange-900 mb-2">Ben Johnson</h3>
            <div className="text-orange-800 font-semibold mb-2">Chicago Bears</div>
            <div className="text-orange-700 text-sm">
              Former Detroit Lions offensive coordinator who led one of the NFL's most explosive offenses
            </div>
            <div className="mt-3 text-orange-600 text-xs">
              <strong>Background:</strong> Offensive Coordinator
            </div>
          </div>

          {/* Kellen Moore - Saints */}
          <div className="bg-gold-50 border border-gold-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gold-900 mb-2">Kellen Moore</h3>
            <div className="text-gold-800 font-semibold mb-2">New Orleans Saints</div>
            <div className="text-gold-700 text-sm">
              Former Dallas Cowboys offensive coordinator with proven success in developing quarterbacks
            </div>
            <div className="mt-3 text-gold-600 text-xs">
              <strong>Background:</strong> Offensive Coordinator
            </div>
          </div>

          {/* Liam Coen - Jaguars */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-teal-900 mb-2">Liam Coen</h3>
            <div className="text-teal-800 font-semibold mb-2">Jacksonville Jaguars</div>
            <div className="text-teal-700 text-sm">
              Former Los Angeles Rams offensive coordinator with Super Bowl experience
            </div>
            <div className="mt-3 text-teal-600 text-xs">
              <strong>Background:</strong> Offensive Coordinator
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gray-900 text-white p-8 rounded-lg text-center my-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Profit?</h2>
          <p className="text-gray-300 mb-6">
            Target these teams for their win totals, and again thank us in January.
          </p>
          <div className="text-sm text-gray-400">
            <strong>Key Takeaway:</strong> First-time head coaches with offensive backgrounds have historically outperformed their preseason win total projections by an average of +0.7 wins.
          </div>
        </div>

        {/* SEO Keywords Section */}
        <div className="bg-gray-50 p-6 rounded-lg my-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Related Topics:</h3>
          <div className="flex flex-wrap gap-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">NFL Win Totals</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Chicago Bears</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">First Time Head Coaches</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">NFL Betting</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Ben Johnson</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Kellen Moore</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Liam Coen</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">NFL Season Predictions</span>
          </div>
        </div>
      </div>
    </article>
  );
} 