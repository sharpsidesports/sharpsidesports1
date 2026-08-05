import { useMemo, useState } from 'react';
import { SEASON_TABLE, TRACK_RECORD_HEADLINE, type League } from './trackRecordData.js';

type FilterValue = League | 'all';

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'Combined' },
  { value: 'NFL', label: 'NFL' },
  { value: 'CFB', label: 'CFB' },
];

export default function TrackRecord() {
  const [filter, setFilter] = useState<FilterValue>('all');

  const rows = useMemo(
    () => (filter === 'all' ? SEASON_TABLE : SEASON_TABLE.filter((r) => r.league === filter)),
    [filter]
  );

  return (
    <section className="bg-gray-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Track Record</h2>
          <p className="mt-4 text-lg text-gray-600">
            Every pick is timestamped and publicly tracked before the game starts — win, lose, or push.
          </p>
        </div>

        {/* Headline stats */}
        <dl className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-100">
            <dd className="text-3xl font-bold text-gray-900">
              {TRACK_RECORD_HEADLINE.totalWins}-{TRACK_RECORD_HEADLINE.totalLosses}
            </dd>
            <dt className="mt-1 text-sm text-gray-500">Combined record</dt>
          </div>
          <div className="rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-100">
            <dd className="text-3xl font-bold text-sharpside-green">
              {(TRACK_RECORD_HEADLINE.winRate * 100).toFixed(1)}%
            </dd>
            <dt className="mt-1 text-sm text-gray-500">Win rate</dt>
          </div>
          <div className="rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-100">
            <dd className="text-3xl font-bold text-sharpside-green">
              +{TRACK_RECORD_HEADLINE.totalUnits.toFixed(1)}u
            </dd>
            <dt className="mt-1 text-sm text-gray-500">Units won</dt>
          </div>
          <div className="rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-100">
            <dd className="text-3xl font-bold text-gray-900">{TRACK_RECORD_HEADLINE.seasonsTracked}</dd>
            <dt className="mt-1 text-sm text-gray-500">
              Seasons tracked ({TRACK_RECORD_HEADLINE.firstYear}–{TRACK_RECORD_HEADLINE.lastYear})
            </dt>
          </div>
        </dl>

        {/* Filter */}
        <div className="mt-12 flex justify-center">
          <div role="group" aria-label="Filter track record by league" className="inline-flex rounded-lg bg-gray-100 p-1">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                aria-pressed={filter === f.value}
                onClick={() => setFilter(f.value)}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-sharpside-green focus:ring-offset-1 ${
                  filter === f.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="mt-8 overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left font-semibold text-gray-900">Season</th>
                <th scope="col" className="px-4 py-3 text-left font-semibold text-gray-900">League</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold text-gray-900">Record</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold text-gray-900">Win Rate</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold text-gray-900">Units</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={`${row.season}-${row.league}`}>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-900">{row.season}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">{row.league}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-gray-900">{row.record}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-gray-900">
                    {(row.winRate * 100).toFixed(1)}%
                  </td>
                  <td
                    className={`whitespace-nowrap px-4 py-3 text-right font-medium ${
                      row.units >= 0 ? 'text-sharpside-green' : 'text-red-600'
                    }`}
                  >
                    {row.units >= 0 ? '+' : ''}
                    {row.units.toFixed(1)}u
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">
          Every pick logged with date and result. Win rate = wins / (wins + losses), pushes excluded. Units at 4% =
          1 unit.
        </p>
        <p className="mt-1 text-center text-xs text-gray-400">
          Results compiled from season-tracking sheets maintained since {TRACK_RECORD_HEADLINE.firstYear}. Additional
          CFB and NFL seasons are being compiled and will be added here.
        </p>
      </div>
    </section>
  );
}
