import { GUIDE_CHAPTERS } from '../articles/footballGuideChapters.js';

export interface IndexedArticle {
  slug: string;
  title: string;
  path: string;
  coverImage: { src: string; alt: string };
  category: 'Betting Guide' | 'Analysis';
}

// Real articles pulled from the site's existing /articles pages — every
// entry below has a live route registered in App.tsx.
const guideArticles: IndexedArticle[] = GUIDE_CHAPTERS.map((chapter) => ({
  slug: chapter.slug,
  title: chapter.navTitle,
  path: `/articles/${chapter.slug}`,
  coverImage: chapter.coverImage,
  category: 'Betting Guide',
}));

const analysisArticles: IndexedArticle[] = [
  {
    slug: 'best-nfl-betting-spot',
    title: 'The Best NFL Betting Spot Of The Season',
    path: '/articles/best-nfl-betting-spot',
    coverImage: {
      src: 'https://files.constantcontact.com/f381eaf7701/1f513632-54af-4685-ad5d-a832b3ec37c4.jpg',
      alt: 'NFL betting spot analysis',
    },
    category: 'Analysis',
  },
  {
    slug: 'holdouts-performance',
    title: 'Do Holdouts Actually Affect Performance',
    path: '/articles/holdouts-performance',
    coverImage: {
      src: 'https://files.constantcontact.com/f381eaf7701/c8e4f36f-6089-4873-b5e6-c421012e2329.jpg',
      alt: 'NFL player holdout performance analysis',
    },
    category: 'Analysis',
  },
  {
    slug: 'nfl-bets-before-week-1',
    title: 'The NFL Bets You Need to Make Before Week 1',
    path: '/articles/nfl-bets-before-week-1',
    coverImage: {
      src: 'https://files.constantcontact.com/f381eaf7701/e7c168f2-f899-4ee4-b8b6-5a5ffef0a97c.jpg',
      alt: 'NFL futures market analysis',
    },
    category: 'Analysis',
  },
  {
    slug: 'nfl-player-massive-year',
    title: 'This NFL Player Is Set For a Massive Year',
    path: '/articles/nfl-player-massive-year',
    coverImage: {
      src: 'https://files.constantcontact.com/f381eaf7701/b4f3fa23-d398-46f3-a5e8-61df8fa159cd.jpg',
      alt: 'NFL player outlook analysis',
    },
    category: 'Analysis',
  },
  {
    slug: 'nfl-win-totals-first-time-coaches',
    title: 'Target These NFL Teams To Go Over Their Win Total — First Time Head Coaches',
    path: '/articles/nfl-win-totals-first-time-coaches',
    coverImage: {
      src: 'https://files.constantcontact.com/f381eaf7701/21bf6110-5660-4eaf-93e7-8dc73b6384a2.jpg',
      alt: 'NFL win totals analysis',
    },
    category: 'Analysis',
  },
  {
    slug: 'recapping-bets-week-good-bad-unlucky',
    title: 'Recapping the Bets for Our Week: The Good, the Bad, and the Unlucky',
    path: '/articles/recapping-bets-week-good-bad-unlucky',
    coverImage: {
      src: 'https://files.constantcontact.com/f381eaf7701/21bf6110-5660-4eaf-93e7-8dc73b6384a2.jpg',
      alt: 'Weekly bet recap',
    },
    category: 'Analysis',
  },
  {
    slug: 'recapping-nfl-bets-week-2',
    title: 'Recapping Our NFL Bets for Week 2: The Good, Bad and Ugly',
    path: '/articles/recapping-nfl-bets-week-2',
    coverImage: {
      src: 'https://files.constantcontact.com/f381eaf7701/e37b3648-7249-41a6-be5a-8f2eb2ae17ee.jpg',
      alt: 'Week 2 NFL bet recap',
    },
    category: 'Analysis',
  },
  {
    slug: 'wr-highest-upside',
    title: 'This WR Has THE Highest Upside',
    path: '/articles/wr-highest-upside',
    coverImage: {
      src: 'https://files.constantcontact.com/f381eaf7701/6f9dafc8-b78b-4527-ad52-10d395ed4f63.jpg',
      alt: 'NFL wide receiver upside analysis',
    },
    category: 'Analysis',
  },
];

export const ALL_ARTICLES: IndexedArticle[] = [...guideArticles, ...analysisArticles];
