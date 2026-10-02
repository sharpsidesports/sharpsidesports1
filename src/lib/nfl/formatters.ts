export function formatOdds(odds: number | null): string {
  if (odds === null) return '—';
  return odds > 0 ? `+${odds}` : `${odds}`;
}

export function formatPct(p: number | null): string {
  if (p === null) return '—';
  return `${(p * 100).toFixed(1)}%`;
}

export function formatEdge(edge: number | null): string {
  if (edge === null) return '—';
  const pct = edge * 100;
  return pct > 0 ? `+${pct.toFixed(1)}%` : `${pct.toFixed(1)}%`;
}

export function formatTdDebt(tdDebt: number | null): string {
  if (tdDebt === null) return '—';
  return tdDebt > 0 ? `+${tdDebt.toFixed(1)}` : tdDebt.toFixed(1);
}
