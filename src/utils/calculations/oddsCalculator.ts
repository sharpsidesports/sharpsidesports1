export const calculateImpliedProbability = (odds: number): number => {
  if (!odds) return 0;
  
  if (odds > 0) {
    return (100 / (odds + 100)) * 100;
  }
  
  return (Math.abs(odds) / (Math.abs(odds) + 100)) * 100;
};

export const calculatePayout = (odds: number, betAmount: number): number => {
  if (!odds || !betAmount) return 0;
  
  if (odds > 0) {
    return (betAmount * (odds / 100));
  }
  
  return (betAmount * (100 / Math.abs(odds)));
};