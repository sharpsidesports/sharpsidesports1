// SEO optimization utility for NFL stat pages
export interface SEOConfig {
  pageTitle: string;
  metaDescription: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
  h1Title: string;
  h1Description: string;
  h1SubDescription: string;
  analysisTitle: string;
  analysisContent: string[];
  structuredDataName: string;
  structuredDataDescription: string;
  variableMeasured: string;
}

export const applySEOOptimization = (config: SEOConfig) => {
  // Update document title
  document.title = `${config.pageTitle} | SharpSide Sports`;
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', config.metaDescription);
  } else {
    const newMetaDescription = document.createElement('meta');
    newMetaDescription.name = 'description';
    newMetaDescription.content = config.metaDescription;
    document.head.appendChild(newMetaDescription);
  }

  // Add structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": config.structuredDataName,
    "description": config.structuredDataDescription,
    "url": window.location.href,
    "mainEntity": {
      "@type": "Dataset",
      "name": config.structuredDataName,
      "description": config.structuredDataDescription,
      "variableMeasured": config.variableMeasured,
      "temporalCoverage": "2024 NFL Season"
    }
  };

  // Remove existing structured data if present
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);

  // Add additional meta tags for SEO
  const metaTags = [
    { name: 'keywords', content: config.keywords },
    { name: 'author', content: 'SharpSide Sports' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: config.ogTitle },
    { property: 'og:description', content: config.ogDescription },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: window.location.href },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: config.twitterTitle },
    { name: 'twitter:description', content: config.twitterDescription }
  ];

  metaTags.forEach(tag => {
    const existingTag = document.querySelector(`meta[${tag.name ? 'name' : 'property'}="${tag.name || tag.property}"]`);
    if (existingTag) {
      existingTag.setAttribute('content', tag.content);
    } else {
      const newTag = document.createElement('meta');
      if (tag.name) newTag.name = tag.name;
      if (tag.property) newTag.setAttribute('property', tag.property);
      newTag.content = tag.content;
      document.head.appendChild(newTag);
    }
  });

  return () => {
    // Cleanup: restore original title when component unmounts
    document.title = 'sharpside golf';
  };
};

