import { Link } from 'react-router-dom';
import ChapterNav from '../../components/articles/ChapterNav.js';
import ChapterCoverImage from '../../components/articles/ChapterCoverImage.js';
import ArticleCTA from '../../components/articles/ArticleCTA.js';
import { useArticleSEO } from '../../hooks/useArticleSEO.js';
import { GUIDE_CHAPTERS } from './footballGuideChapters.js';

const TITLE = 'The Uncorrelated Parlay Edge: Exploiting NFL Player Prop Pricing';
const DESCRIPTION =
  'Why correlated same-game parlays stopped paying off, and how pairing uncorrelated player prop outcomes can still produce a real, exploitable edge.';
const COVER_IMAGE = GUIDE_CHAPTERS.find((c) => c.slug === 'uncorrelated-parlays-nfl-betting-edge')!.coverImage;

export default function UncorrelatedParlaysNflBettingEdge() {
  useArticleSEO({
    title: `${TITLE} | SharpSide Sports`,
    headline: TITLE,
    description: DESCRIPTION,
    slug: 'articles/uncorrelated-parlays-nfl-betting-edge',
    datePublished: '2026-08-03',
  });

  return (
    <div className="prose mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-sharpside-green">
          Football Betting Guide — Chapter 6
        </p>
        <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">{TITLE}</h1>
        <p className="text-lg text-gray-700">{DESCRIPTION}</p>
      </header>

      <ChapterCoverImage coverImage={COVER_IMAGE} />

      <p>
        We already covered what an edge is and why constantly hunting for one matters (see{' '}
        <Link to="/articles/football-betting-basic-strategy">Chapter 1</Link>). Edges don't only live in a
        mispriced side or total — they show up in derivative markets too, wherever the book is pricing a
        combination of outcomes less carefully than the individual legs that make it up. This chapter covers one
        we still use today. It's been discussed publicly and posted widely on social media, so we're comfortable
        sharing the full mechanics.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">How Correlated Same-Game Parlays Got Nerfed</h2>
      <p>
        When Same Game Parlays (SGPs) first launched, they were the wild west. Implied probability on a combined
        correlated parlay was frequently far higher than the actual payout implied — pure value. Early on, you
        could parlay heavily correlated outcomes together and see almost no drop-off in true odds. A classic
        example from that era:
      </p>
      <ul className="my-4 list-disc space-y-2 pl-6">
        <li>QB throws for 300+ passing yards</li>
        <li>His top WR gets 100+ receiving yards</li>
        <li>The team's total lands over 24.5</li>
      </ul>
      <p>
        All three outcomes are tightly correlated — if the QB throws for 300+, the WR is likely clearing 100+, and
        a productive passing game like that usually pushes the team total over. That combination was a real,
        exploitable edge for about a week (and closer to a full season on some player-prop-specific platforms)
        before books built a correlation-detection system that nerfs the payout any time multiple correlated legs
        are combined.
      </p>
      <p>You can see the effect in the pricing itself. As a worked example:</p>
      <div className="my-6 overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-900">Parlay type</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-900">Price</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-900">Implied probability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="px-4 py-2">Same-game, two correlated legs</td>
              <td className="px-4 py-2">+162</td>
              <td className="px-4 py-2">≈38%</td>
            </tr>
            <tr>
              <td className="px-4 py-2">Same juice, legs split across two separate games</td>
              <td className="px-4 py-2">+252</td>
              <td className="px-4 py-2">≈28%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        That's a roughly 10-point implied-probability haircut — the algorithm is pricing in a meaningful chunk of
        the correlation. A correlated parlay can still be +EV if your own modeling has that combination hitting
        above the implied rate (44%+ in a case like this), but generally speaking, the easy value from correlated
        SGPs is gone.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">Flipping the Script: Uncorrelated Parlays</h2>
      <p>
        Instead of fighting an already-patched market, we asked a different question: could the same target share,
        volume, and aDOT models we use for straight player props (see{' '}
        <Link to="/articles/football-betting-advanced-metrics">Chapter 3</Link>) also project{' '}
        <strong>uncorrelated</strong> combinations? Concretely: pairing a player prop <em>under</em> with a
        different, less-correlated prop <em>over</em> for the same player — outcomes that a correlation algorithm
        isn't built to flag, because on the surface they look unrelated.
      </p>
      <p>
        A real example from last season: a receiver going <strong>under 3.5 receptions</strong> parlayed with the
        same player going <strong>over 70 receiving yards</strong>. That looks contradictory at first glance — fewer
        catches but more yards — but it's a completely plausible outcome for a big-play, low-target-share receiver,
        and it's exactly the profile our aDOT and target models are built to identify (see the aDOT section in{' '}
        <Link to="/articles/football-betting-advanced-metrics">Chapter 3</Link>).
      </p>
      <p>
        We ran that receiver through our aDOT and target models 1,000 times for the week in question, and that
        specific combination — under 3.5 receptions <em>and</em> over 70 yards — hit in roughly{' '}
        <strong>9.5% of simulations</strong>. Compared against the combined market price on both legs, that gave
        us close to a <strong>5% edge</strong>. We used the correlation-detection algorithm against itself: since
        it isn't built to flag this combination as correlated, it doesn't apply the same haircut, even though our
        own modeling says the combination is meaningfully more likely than the market price implies.
      </p>

      <div className="my-6 rounded-r-lg border-l-4 border-green-500 bg-green-50 p-6">
        <p className="font-semibold text-gray-900">The pattern generalizes.</p>
        <p className="mt-2 text-gray-700">
          Rushing yards over + attempts under. Pass attempts over + passing yards under. Any two outcomes for the
          same player that look uncorrelated on the surface, but that your own modeling says move together more
          than the market assumes, are worth testing. We specialize in projecting receptions, so attacking that
          specific market was a natural fit — the same logic applies to whatever market you know best.
        </p>
      </div>

      <p>
        Whatever combination you test, get your true implied probability first — simulate it, model it, or
        otherwise validate it independently before you ever look at the parlay price. Once you know your real edge,
        you can see clearly whether the combined market price has left value on the table. Sportsbooks now cover
        an enormous number of markets every single week, and there's simply too much ground for pricing algorithms
        to get everything right. Always be hunting.
      </p>

      <ArticleCTA />
      <ChapterNav currentSlug="uncorrelated-parlays-nfl-betting-edge" />
    </div>
  );
}
