import React, { useEffect } from 'react';

export default function RecappingBetsWeekGoodBadUnlucky() {
  useEffect(() => {
    // Update page title and meta description
    document.title = "Recapping the Bets for Our Week: The Good, the Bad, and the Unlucky | SharpSide Sports";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'A weekly recap of betting performance from the SharpSide Partners team. Breaking down the good, bad, and unlucky wagers from our NFL and CFB betting week.');
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = 'A weekly recap of betting performance from the SharpSide Partners team. Breaking down the good, bad, and unlucky wagers from our NFL and CFB betting week.';
      document.head.appendChild(newMetaDescription);
    }

    // Add structured data for SEO and Google News
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": "Recapping the Bets for Our Week: The Good, the Bad, and the Unlucky",
      "image": [
        "https://files.constantcontact.com/f381eaf7701/21bf6110-5660-4eaf-93e7-8dc73b6384a2.jpg"
      ],
      "datePublished": "2025-09-06T12:00:00-04:00",
      "dateModified": "2025-09-06T12:00:00-04:00",
      "author": [{
        "@type": "Person",
        "name": "SharpSide James",
        "url": "https://sharpsidesports.com"
      }],
      "publisher": {
        "@type": "Organization",
        "name": "SharpSide Sports",
        "logo": {
          "@type": "ImageObject",
          "url": "https://files.constantcontact.com/f381eaf7701/21bf6110-5660-4eaf-93e7-8dc73b6384a2.jpg"
        }
      },
      "mainEntity": {
        "@type": "WebPage",
        "name": "Weekly Betting Recap - The Good, Bad, and Unlucky"
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
          Recapping the Bets for Our Week: The Good, the Bad, and the Unlucky
        </h1>
        <div className="flex items-center space-x-4 text-gray-600 mb-6">
          <span>September 6, 2025</span>
          <span>•</span>
          <span>Betting Recap</span>
          <span>•</span>
          <span>NFL & CFB</span>
        </div>
        <img 
          src="https://files.constantcontact.com/f381eaf7701/21bf6110-5660-4eaf-93e7-8dc73b6384a2.jpg" 
          alt="Weekly betting recap - The good, the bad, and the unlucky"
          className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg "
        />
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-700 leading-relaxed mb-6">
          Most of you (I think) enjoy when we break down wagers, show how we model and get our fair price, and talk about the market and what it's like to depend on betting as a primary source of income.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          So now, every Tuesday, I'll be sending a weekly recap of my betting week, and what it was like for me personally. Whether we ran like gods or ran like dog water, I'll be here breaking down what it was like for the SharpSide Partners. Let's get into it.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          But first... this will literally be one of the best weeks to be on our team all year. NFL, CFB, AND we get 2 awesome PGA betting markets. This will be a high volume week, with high ROI.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8 rounded-r-lg">
          <p className="text-lg text-blue-800 mb-4">
            <strong>Click the link below and use code "JAMES" to get 50% off our weekly All-Access Membership.</strong> Not only will it give you 50% off, but because I am awesome and a nice guy, you will be grandfathered into this price forever. You're welcome.
          </p>
        </div>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          For starters, last week semi-sucked on the personal front. I am a procrastinator at heart when it comes to adult tasks, so naturally I waited till the last minute to file taxes. Withdrawing 5 figures from accounts just to pay Uncle Sam wasn't so fun.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          On top of that, two of my partners who run DK and FD accounts for me were "camping," so filling bets last week was extremely stressful. On the plus side, this is essentially the best time of the year weather-wise for 80% of the US, so drink it in while you can. Ok, let's break down some wagers.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">The Good:</h2>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">Jaxon Smith-Njigba OVER 4.5 REC.</h3>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          We have been JSN truthers since the moment he was drafted. He used to be our low ADOT king his rookie year; now he is a true alpha. The model absolutely smashed this. Our fair price was -239, which is why we were willing to risk to win 4% on -164. Just absolute king shit:
        </p>

        <ul className="list-disc list-inside text-lg text-gray-700 mb-6 space-y-2">
          <li>53% target share</li>
          <li>90% air yardage share</li>
          <li>13.9 ADOT</li>
          <li>29% slot rate (lowest of career)</li>
          <li>124 of 150 Seattle Seahawks receiving yards</li>
        </ul>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          On a projected competitive game flow, this was a no-brainer. In the future, we will be playing yards instead of rec. when we have a high rating on JSN.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">College Football Sides/Totals: 3-1</h3>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          CFB Saturday on the 3rd most liquid market on the planet. CFB has always been a strong suit of ours, but the last 2 years the ROI has been surpassed by NFL. Not like we had bad years, but the profit was just smaller. Early on, the 3 main models we run to get power ratings, final scores, and % of explosive plays (most predictive outlier metric) have been dialed in. Great sign as these only get sharper as the season progresses.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">CeeDee Lamb 70+ REC. Yards</h3>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          We already touched on this, but did the market forget this was borderline the BEST WR in the NFL in 2023?? With a healthy Dak in 2023, he had over 13 YPC in 11 of the 17 games played and had 9 or more targets in 12 of the 17 games played. If you remove the games where they were favored by more than a TD, this % increases to 80%. Obviously, that's not predictive, but an important sample to give you. The rest of the model breakdown is in an email I sent you on Friday.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">The Bad:</h2>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">Brian Thomas Jr OVER 76.5 REC. Yards</h3>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Legit worried for one of our top projected WR. He only had a 43% catchable target rate, ending with a stat line of 1/11/0. I'm not sure if I am more worried about his 28% first read target share or the fact that Mac Jones legit might be a better QB than Lawrence. Sad stuff, to say the least.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          The bright side: It was shitty game flow (JAX was up by 17 for the entire second half), it was a wonky game with the delay, and Coen seems to know how important it is to get this monster involved. Plus, we might see the market go full bear mode on BTJ and get some awesome prices in the future.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">Tyreek Hill OVER 68.5 REC. Yards</h3>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Hand up, I did adjust inputs for the reception model here. Going off priors just did not feel right with Jonnu Smith gone, and let me tell you why. Without Smith, and a healthy Tua, Hill averaged 31% target share and over 10 ADOT. Not like this was a small sample either; we're talking over 18 games. Waller was out, meaning the targets were essentially going to be split up between Hill, Achane, and Waddle. Unfortunately, we got the nut low in terms of game flow. Still think that if Tua doesn't play in the bottom 20% of his range of outcomes, this still goes over. Nut low results in a loss.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">The Unlucky/Lucky:</h2>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">Michael Trigg OVER 51.5 REC. Yards</h3>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          The Baylor tight end had 39 rec. yards heading into halftime in a dream game flow spot, high target share, and a whole half to get 13 yards. He suffered a phantom injury and did not return to the field. Model had it correct; just a brutal outcome. By the way, make a note... Baylor WRs to the MOON in positive game flow situations.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">DJ Moore OVER 56.5 REC. Yards</h3>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          I put this on here because I realize a bunch of our members don't have DK accounts, and more importantly, I did not realize that half our fills from partners were on BO which had the line at 57.5. Thank you, pitchy pitchy woo woo! Rome was the leader in first read target share, which means the models likely will not be high on Moore again unless the market takes a serious turn to the downside. Thanks for your service and the cash, Mr. Moore.
        </p>

        <div className="bg-green-50 border-l-4 border-green-500 p-6 my-8 rounded-r-lg">
          <p className="text-lg text-green-800 mb-4">
            <strong>Overall, a winning week, and football is in full swing.</strong> Plus, we get a beautiful golf market in not one but 2 events this week... in September! Life is good, guys. Talk soon.
          </p>
          <p className="text-green-700 font-semibold">- Sharpside James</p>
        </div>
      </div>
    </article>
  );
}
