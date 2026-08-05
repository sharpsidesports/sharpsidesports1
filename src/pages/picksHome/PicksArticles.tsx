import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PicksLayout from '../../components/picksHome/PicksLayout.js';
import { ALL_ARTICLES } from './articlesIndexData.js';

const PAGE_TITLE = 'Articles | SharpSide Sports';

export default function PicksArticles() {
  useEffect(() => {
    document.title = PAGE_TITLE;
    return () => {
      document.title = 'sharpside golf';
    };
  }, []);

  return (
    <PicksLayout>
      <div className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Articles</h1>
          <p className="mt-4 text-lg text-gray-600">
            Football betting strategy, trends, and analysis from SharpSide Sports.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_ARTICLES.map((article) => (
            <Link
              key={article.slug}
              to={article.path}
              className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-lg"
            >
              <img
                src={article.coverImage.src}
                alt={article.coverImage.alt}
                className="h-44 w-full object-cover"
                loading="lazy"
              />
              <div className="p-5">
                <span className="text-xs font-bold uppercase tracking-wide text-sharpside-green">
                  {article.category}
                </span>
                <h2 className="mt-2 text-base font-bold text-gray-900 group-hover:text-sharpside-green">
                  {article.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PicksLayout>
  );
}
