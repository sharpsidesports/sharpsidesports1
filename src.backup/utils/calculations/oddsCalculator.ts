export const parseAmericanOdds = (oddsString: string | number): number => {
  if (typeof oddsString === 'number') return oddsString;
  if (!oddsString || oddsString === 'N/A') return 0;
  
  // Remove any whitespace and handle the plus sign
  const cleanOdds = oddsString.trim();
  return parseInt(cleanOdds, 10);
};

export const calculateImpliedProbability = (americanOdds: string | number): number => {
  const odds = parseAmericanOdds(americanOdds);
  if (!odds) return 0;
  
  // Convert American odds to implied probability
  if (odds > 0) {
    // Positive American odds (e.g. +150)
    return 100 / (odds + 100); // Already returns percentage between 0-100
  } else {
    // Negative American odds (e.g. -150)
    return (Math.abs(odds) / (Math.abs(odds) + 100)) * 100;
  }
};

export const calculatePayout = (odds: number, betAmount: number): number => {
  if (!odds || !betAmount) return 0;
  
  if (odds > 0) {
    return (betAmount * (odds / 100));
  }
  
  return (betAmount * (100 / Math.abs(odds)));
};

export const formatAmericanOdds = (odds: string | number): string => {
  if (!odds) return 'N/A';
  const numOdds = parseAmericanOdds(odds);
  return numOdds > 0 ? `+${numOdds}` : numOdds.toString();
};