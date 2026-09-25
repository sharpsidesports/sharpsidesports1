// Groups a flat player list into one entry per game ("TEAM @ OPP"), the way
// the reference product's Game Vault does — instead of one entry per team.
// Players with no resolvable opponent (BYE week, or opponent not yet known)
// are dropped from the grouped view; there's no "matchup" to place them in.

export interface MatchupGroup<T> {
  key: string; // sorted "TEAMA-TEAMB", stable regardless of home/away
  teamA: string;
  teamB: string;
  players: T[]; // sorted by score descending (caller passes a scoreOf accessor)
}

export function groupByMatchup<T>(
  players: T[],
  teamOf: (p: T) => string,
  opponentOf: (p: T) => string | null,
  scoreOf: (p: T) => number | null
): MatchupGroup<T>[] {
  const groups = new Map<string, MatchupGroup<T>>();

  for (const player of players) {
    const team = teamOf(player);
    const opponent = opponentOf(player);
    if (!opponent) continue; // BYE / unknown opponent — no game to group into

    const [teamA, teamB] = [team, opponent].sort();
    const key = `${teamA}-${teamB}`;

    let group = groups.get(key);
    if (!group) {
      group = { key, teamA, teamB, players: [] };
      groups.set(key, group);
    }
    group.players.push(player);
  }

  for (const group of groups.values()) {
    group.players.sort((a, b) => (scoreOf(b) ?? -Infinity) - (scoreOf(a) ?? -Infinity));
  }

  return Array.from(groups.values());
}
