import { useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  BubbleController,
  Tooltip,
  Legend,
  type Plugin,
  type ChartOptions,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import type { TdModelRow } from '../../lib/nfl/tdModelData.js';
import { formatEdge } from '../../lib/nfl/formatters.js';

ChartJS.register(LinearScale, PointElement, BubbleController, Tooltip, Legend);

interface VolumeTdDebtScatterProps {
  rows: TdModelRow[];
  onSelect: (playerId: string) => void;
}

const POSITION_COLORS: Record<string, string> = {
  QB: '#3B82F6', // blue-500
  RB: '#3CB371', // sharpside-green
  WR: '#F59E0B', // amber-500
  TE: '#8B5CF6', // violet-500
};

interface BubblePoint {
  x: number; // volume
  y: number; // td debt
  r: number; // radius, derived from |edge| when available
  playerId: string;
  name: string;
  team: string;
  edge: number | null;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

// Dashed median-line quadrant divider — a small inline plugin instead of
// pulling in chartjs-plugin-annotation (not an installed dependency, and the
// brief says not to add a new chart library).
function buildQuadrantPlugin(medianX: number, medianY: number): Plugin<'bubble'> {
  return {
    id: 'quadrantLines',
    afterDraw(chart) {
      const { ctx, chartArea, scales } = chart;
      if (!chartArea) return;
      const xPixel = scales.x.getPixelForValue(medianX);
      const yPixel = scales.y.getPixelForValue(medianY);

      ctx.save();
      ctx.strokeStyle = '#9CA3AF';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(xPixel, chartArea.top);
      ctx.lineTo(xPixel, chartArea.bottom);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(chartArea.left, yPixel);
      ctx.lineTo(chartArea.right, yPixel);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.fillStyle = '#6B7280';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('High Volume + Due', chartArea.right - 6, chartArea.top + 14);
      ctx.restore();
    },
  };
}

export default function VolumeTdDebtScatter({ rows, onSelect }: VolumeTdDebtScatterProps) {
  const [collapsed, setCollapsed] = useState(false);

  const plottable = useMemo(
    () => rows.filter((r) => r.td_debt !== null), // need a real y-value to plot
    [rows]
  );

  const medianX = useMemo(() => median(plottable.map((r) => r.volume)), [plottable]);
  const medianY = useMemo(() => median(plottable.map((r) => r.td_debt as number)), [plottable]);

  const datasets = useMemo(() => {
    const byPosition = new Map<string, BubblePoint[]>();
    for (const r of plottable) {
      const point: BubblePoint = {
        x: r.volume,
        y: r.td_debt as number,
        r: 6 + Math.min(Math.abs(r.edge ?? 0) * 200, 14),
        playerId: r.player_id,
        name: r.player_name,
        team: r.team,
        edge: r.edge,
      };
      const list = byPosition.get(r.position) ?? [];
      list.push(point);
      byPosition.set(r.position, list);
    }
    return Array.from(byPosition.entries()).map(([position, data]) => ({
      label: position,
      data,
      backgroundColor: `${POSITION_COLORS[position] ?? '#9CA3AF'}B3`, // ~70% opacity
      borderColor: POSITION_COLORS[position] ?? '#9CA3AF',
      borderWidth: 1,
    }));
  }, [plottable]);

  const options: ChartOptions<'bubble'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { title: { display: true, text: 'Volume (season-to-date touches)' } },
        y: { title: { display: true, text: 'TD Debt' } },
      },
      plugins: {
        legend: { position: 'top', labels: { usePointStyle: true } },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const p = ctx.raw as BubblePoint;
              return `${p.name} (${p.team}) — Vol ${p.x}, TD Debt ${p.y.toFixed(1)}${
                p.edge !== null ? `, Edge ${formatEdge(p.edge)}` : ''
              }`;
            },
          },
        },
      },
      onClick: (_event, elements, chart) => {
        if (elements.length === 0) return;
        const { datasetIndex, index } = elements[0];
        const point = chart.data.datasets[datasetIndex].data[index] as unknown as BubblePoint;
        onSelect(point.playerId);
      },
    }),
    [onSelect]
  );

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700">Volume vs. TD Debt</h2>
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="text-xs font-semibold text-sharpside-green hover:underline"
        >
          {collapsed ? 'Show chart' : 'Hide chart'}
        </button>
      </div>

      {!collapsed && (
        <>
          <div className="hidden h-72 md:block">
            {plottable.length > 0 ? (
              <Bubble data={{ datasets }} options={options} plugins={[buildQuadrantPlugin(medianX, medianY)]} />
            ) : (
              <p className="text-sm text-gray-400">Not enough data yet to plot.</p>
            )}
          </div>

          {/* Mobile fallback: a simple ranked bar list instead of the 2D chart. */}
          <div className="space-y-1.5 md:hidden">
            {[...plottable]
              .sort((a, b) => b.combinedScore - a.combinedScore)
              .slice(0, 8)
              .map((r) => (
                <button
                  key={r.player_id}
                  type="button"
                  onClick={() => onSelect(r.player_id)}
                  className="flex w-full items-center gap-2 rounded px-1 py-1 text-left hover:bg-gray-50"
                >
                  <span className="w-24 shrink-0 truncate text-xs text-gray-700">{r.player_name}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <span
                      className="block h-full rounded-full bg-sharpside-green"
                      style={{ width: `${Math.max(4, r.combinedScore * 100)}%` }}
                    />
                  </span>
                </button>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
