import { Link } from 'react-router-dom';
import ChapterNav from '../../components/articles/ChapterNav.js';
import ChapterCoverImage from '../../components/articles/ChapterCoverImage.js';
import ArticleCTA from '../../components/articles/ArticleCTA.js';
import { useArticleSEO } from '../../hooks/useArticleSEO.js';
import { GUIDE_CHAPTERS } from './footballGuideChapters.js';

const TITLE = 'Football Betting Basic Strategy: The Fundamentals Sharp Bettors Use';
const DESCRIPTION =
  'The foundational rules every football bettor needs before touching the NFL or CFB markets — devigging odds, key numbers, line shopping, and top-down vs. originating.';
const COVER_IMAGE = GUIDE_CHAPTERS.find((c) => c.slug === 'football-betting-basic-strategy')!.coverImage;

export default function FootballBettingBasicStrategy() {
  useArticleSEO({
    title: `${TITLE} | SharpSide Sports`,
    headline: TITLE,
    description: DESCRIPTION,
    slug: 'articles/football-betting-basic-strategy',
    datePublished: '2026-08-03',
  });

  return (
    <div className="prose mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-sharpside-green">
          Football Betting Guide — Chapter 1
        </p>
        <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">{TITLE}</h1>
        <p className="text-lg text-gray-700">{DESCRIPTION}</p>
      </header>

      <ChapterCoverImage coverImage={COVER_IMAGE} />

      <p>
        Football is king in the U.S. betting market, and the <strong>NFL and college football markets are the two
        most liquid betting markets in the country</strong>. A single Monday Night Football game can see roughly
        20x the handle of a mid-tier college basketball game. That liquidity attracts the sharpest, highest-limit
        bettors in the world, and sharp syndicate groups betting the openers only feeds sportsbooks more information
        to price the line accurately. In short: football is hard to beat long-term. But if you can beat it, it's the
        most lucrative market available.
      </p>

      <p>
        We've been profitable betting football for 5 years running, and 8 of the last 10 years. We've also more
        than tripled our bankroll since 2020 through disciplined bankroll management. There's no magic model behind
        that. For the vast majority of bettors — tailing a model or building one yourself — a model alone will not
        beat the closing NFL or CFB number. Instead, we lean on a blend of indicators, historically profitable
        situational spots, and a strategy that keeps evolving. There is no simple, permanent edge. If you find one
        that looks too easy, expect it to dry up fast — you have to keep adapting.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">The Vig, and Why "Small" Edges Aren't Enough</h2>
      <p>
        Every wager you place at a sportsbook carries a built-in tax — the vig (or juice). On a standard NFL or CFB
        spread or total at <strong>-110</strong>, you need to win at roughly a <strong>52.4% clip</strong> (commonly
        rounded to 53%) just to break even, which works out to needing about a <strong>2.4-point edge over a true
        coin flip</strong>. Having an edge on the market and still losing money is entirely possible — if your
        process spits out a 2% edge on average, you can still lose betting into -110/-110 because that edge hasn't
        cleared the vig. You had an edge on the market, but a negative expected value (-EV) bet.
      </p>
      <p>
        That's the problem with "get as close to the market as possible" thinking. If your whole goal is shaving
        small edges off the sharpest, most efficient betting market on earth, it's going to be brutal. Legendary
        coach Steve Spurrier put it well:
      </p>
      <blockquote className="my-6 border-l-4 border-sharpside-green bg-gray-50 py-2 pl-4 italic text-gray-700">
        "If you want to be successful, you have to do it the way everybody does it and do it a lot better — or you
        have to do it differently. I can't outwork anybody... so I figured I'd try to coach some different ball
        plays."
      </blockquote>
      <p>
        If you're reading a guide like this, you're already putting in the work and already thinking like a sharp
        bettor — but you're probably not an MIT-trained quant either. Trying to out-model the sharpest quant shops
        and syndicate groups at their own game is a losing plan for most of us. It's often smarter to look for a
        different approach entirely, which is what the rest of this guide covers.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">Our Basic Strategy Rules</h2>
      <p>
        Blackjack has a finite, well-defined "basic strategy" you can memorize. Sports betting is far more
        open-ended — which is a good thing, since it means there are many different methods and techniques you can
        use to find and exploit an edge. Here's the fundamental rule set we lean on to avoid costly mistakes and
        build a strong foundation.
      </p>

      <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">Bankroll management is everything</h3>
      <p>
        You can be the sharpest bettor alive with a massive edge, but if you don't understand risk, go on tilt
        easily, or allocate capital poorly, you will not survive long-term. Variance is real, and it has busted
        some of the sharpest bettors we know. (More on this in{' '}
        <Link to="/articles/sports-betting-bankroll-management">Chapter 4: Bankroll Management</Link>.)
      </p>

      <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">Do not chase a number</h3>
      <p>
        To be clear: we're not talking about picking off better numbers at slow books, or betting top-down (more on
        that below). We mean blindly taking a game at a <strong>worse</strong> number just because the line moved
        in that team's favor. Moves off the opener are often driven by sharp action or injury news, but blindly
        tailing after a significant move has historically been -EV. Profitable bettors bet a specific
        <strong> number</strong>, not a team.
      </p>

      <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">Line shop</h3>
      <p>
        This is the simplest way to gain value on a micro level. It matters most in MLB, PGA, UFC, and CBB, but
        even NFL and CFB openers can carry slight differences across books. Shopping for the best number for your
        position is free +EV every time you do it.
      </p>

      <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">Top-down vs. originating betting</h3>
      <p>
        This is polarizing enough in the betting community to deserve its own chapter, so we'll keep the summary
        tight here. <strong>Top-down betting</strong> strips sports knowledge and bias out of the equation
        entirely. A top-down bettor watches a live odds screen (DonsBest, OddsJam) and keys in on sharp,
        market-originating books like Pinnacle and Circa. When one of those books moves a line, the top-down bettor
        rushes to bet the same side at a slower rec book — FanDuel, BetMGM, DraftKings — before that book catches
        up, picking off a stale number. This is often called "steam chasing" or "board cleaning," and it can
        produce near-instant closing line value (CLV).
      </p>
      <p>
        <strong>Originating (bottom-up) betting</strong> means building your own projections and betting them
        directly — whether that's a quant with a real model, or a friend who just "thinks the Cowboys cover -3."
        There's a wide range of quality inside "originating," which is why it carries a mixed reputation.
      </p>
      <p>
        Both approaches have real tradeoffs. Pure top-down betting is extremely time-consuming for a one-person
        operation, and if you're just tailing sharp action without understanding *why* the market moved, it's a
        poor long-term use of time. You can also get burned by pump-fake moves, or by tailing a group that has
        temporarily lost its edge — which happens to even the sharpest syndicates. Pure originator betting, on the
        other hand, is only as good as the model or ratings system behind it, and most self-styled "sharp"
        originators simply aren't.
      </p>
      <p>
        Our take after years of doing this: blend the two. Build an original ratings system or model, then combine
        it with a real understanding of how markets move — who's betting openers, when buybacks happen, why a book
        is really moving a number. Use the top-down lens to help confirm or filter games you've already flagged as
        +EV from your own process. A pure top-down approach can produce good weeks and real CLV, but once you're
        successful, rec books with stale lines will limit you fast. Being an originator with a real, long-term
        winning sample lets you keep betting sizable limits at market-testing books. In nine years of doing this
        full-time, the biggest edges we've found were almost never sitting on an odds screen.
      </p>

      <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">Never bet through a key number in the NFL</h3>
      <p>
        Betting after a spread has moved past a key number is a cardinal sin, especially in the NFL. A worse number
        is always -EV, but some numbers matter far more than others. The NFL's key numbers are{' '}
        <strong>3, 4, 6, 7, 10, and 14</strong>.
      </p>

      <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">Don't be afraid to fire on an opener</h3>
      <p>
        If you trust your ranking system, model, or general read on a spot, fire on the opener. This sounds obvious
        but is a common beginner mistake. Betting openers is the best way to secure real closing line value, and
        it's also a useful gauge of how accurate your process actually is — if you're consistently getting -CLV,
        it's a sign to rethink your approach.
      </p>

      <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">It's okay to fade steam</h3>
      <p>
        If you didn't bet the opener and are waiting for a better number closer to kickoff, fading steam has
        historically been profitable. Since 2004, fading a steam move of 1–4 points in the NFL is{' '}
        <strong>159-93-5</strong> against the closing number. Not every line move is sharp action, and not every
        sharp group is on the same side — especially in the NFL. You won't get CLV doing this, but you can still
        create an edge by taking the extra points relative to the opener.
      </p>

      <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">Always be hunting for simple edges</h3>
      <p>
        This sounds obvious but is genuinely tedious in practice — comparing house rules, line differences, and
        odd bet types across books. A well-known example: bettor @telemachusmodel documented turning a small
        bankroll into 100x in eight months by exploiting a mispriced parlay rule at BetMGM that offered roughly
        140% ROI. It took MGM a full season to fix it. Sometimes edges are hiding in plain sight — you just have to
        be paying attention.
      </p>

      <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">Don't overreact to a small sample size</h3>
      <p>
        Betting has real variance. If you believe in your method and the edges you're finding aren't far-fetched,
        it's fine to ride a system out through a rough short-term stretch.
      </p>

      <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">Early season betting is your friend</h3>
      <p>
        Sportsbooks are most vulnerable early in the season, when power rankings can be stale — especially in CFB,
        where roster turnover leaves a lot unknown. If you can grade teams more accurately than the market early
        on, you'll get real CLV and an early edge.
      </p>

      <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">Don't overextend early</h3>
      <p>
        It's fine to have a 10+ bet day — but only once you have a proven process and real confidence in your edge.
        If you're still testing a method on a small sample, keep your exposure limited so a bad stretch doesn't
        wreck your bankroll.
      </p>

      <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">Small dogs on the moneyline</h3>
      <p>
        The straight-up winner of an NFL game has also covered the spread roughly <strong>83% of the time</strong>.
        If you like a live, small underdog, taking them on the moneyline instead of +EV points against the spread
        is often the better play — and if you lean toward a small favorite, take them against the spread rather
        than laying a bloated moneyline price.
      </p>

      <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">Home field matters more in college football</h3>
      <p>
        This one's well known but still worth stating: over the last 15 years, home field advantage in a college
        football game (Power 5 vs. Power 5) has been worth almost a half point more than in the NFL. If you lean on
        home-field spots, weight it more heavily in CFB — with the caveat that Group of 5 matchups need their own
        homework, since the sample is noisier.
      </p>

      <ArticleCTA />
      <ChapterNav currentSlug="football-betting-basic-strategy" />
    </div>
  );
}
