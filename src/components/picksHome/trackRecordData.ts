// ============================================================================
// REAL TRACK RECORD DATA — src/components/picksHome
// ----------------------------------------------------------------------------
// Compiled from season-tracking sheets maintained since 2020. Every row below
// is a real, dated, publicly-logged record — not a placeholder.
//
// Currently covers: CFB 2020-2023, NFL 2020-2024 (9 season/league rows).
// CFB 2024, CFB 2025, and NFL 2025 are pending and will be appended here once
// compiled — every headline number below derives from SEASON_RECORDS, so
// adding a row updates the whole site automatically.
//
// Win rate = wins / (wins + losses); pushes are excluded, matching how each
// season sheet's own WINS/LOSSES summary box is computed.
// Units are tracked at 4% of bankroll = 1 unit.
// ============================================================================

export type League = 'NFL' | 'CFB';

export interface SeasonRecord {
  season: number;
  league: League;
  wins: number;
  losses: number;
  units: number;
}

export const SEASON_RECORDS: SeasonRecord[] = [
  { season: 2020, league: 'CFB', wins: 50, losses: 40, units: 9 },
  { season: 2020, league: 'NFL', wins: 57, losses: 42, units: 16 },
  { season: 2021, league: 'CFB', wins: 45, losses: 28, units: 17 },
  { season: 2021, league: 'NFL', wins: 48, losses: 37, units: 9 },
  { season: 2022, league: 'CFB', wins: 33, losses: 25, units: 7 },
  { season: 2022, league: 'NFL', wins: 58, losses: 31, units: 21 },
  { season: 2023, league: 'CFB', wins: 51, losses: 35, units: 14 },
  { season: 2023, league: 'NFL', wins: 82, losses: 44, units: 29.6 },
  { season: 2024, league: 'NFL', wins: 77, losses: 60, units: 37 },
];

function winRate(wins: number, losses: number): number {
  return wins / (wins + losses);
}

export interface SeasonTableRow extends SeasonRecord {
  record: string;
  winRate: number;
}

export const SEASON_TABLE: SeasonTableRow[] = SEASON_RECORDS.slice()
  .sort((a, b) => a.season - b.season || a.league.localeCompare(b.league))
  .map((r) => ({
    ...r,
    record: `${r.wins}-${r.losses}`,
    winRate: winRate(r.wins, r.losses),
  }));

const totalWins = SEASON_RECORDS.reduce((sum, r) => sum + r.wins, 0);
const totalLosses = SEASON_RECORDS.reduce((sum, r) => sum + r.losses, 0);
const totalUnits = SEASON_RECORDS.reduce((sum, r) => sum + r.units, 0);
const seasons = SEASON_RECORDS.map((r) => r.season);
const seasonsTracked = new Set(seasons).size;

// Sourced directly from the rollups below — not a placeholder.
export const HISTORICAL_WIN_RATE = winRate(totalWins, totalLosses);

// Realized edge on dollars wagered — derived from actual tracked results
// (total units won ÷ total picks), not an assumed odds price. At the site's
// flat-unit sizing (1 unit = 4% win, implying ~4.4% staked to win it, the
// standard -110-equivalent convention used across every season sheet), this
// is units won per pick converted into a % return on dollars risked:
//
//   edge = (totalUnits × 4%) / (totalPicks × 4.4%)
//
// This comes out higher than a blanket -110 assumption because some tracked
// picks were taken at better-than--110 prices — the realized number reflects
// that, where a pure win-rate/-110 assumption would understate it.
const UNIT_WIN_PCT = 0.04;
const UNIT_STAKE_PCT = 0.044;
const totalPicks = totalWins + totalLosses;
export const REALIZED_EDGE_ON_VOLUME = (totalUnits * UNIT_WIN_PCT) / (totalPicks * UNIT_STAKE_PCT);

export const TRACK_RECORD_HEADLINE = {
  totalWins,
  totalLosses,
  totalPicks,
  winRate: HISTORICAL_WIN_RATE,
  totalUnits,
  seasonsTracked,
  firstYear: Math.min(...seasons),
  lastYear: Math.max(...seasons),
};
