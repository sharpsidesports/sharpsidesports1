// server-only helper
// Generic fetcher for nflverse-data GitHub release CSV assets
// (https://github.com/nflverse/nflverse-data/releases). Only imported by
// Node code (Vercel Serverless Functions, scripts) — never the frontend.

import { parse } from 'csv-parse/sync';

const NFLVERSE_RELEASE_BASE = 'https://github.com/nflverse/nflverse-data/releases/download';

export class NflverseFetchError extends Error {
  constructor(public readonly tag: string, public readonly file: string, message: string) {
    super(`nflverse fetch failed (${tag}/${file}): ${message}`);
    this.name = 'NflverseFetchError';
  }
}

export interface NflverseCsvResult<T> {
  rows: T[];
  fetchedAt: string;
  sourceUrl: string;
}

// Fetches and parses a single CSV asset from a nflverse-data release.
// Never returns an empty array to represent "fetch failed" — throws instead,
// so callers can tell a real failure apart from "no rows for this filter."
export async function fetchNflverseCsv<T = Record<string, string>>(
  tag: string,
  file: string
): Promise<NflverseCsvResult<T>> {
  const sourceUrl = `${NFLVERSE_RELEASE_BASE}/${tag}/${file}`;
  let res: Response;
  try {
    res = await fetch(sourceUrl);
  } catch (err) {
    throw new NflverseFetchError(tag, file, err instanceof Error ? err.message : 'network error');
  }
  if (!res.ok) {
    throw new NflverseFetchError(tag, file, `HTTP ${res.status}`);
  }
  const text = await res.text();
  let rows: T[];
  try {
    rows = parse(text, { columns: true, skip_empty_lines: true }) as T[];
  } catch (err) {
    throw new NflverseFetchError(tag, file, `CSV parse error: ${err instanceof Error ? err.message : String(err)}`);
  }
  return { rows, fetchedAt: new Date().toISOString(), sourceUrl };
}
