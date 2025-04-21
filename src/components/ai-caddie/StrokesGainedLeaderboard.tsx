import StrokesGainedTable from './tables/StrokesGainedTable.js';

export default function StrokesGainedLeaderboard() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Top 10 Players by Strokes Gained</h2>
      <StrokesGainedTable />
    </div>
  );
}