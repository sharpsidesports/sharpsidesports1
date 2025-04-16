import { FantasyPlayer, FantasyLineup, FantasySettings } from '../../types/fantasy.js';

interface LineupConstraints {
  totalSalary: number;
  playerCount: number;
}

const CONSTRAINTS: Record<string, Omit<LineupConstraints, 'totalSalary'>> = {
  draftkings: {
    playerCount: 6
  },
  fanduel: {
    playerCount: 6
  }
};

export function generateOptimalLineups(
  players: FantasyPlayer[],
  settings: FantasySettings,
  lockedPlayers: string[],
  excludedPlayers: string[]
): FantasyLineup[] {
  const siteConstraints = CONSTRAINTS[settings.site];
  if (!siteConstraints) {
    throw new Error(`Unsupported site: ${settings.site}`);
  }

  const constraints: LineupConstraints = {
    ...siteConstraints,
    totalSalary: settings.budget
  };

  // Filter out excluded players and get available players
  const availablePlayers = players.filter(p => !excludedPlayers.includes(p.id));

  // Ensure we have enough players
  if (availablePlayers.length < constraints.playerCount) {
    throw new Error(`Not enough players available. Need ${constraints.playerCount} players.`);
  }

  // Start with locked players
  const lockedPlayerObjects = availablePlayers.filter(p => lockedPlayers.includes(p.id));
  const remainingPlayers = availablePlayers.filter(p => !lockedPlayers.includes(p.id));

  // Sort remaining players by projected points per dollar
  const sortedPlayers = remainingPlayers.sort((a, b) => {
    const aValue = a.projectedPoints / a.salary;
    const bValue = b.projectedPoints / b.salary;
    return bValue - aValue;
  });

  const lineups: FantasyLineup[] = [];
  const numLineupsToGenerate = Math.min(settings.lineups, 10); // Cap at 10 lineups for now

  for (let i = 0; i < numLineupsToGenerate; i++) {
    try {
      const lineup = generateSingleLineup(
        sortedPlayers,
        lockedPlayerObjects,
        constraints,
        settings,
        lineups
      );
      lineups.push(lineup);
    } catch (error) {
      console.error('Failed to generate lineup:', error);
      break;
    }
  }

  return lineups;
}

function generateSingleLineup(
  sortedPlayers: FantasyPlayer[],
  lockedPlayers: FantasyPlayer[],
  constraints: LineupConstraints,
  settings: FantasySettings,
  existingLineups: FantasyLineup[]
): FantasyLineup {
  const lineup: FantasyPlayer[] = [...lockedPlayers];
  let remainingSalary = constraints.totalSalary;
  let remainingSpots = constraints.playerCount - lineup.length;

  // Subtract locked players' salaries
  remainingSalary -= lockedPlayers.reduce((sum, p) => sum + p.salary, 0);

  // Try to fill remaining spots with best value players that fit under salary cap
  for (const player of sortedPlayers) {
    // Skip if player is already in lineup
    if (lineup.some(p => p.id === player.id)) continue;

    // Check if adding this player would exceed salary cap
    if (player.salary > remainingSalary) continue;

    // Check if adding this player would make it impossible to fill remaining spots
    const minSalaryForRemaining = (remainingSpots - 1) * Math.min(...sortedPlayers.map(p => p.salary));
    if (player.salary + minSalaryForRemaining > remainingSalary) continue;

    // Check if player is already heavily used in other lineups (exposure limit)
    const playerExposure = existingLineups.filter(l => 
      l.players.includes(player.id)
    ).length / Math.max(existingLineups.length, 1);

    if (playerExposure * 100 >= settings.maxExposure) continue;

    lineup.push(player);
    remainingSalary -= player.salary;
    remainingSpots--;

    if (remainingSpots === 0) break;
  }

  // If we couldn't fill all spots, throw an error
  if (remainingSpots > 0) {
    throw new Error('Could not fill all lineup spots within salary constraints');
  }

  // Calculate lineup stats
  const totalSalary = lineup.reduce((sum, p) => sum + p.salary, 0);
  const projectedPoints = lineup.reduce((sum, p) => sum + p.projectedPoints, 0);

  return {
    id: Math.random().toString(36).substr(2, 9),
    players: lineup.map(p => p.id),
    totalSalary,
    projectedPoints
  };
}
