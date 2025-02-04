export const ENDPOINTS = {
  RANKINGS: 'preds/get-dg-rankings',
  APPROACH_SKILL: 'preds/approach-skill',
  SKILL_RATINGS: 'preds/skill-ratings',
  HISTORICAL_ROUNDS: 'historical-raw-data/rounds',
  EVENT_LIST: 'historical-raw-data/event-list',
  BETTING_ODDS: 'betting-tools/outrights',
  MATCHUPS: 'betting-tools/matchups',
  DFS_EVENT_LIST: 'historical-dfs-data/event-list',
  DFS_POINTS: 'historical-dfs-data/points',
} as const;