import { useEffect } from 'react';

interface PageSeoConfig {
  title: string; // full <title> tag content, e.g. "Headline | SharpSide Sports"
  description: string;
  keywords?: string;
  // Absolute path this page's canonical URL should point at, e.g.
  // '/picks-preview/nfl-models/touchdown-model'. Pass the OTHER URL's path
  // when a page also renders at a second route and that other one should be
  // the canonical — see AnytimeTdProjections.tsx for an example.
  canonicalPath: string;
  structuredData?: Record<string, unknown>;
}

const SITE_URL = 'https://sharpsidesports.com';

// Shared SEO side-effects for tool/model pages: document title, meta
// description/keywords, OG/Twitter tags, canonical link, and optional JSON-LD
// structured data. Same create-tag-if-missing robustness as
// src/utils/seoOptimizer.ts (unlike useArticleSEO.ts's plain
// querySelector+setAttribute, which silently no-ops if the tag isn't already
// in index.html) — reused across the Reception/TD/Pace/picks-preview pages
// instead of copy-pasting this wiring into each one.
export function usePageSeo({ title, description, keywords, canonicalPath, structuredData }: PageSeoConfig) {
  useEffect(() => {
    const canonicalUrl = `${SITE_URL}${canonicalPath}`;
    const previousTitle = document.title;
    document.title = title;

    function setMeta(selector: string, attrs: Record<string, string>, content: string) {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    }

    setMeta('meta[name="description"]', { name: 'description' }, description);
    if (keywords) setMeta('meta[name="keywords"]', { name: 'keywords' }, keywords);
    setMeta('meta[property="og:title"]', { property: 'og:title' }, title);
    setMeta('meta[property="og:description"]', { property: 'og:description' }, description);
    setMeta('meta[property="og:url"]', { property: 'og:url' }, canonicalUrl);
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, title);
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, description);

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const previousCanonical = canonicalLink?.getAttribute('href') ?? null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    let script: HTMLScriptElement | null = null;
    if (structuredData) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    return () => {
      document.title = previousTitle;
      if (previousCanonical !== null) canonicalLink!.setAttribute('href', previousCanonical);
      script?.remove();
    };
  }, [title, description, keywords, canonicalPath, structuredData]);
}
