import React, { useEffect, useMemo, useRef, useState } from 'react';
import NflPlayerAvatar from './NflPlayerAvatar.js';
import Badge from './Badge.js';
import HeatCell from './HeatCell.js';
import StatBar from './StatBar.js';
import InfoTooltip from './InfoTooltip.js';
import { TableRowsSkeleton } from './Skeleton.js';
import { ZONE_ORDER, ZONE_LABELS, type TdModelRow } from '../../lib/nfl/tdModelData.js';
import { percentileRank } from '../../lib/nfl/percentileRank.js';
import { formatOdds, formatPct, formatEdge, formatTdDebt } from '../../lib/nfl/formatters.js';

type SortKey = 'combinedScore' | 'volume' | 'tdDebt' | 'edge' | 'impliedTotal' | 'sharpScore' | 'player';
type ChipFilter = 'all' | 'topPlays' | 'highVolume' | 'mostDue';

interface TdModelTableProps {
  rows: TdModelRow[]; // already position + search filtered, percentiles derived against this pool
  loading: boolean;
  highlightedPlayerId: string | null;
  onHighlightHandled: () => void;
}

function pctlFill(pctl: number | null): number | null {
  return pctl === null ? null : pctl * 100;
}

function ZoneBreakdownSection({ r }: { r: TdModelRow }) {
  if (!r.zone_breakdown) {
    return (
      <div className="text-xs text-gray-400">
        No season-to-date play-by-play zone data for this player yet (needs an nflverse ID match and at least one
        game played this season).
      </div>
    );
  }
  const byZone = new Map(r.zone_breakdown.map((z) => [z.zone, z]));
  return (
    <div>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Zone Breakdown <span className="font-normal normal-case text-gray-400">(season-to-date)</span>
        </div>
        <div className="flex gap-4 text-xs">
          <span>
            Expected TDs: <span className="font-semibold tabular-nums text-gray-900">{r.expected_tds ?? '—'}</span>
          </span>
          <span>
            Scored: <span className="font-semibold tabular-nums text-gray-900">{r.scored ?? '—'}</span>
          </span>
          <span>
            TD Deficit:{' '}
            <span
              className={`font-semibold tabular-nums ${r.td_debt !== null && r.td_debt > 0 ? 'text-[#15803D]' : 'text-gray-900'}`}
            >
              {formatTdDebt(r.td_debt)}
            </span>
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-1 pr-4 font-medium">Zone</th>
              <th className="py-1 pr-4 text-right font-medium">Carries</th>
              <th className="py-1 pr-4 text-right font-medium">Targets</th>
              <th className="py-1 text-right font-medium">xTD</th>
            </tr>
          </thead>
          <tbody>
            {ZONE_ORDER.map((zone) => {
              const row = byZone.get(zone);
              return (
                <tr key={zone} className="border-t border-gray-100">
                  <td className="py-1 pr-4 text-gray-700">{ZONE_LABELS[zone]}</td>
                  <td className="py-1 pr-4 text-right tabular-nums text-gray-900">{row?.carries ?? 0}</td>
                  <td className="py-1 pr-4 text-right tabular-nums text-gray-900">{row?.targets ?? 0}</td>
                  <td className="py-1 text-right font-semibold tabular-nums text-sharpside-green">
                    {(row?.xTd ?? 0).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExpandedDetail({ r, pool }: { r: TdModelRow; pool: TdModelRow[] }) {
  const pools = useMemo(
    () => ({
      espnTdProbability: pool.map((p) => p.espn_td_probability),
      consensusTdProbability: pool.map((p) => p.consensus_td_probability),
      edge: pool.map((p) => p.edge),
      impliedTeamTotal: pool.map((p) => p.implied_team_total),
      matchupTdRateAllowed: pool.map((p) => p.matchup_td_rate_allowed),
    }),
    [pool]
  );

  return (
    <div className="space-y-4 border-t border-gray-100 bg-gray-50/60 p-4">
      <ZoneBreakdownSection r={r} />
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Component Breakdown</div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          <StatBar
            label="Sharpside TD %"
            value={formatPct(r.espn_td_probability)}
            fillPct={pctlFill(percentileRank(r.espn_td_probability, pools.espnTdProbability))}
          />
          <StatBar
            label="Consensus TD %"
            value={formatPct(r.consensus_td_probability)}
            fillPct={pctlFill(percentileRank(r.consensus_td_probability, pools.consensusTdProbability))}
            tone="blue"
          />
          <StatBar
            label="Implied Team Total"
            value={r.implied_team_total === null ? '—' : `${r.implied_team_total.toFixed(1)} pts`}
            fillPct={pctlFill(percentileRank(r.implied_team_total, pools.impliedTeamTotal))}
          />
          <StatBar
            label="Matchup (opp TD/g allowed)"
            value={r.matchup_td_rate_allowed === null ? '—' : r.matchup_td_rate_allowed.toFixed(2)}
            fillPct={pctlFill(percentileRank(r.matchup_td_rate_allowed, pools.matchupTdRateAllowed))}
            tone="blue"
          />
          <StatBar
            label="Edge vs. Market"
            value={formatEdge(r.edge)}
            fillPct={pctlFill(percentileRank(r.edge, pools.edge))}
            tone="amber"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-gray-600 sm:grid-cols-3 lg:grid-cols-4">
        <div>
          Sharpside projected TD: <span className="font-semibold text-gray-900">{r.projected_anytime_td.toFixed(2)}</span>
        </div>
        <div>
          Consensus odds:{' '}
          <span className="font-semibold text-gray-900">
            {formatOdds(r.consensus_american_odds)}
            {r.sportsbook_count > 0 && <span className="ml-1 text-gray-400">({r.sportsbook_count} books)</span>}
          </span>
        </div>
      </div>
    </div>
  );
}

function rowBadges(r: TdModelRow) {
  return (
    <>
      {r.isDue && <Badge label="🔥 Due" tone="green" />}
      {r.isHighVolume && <Badge label="📈 High Volume" tone="blue" />}
      {r.isTopPlay && <Badge label="⭐ Top Play" tone="amber" />}
    </>
  );
}

const COLUMN_TOOLTIPS: Record<string, string> = {
  volume: 'Season-to-date carries + targets across all field zones — how often this player has gotten the ball.',
  tdDebt:
    'TD Deficit = Expected TDs minus actual TDs; higher means the player has been unlucky and is due for positive regression.',
  edge: "Sharpside's touchdown probability minus the sportsbook consensus — positive means our model sees more value than the market price.",
  impliedTotal: "This player's team Vegas-implied point total this week — higher means a higher-scoring environment.",
  sharpScore: "Sharpside's composite 0-100 ranking combining TD probability, market edge, implied total, and matchup.",
};

export default function TdModelTable({ rows, loading, highlightedPlayerId, onHighlightHandled }: TdModelTableProps) {
  const [chipFilter, setChipFilter] = useState<ChipFilter>('all');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('combinedScore');
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
    return rows.filter((r) => r.player_name.toLowerCase().includes(q) || r.team.toLowerCase().includes(q));
  }, [rows, search]);

  const chipped = useMemo(() => {
    switch (chipFilter) {
      case 'topPlays':
        return searched.filter((r) => r.isTopPlay);
      case 'highVolume':
        return searched.filter((r) => r.isHighVolume);
      case 'mostDue':
        return searched.filter((r) => r.isDue);
      default:
        return searched;
    }
  }, [searched, chipFilter]);

  const sorted = useMemo(() => {
    const dir = sortDir === 'asc' ? 1 : -1;
    const valueFor = (r: TdModelRow): number | string => {
      switch (sortKey) {
        case 'player':
          return r.player_name;
        case 'volume':
          return r.volume;
        case 'tdDebt':
          return r.td_debt ?? -Infinity;
        case 'edge':
          return r.edge ?? -Infinity;
        case 'impliedTotal':
          return r.implied_team_total ?? -Infinity;
        case 'sharpScore':
          return r.sharp_score ?? -Infinity;
        case 'combinedScore':
        default:
          return r.combinedScore;
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
    { key: 'topPlays', label: '⭐ Top Plays' },
    { key: 'highVolume', label: '📈 High Volume' },
    { key: 'mostDue', label: '🔥 Most Due' },
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
              <th className="cursor-pointer whitespace-nowrap px-3 py-2 text-right" onClick={() => handleSort('volume')}>
                Volume{sortIndicator('volume')}
                <InfoTooltip text={COLUMN_TOOLTIPS.volume} />
              </th>
              <th className="cursor-pointer whitespace-nowrap px-3 py-2 text-right" onClick={() => handleSort('tdDebt')}>
                TD Deficit{sortIndicator('tdDebt')}
                <InfoTooltip text={COLUMN_TOOLTIPS.tdDebt} />
              </th>
              <th className="cursor-pointer whitespace-nowrap px-3 py-2 text-right" onClick={() => handleSort('edge')}>
                Edge{sortIndicator('edge')}
                <InfoTooltip text={COLUMN_TOOLTIPS.edge} />
              </th>
              <th
                className="cursor-pointer whitespace-nowrap px-3 py-2 text-right"
                onClick={() => handleSort('impliedTotal')}
              >
                Implied Total{sortIndicator('impliedTotal')}
                <InfoTooltip text={COLUMN_TOOLTIPS.impliedTotal} />
              </th>
              <th className="whitespace-nowrap px-3 py-2 text-right">Odds</th>
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
                <td colSpan={8} className="px-3 py-10 text-center text-sm text-gray-400">
                  No players match these filters. Try clearing the search or quick filters.
                </td>
              </tr>
            ) : (
              sorted.map((r, idx) => (
                <React.Fragment key={r.player_id}>
                  <tr
                    ref={(el) => {
                      if (el) rowRefs.current.set(r.player_id, el);
                    }}
                    className={`border-t border-gray-100 transition-colors ${
                      flashId === r.player_id ? 'bg-yellow-50' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                    }`}
                  >
                    <td className="sticky left-0 z-10 bg-inherit px-3 py-2">
                      <div className="flex items-center gap-2">
                        <NflPlayerAvatar name={r.player_name} espnId={r.player_id} size={32} className="shrink-0" />
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-gray-900">{r.player_name}</div>
                          <div className="truncate text-xs text-gray-500">
                            {r.position} · {r.team} vs {r.opponent}
                          </div>
                          {(r.isDue || r.isHighVolume || r.isTopPlay) && (
                            <div className="mt-0.5 flex flex-wrap gap-1">{rowBadges(r)}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-1 py-2">
                      <HeatCell value={String(r.volume)} percentile={r.volumePercentile} />
                    </td>
                    <td className="px-1 py-2">
                      <HeatCell value={formatTdDebt(r.td_debt)} percentile={r.tdDebtPercentile} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-gray-700">
                      {formatEdge(r.edge)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-gray-700">
                      {r.implied_team_total === null ? '—' : r.implied_team_total.toFixed(1)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-gray-700">
                      {formatOdds(r.consensus_american_odds)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right">
                      <span className="inline-block min-w-[32px] rounded-full bg-sharpside-green/10 px-2 py-0.5 font-bold tabular-nums text-sharpside-green">
                        {r.sharp_score ?? '—'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => setExpandedId(expandedId === r.player_id ? null : r.player_id)}
                        className="text-xs font-semibold text-sharpside-green hover:underline"
                      >
                        {expandedId === r.player_id ? 'Hide' : 'Detail'}
                      </button>
                    </td>
                  </tr>
                  {expandedId === r.player_id && (
                    <tr>
                      <td colSpan={8} className="p-0">
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
              key={r.player_id}
              ref={(el) => {
                if (el) rowRefs.current.set(r.player_id, el);
              }}
              className={`p-3 ${flashId === r.player_id ? 'bg-yellow-50' : ''}`}
            >
              <div className="flex items-center gap-3">
                <NflPlayerAvatar name={r.player_name} espnId={r.player_id} size={36} className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold text-gray-900">{r.player_name}</div>
                  <div className="truncate text-xs text-gray-500">
                    {r.position} · {r.team} vs {r.opponent}
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-sharpside-green/10 px-2 py-0.5 text-sm font-bold tabular-nums text-sharpside-green">
                  {r.sharp_score ?? '—'}
                </span>
              </div>
              {(r.isDue || r.isHighVolume || r.isTopPlay) && (
                <div className="mt-1.5 flex flex-wrap gap-1">{rowBadges(r)}</div>
              )}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <HeatCell value={`Vol ${r.volume}`} percentile={r.volumePercentile} align="center" />
                <HeatCell value={`Deficit ${formatTdDebt(r.td_debt)}`} percentile={r.tdDebtPercentile} align="center" />
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-600">
                <span>Edge {formatEdge(r.edge)}</span>
                <span>Odds {formatOdds(r.consensus_american_odds)}</span>
              </div>
              <button
                type="button"
                onClick={() => setExpandedId(expandedId === r.player_id ? null : r.player_id)}
                className="mt-2 text-xs font-semibold text-sharpside-green hover:underline"
              >
                {expandedId === r.player_id ? 'Hide detail' : 'Show detail'}
              </button>
              {expandedId === r.player_id && (
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
        <span>🔥 Due = Elite TD Deficit (top 10%)</span>
        <span>📈 High Volume = Elite Volume (top 10%)</span>
        <span>⭐ Top Play = Strong+ in both, positive/unknown edge</span>
        <span>Darker/bolder cell = higher percentile within current filters</span>
      </div>
    </div>
  );
}
