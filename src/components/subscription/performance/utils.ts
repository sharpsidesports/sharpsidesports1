import { PerformanceDataPoint } from './data';

export const calculateMetrics = (data: PerformanceDataPoint[]) => {
  const startValue = data[0].value;
  const endValue = data[data.length - 1].value;
  const totalUnits = endValue - startValue;
  const roiPerWager = ((endValue - startValue) / startValue / 48) * 100; // Monthly average

  return {
    totalUnits: totalUnits.toFixed(2),
    roiPerWager: roiPerWager.toFixed(2)
  };
};