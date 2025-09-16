import React, { useEffect } from 'react';

const RecappingNFLBetsWeek2: React.FC = () => {
  useEffect(() => {
    document.title = 'Recapping Our NFL Bets for Week 2: The Good, Bad and Ugly | Sharpside Sports';
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Weekly NFL betting recap from Sharpside Sports covering Week 2 results, model performance, and betting insights including ADOT/YAC models, prop bets, and game analysis.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Weekly NFL betting recap from Sharpside Sports covering Week 2 results, model performance, and betting insights including ADOT/YAC models, prop bets, and game analysis.';
      document.head.appendChild(meta);
    }

    // Add JSON-LD structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": "Recapping Our NFL Bets for Week 2: The Good, Bad and Ugly",
      "description": "Weekly NFL betting recap from Sharpside Sports covering Week 2 results, model performance, and betting insights including ADOT/YAC models, prop bets, and game analysis.",
      "image": "https://ci3.googleusercontent.com/meips/ADKq_NZzX0_JnN_e__FB_vLvQCrZ8663P6Ohv0ZeHhDo8lsJWPTRlo71mUlVrjIbHke4oLBUoQALlONeUfe03F1OoewPHDJcIzOViecszlUOZ224TPgwoRJnw_4jZEaseYWi2_gMIbjgj-fv1JVc4vQ3PX0mc7Y47A=s0-d-e1-ft#https://files.constantcontact.com/f381eaf7701/e37b3648-7249-41a6-be5a-8f2eb2ae17ee.jpg?rdr=true",
      "author": {
        "@type": "Organization",
        "name": "Sharpside Sports"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Sharpside Sports",
        "logo": {
          "@type": "ImageObject",
          "url": "https://ssgolf-vercel-3-924lh7o73-john-abbeys-projects.vercel.app/sharpside-logo.svg"
        }
      },
      "datePublished": "2024-09-17",
      "dateModified": "2024-09-17",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://ssgolf-vercel-3-924lh7o73-john-abbeys-projects.vercel.app/articles/recapping-nfl-bets-week-2"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Recapping Our NFL Bets for Week 2: The Good, Bad and Ugly
          </h1>
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <span>Sharpside Sports</span>
            <span className="mx-2">•</span>
            <span>September 17, 2024</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8">
          <img
            src="https://ci3.googleusercontent.com/meips/ADKq_NZzX0_JnN_e__FB_vLvQCrZ8663P6Ohv0ZeHhDo8lsJWPTRlo71mUlVrjIbHke4oLBUoQALlONeUfe03F1OoewPHDJcIzOViecszlUOZ224TPgwoRJnw_4jZEaseYWi2_gMIbjgj-fv1JVc4vQ3PX0mc7Y47A=s0-d-e1-ft#https://files.constantcontact.com/f381eaf7701/e37b3648-7249-41a6-be5a-8f2eb2ae17ee.jpg?rdr=true"
            alt="NFL Week 2 Betting Recap"
            className="w-full h-auto rounded-lg shadow-lg max-w-2xl mx-auto"
            style={{ imageRendering: 'crisp-edges' }}
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Time to recap my betting week... Every Tuesday, I'll be sending a weekly recap of my betting week, and what it was like for me personally. Whether we ran like god or ran like dogwater, I'll be here breaking down what it was like for the Sharpside Partners. Let's get into it.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            In terms of workload, last week was nuts for me last week. Two partners were on vacation, and my dev who updates the site was unavailable from Wednesday on. Betting is a legit job, and if I do not give it 40+ hours, I feel like I left money on the table. Plus, the new site is a ton of work especially with golf having two great markets last week AND CFB/NFL in full swing.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            I also had to get a ton of fills through bet online because of this as well. I am limited on my main beards account, so had to get slightly worse numbers for majority of all fills this week.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            In the past I would try and squeeze everything in but 1. I'm a dad now and that just isn't possible, and 2. trying to exploit new edges in the past while, working overtime just resulted in negative ROI if I am being honest. So this week I decided to just hone in on what I specialize at, and really try & get it in with the best edges in the markets I know I can beat.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Good:</h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">ADOT/YAC Model:</h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            These two models combined are just on fire. The top 2 plays for both models were Chase and Nabers. That's why we played both straight and hit it in the 100+/110+ parlay for +895. I made a serious adjustment with zone coverage. I was underweighting aDOT in this spot and seriously overestimating how much zone coverage decreases YAC. My past findings from 2015–2020 showed YAC dropped anywhere from 5–15% when going from man to zone. But I have a hypothesis that this isn't the case for top WRs due to the new shell/semi-double looks.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            You also have to factor in that top WRs' deployment is 100x better today than it was even 10 years ago. Slot % is up, presnap motion is up, usage rate is up, etc. I'm not saying we need to fire on every top WR (obviously), but when the model has it 13+ yards off combined with our reception model, it's a green light for sure. JSN was the third-rated WR, and we held off because of the projected low volume in that game. Still had major FOMO seeing my prince put up another 100+ game.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Fannin Jr OVER 3.5 REC:</h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Just a crazy number the market gave us, and I'm relieved it hit, because if it didn't I would've been questioning my top model for the last 3 years. This number should have been 4.5 around -115ish, so a full catch off. Our projected game flow and pass attempts were spot on, as we had Flacco at 41.7 pass attempts. Target share came in lower than projected, but his RR and snap % were close to the actual outcome.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            If the game flow is what the model projects, and the outcome with multiple inputs is vastly different than what you predicted, you've got a problem. If the majority of inputs are accurate, then you've got a good model. All 3 of our major prop models are hitting at an extremely high success rate, not just with bets but also with the inputs, which is a great sign for us and members.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">GA Tech +3:</h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            I hate, hate, hate, betting a game after you miss the move. If you have been with us at all you know this is the case. We rarely bet a side or total after it moves through a key number. Most sharp bettors will tell you the same thing. They do not "follow reverse line movement". If you miss the move, you missed the edge 95% of the time. The reasoning is, you missed the value, typically the number posted is the efficient number, and will be close to what your projected fair value is. This was not the case for Tech.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            For starters, +6 was only posted at super small limits. Once I actually looked at market history I realized +6 was sort of a phantom opener, and wasn't really available for anyone who wanted to get more than $250 down. Secondly, our fair price on this was Tech +2, so there was still value even though it moved through 4. Did we get the best price? No. Did it still have +EV compared to our fair price? Yes. On a day that had little value pregame, I am glad we fired.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Bad:</h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Napa:</h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            I will be happy if I don't see Silverado Resort Course for a while. The base model was ok not great, with Scottie being #1 (obviously) and Griffin ranking 6th. Our implied win % was still lower than the posted odds though. This will be the case for most tournaments where Scottie is less than +225, but Griffin was a miss as he def. should have had value. Matchups were the big whiff this week. We got a combined 35 cents CLV, which can be tough for us to read since we help move these lines, and still had a bad ROI. I am going to chalk it up to variance, as every player we took ranked in the bottom 10 for SGPUTT for that day. Overall a bad tournament.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Unlucky/Lucky:</h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Sellers/USC:</h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Look, I get that it wasn't looking good, but for most live models we use for win prob PLUS the implied odds live still had both of these bets at 55%+ before the injury. The majority of outcomes have this going 1-1 and depending on what hit, we either break even or lose juice. The concussion essentially killed both bets. Injury luck has not been kind to us this year, which makes it even more impressive we've seen the return we have seen so far this football season. Looks like we're heading to the moon once some run good comes our way.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecappingNFLBetsWeek2;
