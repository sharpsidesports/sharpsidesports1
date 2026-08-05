import { Link } from 'react-router-dom';
import { GUIDE_CHAPTERS, GUIDE_HUB_COVER_IMAGE, GUIDE_HUB_PATH } from '../../pages/articles/footballGuideChapters.js';

const PUBLISH_LABEL = 'AUGUST 2026'; // PLACEHOLDER — matches each article's datePublished; update as new articles ship

export default function LatestArticles() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Latest Articles</h2>
          <p className="mt-3 text-lg text-gray-500">Football betting strategy, trends, and betting edges</p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Featured hub card */}
          <Link
            to={GUIDE_HUB_PATH}
            className="group overflow-hidden rounded-xl border-2 border-sharpside-green bg-white shadow-sm transition-shadow hover:shadow-lg"
          >
            <img
              src={GUIDE_HUB_COVER_IMAGE.src}
              alt={GUIDE_HUB_COVER_IMAGE.alt}
              className="h-48 w-full object-cover"
              loading="lazy"
            />
            <div className="p-5">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">{PUBLISH_LABEL}</span>
                <span className="font-bold uppercase tracking-wide text-sharpside-green">SharpSide</span>
              </div>
              <h3 className="mt-2 text-lg font-bold text-gray-900 group-hover:text-sharpside-green">
                The Complete Football Betting Guide
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Our full 7-chapter guide to betting NFL and CFB profitably — strategy, trends, metrics, bankroll
                management, line movement, and two betting edges most bettors never learn. Start here.
              </p>
            </div>
          </Link>

          {GUIDE_CHAPTERS.map((chapter) => (
            <Link
              key={chapter.slug}
              to={`/articles/${chapter.slug}`}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
            >
              <img
                src={chapter.coverImage.src}
                alt={chapter.coverImage.alt}
                className="h-48 w-full object-cover"
                loading="lazy"
              />
              <div className="p-5">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">{PUBLISH_LABEL}</span>
                  <span className="font-bold uppercase tracking-wide text-sharpside-green">SharpSide</span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-gray-900 group-hover:text-sharpside-green">
                  {chapter.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-gray-600">{chapter.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
