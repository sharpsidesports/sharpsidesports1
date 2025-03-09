// Function to generate a random factor for score calculation
export const generateRandomFactor = (): number => {
  // Generate a random number between -0.5 and 0.5
  // Increased range for more potential upsets
  return (Math.random() - 0.5);
};