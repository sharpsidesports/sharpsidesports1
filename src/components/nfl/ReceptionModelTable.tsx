import React, { useEffect, useMemo, useRef, useState } from 'react';
import NflPlayerAvatar from './NflPlayerAvatar.js';
import Badge from './Badge.js';
import HeatCell from './HeatCell.js';
import StatBar from './StatBar.js';
import InfoTooltip from './InfoTooltip.js';
import { TableRowsSkeleton } from './Skeleton.js';
import type { ReceptionModelRow } from '../../lib/nfl/receptionModelData.js';
import { percentileRank } from '../../lib/nfl/percentileRank.js';
import { formatPct } from '../../lib/nfl/formatters.js';

type SortKey = 'sharpScore' | 'targetShare' | 'catchRate' | 'regressionGap' | 'projectedReceptions' | 'impliedTotal' | 'player';
type ChipFilter = 'all' | 'buyLow' | 'unsustainable' | 'roleClimbing' | 'overlooked' | 'passRateRebound';

interface ReceptionModelTableProps {
  rows: ReceptionModelRow[]; // already search-filtered, percentiles derived against this pool
  loading: boolean;
  highlightedPlayerId: string | null;
  onHighlightHandled: () => void;
}

function pctlFill(pctl: number | null): number | null {
  return pctl === null ? null : pctl * 100;
}

function roleTrendBadge(r: ReceptionModelRow) {
  if (r.isRoleClimbing) return <Badge label="📈 Climbing" tone="blue" />;
  if (r.isRoleFading) return <Badge label="📉 Fading" tone="gray" />;
  return <span className="text-xs text-gray-400">Steady</span>;
}

function formatYards(value: number | null): string {
  return value === null ? '—' : `${value.toFixed(1)} yds`;
}

function formatSignedYards(value: number | null): string {
  if (value === null) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)} yds`;
}

function formatSignedPct(value: number | null): string {
  if (value === null) return '—';
  const pct = value * 100;
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}%`;
}

