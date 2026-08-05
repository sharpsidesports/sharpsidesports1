import type { CoverImage } from '../../pages/articles/footballGuideChapters.js';

interface ChapterCoverImageProps {
  coverImage: CoverImage;
}

export default function ChapterCoverImage({ coverImage }: ChapterCoverImageProps) {
  return (
    <div className="mb-8 flex justify-center">
      <img
        src={coverImage.src}
        alt={coverImage.alt}
        className="w-3/5 rounded-lg border-4"
        style={{ borderColor: '#059669' }}
      />
    </div>
  );
}
