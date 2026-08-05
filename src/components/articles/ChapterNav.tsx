import { Link } from 'react-router-dom';
import { GUIDE_CHAPTERS, GUIDE_HUB_PATH } from '../../pages/articles/footballGuideChapters.js';

interface ChapterNavProps {
  currentSlug: string;
}

// Prev/next + back-to-hub navigation shown on every chapter of the football
// betting guide, so the chapters interlink instead of being SEO dead ends.
export default function ChapterNav({ currentSlug }: ChapterNavProps) {
  const index = GUIDE_CHAPTERS.findIndex((c) => c.slug === currentSlug);
  const prev = index > 0 ? GUIDE_CHAPTERS[index - 1] : undefined;
  const next = index >= 0 && index < GUIDE_CHAPTERS.length - 1 ? GUIDE_CHAPTERS[index + 1] : undefined;

  return (
    <nav aria-label="Guide chapter navigation" className="mt-10 border-t border-gray-200 pt-6">
      <Link to={GUIDE_HUB_PATH} className="text-sm font-medium text-sharpside-green hover:underline">
        ← Back to the full Football Betting Guide
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {prev && (
          <Link
            to={`/articles/${prev.slug}`}
            className="rounded-md border border-gray-200 p-3 text-sm hover:border-sharpside-green hover:bg-green-50"
          >
            <span className="block text-xs text-gray-500">← Chapter {prev.chapterNumber}</span>
            <span className="font-medium text-gray-900">{prev.navTitle}</span>
          </Link>
        )}
        {next && (
          <Link
            to={`/articles/${next.slug}`}
            className="rounded-md border border-gray-200 p-3 text-right text-sm hover:border-sharpside-green hover:bg-green-50 sm:col-start-2"
          >
            <span className="block text-xs text-gray-500">Chapter {next.chapterNumber} →</span>
            <span className="font-medium text-gray-900">{next.navTitle}</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
