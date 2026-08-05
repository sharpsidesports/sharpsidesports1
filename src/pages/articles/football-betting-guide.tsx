import { Link } from 'react-router-dom';
import ArticleCTA from '../../components/articles/ArticleCTA.js';
import ChapterCoverImage from '../../components/articles/ChapterCoverImage.js';
import { useArticleSEO } from '../../hooks/useArticleSEO.js';
import { GUIDE_CHAPTERS, GUIDE_HUB_COVER_IMAGE } from './footballGuideChapters.js';

const TITLE = 'The Complete Football Betting Guide: Strategy, Trends, Metrics & Bankroll Management';
const DESCRIPTION =
  "SharpSide Sports' complete football betting guide — basic strategy, profitable trends, advanced metrics, bankroll management, line movement, and betting edges for NFL and CFB.";

export default function FootballBettingGuide() {
  useArticleSEO({
    title: `${TITLE} | SharpSide Sports`,
    headline: TITLE,
    description: DESCRIPTION,
    slug: 'articles/football-betting-guide',
    datePublished: '2026-08-03',
  });

  return (
    <div className="prose mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">{TITLE}</h1>
        <p className="text-lg text-gray-700">{DESCRIPTION}</p>
      </header>

      <ChapterCoverImage coverImage={GUIDE_HUB_COVER_IMAGE} />

      <p>
        Football is king in the U.S. betting market — the NFL and college football markets are the two most liquid
        in the country, which also makes them the two hardest to beat. The highest limits attract the sharpest,
        most sophisticated bettors and syndicate groups in the world, and every dollar they bet on an opener gives
        sportsbooks more information to price the closing number accurately. It's genuinely difficult to win
        long-term betting football. But if you can beat it, it's the most lucrative market available.
      </p>
      <p>
        We've been profitable betting football for 5 years running, and 8 of the last 10 years, and have more than
        tripled our bankroll since 2020. None of that comes from a secret model or algorithm — for the vast
        majority of bettors, no model alone reliably beats the closing NFL or CFB number. It comes from blending a
        real strategic framework, historically profitable situational spots, advanced metrics, and disciplined
        bankroll management, and constantly adapting as the market catches up.
      </p>
      <p>
        This guide is organized into seven chapters, each building on the last. Read them in order if you're new to
        sharp betting concepts, or jump straight to the chapter you need.
      </p>

      <div className="not-prose my-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {GUIDE_CHAPTERS.map((chapter) => (
          <Link
            key={chapter.slug}
            to={`/articles/${chapter.slug}`}
            className="group flex flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-sharpside-green hover:shadow-md"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-sharpside-green">
              Chapter {chapter.chapterNumber}
            </span>
            <span className="mt-1 text-base font-semibold text-gray-900 group-hover:text-sharpside-green">
              {chapter.navTitle}
            </span>
            <span className="mt-2 text-sm text-gray-600">{chapter.description}</span>
          </Link>
        ))}
      </div>

      <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">A Note Before You Start</h2>
      <p>
        There's a stigma in betting circles that "sharp" bettors all think alike, and that syncing up with the
        consensus is the goal. Some ideas in this space genuinely hold up over time — but betting is always
        evolving, and it's okay to challenge the status quo. Some of the best thinkers in any field got there by
        rejecting the conventional approach, not copying it. Keep that in mind as you work through these chapters:
        use them as a real framework, not a rulebook to follow blindly.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">Betting the NFL and CFB Is Tough — That's the Point</h2>
      <p>
        The NFL and college football markets are the most efficient, sharpest, hardest-to-beat markets on the
        planet. That's exactly why beating them is so lucrative when you do. This guide is the framework we use to
        do it — basic strategy, situational trends, advanced metrics, bankroll discipline, market reading, and two
        specific betting edges most bettors never learn.
      </p>

      <ArticleCTA
        heading="Want it done for you instead?"
        body="Every pick in this guide's framework is something we bet ourselves — timestamped and tracked before kickoff, every week of the season. Start a free trial and see what following it in real time looks like."
      />
    </div>
  );
}
