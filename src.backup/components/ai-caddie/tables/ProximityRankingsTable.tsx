import { useGolfStore } from '../../../store/useGolfStore';
import { Golfer } from '../../../types/golf';

interface ProximityRange {
  key: keyof Golfer['proximityMetrics'];
  label: string;
}

const PROXIMITY_RANGES: ProximityRange[] = [
  { key: '100-125', label: '100-125 yards' },
  { key: '125-150', label: '125-150 yards' },
  { key: '150-175', label: '150-175 yards' },
  { key: '175-200', label: '175-200 yards' },
  { key: '200-225', label: '200-225 yards' },
  { key: '225plus', label: '225+ yards' }
];

export default function ProximityRankingsTable() {
  const { golfers } = useGolfStore();

  // Get top 10 golfers for each proximity range
  const getRankedGolfers = (range: keyof Golfer['proximityMetrics']) => {
    return [...golfers]
      .sort((a, b) => a.proximityMetrics[range] - b.proximityMetrics[range])
      .slice(0, 10);
  };

  return (
    <div className="space-y-8">
      {PROXIMITY_RANGES.map((range) => (
        <div key={range.key} className="overflow-x-auto">
          <h3 className="text-lg font-medium mb-4">Top 10 Players - {range.label}</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Player
                </th>
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proximity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getRankedGolfers(range.key).map((golfer, index) => (
                <tr key={golfer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded-full object-cover" 
                          src={golfer.imageUrl} 
                          alt={golfer.name} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {golfer.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    {golfer.proximityMetrics[range.key].toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
} 