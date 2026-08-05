import { Link } from 'react-router-dom';
import ChapterNav from '../../components/articles/ChapterNav.js';
import ChapterCoverImage from '../../components/articles/ChapterCoverImage.js';
import ArticleCTA from '../../components/articles/ArticleCTA.js';
import { useArticleSEO } from '../../hooks/useArticleSEO.js';
import { GUIDE_CHAPTERS } from './footballGuideChapters.js';

const TITLE = 'Live In-Play Betting: How to Find Mispriced NFL Player Props Late in Games';
const DESCRIPTION =
  'Why live player prop pricing algorithms lag game flow late in the 3rd and 4th quarters — and how to find real-money edges while the line catches up.';
const COVER_IMAGE = GUIDE_CHAPTERS.find((c) => c.slug === 'live-in-play-betting-strategy')!.coverImage;

export default function LiveInPlayBettingStrategy() {
  useArticleSEO({
    title: `${TITLE} | SharpSide Sports`,
    headline: TITLE,
    description: DESCRIPTION,
    slug: 'articles/live-in-play-betting-strategy',
    datePublished: '2026-08-03',
  });

  return (
    <div className="prose mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-sharpside-green">
          Football Betting Guide — Chapter 7
        </p>
        <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">{TITLE}</h1>
        <p className="text-lg text-gray-700">{DESCRIPTION}</p>
      </header>

      <ChapterCoverImage coverImage={COVER_IMAGE} />

      <p>
        The NFL betting market is the most efficient market in the world at kickoff — but that doesn't mean every
        market inside the game stays that efficient once it's underway. The explosion of player prop offerings
        means books now have to price and re-price an enormous number of markets in real time, and that creates
        real openings if you know where to look.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">Why Two-Way Live Markets Matter</h2>
      <p>
        Major sportsbooks offer live, in-play lines on most player props, and critically, many of those are{' '}
        <strong>two-way markets</strong> (over/under) rather than one-way markets. A one-way market can be juiced
        up aggressively with little consequence, since there's only one side bettors can take. A two-way market has
        to stay close to what the book's pricing algorithm believes is the efficient number on both sides — which
        means the line itself is a much more honest signal of what the model actually thinks, and a much easier
        target when that model is wrong.
      </p>
      <p>
        The most efficient number in the entire NFL market is the moneyline or spread at kickoff — a point we've
        made repeatedly in this guide (see{' '}
        <Link to="/articles/how-sportsbook-lines-move">Chapter 5</Link>) — because the market has had all week to
        price it. Live markets don't get that luxury. Believe it or not, live pricing algorithms hang bad numbers
        constantly, simply because there's too much ground to cover with too little time to react.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">Where the Edge Actually Lives</h2>
      <p>
        Live player prop pricing runs primarily off the <strong>game clock</strong>, with adjustments layered on
        top — it's not purely situational. That's the crack in the armor: find spots late in the 3rd quarter or
        early in the 4th where the current game flow isn't fully priced in yet.
      </p>

      <div className="my-6 rounded-r-lg border-l-4 border-green-500 bg-green-50 p-6">
        <p className="font-semibold text-gray-900">Example: a buried receiving yards under</p>
        <p className="mt-2 text-gray-700">
          During a recent NFL season, the Bills were blowing out the Seahawks on the road, up 24–3 with about 3:30
          left in the 3rd quarter. Their tight end had 31 yards on the day and had just caught a 12-yard gain on
          the current drive. His full-game receiving yardage line was still sitting at 39.5, priced at roughly a
          56% implied probability to go under — well below our own read of around 70%. Our aDOT model had his
          expected gain on the rest of that drive under 6 yards, meaning the under had real cushion even if he
          caught one more pass. It cashed comfortably, because garbage-time offense (backups, run-heavy play
          calling) was coming regardless of the scoreboard.
        </p>
      </div>

      <div className="my-6 rounded-r-lg border-l-4 border-green-500 bg-green-50 p-6">
        <p className="font-semibold text-gray-900">Example: a buried receiving yards over</p>
        <p className="mt-2 text-gray-700">
          In a different game, the Bengals were tied with the Broncos late in the 3rd quarter after Denver had just
          scored to make it 10–10, with Cincinnati about to get the ball back. Their WR1 — already established as
          the clear top target in our models — had just 27 yards on the day, and his live odds to reach 100+
          receiving yards for the game had drifted out to +600. That was a badly stale price: if Cincinnati scored
          on the drive, it was likely because that WR was producing; overtime had a real (10%+) chance of adding an
          extra possession; and if Cincinnati stalled, a Denver lead could open up garbage-time volume the other
          way. Multiple paths to the same outcome, at a price that hadn't caught up to any of them.
        </p>
      </div>

      <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">The Same Idea Shows Up in Other Sports</h2>
      <p>
        This isn't NFL-specific. A well-known example from the NBA: live pricing algorithms would drop a star
        player's points line the moment he got subbed out at the end of the 1st quarter — say, from 25.5 down to
        21.5 during his four minutes of bench time — and sharp bettors would take the under right before the sub,
        then flip to the over right after, picking up a 3–4 point middle on a single rotation pattern, repeated
        across star players league-wide. Versions of this "benching edge" have shown up in the NHL as well,
        wherever a live pricing model reacts to the clock faster than it reacts to who's actually on the ice or
        floor.
      </p>
      <p>
        The broader lesson: no market is fully efficient at every moment, even inside the most efficient sport in
        the world to bet. If you're only ever betting closing numbers at kickoff, you're leaving an entire category
        of edges — the ones created by fast-moving game flow outpacing a pricing algorithm — completely on the
        table.
      </p>

      <ArticleCTA />
      <ChapterNav currentSlug="live-in-play-betting-strategy" />
    </div>
  );
}
