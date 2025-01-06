import { Golfer, GolferStats } from '../../types/golf';
import { calculateImpliedProbability } from '../calculations/oddsCalculator';
import playerRoundsData from '../../data/player_rounds_FILTERED.json';

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
  approachStats: any[] = [],
  selectedCourses: string[] = []
): Golfer[] => {
  // Sort rankings by datagolf_rank and take only top 10
  const top10Rankings = rankings
    .sort((a, b) => (a.datagolf_rank || 0) - (b.datagolf_rank || 0))
    .slice(0, 2);

  return top10Rankings.map(player => {
    const approachData = approachStats.find(a => a.dg_id === player.dg_id);


    // Fetch the player's round history from the JSON data
    const playerRounds = playerRoundsData[player.player_name] || {};

    // Calculate average SG metrics across selected courses
    let totalRounds = 0;
    let totalSGTotal = 0, totalSGTee = 0, totalSGApproach = 0, totalSGAround = 0, totalSGPutting = 0;
    console.log(selectedCourses)
    selectedCourses.forEach(course => {
      if (playerRounds[course]) {
        playerRounds[course].rounds.forEach(round => {
          totalSGTotal += round.sg_total;
          totalSGTee += round.sg_ott;
          totalSGApproach += round.sg_app;
          totalSGAround += round.sg_arg;
          totalSGPutting += round.sg_putt;
          totalRounds++;
        });
      }
    });

    const averageSGTotal = totalRounds ? totalSGTotal / totalRounds : 0;
    const averageSGTee = totalRounds ? totalSGTee / totalRounds : 0;
    const averageSGApproach = totalRounds ? totalSGApproach / totalRounds : 0;
    const averageSGAround = totalRounds ? totalSGAround / totalRounds : 0;
    const averageSGPutting = totalRounds ? totalSGPutting / totalRounds : 0;

    return {
      id: player.dg_id.toString(),
      name: player.player_name,
      imageUrl: golferImages[player.player_name] || `https://pga-tour-res.cloudinary.com/image/upload/c_fill,d_headshots_default.png,f_auto,g_face:center,h_294,q_auto,w_220/headshots_${player.dg_id}.png`,
      rank: player.datagolf_rank,
      strokesGainedTotal: averageSGTotal,
      strokesGainedTee: averageSGTee,
      strokesGainedApproach: averageSGApproach,
      strokesGainedAround: averageSGAround,
      strokesGainedPutting: averageSGPutting,
      proximityStats: {
        '100-125': 1,
        '125-150': 1,
        '175-200': 1,
        '200-225': 1,
        '225plus': 1
      },
      // proximityStats: {
      //   '100-125': approachData?.['100_150_fw_proximity_per_shot'] || 0,
      //   '125-150': approachData?.['100_150_fw_proximity_per_shot'] || 0,
      //   '175-200': approachData?.['150_200_fw_proximity_per_shot'] || 0,
      //   '200-225': approachData?.['over_200_fw_proximity_per_shot'] || 0,
      //   '225plus': approachData?.['over_200_fw_proximity_per_shot'] || 0
      // },
      odds: odds,
      simulatedRank: 0,
      simulationStats: {
        averageFinish: 0,
        winPercentage: calculateImpliedProbability(odds),
        impliedProbability: calculateImpliedProbability(odds)
      },
      recentRounds: playerRounds
    };
  });
};