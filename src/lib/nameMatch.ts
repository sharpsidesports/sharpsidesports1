// Normalizes player names so ESPN's naming and a sportsbook's naming for the
// same person compare equal (periods, apostrophes, hyphens, suffixes).

const SUFFIXES = new Set(['jr', 'sr', 'ii', 'iii', 'iv', 'v']);

export function normalizePlayerName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[.’']/g, '')
    .replace(/-/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => !SUFFIXES.has(token))
    .join(' ')
    .trim();
}
