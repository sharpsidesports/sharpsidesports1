// Shared metadata for the 7-chapter football betting guide + its hub page.
// Used by the hub page and each chapter's prev/next chapter navigation so
// the reading order only has to be defined in one place.

export interface CoverImage {
  src: string;
  alt: string;
}

export interface GuideChapter {
  slug: string;
  chapterNumber: number;
  navTitle: string; // short label used in nav/hub cards
  title: string; // full H1 / page title
  description: string; // 1-sentence dek used on the hub + as a fallback meta description
  coverImage: CoverImage;
}

export const GUIDE_HUB_PATH = '/articles/football-betting-guide';

// Reused from the existing NFL articles' image library (files.constantcontact.com).
// None of these were shot for these specific chapters, so alt text is written
// to describe the chapter topic rather than whatever the photo originally
// illustrated — swap in dedicated cover photos per chapter whenever you have them.
export const GUIDE_HUB_COVER_IMAGE: CoverImage = {
  src: 'https://files.constantcontact.com/f381eaf7701/18be7f91-9a7b-475b-96db-48018ac7c8f5.png',
  alt: 'SharpSide Sports football betting guide',
};

export const GUIDE_CHAPTERS: GuideChapter[] = [
  {
    slug: 'football-betting-basic-strategy',
    chapterNumber: 1,
    navTitle: 'Basic Strategy',
    title: 'Football Betting Basic Strategy: The Fundamentals Sharp Bettors Use',
    description:
      'The foundational rules every football bettor needs before touching the NFL or CFB markets — devigging odds, key numbers, line shopping, and top-down vs. originating.',
    coverImage: {
      src: 'https://files.constantcontact.com/f381eaf7701/1f513632-54af-4685-ad5d-a832b3ec37c4.jpg',
      alt: 'NFL football betting strategy analysis',
    },
  },
  {
    slug: 'profitable-football-betting-trends',
    chapterNumber: 2,
    navTitle: 'Profitable Betting Spots & Trends',
    title: 'Historically Profitable Football Betting Trends & Situational Spots',
    description:
      'Situational betting spots and long-tracked NFL and college football trends — from letdown spots to academy unders — and how to tell which ones still hold up.',
    coverImage: {
      src: 'https://files.constantcontact.com/f381eaf7701/21bf6110-5660-4eaf-93e7-8dc73b6384a2.jpg',
      alt: 'NFL and college football betting trends',
    },
  },
  {
    slug: 'football-betting-advanced-metrics',
    chapterNumber: 3,
    navTitle: 'Advanced Metrics',
    title: 'Advanced Football Metrics for Bettors: DVOA, EPA, Success Rate & aDOT Explained',
    description:
      'A practical, betting-focused breakdown of DVOA, EPA, success rate, explosiveness, aDOT, and pressure metrics — what they measure and when they actually matter.',
    coverImage: {
      src: 'https://files.constantcontact.com/f381eaf7701/b4f3fa23-d398-46f3-a5e8-61df8fa159cd.jpg',
      alt: 'Advanced football analytics and metrics',
    },
  },
  {
    slug: 'sports-betting-bankroll-management',
    chapterNumber: 4,
    navTitle: 'Bankroll Management',
    title: 'Sports Betting Bankroll Management: Unit Sizing and the Kelly Criterion',
    description:
      'How to size bets, avoid tilt, and use the Kelly Criterion to turn a real edge into long-term bankroll growth instead of a short-term hot streak.',
    coverImage: {
      src: 'https://files.constantcontact.com/f381eaf7701/c8e4f36f-6089-4873-b5e6-c421012e2329.jpg',
      alt: 'Sports betting bankroll management',
    },
  },
  {
    slug: 'how-sportsbook-lines-move',
    chapterNumber: 5,
    navTitle: 'Line Movement & Fallacies',
    title: 'How Sportsbook Lines Move — And the Biggest Betting Fallacies Debunked',
    description:
      "How odds actually get set and moved behind the scenes, and why 'Vegas knows,' fading the public, and blindly following reverse line movement are all flawed.",
    coverImage: {
      src: 'https://files.constantcontact.com/f381eaf7701/6f9dafc8-b78b-4527-ad52-10d395ed4f63.jpg',
      alt: 'How sportsbook betting lines move',
    },
  },
  {
    slug: 'uncorrelated-parlays-nfl-betting-edge',
    chapterNumber: 6,
    navTitle: 'Uncorrelated Parlays',
    title: 'The Uncorrelated Parlay Edge: Exploiting NFL Player Prop Pricing',
    description:
      'Why correlated same-game parlays stopped paying off, and how pairing uncorrelated player prop outcomes can still produce a real, exploitable edge.',
    coverImage: {
      src: 'https://files.constantcontact.com/f381eaf7701/e7c168f2-f899-4ee4-b8b6-5a5ffef0a97c.jpg',
      alt: 'NFL parlay betting edge analysis',
    },
  },
  {
    slug: 'live-in-play-betting-strategy',
    chapterNumber: 7,
    navTitle: 'Live In-Play Betting',
    title: 'Live In-Play Betting: How to Find Mispriced NFL Player Props Late in Games',
    description:
      'Why live player prop pricing algorithms lag game flow late in the 3rd and 4th quarters — and how to find real-money edges while the line catches up.',
    coverImage: {
      src: 'https://files.constantcontact.com/f381eaf7701/e37b3648-7249-41a6-be5a-8f2eb2ae17ee.jpg',
      alt: 'Live in-play NFL betting strategy',
    },
  },
];
