import { Golfer, GolferStats } from '../../types/golf';
import { calculateImpliedProbability } from '../calculations/oddsCalculator';
import playerRoundsData from '../../data/player_rounds_FULL.json';

export const golferImages = {
  "Scheffler, Scottie": "https://pga-tour-res.cloudinary.com/image/upload/c_fill,d_headshots_default.png,f_auto,g_face:center,h_294,q_auto,w_220/headshots_46046.png",
  "McIlroy, Rory": "https://pga-tour-res.cloudinary.com/image/upload/c_fill,d_headshots_default.png,f_auto,g_face:center,h_294,q_auto,w_220/headshots_28237.png",
  "Rahm, Jon": "https://pga-tour-res.cloudinary.com/image/upload/c_fill,d_headshots_default.png,f_auto,g_face:center,h_294,q_auto,w_220/headshots_46970.png",
  "Hovland, Viktor": "https://pga-tour-res.cloudinary.com/image/upload/c_fill,d_headshots_default.png,f_auto,g_face:center,h_294,q_auto,w_220/headshots_46717.png",
  "Cantlay, Patrick": "https://pga-tour-res.cloudinary.com/image/upload/c_fill,d_headshots_default.png,f_auto,g_face:center,h_294,q_auto,w_220/headshots_39971.png",
  "Schauffele, Xander": "https://pga-tour-res.cloudinary.com/image/upload/c_fill,d_headshots_default.png,f_auto,g_face:center,h_294,q_auto,w_220/headshots_48081.png",
  "Koepka, Brooks": "https://pga-tour-res.cloudinary.com/image/upload/c_fill,d_headshots_default.png,f_auto,g_face:center,h_294,q_auto,w_220/headshots_34046.png",
  "Spieth, Jordan": "https://pga-tour-res.cloudinary.com/image/upload/c_fill,d_headshots_default.png,f_auto,g_face:center,h_294,q_auto,w_220/headshots_34046.png"
};
export const transformGolferData = (
  rankings: any[],
  odds: any[] = [],
  skillRatings: any[] = [],
  approachStats: any[] = []
): Golfer[] => {
  // Sort rankings by datagolf_rank and take only top 10
  const top10Rankings = rankings
    .sort((a, b) => (a.datagolf_rank || 0) - (b.datagolf_rank || 0))
    .slice(0, 10);

  return top10Rankings.map(player => {
    const oddsData = odds.find(o => o.dg_id.toString() === player.dg_id.toString());
    const skillData = skillRatings.find(s => s.dg_id === player.dg_id);
    const approachData = approachStats.find(a => a.dg_id === player.dg_id);

    // Convert oddsData.fanduel from string to number
    const fanduelOdds = oddsData ? parseInt(oddsData.fanduel, 10) : 0;

    // Fetch the player's round history from the JSON data
    const playerRounds = playerRoundsData[player.player_name] || {};

    return {
      id: player.dg_id.toString(),
      name: player.player_name,
      imageUrl: golferImages[player.player_name] || `https://pga-tour-res.cloudinary.com/image/upload/c_fill,d_headshots_default.png,f_auto,g_face:center,h_294,q_auto,w_220/headshots_${player.dg_id}.png`,
      rank: player.datagolf_rank,
      strokesGainedTotal: skillData?.sg_total || 0,
      strokesGainedTee: skillData?.sg_ott || 0,
      strokesGainedApproach: skillData?.sg_app || 0,
      strokesGainedAround: skillData?.sg_arg || 0,
      strokesGainedPutting: skillData?.sg_putt || 0,
      proximityStats: {
        '100-125': approachData?.['100_150_fw_proximity_per_shot'] || 0,
        '125-150': approachData?.['100_150_fw_proximity_per_shot'] || 0,
        '175-200': approachData?.['150_200_fw_proximity_per_shot'] || 0,
        '200-225': approachData?.['over_200_fw_proximity_per_shot'] || 0,
        '225plus': approachData?.['over_200_fw_proximity_per_shot'] || 0
      },
      odds: fanduelOdds,
      simulatedRank: 0,
      simulationStats: {
        averageFinish: 0,
        winPercentage: calculateImpliedProbability(fanduelOdds),
        impliedProbability: calculateImpliedProbability(fanduelOdds)
      },
      recentRounds: playerRounds
    };
  });
};