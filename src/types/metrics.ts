export type SharpsideMetric = 
  | 'Total'
  | 'OTT'
  | 'APP'
  | 'ARG'
  | 'T2G'
  | 'P'
  | 'BS'
  | 'gir'
  | 'DrivingAcc'
  | 'DrivingDist'
  | 'Prox100_125'
  | 'Prox125_150'
  | 'Prox175_200'
  | 'Prox200_225'
  | 'Prox225Plus'
  // Scoring metrics
  | 'BogeyAvoid'
  | 'TotalBirdies'
  | 'Par3BirdieOrBetter'
  | 'Par4BirdieOrBetter'
  | 'Par5BirdieOrBetter'
  | 'BirdieConversion'
  | 'Par3Scoring'
  | 'Par4Scoring'
  | 'Par5Scoring'
  | 'EaglesPerHole'
  | 'BirdieAvg'
  | 'BirdieOrBetterPct'

export interface MetricWeight {
  metric: SharpsideMetric;
  weight: number;
}

export const METRICS: SharpsideMetric[] = [
  'Total', 'OTT', 'APP', 'ARG', 'T2G', 'P', 'BS', 'gir', 'DrivingAcc', 'DrivingDist',
  'Prox100_125', 'Prox125_150', 'Prox175_200', 'Prox200_225', 'Prox225Plus',
  // Scoring metrics
  'BogeyAvoid', 'TotalBirdies',
  'Par3BirdieOrBetter', 'Par4BirdieOrBetter', 'Par5BirdieOrBetter', 'BirdieConversion',
  'Par3Scoring', 'Par4Scoring', 'Par5Scoring', 'EaglesPerHole', 'BirdieAvg',
  'BirdieOrBetterPct'
];

export const METRIC_LABELS: Record<SharpsideMetric, string> = {
  'Total': 'Total',
  'OTT': 'Off the Tee',
  'APP': 'Approach',
  'ARG': 'Around Green',
  'T2G': 'Tee to Green',
  'P': 'Putting',
  'BS': 'Ball Striking',
  'gir': 'GIR',
  'DrivingAcc': 'Driving Accuracy',
  'DrivingDist': 'Driving Distance',
  'Prox100_125': 'Proximity 100-125',
  'Prox125_150': 'Proximity 125-150',
  'Prox175_200': 'Proximity 175-200',
  'Prox200_225': 'Proximity 200-225',
  'Prox225Plus': 'Proximity 225+',
  // Scoring metrics
  'BogeyAvoid': 'Bogey Avoidance',
  'TotalBirdies': 'Total Birdies',
  'Par3BirdieOrBetter': 'Par 3 Birdie or Better',
  'Par4BirdieOrBetter': 'Par 4 Birdie or Better',
  'Par5BirdieOrBetter': 'Par 5 Birdie or Better',
  'BirdieConversion': 'Birdie Conversion',
  'Par3Scoring': 'Par 3 Efficiency',
  'Par4Scoring': 'Par 4 Efficiency',
  'Par5Scoring': 'Par 5 Efficiency',
  'EaglesPerHole': 'Eagles per Hole',
  'BirdieAvg': 'Birdie Average',
  'BirdieOrBetterPct': 'Birdie or Better %',
};

export const METRIC_CATEGORIES = {
  GENERAL: ['Total', 'OTT', 'APP', 'ARG', 'T2G', 'gir', 'DrivingAcc', 'DrivingDist', 'P', 'BS'] as SharpsideMetric[],
  PROXIMITY: ['Prox100_125', 'Prox125_150', 'Prox175_200', 'Prox200_225', 'Prox225Plus'] as SharpsideMetric[],
  SCORING: [
    'BogeyAvoid', 'TotalBirdies',
    'Par3BirdieOrBetter', 'Par4BirdieOrBetter', 'Par5BirdieOrBetter', 'BirdieConversion',
    'Par3Scoring', 'Par4Scoring', 'Par5Scoring', 'EaglesPerHole', 'BirdieAvg',
    'BirdieOrBetterPct'
  ] as SharpsideMetric[]
};