function ExpandedDetail({ r, pool }: { r: ReceptionModelRow; pool: ReceptionModelRow[] }) {
  const pools = useMemo(
    () => ({
      targetShare: pool.map((p) => p.expectedTargetShare),
      targetsPerGame: pool.map((p) => p.targetsPerGame),
      catchPctSeason: pool.map((p) => p.catchPctSeason),
      opponentCatchPctAllowedToWr: pool.map((p) => p.opponentCatchPctAllowedToWr),
      impliedTeamTotal: pool.map((p) => p.impliedTeamTotal),
      receptionDebt: pool.map((p) => p.receptionDebt),
      offenseSnapPct: pool.map((p) => p.recentOffenseSnapPct),
      avgSeparation: pool.map((p) => p.avgSeparation),
    }),
    [pool]
  );

  return (
    <div className="space-y-4 border-t border-gray-100 bg-gray-50/60 p-4">
      <div>
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Recent vs. Season Role <span className="font-normal normal-case text-gray-400">(last {r.recentGamesCount} game{r.recentGamesCount === 1 ? '' : 's'})</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-gray-600 sm:grid-cols-4">
          <div>
            Recent target share: <span className="font-semibold text-gray-900">{formatPct(r.recentTargetShare)}</span>
          </div>
          <div>
            Season target share: <span className="font-semibold text-gray-900">{formatPct(r.seasonTargetShareActual)}</span>
          </div>
          <div>
            Recent catch %: <span className="font-semibold text-gray-900">{formatPct(r.recentCatchPct)}</span>
          </div>
          <div>
            Season catch %: <span className="font-semibold text-gray-900">{formatPct(r.catchPctSeason)}</span>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Component Breakdown</div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          <StatBar
            label="Expected Target Share"
            value={formatPct(r.expectedTargetShare)}
            fillPct={pctlFill(percentileRank(r.expectedTargetShare, pools.targetShare))}
          />
          <StatBar
            label="Targets / Game (season)"
            value={r.targetsPerGame !== null ? `${r.targetsPerGame}` : '—'}
            fillPct={pctlFill(percentileRank(r.targetsPerGame, pools.targetsPerGame))}
            tone="blue"
          />
          <StatBar
            label="Catch % (season)"
            value={formatPct(r.catchPctSeason)}
            fillPct={pctlFill(percentileRank(r.catchPctSeason, pools.catchPctSeason))}
          />
          <StatBar
            label="Matchup (opp catch % allowed to WR)"
            value={formatPct(r.opponentCatchPctAllowedToWr)}
            fillPct={pctlFill(percentileRank(r.opponentCatchPctAllowedToWr, pools.opponentCatchPctAllowedToWr))}
            tone="blue"
          />
          <StatBar
            label="Implied Team Total"
            value={r.impliedTeamTotal !== null ? `${r.impliedTeamTotal} pts` : '—'}
            fillPct={pctlFill(percentileRank(r.impliedTeamTotal, pools.impliedTeamTotal))}
          />
          <StatBar
            label="Recent Snap Share (role proxy)"
            value={formatPct(r.recentOffenseSnapPct)}
            fillPct={pctlFill(percentileRank(r.recentOffenseSnapPct, pools.offenseSnapPct))}
            tone="blue"
          />
          <StatBar
            label="Avg. Separation (NGS)"
            value={formatYards(r.avgSeparation)}
            fillPct={pctlFill(percentileRank(r.avgSeparation, pools.avgSeparation))}
          />
          <StatBar
            label="Reception Debt (season-cumulative, legacy)"
            value={r.receptionDebt !== null ? `${r.receptionDebt}` : '—'}
            fillPct={pctlFill(percentileRank(r.receptionDebt, pools.receptionDebt))}
            tone="amber"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-gray-600 sm:grid-cols-3 lg:grid-cols-4">
        <div>ESPN projected: <span className="font-semibold text-gray-900">{r.espnProjectedReceptions ?? '—'}</span></div>
        <div>Team pass att.: <span className="font-semibold text-gray-900">{r.projectedTeamPassAttempts ?? '—'}</span></div>
        <div>Projected targets: <span className="font-semibold text-gray-900">{r.projectedTargets ?? '—'}</span></div>
        <div>nflverse model: <span className="font-semibold text-gray-900">{r.nflverseProjectedReceptions ?? '—'}</span></div>
        <div>Matchup, all positions: <span className="font-semibold text-gray-900">{formatPct(r.opponentCatchPctAllowed)}</span></div>
        <div>Team pass rate vs. expected (recent 3wk, neutral script): <span className="font-semibold text-gray-900">{formatSignedPct(r.recentTeamProe)}</span></div>
        <div>Team pass rate vs. expected (season, neutral script): <span className="font-semibold text-gray-900">{formatSignedPct(r.seasonTeamProe)}</span></div>
        <div>Avg. Cushion (NGS): <span className="font-semibold text-gray-900">{formatYards(r.avgCushion)}</span></div>
        <div>Avg. YAC above expectation (NGS): <span className="font-semibold text-gray-900">{formatSignedYards(r.avgYacAboveExpectation)}</span></div>
        <div>Data updated: <span className="font-semibold text-gray-900">{r.dataLastUpdated ? new Date(r.dataLastUpdated).toLocaleString() : '—'}</span></div>
        {r.fallbacksUsed.length > 0 && (
          <div className="col-span-full">Fallbacks: <span className="font-semibold text-gray-900">{r.fallbacksUsed.join(', ')}</span></div>
        )}
        {r.warnings.length > 0 && (
          <div className="col-span-full text-amber-700">Warnings: <span className="font-semibold">{r.warnings.join(', ')}</span></div>
        )}
      </div>
    </div>
  );
}

