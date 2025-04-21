import { useGolfStore } from '../../../store/useGolfStore.js';
import { Golfer } from '../../../types/golf.js';
import { googleSheetsService } from '../../../services/api/googleSheetsService.js';
import { useState, useEffect } from 'react';

export default function StrokesGainedTable() {
  const { golfers } = useGolfStore();
  const [courseWeights, setCourseWeights] = useState<any>(null);

  useEffect(() => {
    const fetchWeights = async () => {
      const weights = await googleSheetsService.getCourseWeights();
      setCourseWeights(weights);
    };
    fetchWeights();
  }, []);

  // Define the calculateStrokesGainedScore function here
  const calculateStrokesGainedScore = (golfer: Golfer) => {
    // Use weights from Google Sheet if available, otherwise use equal weights
    const rawWeights = courseWeights || {
      ottWeight: 0.25,
      approachWeight: 0.25,
      aroundGreenWeight: 0.25,
      puttingWeight: 0.25
    };

    // Scale the weights to 85% of their original values to account for the 15% SG: Total
    const weights = {
      total: 0.15, // Fixed at 15%
      ottWeight: rawWeights.ottWeight * 0.85,
      approachWeight: rawWeights.approachWeight * 0.85,
      aroundGreenWeight: rawWeights.aroundGreenWeight * 0.85,
      puttingWeight: rawWeights.puttingWeight * 0.85
    };

    return (
      golfer.strokesGainedTotal * weights.total +
      golfer.strokesGainedTee * weights.ottWeight +
      golfer.strokesGainedApproach * weights.approachWeight +
      golfer.strokesGainedAround * weights.aroundGreenWeight +
      golfer.strokesGainedPutting * weights.puttingWeight
    );
  };

  const sortedGolfers = [...golfers]
    .sort((a, b) => calculateStrokesGainedScore(b) - calculateStrokesGainedScore(a))
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
              SG: Total
            </th>
            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              SG: OTT
            </th>
            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Approach
            </th>
            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Around Green
            </th>
            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Putting
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
                {golfer.strokesGainedTotal.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                {golfer.strokesGainedTee.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                {golfer.strokesGainedApproach.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                {golfer.strokesGainedAround.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                {golfer.strokesGainedPutting.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                {calculateStrokesGainedScore(golfer).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}