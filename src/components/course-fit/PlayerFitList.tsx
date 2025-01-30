import React from 'react';
import { useCourseFitStore } from '../../store/useCourseFitStore';
import { getPlayerName } from '../../data/playerMapping';

interface PlayerFitListProps {
  courseId: string;
  loading?: boolean;
}

export default function PlayerFitList({ courseId, loading = false }: PlayerFitListProps) {
  const { playerRounds } = useCourseFitStore();

  // Get rounds for the selected course
  const courseRounds = playerRounds.filter(round => round.course === courseId);

  // Group rounds by player and calculate average performance
  const playerStats = courseRounds.reduce((acc, round) => {
    if (!acc[round.dg_id]) {
      acc[round.dg_id] = {
        dg_id: round.dg_id,
        rounds: [],
      };
    }
    acc[round.dg_id].rounds.push(round);
    return acc;
  }, {} as Record<string, { dg_id: string; rounds: typeof courseRounds }>);

  // Calculate averages and sort by SG: Total
  const playerAverages = Object.values(playerStats)
    .map(player => {
      const avgStats = player.rounds.reduce(
        (acc, round) => ({
          sgTotal: acc.sgTotal + (round.sg_total || 0),
          sgOtt: acc.sgOtt + (round.sg_ott || 0),
          sgApp: acc.sgApp + (round.sg_app || 0),
          sgArg: acc.sgArg + (round.sg_arg || 0),
          sgPutt: acc.sgPutt + (round.sg_putt || 0),

        }),
        {
          sgTotal: 0,
          sgOtt: 0,
          sgApp: 0,
          sgArg: 0,
          sgPutt: 0
        }
      );

      const numRounds = player.rounds.length;
      return {
        dg_id: player.dg_id,
        numRounds,
        playerName: getPlayerName(player.dg_id),
        avgSgTotal: avgStats.sgTotal / numRounds,
        avgSgOtt: avgStats.sgOtt / numRounds,
        avgSgApp: avgStats.sgApp / numRounds,
        avgSgArg: avgStats.sgArg / numRounds,
        avgSgPutt: avgStats.sgPutt / numRounds,

      };
    })
    .sort((a, b) => b.avgSgTotal - a.avgSgTotal)
    .slice(0, 10); // Show top 10 players

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading player data...</span>
      </div>
    );
  }

  if (playerAverages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No player data available for this course
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Player Performance</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Player Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rounds
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SG: Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SG: OTT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SG: APP
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SG: ARG
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SG: PUTT
              </th>

            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {playerAverages.map((player, index) => (
              <tr key={player.dg_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {player.playerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {player.numRounds}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {player.avgSgTotal.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {player.avgSgOtt.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {player.avgSgApp.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {player.avgSgArg.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {player.avgSgPutt.toFixed(2)}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}