// Predefined SEO configurations for different stat types
export const NFLStatSEOConfigs = {
  // Offensive Stats
  'passing-yards-per-game': {
    pageTitle: 'NFL Passing Yards per Game 2024 - Team Passing Statistics & Rankings',
    metaDescription: 'NFL passing yards per game statistics for 2024 season. View team passing rankings, passing yards per game leaders, and complete passing statistics for all 32 NFL teams. Updated weekly.',
    keywords: 'NFL passing yards per game, passing yards per game 2024, NFL passing stats, team passing rankings, passing yards leaders, NFL passing statistics, football passing stats',
    ogTitle: 'NFL Passing Yards per Game 2024 - Team Passing Statistics & Rankings',
    ogDescription: 'NFL passing yards per game statistics for 2024 season. View team passing rankings, passing yards per game leaders, and complete passing statistics for all 32 NFL teams.',
    twitterTitle: 'NFL Passing Yards per Game 2024 - Team Passing Statistics & Rankings',
    twitterDescription: 'NFL passing yards per game statistics for 2024 season. View team passing rankings, passing yards per game leaders, and complete passing statistics for all 32 NFL teams.',
    h1Title: 'NFL Passing Yards per Game 2024 - Team Passing Statistics & Rankings',
    h1Description: 'Comprehensive NFL passing yards per game statistics for the 2024 season. View detailed team passing rankings, passing yards per game leaders, and complete passing statistics for all 32 NFL teams.',
    h1SubDescription: 'Updated weekly with the latest NFL passing stats including current season totals, recent performance trends, home and away splits, and historical comparisons.',
    analysisTitle: 'NFL Passing Yards per Game Analysis',
    analysisContent: [
      'Our comprehensive NFL passing yards per game database provides detailed analysis of all 32 teams\' passing performance throughout the 2024 season. This metric is crucial for understanding team offensive strategies, quarterback performance, and overall offensive efficiency.',
      'The passing yards per game statistic measures the average number of passing yards a team gains per game. This includes all passing plays, whether they result in completions or incompletions. Teams with higher passing yards per game typically have more explosive offenses and better quarterback play.',
      'Use these NFL passing stats for fantasy football research, sports betting analysis, or general team performance evaluation. Our rankings help identify the most effective passing offenses in the league and track performance trends throughout the season.'
    ],
    structuredDataName: 'NFL Passing Yards per Game Statistics',
    structuredDataDescription: 'Comprehensive passing yards per game statistics for all NFL teams',
    variableMeasured: 'Passing Yards per Game'
  },
  'yards-per-play': {
    pageTitle: 'NFL Yards per Play 2024 - Team Efficiency Statistics & Rankings',
    metaDescription: 'NFL yards per play statistics for 2024 season. View team efficiency rankings, yards per play leaders, and complete offensive efficiency data for all 32 NFL teams. Updated weekly.',
    keywords: 'NFL yards per play, yards per play 2024, NFL efficiency stats, team efficiency rankings, yards per play leaders, NFL offensive efficiency, football efficiency stats',
    ogTitle: 'NFL Yards per Play 2024 - Team Efficiency Statistics & Rankings',
    ogDescription: 'NFL yards per play statistics for 2024 season. View team efficiency rankings, yards per play leaders, and complete offensive efficiency data for all 32 NFL teams.',
    twitterTitle: 'NFL Yards per Play 2024 - Team Efficiency Statistics & Rankings',
    twitterDescription: 'NFL yards per play statistics for 2024 season. View team efficiency rankings, yards per play leaders, and complete offensive efficiency data for all 32 NFL teams.',
    h1Title: 'NFL Yards per Play 2024 - Team Efficiency Statistics & Rankings',
    h1Description: 'Comprehensive NFL yards per play statistics for the 2024 season. View detailed team efficiency rankings, yards per play leaders, and complete offensive efficiency data for all 32 NFL teams.',
    h1SubDescription: 'Updated weekly with the latest NFL efficiency stats including current season totals, recent performance trends, home and away splits, and historical comparisons.',
    analysisTitle: 'NFL Yards per Play Analysis',
    analysisContent: [
      'Our comprehensive NFL yards per play database provides detailed analysis of all 32 teams\' offensive efficiency throughout the 2024 season. This metric is crucial for understanding team offensive effectiveness, play-calling success, and overall offensive performance.',
      'The yards per play statistic measures the average number of yards a team gains per offensive play. This includes all offensive plays (runs and passes) and is one of the most important metrics for evaluating offensive efficiency. Teams with higher yards per play typically have more explosive offenses and better overall offensive execution.',
      'Use these NFL efficiency stats for fantasy football research, sports betting analysis, or general team performance evaluation. Our rankings help identify the most efficient offenses in the league and track performance trends throughout the season.'
    ],
    structuredDataName: 'NFL Yards per Play Statistics',
    structuredDataDescription: 'Comprehensive yards per play statistics for all NFL teams',
    variableMeasured: 'Yards per Play'
  },
  'points-per-game': {
    pageTitle: 'NFL Points per Game 2024 - Team Scoring Statistics & Rankings',
    metaDescription: 'NFL points per game statistics for 2024 season. View team scoring rankings, points per game leaders, and complete scoring statistics for all 32 NFL teams. Updated weekly.',
    keywords: 'NFL points per game, points per game 2024, NFL scoring stats, team scoring rankings, points per game leaders, NFL scoring statistics, football scoring stats',
    ogTitle: 'NFL Points per Game 2024 - Team Scoring Statistics & Rankings',
    ogDescription: 'NFL points per game statistics for 2024 season. View team scoring rankings, points per game leaders, and complete scoring statistics for all 32 NFL teams.',
    twitterTitle: 'NFL Points per Game 2024 - Team Scoring Statistics & Rankings',
    twitterDescription: 'NFL points per game statistics for 2024 season. View team scoring rankings, points per game leaders, and complete scoring statistics for all 32 NFL teams.',
    h1Title: 'NFL Points per Game 2024 - Team Scoring Statistics & Rankings',
    h1Description: 'Comprehensive NFL points per game statistics for the 2024 season. View detailed team scoring rankings, points per game leaders, and complete scoring statistics for all 32 NFL teams.',
    h1SubDescription: 'Updated weekly with the latest NFL scoring stats including current season totals, recent performance trends, home and away splits, and historical comparisons.',
    analysisTitle: 'NFL Points per Game Analysis',
    analysisContent: [
      'Our comprehensive NFL points per game database provides detailed analysis of all 32 teams\' scoring performance throughout the 2024 season. This metric is crucial for understanding team offensive effectiveness, scoring efficiency, and overall offensive production.',
      'The points per game statistic measures the average number of points a team scores per game. This includes all scoring plays (touchdowns, field goals, extra points, and safeties) and is one of the most important metrics for evaluating offensive success. Teams with higher points per game typically have more effective offenses and better overall scoring ability.',
      'Use these NFL scoring stats for fantasy football research, sports betting analysis, or general team performance evaluation. Our rankings help identify the most effective scoring offenses in the league and track performance trends throughout the season.'
    ],
    structuredDataName: 'NFL Points per Game Statistics',
    structuredDataDescription: 'Comprehensive points per game statistics for all NFL teams',
    variableMeasured: 'Points per Game'
  },
  'rushing-yards-per-game': {
    pageTitle: 'NFL Rushing Yards per Game 2024 - Team Rushing Statistics & Rankings',
    metaDescription: 'NFL rushing yards per game statistics for 2024 season. View team rushing rankings, rushing yards per game leaders, and complete rushing statistics for all 32 NFL teams. Updated weekly.',
    keywords: 'NFL rushing yards per game, rushing yards per game 2024, NFL rushing stats, team rushing rankings, rushing yards leaders, NFL rushing statistics, football rushing stats',
    ogTitle: 'NFL Rushing Yards per Game 2024 - Team Rushing Statistics & Rankings',
    ogDescription: 'NFL rushing yards per game statistics for 2024 season. View team rushing rankings, rushing yards per game leaders, and complete rushing statistics for all 32 NFL teams.',
    twitterTitle: 'NFL Rushing Yards per Game 2024 - Team Rushing Statistics & Rankings',
    twitterDescription: 'NFL rushing yards per game statistics for 2024 season. View team rushing rankings, rushing yards per game leaders, and complete rushing statistics for all 32 NFL teams.',
    h1Title: 'NFL Rushing Yards per Game 2024 - Team Rushing Statistics & Rankings',
    h1Description: 'Comprehensive NFL rushing yards per game statistics for the 2024 season. View detailed team rushing rankings, rushing yards per game leaders, and complete rushing statistics for all 32 NFL teams.',
    h1SubDescription: 'Updated weekly with the latest NFL rushing stats including current season totals, recent performance trends, home and away splits, and historical comparisons.',
    analysisTitle: 'NFL Rushing Yards per Game Analysis',
    analysisContent: [
      'Our comprehensive NFL rushing yards per game database provides detailed analysis of all 32 teams\' rushing performance throughout the 2024 season. This metric is crucial for understanding team offensive strategies, running back effectiveness, and overall ground game success.',
      'The rushing yards per game statistic measures the average number of rushing yards a team gains per game. This includes all rushing plays and is essential for evaluating ground game effectiveness. Teams with higher rushing yards per game typically have more balanced offenses and better overall offensive control.',
      'Use these NFL rushing stats for fantasy football research, sports betting analysis, or general team performance evaluation. Our rankings help identify the most effective rushing offenses in the league and track performance trends throughout the season.'
    ],
    structuredDataName: 'NFL Rushing Yards per Game Statistics',
    structuredDataDescription: 'Comprehensive rushing yards per game statistics for all NFL teams',
    variableMeasured: 'Rushing Yards per Game'
  }
  // Add more configurations for other stats as needed
}; 