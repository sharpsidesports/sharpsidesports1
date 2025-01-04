import React, { useState } from 'react';
import { useGolfStore } from '../store/useGolfStore';
import { Golfer } from '../types/golf';

function MatchupTool() {
  const { golfers } = useGolfStore();
  const [golfer1, setGolfer1] = useState<Golfer | null>(null);
  const [golfer2, setGolfer2] = useState<Golfer | null>(null);
  const [odds, setOdds] = useState<string>('');
  const [betAmount, setBetAmount] = useState<string>('');

  const calculateEdge = () => {
    if (!golfer1 || !golfer2 || !odds) return null;

    const projectedWinProb = golfer1.simulationStats.winPercentage /
      (golfer1.simulationStats.winPercentage + golfer2.simulationStats.winPercentage);
    
    const oddsDecimal = parseInt(odds);
    const impliedProb = oddsDecimal > 0 
      ? 100 / (oddsDecimal + 100)
      : Math.abs(oddsDecimal) / (Math.abs(oddsDecimal) + 100);

    return (projectedWinProb - impliedProb) * 100;
  };

  const calculatePayout = () => {
    if (!odds || !betAmount) return null;

    const amount = parseFloat(betAmount);
    const oddsNum = parseInt(odds);

    if (oddsNum > 0) {
      return (amount * (oddsNum / 100)).toFixed(2);
    } else {
      return (amount * (100 / Math.abs(oddsNum))).toFixed(2);
    }
  };

  const edge = calculateEdge();
  const payout = calculatePayout();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Matchup Analysis Tool</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Your Pick (Golfer to Bet On)
              </label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Selected to Win
              </span>
            </div>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={golfer1?.id || ''}
              onChange={(e) => setGolfer1(golfers.find(g => g.id === e.target.value) || null)}
            >
              <option value="">Select Golfer</option>
              {golfers.map((golfer) => (
                <option key={golfer.id} value={golfer.id}>
                  {golfer.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Opponent
              </label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Betting Against
              </span>
            </div>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={golfer2?.id || ''}
              onChange={(e) => setGolfer2(golfers.find(g => g.id === e.target.value) || null)}
            >
              <option value="">Select Golfer</option>
              {golfers.map((golfer) => (
                <option key={golfer.id} value={golfer.id}>
                  {golfer.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Odds for Your Pick (e.g., +120 or -110)
            </label>
            <input
              type="text"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={odds}
              onChange={(e) => setOdds(e.target.value)}
              placeholder="Enter odds"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bet Amount ($)
            </label>
            <input
              type="number"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              placeholder="Enter bet amount"
            />
          </div>
        </div>

        {golfer1 && golfer2 && odds && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Projected Win Probability</h3>
              <p className="text-2xl font-bold text-gray-900">
                {((golfer1.simulationStats.winPercentage /
                  (golfer1.simulationStats.winPercentage + golfer2.simulationStats.winPercentage)) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500 mt-1">
                For {golfer1.name}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Model Edge</h3>
              <p className={`text-2xl font-bold ${edge && edge > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {edge ? `${edge.toFixed(1)}%` : '-'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {edge && edge > 0 ? 'Favorable Edge' : 'Unfavorable Edge'}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Potential Payout</h3>
              <p className="text-2xl font-bold text-gray-900">
                ${payout || '-'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                If {golfer1?.name} wins
              </p>
            </div>
          </div>
        )}
      </div>

      {golfer1 && golfer2 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Head-to-Head Comparison</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metric
                  </th>
                  <th className="px-6 py-3 bg-green-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {golfer1.name} (Your Pick)
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {golfer2.name}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    SG: Total
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 bg-green-50">
                    {golfer1.strokesGainedTotal.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    {golfer2.strokesGainedTotal.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Win Probability
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 bg-green-50">
                    {golfer1.simulationStats.winPercentage.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    {golfer2.simulationStats.winPercentage.toFixed(1)}%
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Average Finish
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 bg-green-50">
                    {golfer1.simulationStats.averageFinish.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    {golfer2.simulationStats.averageFinish.toFixed(1)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default MatchupTool;