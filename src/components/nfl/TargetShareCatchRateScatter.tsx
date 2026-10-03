import { useMemo, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  BubbleController,
  Tooltip,
  Legend,
  type Plugin,
  type ChartOptions,
  type Chart,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Bubble } from 'react-chartjs-2';
import type { ReceptionModelRow } from '../../lib/nfl/receptionModelData.js';

// chartjs-plugin-zoom's published types don't line up with Chart.js v4's
// register() overloads (a known friction between the two packages, not a
// runtime issue) — cast through the same Plugin type used for the quadrant
// plugin below.
ChartJS.register(LinearScale, PointElement, BubbleController, Tooltip, Legend, zoomPlugin as unknown as Plugin<'bubble'>);

interface TargetShareCatchRateScatterProps {
  rows: ReceptionModelRow[];
  onSelect: (playerId: string) => void;
}

type BadgeGroup = 'buyLow' | 'unsustainable' | 'neutral';

// Colored by badge type rather than position (unlike the TD page's chart) —
// this page is WR-only, so position carries no information here; badge type
// is the thing worth seeing at a glance.
const GROUP_COLORS: Record<BadgeGroup, string> = {
  buyLow: '#15803D', // dark green, matches the HeatCell "elite" text color
  unsustainable: '#D97706', // amber-600
  neutral: '#9CA3AF', // gray-400
};
const GROUP_LABELS: Record<BadgeGroup, string> = {
  buyLow: '🎯 Buy Low',
  unsustainable: '⚠️ Unsustainable',
  neutral: 'Neither',
};

interface BubblePoint {
  x: number; // recent target share (%, 0-100)
  y: number; // recent catch rate (%, 0-100)
  r: number;
  playerId: string;
  name: string;
  team: string;
  gap: number;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

// Dashed median-line quadrant divider — same small inline plugin pattern used
// on the TD page's chart, not a new chartjs-plugin-annotation dependency.
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
      ctx.fillText('Buy Low zone', chartArea.right - 6, chartArea.bottom - 8);
      ctx.restore();
    },
  };
}

export default function TargetShareCatchRateScatter({ rows, onSelect }: TargetShareCatchRateScatterProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const chartRef = useRef<Chart<'bubble'> | null>(null);

  const plottable = useMemo(
    () => rows.filter((r) => r.recentTargetShare !== null && r.recentCatchPct !== null),
    [rows]
  );

  const medianX = useMemo(() => median(plottable.map((r) => (r.recentTargetShare as number) * 100)), [plottable]);
  const medianY = useMemo(() => median(plottable.map((r) => (r.recentCatchPct as number) * 100)), [plottable]);

  const datasets = useMemo(() => {
    const byGroup = new Map<BadgeGroup, BubblePoint[]>();
    for (const r of plottable) {
      const group: BadgeGroup = r.isBuyLow ? 'buyLow' : r.isUnsustainable ? 'unsustainable' : 'neutral';
      // Gap is a percentile difference in [-1, 1]; most real gaps cluster well
      // under 0.5, so scale generously but cap modestly — same fix applied to
      // the TD page's chart after its bubble-size scale saturated in practice.
      const point: BubblePoint = {
        x: (r.recentTargetShare as number) * 100,
        y: (r.recentCatchPct as number) * 100,
        r: 5 + Math.min(Math.abs(r.regressionGap) * 14, 8),
        playerId: r.espnId,
        name: r.playerName,
        team: r.team,
        gap: r.regressionGap,
      };
      const list = byGroup.get(group) ?? [];
      list.push(point);
      byGroup.set(group, list);
    }
    return (['buyLow', 'unsustainable', 'neutral'] as BadgeGroup[])
      .filter((g) => byGroup.has(g))
      .map((group) => ({
        label: GROUP_LABELS[group],
        data: byGroup.get(group) as BubblePoint[],
        backgroundColor: `${GROUP_COLORS[group]}80`, // ~50% opacity
        borderColor: GROUP_COLORS[group],
        borderWidth: 1,
      }));
  }, [plottable]);

  const options: ChartOptions<'bubble'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { title: { display: true, text: 'Recent Target Share (%)' } },
        y: { title: { display: true, text: 'Recent Catch Rate (%)' } },
      },
      // 'nearest' + intersect:false means a click/tap registers on the closest
      // bubble even if the pointer isn't exactly inside its small circle —
      // applies to both hover tooltips and onClick's `elements` below.
      interaction: { mode: 'nearest', intersect: false },
      plugins: {
        legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 8, font: { size: 10 } } },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const p = ctx.raw as BubblePoint;
              return `${p.name} (${p.team}) — Share ${p.x.toFixed(1)}%, Catch % ${p.y.toFixed(1)}%`;
            },
          },
        },
        zoom: {
          limits: {
            x: { min: 'original', max: 'original' },
            y: { min: 'original', max: 'original' },
          },
          pan: {
            enabled: true,
            mode: 'xy',
            onPanComplete: () => setIsZoomed(true),
          },
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: 'xy',
            onZoomComplete: () => setIsZoomed(true),
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

  const resetZoom = () => {
    chartRef.current?.resetZoom();
    setIsZoomed(false);
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700">Target Share vs. Catch Rate</h2>
        <div className="flex items-center gap-3">
          {!collapsed && isZoomed && (
            <button type="button" onClick={resetZoom} className="text-xs font-semibold text-gray-500 hover:underline">
              Reset zoom
            </button>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="text-xs font-semibold text-sharpside-green hover:underline"
          >
            {collapsed ? 'Show chart' : 'Hide chart'}
          </button>
        </div>
      </div>
      {!collapsed && (
        <p className="mb-2 text-xs text-gray-400">
          Both axes are last-3-game actuals, not season-cumulative — a player's recent role shift shows up directly
          instead of being averaged away. Scroll or pinch to zoom, drag to pan, tap a dot for that player's row below.
        </p>
      )}

      {!collapsed && (
        <div className="h-64 sm:h-80">
          {plottable.length > 0 ? (
            <Bubble
              ref={chartRef}
              data={{ datasets }}
              options={options}
              plugins={[buildQuadrantPlugin(medianX, medianY)]}
            />
          ) : (
            <p className="text-sm text-gray-400">Not enough data yet to plot.</p>
          )}
        </div>
      )}
    </div>
  );
}
