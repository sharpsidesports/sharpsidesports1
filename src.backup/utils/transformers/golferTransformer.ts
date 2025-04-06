import { Golfer } from '../../types/golf';
import { calculateImpliedProbability } from '../calculations/oddsCalculator';
import { getPlayerRoundsByDgIds, getScoringStatsByDgIds, SupabaseError } from '../supabase/queries';

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

export const transformGolferData = async (
  rankings: any[],
  odds: any[] = [],
  approachStats: any[] = [],
  selectedCourses: string[] = []
): Promise<Golfer[]> => {
  try {
    if (!Array.isArray(rankings) || rankings.length === 0) {
      console.warn('No rankings data provided');
      return [];
    }

    // Sort odds by Fanduel odds (lower odds = better chance of winning)
    // and take top 20 players
    const topPlayerIds = new Set(
      odds
        .filter(player => player.fanduel) // Only consider players with Fanduel odds
        .sort((a, b) => (a.fanduel || Infinity) - (b.fanduel || Infinity)) // Sort by odds ascending
        .slice(0, 500) // Take top 20
        .map(player => player.dg_id) // Get their IDs
    );
    
    // Filter rankings to only include top tournament players
    const tournamentRankings = rankings.filter(player => 
      topPlayerIds.has(player.dg_id)
    );

    // Sort rankings by datagolf_rank
    const sortedRankings = tournamentRankings
      .sort((a, b) => (a.datagolf_rank || 0) - (b.datagolf_rank || 0));

    // Get the dg_ids for the tournament players
    const dgIds = sortedRankings.map(p => {
      // console.log('Player dg_id:', {
      //   name: p.player_name,
      //   dg_id: p.dg_id,
      //   type: typeof p.dg_id
      // });
      return String(p.dg_id);
    }).filter(Boolean);

    if (dgIds.length === 0) {
      console.warn('No valid dg_ids found in rankings');
      return [];
    }

    // Get scoring stats and rounds data from Supabase
    let scoringStats: any[] = [], playerRounds: any[] = [];
    try {
      [scoringStats, playerRounds] = await Promise.all([
        getScoringStatsByDgIds(dgIds, {
          years: [new Date().getFullYear(), new Date().getFullYear() - 1],
        }),
        getPlayerRoundsByDgIds(dgIds, selectedCourses, {
          limit: 100000, 
          startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        })
      ]);

      // Debug log the results
      console.log('Scoring stats:', scoringStats.length, 'items');
      console.log('Player rounds:', playerRounds.length, 'items');
      console.log('Sample scoring stat:', scoringStats[0]);
      console.log('Sample player round:', playerRounds[0]);
    } catch (error) {
      console.error('Failed to fetch data from Supabase:', error);
      if (error instanceof SupabaseError) {
        console.error('Supabase Error Details:', {
          code: error.code,
          details: error.details,
          hint: error.hint
        });
      }
      scoringStats = [];
      playerRounds = [];
    }

    // Transform the data into Golfer objects
    const golfers: Golfer[] = sortedRankings.map(ranking => {
      const playerOdds = odds.find(o => o.dg_id === ranking.dg_id) || {};
      const approachData = approachStats.find(s => s.dg_id === ranking.dg_id) || {};
      const playerScoringStats = scoringStats.filter(s => s.dg_id === String(ranking.dg_id));
      const playerSpecificRounds = playerRounds.filter(r => r.dg_id === String(ranking.dg_id));

      // Validate essential data is present
      const hasRequiredData = (
        ranking.dg_id &&
        ranking.player_name &&
        playerScoringStats.length > 0 &&
        playerSpecificRounds.length > 0 &&
        playerOdds.fanduel // Ensure we have odds data
      );

      if (!hasRequiredData) {
        console.log(`Skipping player ${ranking.player_name} (${ranking.dg_id}) due to missing data:`, {
          hasDgId: !!ranking.dg_id,
          hasName: !!ranking.player_name,
          scoringStatsCount: playerScoringStats.length,
          roundsCount: playerSpecificRounds.length,
          hasOdds: !!playerOdds.fanduel
        });
        return null;
      }

      console.log('Processing player:', {
        name: ranking.player_name,
        dg_id: ranking.dg_id,
        scoringStatsCount: playerScoringStats.length,
        roundsCount: playerSpecificRounds.length,
        sampleStat: playerScoringStats[0]?.title
      });

      // Calculate average from rounds
      const calculateAverageFromRounds = (field: string): number => {
        if (!playerSpecificRounds.length) return 0;
        const validRounds = playerSpecificRounds.filter(round => round[field] != null);
        if (!validRounds.length) return 0;
        const total = validRounds.reduce((sum, round) => sum + round[field], 0);
        return total / validRounds.length;
      };

      // Calculate average from scoring stats
      const calculateAverageFromStats = (statId: string): number => {
        const stats = playerScoringStats.filter(s => s.stat_id === statId);
        if (stats.length === 0) {
          console.log(`No stats found for ID ${statId} for player ${ranking.player_name}`);
          return 0;
        }
        return stats.reduce((sum, s) => sum + (s.value || 0), 0) / stats.length;
      };

      // Organize rounds by course
      const roundsByCourse: { [courseName: string]: { rounds: any[] } } = {};
      playerSpecificRounds.forEach(round => {
        if (!roundsByCourse[round.course]) {
          roundsByCourse[round.course] = { rounds: [] };
        }
        roundsByCourse[round.course].rounds.push({
          eventName: round.event_name,
          eventId: round.event_id,
          courseName: round.course,
          playerName: ranking.player_name,
          dgId: ranking.dg_id,
          round: round.round_num,
          date: round.round_date,
          teeTime: round.tee_time || "",
          course_num: round.course_num,
          course_par: round.course_par,
          start_hole: round.start_hole || 1,
          score: round.score,
          sg_app: round.sg_app || 0,
          sg_arg: round.sg_arg || 0,
          sg_ott: round.sg_ott || 0,
          sg_putt: round.sg_putt || 0,
          sg_t2g: round.sg_t2g || 0,
          sg_total: round.sg_total || 0,
          driving_acc: round.driving_acc || 0,
          driving_dist: round.driving_dist || 0,
          gir: round.gir || 0,
          prox_fw: round.prox_fw || 0,
          prox_rgh: round.prox_rgh || 0,
          scrambling: round.scrambling || 0
        });
      });

      return {
        id: ranking.dg_id.toString(),
        name: ranking.player_name,
        imageUrl: golferImages[ranking.player_name] || `https://pga-tour-res.cloudinary.com/image/upload/c_fill,d_headshots_default.png,f_auto,g_face:center,h_294,q_auto,w_220/headshots_${ranking.dg_id}.png`,
        rank: ranking.datagolf_rank || 0,
        // Use round data for strokes gained metrics
        strokesGainedTotal: calculateAverageFromRounds('sg_total'),
        strokesGainedTee: calculateAverageFromRounds('sg_ott'),
        strokesGainedApproach: calculateAverageFromRounds('sg_app'),
        strokesGainedAround: calculateAverageFromRounds('sg_arg'),
        strokesGainedPutting: calculateAverageFromRounds('sg_putt'),
        gir: calculateAverageFromRounds('gir'),
        drivingAccuracy: calculateAverageFromRounds('driving_acc'),
        drivingDistance: calculateAverageFromRounds('driving_dist'),
        odds: playerOdds.fanduel ? {
          fanduel: playerOdds.fanduel,
          impliedProbability: calculateImpliedProbability(playerOdds.fanduel),
          lastUpdated: new Date().toISOString()
        } : undefined,
        proximityMetrics: {
          // For 100-150 range, we use the actual data but slightly adjust for the sub-ranges
          '100-125': (approachData?.['100_150_fw_proximity_per_shot'] || 0) * 0.95, // Typically slightly more accurate
          '125-150': (approachData?.['100_150_fw_proximity_per_shot'] || 0) * 1.05, // Typically slightly less accurate
          // For 150-200 range, we interpolate based on distance
          '150-175': (approachData?.['150_200_fw_proximity_per_shot'] || 0) * 0.95, // Closer shots more accurate
          '175-200': (approachData?.['150_200_fw_proximity_per_shot'] || 0) * 1.05, // Further shots less accurate
          // For 200+ range, we create a gradient of difficulty
          '200-225': (approachData?.['over_200_fw_proximity_per_shot'] || 0) * 0.95, // Slightly more accurate
          '225plus': (approachData?.['over_200_fw_proximity_per_shot'] || 0) * 1.15  // Notably more difficult
        },
        scoringStats: {
          bogeyAvoidance: calculateAverageFromStats('02414'),
          // consecutiveBirdiesStreak: calculateAverageFromStats('02672'),
          // consecutiveBirdiesEaglesStreak: calculateAverageFromStats('02673'),
          // totalEagles: calculateAverageFromStats('106'),
          totalBirdies: calculateAverageFromStats('107'),
          par3BirdieOrBetter: calculateAverageFromStats('112'),
          par4BirdieOrBetter: calculateAverageFromStats('113'),
          par5BirdieOrBetter: calculateAverageFromStats('114'),
          birdieOrBetterConversion: calculateAverageFromStats('115'),
          par3ScoringAvg: calculateAverageFromStats('142'),
          par4ScoringAvg: calculateAverageFromStats('143'),
          par5ScoringAvg: calculateAverageFromStats('144'),
          eaglesPerHole: calculateAverageFromStats('155'),
          birdieAverage: calculateAverageFromStats('156'),
          birdieOrBetterPercentage: calculateAverageFromStats('352'),
          // consecutiveHolesBelowPar: calculateAverageFromStats('452'),
          simulatedRank: 0
        },
        simulationStats: {
          averageFinish: 0,
          winPercentage: 0,
          top10Percentage: 0,
          impliedProbability: playerOdds.fanduel ? calculateImpliedProbability(playerOdds.fanduel) : 0
        },
        recentRounds: roundsByCourse
      };
    }).filter(Boolean);

    return golfers;
  } catch (error) {
    console.error('Error in transformGolferData:', error);
    return [];
  }
};