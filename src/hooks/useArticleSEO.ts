import { useEffect } from 'react';

interface ArticleSEOConfig {
  title: string; // full <title> tag content, e.g. "Headline | SharpSide Sports"
  headline: string; // headline without the site suffix, used in structured data
  description: string;
  slug: string; // e.g. 'articles/football-betting-basic-strategy'
  datePublished: string; // ISO date, e.g. '2026-08-03'
  dateModified?: string;
}

const SITE_URL = 'https://sharpsidesports.com';

// Shared SEO side-effects for article pages: document title, meta description,
// OG/Twitter tags, and Article JSON-LD structured data. Mirrors the pattern
// used across the hand-written article pages, centralized so new articles
// don't have to re-implement ~50 lines of tag-wiring boilerplate each.
export function useArticleSEO(config: ArticleSEOConfig) {
  const { title, headline, description, slug, datePublished, dateModified = datePublished } = config;

  useEffect(() => {
    document.title = title;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', headline);

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', description);

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', headline);

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute('content', description);

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline,
      description,
      author: { '@type': 'Organization', name: 'SharpSide Sports' },
      publisher: {
        '@type': 'Organization',
        name: 'SharpSide Sports',
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
      },
      datePublished,
      dateModified,
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/${slug}` },
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      document.title = 'sharpside golf';
      script.remove();
    };
  }, [title, headline, description, slug, datePublished, dateModified]);
}
