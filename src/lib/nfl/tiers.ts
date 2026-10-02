// Presentation-only tiering for heat-map cells/badges — not part of any
// model score. Thresholds per the Sharpside TD-model UX brief: Elite = top
// 10%, Strong = top 25%, Low = bottom 25%, else Neutral.
export type Tier = 'elite' | 'strong' | 'neutral' | 'low';

export function getTier(percentile: number | null): Tier {
  if (percentile === null) return 'neutral';
  if (percentile >= 0.9) return 'elite';
  if (percentile >= 0.75) return 'strong';
  if (percentile < 0.25) return 'low';
  return 'neutral';
}
