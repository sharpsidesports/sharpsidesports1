import { MetricWeight } from './metrics';

export interface AnalyticalModel {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  weights: MetricWeight[];
}