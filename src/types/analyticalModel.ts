import { MetricWeight } from './metrics.js';

export interface AnalyticalModel {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  weights: MetricWeight[];
}