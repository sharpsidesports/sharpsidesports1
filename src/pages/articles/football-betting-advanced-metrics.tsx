import { Link } from 'react-router-dom';
import ChapterNav from '../../components/articles/ChapterNav.js';
import ChapterCoverImage from '../../components/articles/ChapterCoverImage.js';
import ArticleCTA from '../../components/articles/ArticleCTA.js';
import { useArticleSEO } from '../../hooks/useArticleSEO.js';
import { GUIDE_CHAPTERS } from './footballGuideChapters.js';

const TITLE = 'Advanced Football Metrics for Bettors: DVOA, EPA, Success Rate & aDOT Explained';
const DESCRIPTION =
  'A practical, betting-focused breakdown of DVOA, EPA, success rate, explosiveness, aDOT, and pressure metrics — what they measure and when they actually matter.';
const COVER_IMAGE = GUIDE_CHAPTERS.find((c) => c.slug === 'football-betting-advanced-metrics')!.coverImage;

export default function FootballBettingAdvancedMetrics() {
  useArticleSEO({
    title: `${TITLE} | SharpSide Sports`,
    headline: TITLE,
    description: DESCRIPTION,
    slug: 'articles/football-betting-advanced-metrics',
    datePublished: '2026-08-03',
  });

  return (
    <div className="prose mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-sharpside-green">
          Football Betting Guide — Chapter 3
        </p>
        <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">{TITLE}</h1>
        <p className="text-lg text-gray-700">{DESCRIPTION}</p>
      </header>

      <ChapterCoverImage coverImage={COVER_IMAGE} />

      <p>
        Metrics can feel overwhelming, but if you know which ones actually mean something, you can use them to your
        advantage without building a full model yourself. We saw this play out clearly on the PGA Tour: the course
        for a tournament historically suited long hitters who ranked highly in Strokes Gained: Off the Tee. One
        contender ranked inside the top 10 in both categories over his prior 36 rounds and finished 2nd in our
        outright model — a bettor with access to the same course history and strokes-gained data could have
        flagged that outcome without running an intensive model.
      </p>
      <p>
        Football works the same way. If you can read a matchup and identify where one team will get exploited (or
        do the exploiting), you have an edge — whether or not you ever build a formal model.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">
        Metrics Are Polarizing — For the Wrong Reasons
      </h2>
      <p>
        Advanced metrics get dismissed from two opposite directions: pure top-down bettors don't care about them
        because it doesn't fit their process (see{' '}
        <Link to="/articles/football-betting-basic-strategy">Chapter 1</Link>), and square bettors dismiss them
        because they misunderstand how books actually operate. We hear some version of "books already know this"
        constantly. If you believe sportsbooks price in every advanced metric perfectly, you're misreading how
        bookmaking actually works — see{' '}
        <Link to="/articles/how-sportsbook-lines-move">Chapter 5</Link> for the full explanation. You absolutely can
        create an edge with metrics that aren't front-of-mind for the market. The job is identifying a matchup
        mismatch and sizing how much edge it's actually worth. Here's what we key on.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">TARP (Transfer Assets &amp; Returning Production)</h2>
      <p>
        A college football rating system built to quantify team experience through returning production and
        transfer portal activity. It's most valuable in weeks 1–4, when the market has the least game-log data to
        work with. Don't be afraid to fire an early week-1 line if a TARP-style read tells you the market is off —
        it may tie up bankroll for months, but strongly +EV bets are worth the wait.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">DVOA</h2>
      <p>
        DVOA (Defense-adjusted Value Over Average), developed by Football Outsiders, evaluates a team's
        play-by-play performance adjusted for opponent quality — how a team performs relative to league average
        once you account for who they played. We use overall DVOA, offensive DVOA, and defensive DVOA weekly during
        the NFL season, whether we're building a model or just sanity-checking a power ranking.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">Success Rate</h2>
      <p>
        Split into passing and rushing success rate. A play is "successful" when it gains at least 40% of
        yards-to-go on 1st down, 60% on 2nd down, and 100% on 3rd or 4th down. It's a cleaner read on consistency
        than yards-per-play alone, since it doesn't let one 60-yard explosive play mask an otherwise stalled
        offense.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">Explosive Play Rate</h2>
      <p>
        Also split by passing and rushing. An explosive rushing play gains 12+ yards on the ground; an explosive
        passing play gains 16+ yards through the air. We weight this more heavily in college football than the
        NFL — explosive plays are simply more common in the college game, which increases the metric's signal. In
        the NFL, we've found success rate carries more predictive weight than explosiveness.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">Expected Points Added (EPA)</h2>
      <p>
        EPA has become one of the most important NFL metrics, and it's worth understanding the mechanics, not just
        the acronym. It's derived from Expected Points (EP) — the core idea being that not all yards are created
        equal. A 3-yard gain on 3rd-and-2 matters far more than a 2-yard gain on 2nd-and-10, even though the second
        gained more yardage, because of what each does to the odds of extending the drive.
      </p>
      <p>
        Researchers calculated how many points an NFL team scores on average from any down, distance, and field
        position combination — that baseline is Expected Points. It rises as a team nears the opponent's end zone
        and falls on later downs; it can go negative when a team is backed up near its own goal line or facing a
        4th-down punt, since the opponent is now more likely to score next.
      </p>
      <p>
        <strong>EPA measures how a specific play changed that baseline.</strong> If a drive starts at the 50 (about
        2.5 expected points) and ends in a field goal (3 points), the drive's EPA is 3 − 2.5 = <strong>+0.5</strong>.
        The same logic applies play-by-play: if a quarterback throws a 15-yard completion that moves the offense
        from 1st-and-10 at their own 25 (≈1.06 EP) to 1st-and-10 at the 40 (≈1.88 EP), that single play is worth{' '}
        <strong>+0.82 EPA</strong>. If instead he's sacked for a 10-yard loss, dropping the offense to 2nd-and-20
        from their own 15 (≈-0.54 EP), that play is worth <strong>-1.6 EPA</strong>.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">Yards Per Pass Attempt (YPA)</h2>
      <p>
        A simple efficiency read on a team or quarterback's passing game — total yards divided by attempts,
        counting incompletions. A high YPA signals a passing attack capable of producing chunk plays and scoring
        opportunities.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">Average Depth of Target (aDOT)</h2>
      <p>
        aDOT measures how far downfield, on average, a quarterback's intended receiver is when targeted. We lean
        on it heavily for WR and TE props, and to a lesser extent QB props. It's calculated by measuring the
        distance between the line of scrimmage and the targeted receiver on every attempt, then averaging that
        distance over a game or season.
      </p>
      <p>
        aDOT tells you what kind of role a player actually has. A receiver who plays a heavy slot snap rate with a
        low aDOT is likely a high-target-share, high-floor player working shorter, higher-conversion routes near
        the line of scrimmage. A player with a high aDOT and lower target share is probably a boom-or-bust receiver
        whose weekly reception totals will run low-volume more often than not. Paired with target share, aDOT is
        one of the clearest ways to project a receiver's realistic prop range before the market fully adjusts.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">Yards Per Rush (and Opponent YPR)</h2>
      <p>
        A basic but useful read on run-game effectiveness — yards gained divided by carries. Opponent yards per
        rush is the inverse: how many yards a defense allows per attempt. Both are blunt instruments; we lean on
        success rate and stuff rate over raw YPR whenever they're available.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">Trench Win-Rate Metrics</h2>
      <ul className="my-4 list-disc space-y-2 pl-6">
        <li>
          <strong>Pass Rush Win Rate</strong> — how often a pass rusher beats his blocker within 2.5 seconds.
        </li>
        <li>
          <strong>Pass Block Win Rate</strong> — the inverse: how often an offensive line gives its quarterback
          more than 2.5 seconds to throw.
        </li>
        <li>
          <strong>Run Stop Win Rate</strong> — how often a defender sheds his run block within 2.5 seconds.
        </li>
        <li>
          <strong>Run Block Win Rate</strong> — how often an offensive line creates a running lane and sustains the
          block past 2.5 seconds.
        </li>
      </ul>
      <p>
        These four rarely move a line on their own, but they're some of the best early indicators of a mismatch in
        the trenches before it shows up in the box score — and box-score-driven markets are exactly where an edge
        tends to live longest.
      </p>

      <ArticleCTA />
      <ChapterNav currentSlug="football-betting-advanced-metrics" />
    </div>
  );
}
