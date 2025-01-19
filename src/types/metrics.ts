export type SharpsideMetric = 
  | 'Total'
  | 'OTT'
  | 'APP'
  | 'ARG'
  | 'T2G'
  | 'P'
  | 'BS'
  | 'DrivingAcc'
  | 'DrivingDist'
  | 'Prox100_125'
  | 'Prox125_150'
  | 'Prox175_200'
  | 'Prox200_225'
  | 'Prox225Plus'
  // Scoring metrics
  | 'BogeyAvoid'
  | 'ConsecBirdies'
  | 'ConsecBirdiesEagles'
  | 'TotalEagles'
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
  | 'ConsecHolesUnderPar'

export interface MetricWeight {
  metric: SharpsideMetric;
  weight: number;
}

export const METRICS: SharpsideMetric[] = [
  'Total', 'OTT', 'APP', 'ARG', 'T2G', 'P', 'BS', 'DrivingAcc', 'DrivingDist',
  'Prox100_125', 'Prox125_150', 'Prox175_200', 'Prox200_225', 'Prox225Plus',
  // Scoring metrics
  'BogeyAvoid', 'ConsecBirdies', 'ConsecBirdiesEagles', 'TotalEagles', 'TotalBirdies',
  'Par3BirdieOrBetter', 'Par4BirdieOrBetter', 'Par5BirdieOrBetter', 'BirdieConversion',
  'Par3Scoring', 'Par4Scoring', 'Par5Scoring', 'EaglesPerHole', 'BirdieAvg',
  'BirdieOrBetterPct', 'ConsecHolesUnderPar'
];

export const METRIC_LABELS: Record<SharpsideMetric, string> = {
  'Total': 'Total',
  'OTT': 'Off the Tee',
  'APP': 'Approach',
  'ARG': 'Around Green',
  'T2G': 'Tee to Green',
  'P': 'Putting',
  'BS': 'Ball Striking',
  'DrivingAcc': 'Driving Accuracy',
  'DrivingDist': 'Driving Distance',
  'Prox100_125': 'Proximity 100-125',
  'Prox125_150': 'Proximity 125-150',
  'Prox175_200': 'Proximity 175-200',
  'Prox200_225': 'Proximity 200-225',
  'Prox225Plus': 'Proximity 225+',
  // Scoring metrics
  'BogeyAvoid': 'Bogey Avoidance',
  'ConsecBirdies': 'Consecutive Birdies',
  'ConsecBirdiesEagles': 'Consecutive Birdies/Eagles',
  'TotalEagles': 'Total Eagles',
  'TotalBirdies': 'Total Birdies',
  'Par3BirdieOrBetter': 'Par 3 Birdie or Better',
  'Par4BirdieOrBetter': 'Par 4 Birdie or Better',
  'Par5BirdieOrBetter': 'Par 5 Birdie or Better',
  'BirdieConversion': 'Birdie Conversion',
  'Par3Scoring': 'Par 3 Scoring Average',
  'Par4Scoring': 'Par 4 Scoring Average',
  'Par5Scoring': 'Par 5 Scoring Average',
  'EaglesPerHole': 'Eagles per Hole',
  'BirdieAvg': 'Birdie Average',
  'BirdieOrBetterPct': 'Birdie or Better %',
  'ConsecHolesUnderPar': 'Consecutive Holes Under Par'
};

export const METRIC_CATEGORIES = {
  GENERAL: ['Total', 'OTT', 'APP', 'ARG', 'T2G', 'DrivingAcc', 'DrivingDist', 'P', 'BS'] as SharpsideMetric[],
  PROXIMITY: ['Prox100_125', 'Prox125_150', 'Prox175_200', 'Prox200_225', 'Prox225Plus'] as SharpsideMetric[],
  SCORING: [
    'BogeyAvoid', 'ConsecBirdies', 'ConsecBirdiesEagles', 'TotalEagles', 'TotalBirdies',
    'Par3BirdieOrBetter', 'Par4BirdieOrBetter', 'Par5BirdieOrBetter', 'BirdieConversion',
    'Par3Scoring', 'Par4Scoring', 'Par5Scoring', 'EaglesPerHole', 'BirdieAvg',
    'BirdieOrBetterPct', 'ConsecHolesUnderPar'
  ] as SharpsideMetric[]
};