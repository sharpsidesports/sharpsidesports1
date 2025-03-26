import { addMonths, format } from 'date-fns';

export interface PerformanceDataPoint {
  date: string;
  value: number;
}

interface KeyPoint {
  date: string;
  value: number;
}

export const generatePerformanceData = (): PerformanceDataPoint[] => {
  const data: PerformanceDataPoint[] = [];
  const startDate = new Date('2020-01-01');
  const endDate = new Date('2024-12-31');
  
  // We'll start at 100 (representing 100%) and calculate values relative to this
  const baseValue = 100;
  
  const keyPoints = [
    { date: '2020-01-01', value: 100 },    // Start at 100%
    { date: '2020-02-01', value: 85 },     // Initial dip
    { date: '2020-05-01', value: 120 },    // Recovery
    { date: '2020-08-01', value: 150 },
    { date: '2020-12-01', value: 180 },
    { date: '2021-04-01', value: 220 },
    { date: '2021-08-01', value: 260 },
    { date: '2021-12-01', value: 300 },
    { date: '2022-04-01', value: 340 },
    { date: '2022-08-01', value: 320 },    // First dip
    { date: '2022-12-01', value: 360 },
    { date: '2023-04-01', value: 400 },
    { date: '2023-08-01', value: 380 },    // Second dip
    { date: '2023-12-01', value: 440 },
    { date: '2024-04-01', value: 500 },
    { date: '2024-08-01', value: 540 },
    { date: '2024-12-31', value: 576.5 }   // Final target (476.5% gain = 576.5)
  ];

  let currentDate = startDate;
  while (currentDate <= endDate) {
    // Find surrounding points for interpolation
    const prevPoint = [...keyPoints].reverse().find(point => 
      new Date(point.date) <= currentDate
    );
    const nextPoint = keyPoints.find(point => 
      new Date(point.date) > currentDate
    );

    let value;
    if (prevPoint && nextPoint) {
      // Linear interpolation
      const prevTime = new Date(prevPoint.date).getTime();
      const nextTime = new Date(nextPoint.date).getTime();
      const currentTime = currentDate.getTime();
      
      const progress = (currentTime - prevTime) / (nextTime - prevTime);
      value = prevPoint.value + (nextPoint.value - prevPoint.value) * progress;
    } else {
      // Use nearest point if we're at the edges
      value = prevPoint ? prevPoint.value : nextPoint!.value;
    }

    data.push({
      date: currentDate.toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'short'
      }),
      value: value
    });

    currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
  }

  return data;
};

export const calculateMetrics = (data: PerformanceDataPoint[]) => {
  const startValue = data[0].value;
  const endValue = data[data.length - 1].value;
  const percentageGained = ((endValue - startValue) / startValue * 100).toFixed(1);

  return {
    totalUnits: "2321.00",
    roiPerWager: "4.77",
    percentageGained: "476.5%",
    weeklyROI: "3.46%"
  };
};