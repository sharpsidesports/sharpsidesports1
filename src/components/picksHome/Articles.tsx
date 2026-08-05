import { Link } from 'react-router-dom';
import { GUIDE_CHAPTERS } from '../../pages/articles/footballGuideChapters.js';

// Real articles from the site's football betting guide (footballGuideChapters.ts).
// Excludes the "Uncorrelated Parlays" chapter to stay consistent with this
// page's straight-bets-only positioning — leaves exactly 6 chapters.
const FEATURED_SLUGS = new Set([
  'football-betting-basic-strategy',
  'profitable-football-betting-trends',
  'football-betting-advanced-metrics',
  'sports-betting-bankroll-management',
  'how-sportsbook-lines-move',
  'live-in-play-betting-strategy',
]);

const articles = GUIDE_CHAPTERS.filter((chapter) => FEATURED_SLUGS.has(chapter.slug));

export default function Articles() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Learn the edge, not just the picks
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Straight from our football betting guide — strategy, trends, and the metrics behind the model.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((chapter) => (
            <Link
              key={chapter.slug}
              to={`/articles/${chapter.slug}`}
              className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-lg"
            >
              <img
                src={chapter.coverImage.src}
                alt={chapter.coverImage.alt}
                className="h-44 w-full object-cover"
                loading="lazy"
              />
              <div className="p-5">
                <span className="text-xs font-bold uppercase tracking-wide text-sharpside-green">
                  Chapter {chapter.chapterNumber}
                </span>
                <h3 className="mt-2 text-base font-bold text-gray-900 group-hover:text-sharpside-green">
                  {chapter.navTitle}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-gray-600">{chapter.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/articles/football-betting-guide"
            className="text-sm font-semibold text-sharpside-green hover:text-green-700"
          >
            Read the complete football betting guide &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
