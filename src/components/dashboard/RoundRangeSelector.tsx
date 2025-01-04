import React from 'react';
import { useGolfStore } from '../../store/useGolfStore';

const roundRanges = [
  { label: 'Last 4 Rounds', value: 4 },
  { label: 'Last 8 Rounds', value: 8 },
  { label: 'Last 12 Rounds', value: 12 },
  { label: 'Last 16 Rounds', value: 16 },
  { label: 'Last 20 Rounds', value: 20 },
  { label: 'Last 24 Rounds', value: 24 },
  { label: 'Last 28 Rounds', value: 28 },
  { label: 'Last 32 Rounds', value: 32 },
  { label: 'Last 36 Rounds', value: 36 },
];

function RoundRangeSelector() {
  const { roundRange, setRoundRange, runSimulation } = useGolfStore();

  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const range = parseInt(e.target.value);
    setRoundRange(range);
    runSimulation();
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center justify-between">
        <label htmlFor="roundRange" className="block text-sm font-medium text-gray-700">
          Historical Round Range
        </label>
        <select
          id="roundRange"
          value={roundRange}
          onChange={handleRangeChange}
          className="ml-4 block w-48 rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
        >
          {roundRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default RoundRangeSelector;