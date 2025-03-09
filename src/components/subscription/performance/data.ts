import { addMonths, format } from 'date-fns';

export interface PerformanceDataPoint {
  date: string;
  value: number;
}

export const generatePerformanceData = (): PerformanceDataPoint[] => {
  const data: PerformanceDataPoint[] = [];
  let value = 1000; // Starting value
  
  // Start from December 2019
  const startDate = new Date(2019, 11, 1);
  const monthsToGenerate = 48; // 4 years of data
  
  for (let i = 0; i < monthsToGenerate; i++) {
    const currentDate = addMonths(startDate, i);
    
    // Major market events with increased volatility
    if (i === 3) { // COVID crash (March 2020)
      value *= 0.65; // Sharper 35% decline
    } else if (i > 3 && i <= 8) { // Recovery period (April-August 2020)
      value *= 1.12 + (Math.random() * 0.05); // Strong volatile recovery
    } else if (i > 8 && i <= 20) { // 2021 Bull market
      value *= 1.035 + (Math.random() * 0.03); // Strong growth with volatility
    } else if (i > 20 && i <= 32) { // 2022 Bear market
      value *= 0.975 + (Math.random() * 0.02); // Decline with volatility
    } else if (i > 32) { // 2023-2024 Recovery
      value *= 1.025 + (Math.random() * 0.04); // Growth with higher volatility
    }
    
    // Add increased random volatility
    const baseVolatility = 0.08;
    const randomFactor = (Math.random() - 0.5) * baseVolatility;
    
    // Add occasional sharp movements
    const sharpMove = Math.random() > 0.85 ? (Math.random() - 0.5) * 0.1 : 0;
    
    value *= (1 + randomFactor + sharpMove);
    value *= 1.002; // Small positive bias
    
    data.push({
      date: format(currentDate, 'MMM yy'),
      value: Math.round(value)
    });
  }
  
  return data;
};

export const calculateMetrics = (data: PerformanceDataPoint[]) => {
  const startValue = data[0].value;
  const endValue = data[data.length - 1].value;
  const totalReturn = ((endValue - startValue) / startValue) * 100;
  const totalUnits = endValue - startValue;
  
  return {
    totalReturn: totalReturn.toFixed(2),
    totalUnits: totalUnits.toFixed(2),
    roiPerWager: (totalReturn / 48).toFixed(2) // Average monthly ROI
  };
};