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
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="roundRange" className="block text-sm font-medium text-gray-700">
            Historical Round Range
          </label>
          <div className="relative">
            <select
              id="roundRange"
              value={roundRange}
              onChange={handleRangeChange}
              className="block w-48 rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
            >
              {roundRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Select how many recent rounds to consider when analyzing golfer performance
        </p>
      </div>
    </div>
  );
}

export default RoundRangeSelector;