import { Course } from '../../types/courseFit';

export const mockCourses: Course[] = [
  {
    id: 'augusta',
    name: 'Augusta National',
    length: 7510,
    par: 72,
    attributes: {
      drivingDistance: 0.75,
      drivingAccuracy: 0.85,
      approach: 0.90,
      aroundGreen: 0.95,
      putting: 0.95
    },
    scoring: {
      par3: 3.2,
      par4: 4.2,
      par5: 4.6
    },
    stats: {
      fairwayWidth: 28,
      greenSize: 6500,
      greenSpeed: 13.5,
      avgScore: 71.2
    }
  },
  {
    id: 'sawgrass',
    name: 'TPC Sawgrass',
    length: 7245,
    par: 72,
    attributes: {
      gir: 0.85,
      drivingDistance: 0.65,
      drivingAccuracy: 0.90,
      approach: 0.85,
      aroundGreen: 0.80,
      putting: 0.75
    },
    scoring: {
      par3: 3.1,
      par4: 4.1,
      par5: 4.7
    },
    stats: {
      fairwayWidth: 26,
      greenSize: 5500,
      greenSpeed: 12.5,
      avgScore: 71.5
    }
  },
  {
    id: 'pebble',
    name: 'Pebble Beach',
    length: 7075,
    par: 72,
    attributes: {
      drivingDistance: 0.60,
      drivingAccuracy: 0.85,
      approach: 0.90,
      aroundGreen: 0.90,
      putting: 0.85
    },
    scoring: {
      par3: 3.0,
      par4: 4.1,
      par5: 4.8
    },
    stats: {
      fairwayWidth: 24,
      greenSize: 3500,
      greenSpeed: 12.0,
      avgScore: 71.8
    }
  },
  {
    id: 'oakhill',
    name: 'Oak Hill',
    length: 7394,
    par: 70,
    attributes: {
      drivingDistance: 0.70,
      drivingAccuracy: 0.95,
      approach: 0.85,
      aroundGreen: 0.75,
      putting: 0.70
    },
    scoring: {
      par3: 3.2,
      par4: 4.2,
      par5: 4.7
    },
    stats: {
      fairwayWidth: 25,
      greenSize: 5000,
      greenSpeed: 12.8,
      avgScore: 70.9
    }
  },
  {
    id: 'riviera',
    name: 'Riviera',
    length: 7322,
    par: 71,
    attributes: {
      drivingDistance: 0.70,
      drivingAccuracy: 0.85,
      approach: 0.90,
      aroundGreen: 0.85,
      putting: 0.80
    },
    scoring: {
      par3: 3.1,
      par4: 4.1,
      par5: 4.6
    },
    stats: {
      fairwayWidth: 27,
      greenSize: 5200,
      greenSpeed: 12.2,
      avgScore: 71.3
    }
  },
  {
    id: 'bay-hill',
    name: 'Bay Hill',
    length: 7466,
    par: 72,
    attributes: {
      drivingDistance: 0.80,
      drivingAccuracy: 0.75,
      approach: 0.80,
      aroundGreen: 0.70,
      putting: 0.75
    },
    scoring: {
      par3: 3.2,
      par4: 4.2,
      par5: 4.5
    },
    stats: {
      fairwayWidth: 30,
      greenSize: 6000,
      greenSpeed: 12.5,
      avgScore: 72.0
    }
  }
];