import { Star } from 'lucide-react';
import { RATING_BADGE, TESTIMONIALS } from './placeholderData';

export default function Testimonials() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">What members are saying</h2>

          {/* PLACEHOLDER rating badge */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5">
            <div className="flex" aria-hidden="true">
              {Array.from({ length: RATING_BADGE.outOf }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(RATING_BADGE.score) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-900">{RATING_BADGE.score.toFixed(1)}/{RATING_BADGE.outOf}</span>
            <span className="text-sm text-gray-500">({RATING_BADGE.reviewCount} reviews — placeholder)</span>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="flex flex-col rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <blockquote className="flex-1 text-sm text-gray-700">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 border-t border-gray-100 pt-4">
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-sm text-sharpside-green">{t.result}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-gray-400">
          PLACEHOLDER testimonials for layout purposes — replace with real member results before launch.
        </p>
      </div>
    </section>
  );
}
