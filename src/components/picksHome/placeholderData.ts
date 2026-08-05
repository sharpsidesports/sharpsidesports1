// ============================================================================
// PLACEHOLDER MARKETING DATA — src/components/picksHome
// ----------------------------------------------------------------------------
// Every number, name, and quote in this file is a PLACEHOLDER used to build
// out the page's layout and copy. Swap in verified, real data before this
// page goes live. Nothing here is pulled from a live backend.
//
// Real performance data (win rate, season records, units) lives in
// `trackRecordData.ts`, not here — it's compiled from actual season-tracking
// sheets, and the calculator/track-record/hero sections read it directly.
// ============================================================================

import { HISTORICAL_WIN_RATE } from './trackRecordData.js';

export interface HowItWorksStep {
  title: string;
  description: string;
}

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    title: 'Model analyzes matchups & lines',
    description:
      'Every day, our model scans matchups and live lines across sportsbooks, comparing them against thousands of simulated outcomes.',
  },
  {
    title: 'Finds +EV opportunities',
    description:
      'We surface the specific straight bets where the market price diverges from our projected fair price.',
  },
  {
    title: 'You review & place',
    description: 'Every pick ships with the reasoning behind it, so you know exactly why it’s +EV before you bet it.',
  },
  {
    title: 'Track results automatically',
    description:
      'Every pick is timestamped the moment it’s published and graded automatically once the game closes — no cherry-picking.',
  },
];

export interface FeatureItem {
  iconKey: 'trending-up' | 'network' | 'ticket' | 'shield' | 'bell' | 'bar-chart';
  title: string;
  description: string;
}

export const FEATURES: FeatureItem[] = [
  {
    iconKey: 'trending-up',
    title: 'Live Odds Tracking',
    description: 'Line movement across major books, tracked in real time so you know when a number is worth grabbing.',
  },
  {
    iconKey: 'network',
    title: 'Closing Line Value Tracking',
    description: 'See how each pick moved from open to close, so you can measure edge independent of results.',
  },
  {
    iconKey: 'ticket',
    title: 'One-Click Bet Slips',
    description: 'Send any pick straight to your sportsbook slip in a single tap.',
  },
  {
    iconKey: 'shield',
    title: 'Exposure Limits',
    description: 'Set bankroll caps per day, per sport, or per bet type so no single slate can overextend you.',
  },
  {
    iconKey: 'bell',
    title: 'Line Move Alerts',
    description: 'Get notified the moment a tracked line moves far enough to change a bet’s expected value.',
  },
  {
    iconKey: 'bar-chart',
    title: 'Automated Results Tracking',
    description: 'Every graded bet flows into your personal record — win rate, units, and ROI, always up to date.',
  },
];

export interface Testimonial {
  name: string;
  result: string;
  quote: string;
}

// PLACEHOLDER — testimonials, not real users
export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Marcus T.', // PLACEHOLDER
    result: '+41.2 units over 3 months', // PLACEHOLDER
    quote: 'The reasoning behind every pick is what sold me — I can actually see why a bet is +EV instead of just trusting it blindly.',
  },
  {
    name: 'Dana R.', // PLACEHOLDER
    result: '68% win rate on straight bets, 6 weeks', // PLACEHOLDER
    quote: 'Switched from guessing lines myself to following the model’s straight bets. Slower, steadier, and it’s actually working.',
  },
  {
    name: 'Ivan P.', // PLACEHOLDER
    result: '+18.9 units, first month', // PLACEHOLDER
    quote: 'Exposure limits alone are worth the subscription. Kept me from blowing up a slate during a cold stretch.',
  },
];

// PLACEHOLDER — rating badge
export const RATING_BADGE = {
  score: 4.8, // PLACEHOLDER
  outOf: 5,
  reviewCount: 214, // PLACEHOLDER
};

// Real pricing lives in `../subscription/PricingPlans.tsx` (shared with the
// live Subscription page) and is consumed directly by Pricing.tsx.

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Is this legit?',
    answer:
      'Every pick we publish is timestamped the moment it goes live and graded automatically after the game closes, so our record reflects picks made before the outcome was known — not after. The season-by-season breakdown above is compiled directly from our tracking sheets, not curated highlights.',
  },
  {
    question: `Is a ${(HISTORICAL_WIN_RATE * 100).toFixed(1)}% win rate actually good?`,
    answer: `For straight bets at standard -110 odds, breakeven is 52.4%. A ${(HISTORICAL_WIN_RATE * 100).toFixed(
      1
    )}% win rate sustained across hundreds of picks and multiple seasons is a real, meaningful edge over the market — the calculator above shows exactly what that edge is worth at your volume.`,
  },
  {
    question: 'How is tracking verified?',
    answer:
      'Every pick is logged with its date and result in season-tracking sheets before the event starts. We are building out a fully public, filterable results archive so anyone can audit the full history.',
  },
  {
    question: 'Why show multiple years of data instead of just this season?',
    answer:
      'A single hot or cold season can be noise. Showing every tracked season since 2020 — good years and bad — is what makes the combined win rate and units figure credible instead of cherry-picked.',
  },
  {
    question: 'Will I get limited?',
    answer:
      'Betting +EV numbers can lead to limits at some books over time, same as any sharp betting approach. We recommend spreading volume across multiple sportsbooks and using exposure limits to bet sustainably.',
  },
];
