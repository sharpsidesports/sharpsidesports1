import { Golfer } from '../../types/golf';
import { FantasyLineup, FantasySettings } from '../../types/fantasy';

export function optimizeLineups(
  golfers: Golfer[],
  settings: FantasySettings,
  lockedPlayers: string[],
  excludedPlayers: string[]
): FantasyLineup[] {
  // Filter out excluded players and get available players
  const availablePlayers = golfers.filter(g => !excludedPlayers.includes(g.id));
  
  // Ensure locked players are included
  const lockedGolfers = golfers.filter(g => lockedPlayers.includes(g.id));
  
  // Simple optimization strategy for now - we'll enhance this later
  const lineups: FantasyLineup[] = [];
  
  for (let i = 0; i < settings.lineups; i++) {
    // Start with locked players
    const lineup: string[] = [...lockedPlayers];
    let totalSalary = lockedGolfers.reduce((sum, g) => sum + (g.salary || 0), 0);
    
    // Add remaining players based on value (projected points per dollar)
    const remainingSpots = 6 - lineup.length;
    const remainingSalary = settings.budget - totalSalary;
    
    const availableForLineup = availablePlayers
      .filter(g => !lineup.includes(g.id))
      .sort((a, b) => {
        const aValue = a.simulationStats.winPercentage / (a.salary || 1);
        const bValue = b.simulationStats.winPercentage / (b.salary || 1);
        return bValue - aValue;
      });
    
    for (const player of availableForLineup) {
      if (lineup.length >= 6) break;
      if ((player.salary || 0) + totalSalary <= remainingSalary) {
        lineup.push(player.id);
        totalSalary += player.salary || 0;
      }
    }
    
    if (lineup.length === 6 && totalSalary >= settings.minSalary) {
      lineups.push({
        id: `lineup-${i + 1}`,
        players: lineup,
        totalSalary,
        projectedPoints: lineup.reduce((sum, id) => {
          const golfer = golfers.find(g => g.id === id);
          return sum + (golfer?.simulationStats.winPercentage || 0);
        }, 0)
      });
    }
  }
  
  return lineups;
}