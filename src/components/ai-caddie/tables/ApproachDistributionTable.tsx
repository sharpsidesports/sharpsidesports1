import { useGolfStore } from '../../../store/useGolfStore.js';
import { Golfer } from '../../../types/golf.js';
import { useApproachDistributionData } from '../hooks/useApproachDistributionData.js';

export default function ApproachDistributionTable() {
  const { golfers } = useGolfStore();
  const { weights } = useApproachDistributionData();

  // Calculate weighted approach score for each golfer
  const calculateApproachScore = (golfer: Golfer) => {
    // Calculate proximity score (90% weight)
    // Negative because lower proximity numbers are better (closer to the hole)
    const proximityScore = -(
      golfer.proximityMetrics['100-125'] * weights.prox100_125Weight * 0.9 +
      golfer.proximityMetrics['125-150'] * weights.prox125_150Weight * 0.9 +
      golfer.proximityMetrics['150-175'] * weights.prox150_175Weight * 0.9 +
      golfer.proximityMetrics['175-200'] * weights.prox175_200Weight * 0.9 +
      golfer.proximityMetrics['200-225'] * weights.prox200_225Weight * 0.9 +
      golfer.proximityMetrics['225plus'] * weights.prox225plusWeight * 0.9
    );

    // Add SG: Approach (10% weight)
    const sgAppScore = golfer.strokesGainedApproach * 0.1;

    return proximityScore + sgAppScore;
  };

  const sortedGolfers = [...golfers]
    .sort((a, b) => calculateApproachScore(b) - calculateApproachScore(a))
    .slice(0, 10);

  return (
    <div className="overflow-x-auto">
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
              SG: APP
            </th>
            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              100-125
            </th>
            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              125-150
            </th>
            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              150-175
            </th>
            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              175-200
            </th>
            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              200-225
            </th>
            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              225+
            </th>
            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Score
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedGolfers.map((golfer, index) => (
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
                {golfer.strokesGainedApproach.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                {golfer.proximityMetrics['100-125'].toFixed(1)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                {golfer.proximityMetrics['125-150'].toFixed(1)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                {golfer.proximityMetrics['150-175'].toFixed(1)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                {golfer.proximityMetrics['175-200'].toFixed(1)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                {golfer.proximityMetrics['200-225'].toFixed(1)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                {golfer.proximityMetrics['225plus'].toFixed(1)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                {calculateApproachScore(golfer).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 