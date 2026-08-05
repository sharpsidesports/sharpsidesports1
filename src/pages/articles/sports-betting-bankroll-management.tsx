import { Link } from 'react-router-dom';
import ChapterNav from '../../components/articles/ChapterNav.js';
import ChapterCoverImage from '../../components/articles/ChapterCoverImage.js';
import ArticleCTA from '../../components/articles/ArticleCTA.js';
import { useArticleSEO } from '../../hooks/useArticleSEO.js';
import { GUIDE_CHAPTERS } from './footballGuideChapters.js';

const TITLE = 'Sports Betting Bankroll Management: Unit Sizing and the Kelly Criterion';
const DESCRIPTION =
  'How to size bets, avoid tilt, and use the Kelly Criterion to turn a real edge into long-term bankroll growth instead of a short-term hot streak.';
const COVER_IMAGE = GUIDE_CHAPTERS.find((c) => c.slug === 'sports-betting-bankroll-management')!.coverImage;

export default function SportsBettingBankrollManagement() {
  useArticleSEO({
    title: `${TITLE} | SharpSide Sports`,
    headline: TITLE,
    description: DESCRIPTION,
    slug: 'articles/sports-betting-bankroll-management',
    datePublished: '2026-08-03',
  });

  return (
    <div className="prose mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-sharpside-green">
          Football Betting Guide — Chapter 4
        </p>
        <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">{TITLE}</h1>
        <p className="text-lg text-gray-700">{DESCRIPTION}</p>
      </header>

      <ChapterCoverImage coverImage={COVER_IMAGE} />

      <p>
        Bankroll management is one of the most important — and least discussed — skills in sports betting. It's
        the process of allocating your betting funds to minimize your risk of ruin while maximizing your long-term
        odds of staying profitable. It's not glamorous, but a strict, boring routine here is often the difference
        between a bettor who survives a cold streak and one who doesn't.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">The Basics</h2>
      <ul className="my-4 list-disc space-y-3 pl-6">
        <li>
          <strong>Set a budget.</strong> Decide how much you're genuinely comfortable risking on sports betting —
          this is your bankroll. Once set, don't bet more than you can afford to lose, full stop.
        </li>
        <li>
          <strong>Choose a unit size.</strong> Your unit is the amount you bet on a single wager. A reasonable
          starting range is 1–5% of your bankroll per unit; we typically operate at 3–4%. On a $1,000 bankroll,
          that's a $30–$40 unit.
        </li>
        <li>
          <strong>Avoid chasing losses.</strong> After a loss, the temptation to bet bigger to "get it back" is
          real — and it's a fast way to blow up a bankroll. Stick to your unit size regardless of yesterday's
          result.
        </li>
        <li>
          <strong>Take breaks.</strong> On a losing streak, step away. A clear head prevents emotional,
          tilt-driven decisions.
        </li>
        <li>
          <strong>Track your results.</strong> You can't improve — or know whether you actually have an edge —
          without a record of every bet, its number, and its outcome.
        </li>
        <li>
          <strong>Match unit size to risk tolerance.</strong> More risk-averse bettors should size down; more
          aggressive bettors can size up, understanding that increases variance in both directions.
        </li>
        <li>
          <strong>Be willing to adjust.</strong> If your results consistently disagree with your process, revisit
          the process — not just the bet sizing.
        </li>
      </ul>

      <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">The Kelly Criterion</h2>
      <p>
        If you want a mathematical framework for sizing bets rather than a flat unit percentage, the Kelly
        Criterion is the standard tool. It calculates the bankroll fraction that maximizes your bankroll's expected
        long-term growth rate, given your real edge on a bet.
      </p>
      <p>The formula, in terms bettors actually use:</p>
      <div className="my-6 rounded-lg bg-gray-50 p-4 font-mono text-sm text-gray-800">
        f* = p − (1 − p) / b
      </div>
      <ul className="my-4 list-disc space-y-2 pl-6">
        <li><strong>f*</strong> is the fraction of your bankroll to bet</li>
        <li><strong>p</strong> is your true win probability on the bet</li>
        <li><strong>b</strong> is the net odds — how many units you win per unit staked if you win</li>
      </ul>
      <p>
        Take a standard -110 bet: you risk $110 to win $100, so <strong>b = 100/110 ≈ 0.91</strong>. If your process
        says this side is actually a 55% winner (p = 0.55, comfortably above the ~52.4% breakeven from{' '}
        <Link to="/articles/football-betting-basic-strategy">Chapter 1</Link>):
      </p>
      <div className="my-6 rounded-lg bg-gray-50 p-4 font-mono text-sm text-gray-800">
        f* = 0.55 − (0.45 / 0.91) ≈ 0.55 − 0.494 ≈ 0.055 → bet about 5.5% of your bankroll
      </div>
      <p>
        That's meaningfully more aggressive than the 1–5% unit-sizing guideline above — which is exactly why most
        bettors don't run full Kelly. Full Kelly assumes your edge estimate is exact, and in a market as sharp as
        the NFL or CFB, your estimate of <em>p</em> is never perfect. Overestimate your edge even slightly and full
        Kelly will oversize your bets and produce brutal swings.
      </p>

      <div className="my-6 rounded-r-lg border-l-4 border-green-500 bg-green-50 p-6">
        <p className="font-semibold text-gray-900">In practice: bet fractional Kelly.</p>
        <p className="mt-2 text-gray-700">
          Most professional bettors use <strong>half-Kelly or quarter-Kelly</strong> — betting 50% or 25% of what
          the formula outputs — to protect against edge overestimation while still scaling stakes with confidence.
          In the example above, half-Kelly would put you close to 2.75% of bankroll, landing right back in the
          practical unit-size range most disciplined bettors already use.
        </p>
      </div>

      <p>
        The tradeoffs are straightforward. Kelly-based sizing is mathematically sound for long-term bankroll
        growth and scales bet size with the size of your actual edge — bigger edges get bigger stakes,
        automatically. But it requires an honest, well-calibrated estimate of your win probability, and it can
        recommend uncomfortably large bets on your most confident spots. Treat it as a ceiling to size down from,
        not a target to hit exactly.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">The Bottom Line</h2>
      <p>
        Bankroll management is an ongoing process, not a one-time setup. Review your unit sizing and your edge
        estimates regularly, and adjust as your results — and your confidence in your own process — evolve.
      </p>

      <ArticleCTA />
      <ChapterNav currentSlug="sports-betting-bankroll-management" />
    </div>
  );
}
