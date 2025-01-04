export type SGMetric = 
  | 'Total'
  | 'OTT'
  | 'APP'
  | 'ARG'
  | 'T2G'
  | 'P'
  | 'BS'
  | 'Par3Under125'
  | 'Par3_125_150'
  | 'Par3_150_175'
  | 'Par3_175_200'
  | 'Par3Over200'
  // | 'Par4Under400'
  // | 'Par4_400_450'
  // | 'Par4_450_500'
  // | 'Par4Over500'
  // | 'Par5Under500'
  // | 'Par5_500_550'
  // | 'Par5_550_600'
  // | 'Par5Over600'
  | 'Prox100_125'
  | 'Prox125_150'
  | 'Prox175_200'
  | 'Prox200_225'
  | 'Prox225Plus'

export interface MetricWeight {
  metric: SGMetric;
  weight: number;
}

export const METRICS: SGMetric[] = [
  'Total', 'OTT', 'APP', 'ARG', 'T2G', 'P', 'BS',
  'Par3Under125', 'Par3_125_150', 'Par3_150_175', 'Par3_175_200', 'Par3Over200',
  // 'Par4Under400', 'Par4_400_450', 'Par4_450_500', 'Par4Over500',
  // 'Par5Under500', 'Par5_500_550', 'Par5_550_600', 'Par5Over600',
  'Prox100_125', 'Prox125_150', 'Prox175_200', 'Prox200_225', 'Prox225Plus',
];

export const METRIC_LABELS: Record<SGMetric, string> = {
  'Total': 'Total',
  'OTT': 'Off the Tee',
  'APP': 'Approach',
  'ARG': 'Around Green',
  'T2G': 'Tee to Green',
  'P': 'Putting',
  'BS': 'Ball Striking',
  'Par3Under125': 'Par 3 (<125)',
  'Par3_125_150': 'Par 3 (125-150)',
  'Par3_150_175': 'Par 3 (150-175)',
  'Par3_175_200': 'Par 3 (175-200)',
  'Par3Over200': 'Par 3 (200+)',
  // 'Par4Under400': 'Par 4 (<400)',
  // 'Par4_400_450': 'Par 4 (400-450)',
  // 'Par4_450_500': 'Par 4 (450-500)',
  // 'Par4Over500': 'Par 4 (500+)',
  // 'Par5Under500': 'Par 5 (<500)',
  // 'Par5_500_550': 'Par 5 (500-550)',
  // 'Par5_550_600': 'Par 5 (550-600)',
  // 'Par5Over600': 'Par 5 (600+)',
  'Prox100_125': 'Proximity 100-125',
  'Prox125_150': 'Proximity 125-150',
  'Prox175_200': 'Proximity 175-200',
  'Prox200_225': 'Proximity 200-225',
  'Prox225Plus': 'Proximity 225+',
};

export const METRIC_CATEGORIES = {
  GENERAL: ['Total', 'OTT', 'APP', 'ARG', 'T2G', 'P', 'BS'] as SGMetric[],
  PAR3: ['Par3Under125', 'Par3_125_150', 'Par3_150_175', 'Par3_175_200', 'Par3Over200'] as SGMetric[],
  // PAR4: ['Par4Under400', 'Par4_400_450', 'Par4_450_500', 'Par4Over500'] as SGMetric[],
  // PAR5: ['Par5Under500', 'Par5_500_550', 'Par5_550_600', 'Par5Over600'] as SGMetric[],
  PROXIMITY: ['Prox100_125', 'Prox125_150', 'Prox175_200', 'Prox200_225', 'Prox225Plus'] as SGMetric[]
};