function rowBadges(r: ReceptionModelRow) {
  return (
    <>
      {r.isBuyLow && <Badge label="🎯 Buy Low" tone="green" />}
      {r.isUnsustainable && <Badge label="⚠️ Unsustainable" tone="amber" />}
      {r.isRoleClimbing && <Badge label="📈 Climbing" tone="blue" />}
      {r.isRoleFading && <Badge label="📉 Fading" tone="gray" />}
      {r.isOverlooked && <Badge label="🏃 Overlooked" tone="blue" />}
      {r.isPassRateRebound && <Badge label="🔄 Pass Rate Rebound" tone="green" />}
      {r.isPassRateCooling && <Badge label="⚠️ Pass Rate Cooling" tone="amber" />}
    </>
  );
}

function hasAnyBadge(r: ReceptionModelRow): boolean {
  return (
    r.isBuyLow ||
    r.isUnsustainable ||
    r.isRoleClimbing ||
    r.isRoleFading ||
    r.isOverlooked ||
    r.isPassRateRebound ||
    r.isPassRateCooling
  );
}

const COLUMN_TOOLTIPS: Record<string, string> = {
  targetShare:
    'Share of the team\'s targets this player has gotten over his last 3 games — a raw recent snapshot, not blended with projections.',
  catchRate:
    'Receptions / targets over his last 3 games — a raw recent snapshot. Low catch rate with high target share usually means positive regression is likely.',
  regressionGap:
    'Target-share percentile minus catch-rate percentile. Positive = high role, underperforming efficiency (Buy Low). Negative = low role, overperforming efficiency (Unsustainable).',
  projectedReceptions: "Sharpside's blended projection for this week (ESPN baseline + nflverse model).",
  impliedTotal: "This player's team Vegas-implied point total this week — higher means a higher-scoring environment.",
  sharpScore: "Sharpside's composite 0-100 ranking combining ESPN projection, volume, target share, matchup, and implied total.",
};

