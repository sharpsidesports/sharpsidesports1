import React from 'react';
import ArticleTemplate from './ArticleTemplate.js';

export default function JohnDeereClassicArticle() {
  return (
    <ArticleTemplate
      title="Prepare for a Birdie-fest at the John Deere Classic"
      imageUrl="https://res.cloudinary.com/pgatour-prod/image/fetch/h_900,w_1600,c_fit/https://cf-images.us-east-1.prod.boltdns.net/v1/static/6082840763001/6ed812d1-8978-4e31-acb7-67ea7c076ec3/2215803e-c738-492c-bc20-64eaa0a1f3c1/1600x900/match/image.jpg"
      imageAlt="John Deere Classic Visual"
    >
      <p className="mb-4">
        We've said it before, and we'll say it again — get ready for another birdie fest at the John Deere Classic.
      </p>
      <p className="mb-4">
        Six straight editions have finished at -20 or better, and Davis Thompson torched the field last year with a runaway win at -28.
      </p>
      <p className="mb-4">
        TPC Deere Run plays like a resort course, and even with one of the weakest fields of the season, it continues to get dismantled. It ranks:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>8th easiest course to gain strokes on approach</li>
        <li>6th easiest on approach shots under 150 yards</li>
        <li>4th lowest scoring average over the last five years</li>
      </ul>
      <p className="mb-4">
        To contend, you have to go low. Birdies or Better (BoB) has been predictive here — both Davis Thompson and Sepp Straka were top 15 in BoB gained over their last 24 rounds entering the week when they won.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">Players to Watch</h2>
      <div className="mb-6">
        <p className="mb-2">
          <span className="font-bold">Keith Mitchell:</span> Ranks top 10 in both Birdie or Better and total eagles — two stats that matter more than ever at a course like TPC Deere Run. He's long off the tee, aggressive with wedges, and thrives in low-scoring conditions. Last week's missed cut looks like an outlier, not a trend. Over the past three months, he's posted four top-18 finishes, including a runner-up and a T-7 where he held the 54-hole lead. When the putter cooperates, he's proven he can be in the mix on Sunday.
        </p>
        <p>
          <span className="font-bold">Ben Griffin:</span> The betting favorite — and rightfully so. He's one of the hottest players on Tour, coming in with six straight top-13 finishes, including a win and a runner-up. He leads the field in total eagles, ranks 2nd in Birdie or Better, and his wedge game has been dialed in. Deere Run sets up perfectly for his skillset: accurate off the tee, aggressive into short approaches, and capable of stringing birdies in bunches. Expect him to be a serious factor down the stretch.
        </p>
      </div>
    </ArticleTemplate>
  );
} 