export default function ReceptionModelTable({
  rows,
  loading,
  highlightedPlayerId,
  onHighlightHandled,
}: ReceptionModelTableProps) {
  const [chipFilter, setChipFilter] = useState<ChipFilter>('all');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('sharpScore');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [flashId, setFlashId] = useState<string | null>(null);
  const rowRefs = useRef(new Map<string, HTMLElement>());

  useEffect(() => {
    if (!highlightedPlayerId) return;
    const el = rowRefs.current.get(highlightedPlayerId);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setExpandedId(highlightedPlayerId);
    setFlashId(highlightedPlayerId);
    const t = setTimeout(() => setFlashId(null), 2000);
    onHighlightHandled();
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightedPlayerId]);

  const searched = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.playerName.toLowerCase().includes(q) || r.team.toLowerCase().includes(q));
  }, [rows, search]);

  const chipped = useMemo(() => {
    switch (chipFilter) {
      case 'buyLow':
        return searched.filter((r) => r.isBuyLow);
      case 'unsustainable':
        return searched.filter((r) => r.isUnsustainable);
      case 'roleClimbing':
        return searched.filter((r) => r.isRoleClimbing);
      case 'overlooked':
        return searched.filter((r) => r.isOverlooked);
      case 'passRateRebound':
        return searched.filter((r) => r.isPassRateRebound);
      default:
        return searched;
    }
  }, [searched, chipFilter]);

  const sorted = useMemo(() => {
    const dir = sortDir === 'asc' ? 1 : -1;
    const valueFor = (r: ReceptionModelRow): number | string => {
      switch (sortKey) {
        case 'player':
          return r.playerName;
        case 'targetShare':
          return r.recentTargetShare ?? -Infinity;
        case 'catchRate':
          return r.recentCatchPct ?? -Infinity;
        case 'regressionGap':
          return r.regressionGap;
        case 'projectedReceptions':
          return r.projectedReceptions ?? -Infinity;
        case 'impliedTotal':
          return r.impliedTeamTotal ?? -Infinity;
        case 'sharpScore':
        default:
          return r.sharpScore ?? -Infinity;
      }
    };
    return [...chipped].sort((a, b) => {
      const av = valueFor(a);
      const bv = valueFor(b);
      if (typeof av === 'string' || typeof bv === 'string') {
        return String(av).localeCompare(String(bv)) * dir;
      }
      return (av - bv) * dir;
    });
  }, [chipped, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sortIndicator = (key: SortKey) => (sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '');

  const CHIPS: { key: ChipFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'buyLow', label: '🎯 Buy Low' },
    { key: 'unsustainable', label: '⚠️ Unsustainable' },
    { key: 'roleClimbing', label: '📈 Role Climbing' },
    { key: 'overlooked', label: '🏃 Overlooked' },
    { key: 'passRateRebound', label: '🔄 Pass Rate Rebound' },
  ];

  return (
    <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 p-3">
        {CHIPS.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setChipFilter(c.key)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
              chipFilter === c.key
                ? 'border-sharpside-green bg-sharpside-green text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {c.label}
          </button>
        ))}
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search player or team…"
          className="ml-auto w-48 rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-sharpside-green focus:outline-none"
        />
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-20 bg-gray-50">
            <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
              <th
                className="sticky left-0 z-30 cursor-pointer whitespace-nowrap bg-gray-50 px-3 py-2"
                onClick={() => handleSort('player')}
              >
                Player{sortIndicator('player')}
              </th>
              <th
                className="cursor-pointer whitespace-nowrap px-3 py-2 text-right"
                onClick={() => handleSort('targetShare')}
              >
                Target Share{sortIndicator('targetShare')}
                <InfoTooltip text={COLUMN_TOOLTIPS.targetShare} />
              </th>
              <th
                className="cursor-pointer whitespace-nowrap px-3 py-2 text-right"
                onClick={() => handleSort('catchRate')}
              >
                Catch %{sortIndicator('catchRate')}
                <InfoTooltip text={COLUMN_TOOLTIPS.catchRate} />
              </th>
              <th className="whitespace-nowrap px-3 py-2 text-right">Role Trend</th>
              <th
                className="cursor-pointer whitespace-nowrap px-3 py-2 text-right"
                onClick={() => handleSort('projectedReceptions')}
              >
                Proj. Rec{sortIndicator('projectedReceptions')}
                <InfoTooltip text={COLUMN_TOOLTIPS.projectedReceptions} />
              </th>
              <th
                className="cursor-pointer whitespace-nowrap px-3 py-2 text-right"
                onClick={() => handleSort('impliedTotal')}
              >
                Implied Total{sortIndicator('impliedTotal')}
                <InfoTooltip text={COLUMN_TOOLTIPS.impliedTotal} />
              </th>
              <th
                className="cursor-pointer whitespace-nowrap px-3 py-2 text-right"
                onClick={() => handleSort('sharpScore')}
              >
                Sharp Score{sortIndicator('sharpScore')}
                <InfoTooltip text={COLUMN_TOOLTIPS.sharpScore} />
              </th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableRowsSkeleton />
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-10 text-center text-sm text-gray-400">
                  No players match these filters. Try clearing the search or quick filters.
                </td>
              </tr>
            ) : (
              sorted.map((r, idx) => (
                <React.Fragment key={r.espnId}>
                  <tr
                    ref={(el) => {
                      if (el) rowRefs.current.set(r.espnId, el);
                    }}
                    className={`border-t border-gray-100 transition-colors ${
                      flashId === r.espnId ? 'bg-yellow-50' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                    }`}
                  >
                    <td className="sticky left-0 z-10 bg-inherit px-3 py-2">
                      <div className="flex items-center gap-2">
                        <NflPlayerAvatar name={r.playerName} espnId={r.espnId} size={32} className="shrink-0" />
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-gray-900">{r.playerName}</div>
                          <div className="truncate text-xs text-gray-500">
                            WR · {r.team} vs {r.opponentTeam ?? '—'}
                          </div>
                          {hasAnyBadge(r) && (
                            <div className="mt-0.5 flex flex-wrap gap-1">{rowBadges(r)}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-1 py-2">
                      <HeatCell value={formatPct(r.recentTargetShare)} percentile={r.targetSharePercentile} />
                    </td>
                    <td className="px-1 py-2">
                      <HeatCell value={formatPct(r.recentCatchPct)} percentile={r.catchRatePercentile} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right">{roleTrendBadge(r)}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-gray-700">
                      {r.projectedReceptions ?? '—'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-gray-700">
                      {r.impliedTeamTotal === null ? '—' : r.impliedTeamTotal.toFixed(1)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right">
                      <span className="inline-block min-w-[32px] rounded-full bg-sharpside-green/10 px-2 py-0.5 font-bold tabular-nums text-sharpside-green">
                        {r.sharpScore ?? '—'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => setExpandedId(expandedId === r.espnId ? null : r.espnId)}
                        className="text-xs font-semibold text-sharpside-green hover:underline"
                      >
                        {expandedId === r.espnId ? 'Hide' : 'Detail'}
                      </button>
                    </td>
                  </tr>
                  {expandedId === r.espnId && (
                    <tr>
                      <td colSpan={7} className="p-0">
                        <ExpandedDetail r={r} pool={rows} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="divide-y divide-gray-100 md:hidden">
        {loading ? (
          <div className="p-4 text-center text-sm text-gray-400">Loading…</div>
        ) : sorted.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-400">No players match these filters.</div>
        ) : (
          sorted.map((r) => (
            <div
              key={r.espnId}
              ref={(el) => {
                if (el) rowRefs.current.set(r.espnId, el);
              }}
              className={`p-3 ${flashId === r.espnId ? 'bg-yellow-50' : ''}`}
            >
              <div className="flex items-center gap-3">
                <NflPlayerAvatar name={r.playerName} espnId={r.espnId} size={36} className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold text-gray-900">{r.playerName}</div>
                  <div className="truncate text-xs text-gray-500">
                    WR · {r.team} vs {r.opponentTeam ?? '—'}
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-sharpside-green/10 px-2 py-0.5 text-sm font-bold tabular-nums text-sharpside-green">
                  {r.sharpScore ?? '—'}
                </span>
              </div>
              {hasAnyBadge(r) && (
                <div className="mt-1.5 flex flex-wrap gap-1">{rowBadges(r)}</div>
              )}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <HeatCell value={`Share ${formatPct(r.recentTargetShare)}`} percentile={r.targetSharePercentile} align="center" />
                <HeatCell value={`Catch ${formatPct(r.recentCatchPct)}`} percentile={r.catchRatePercentile} align="center" />
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-600">
                <span>Proj. Rec {r.projectedReceptions ?? '—'}</span>
                <span>Implied {r.impliedTeamTotal === null ? '—' : r.impliedTeamTotal.toFixed(1)}</span>
              </div>
              <button
                type="button"
                onClick={() => setExpandedId(expandedId === r.espnId ? null : r.espnId)}
                className="mt-2 text-xs font-semibold text-sharpside-green hover:underline"
              >
                {expandedId === r.espnId ? 'Hide detail' : 'Show detail'}
              </button>
              {expandedId === r.espnId && (
                <div className="mt-2">
                  <ExpandedDetail r={r} pool={rows} />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-gray-100 p-3 text-[11px] text-gray-500">
        <span className="font-semibold uppercase tracking-wide text-gray-400">Legend:</span>
        <span>🎯 Buy Low = high recent target share, low recent catch rate</span>
        <span>⚠️ Unsustainable = low recent target share, high recent catch rate</span>
        <span>📈/📉 Role Trend = last-2-game share vs. season average, ±3pp</span>
        <span>🏃 Overlooked = high recent snap share, low recent target share</span>
        <span>🔄 Pass Rate Rebound = team's recent neutral-script pass rate is well below their season norm</span>
        <span>Darker/bolder cell = higher percentile within current filters</span>
      </div>
    </div>
  );
}
