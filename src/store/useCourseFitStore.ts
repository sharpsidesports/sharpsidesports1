import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SavedModelsSlice, createSavedModelsSlice } from './slices/savedModelsSlice.js';
import { getPlayerRoundsByDgIds } from '../utils/supabase/queries.js';
import { datagolfService, type RankingsResponse } from '../services/api/datagolfService.js';
import type { Database } from '../types/supabase.js';
import type { Player } from '../types/player.js';

type Tables = Database['public']['Tables'];
type PlayerRound = Tables['player_rounds']['Row'];

interface CourseStats {
  courseId: string;
  courseName: string;
  rounds: number;
  avgSgTotal: number;
  avgSgOtt: number;
  avgSgApp: number;
  avgSgArg: number;
  avgSgPutt: number;
  avgDrivingDist: number;
  avgDrivingAcc: number;
}

interface CourseFitState extends SavedModelsSlice {
  selectedCourseId: string | null;
  comparisonCourseId: string | null;
  playerRounds: PlayerRound[];
  players: Player[];
  courseStats: Record<string, CourseStats>;
  loading: boolean;
  error: string | null;
  setSelectedCourse: (courseId: string | null) => void;
  setComparisonCourse: (courseId: string | null) => void;
  fetchPlayerRounds: (courseIds: string[]) => Promise<void>;
  calculateCourseStats: (courseId: string) => void;
}

const calculateAverageStats = (rounds: PlayerRound[]): Omit<CourseStats, 'courseId' | 'courseName'> => {
  if (!rounds.length) return {
    rounds: 0,
    avgSgTotal: 0,
    avgSgOtt: 0,
    avgSgApp: 0,
    avgSgArg: 0,
    avgSgPutt: 0,
    avgDrivingDist: 0,
    avgDrivingAcc: 0,
  };

  // First calculate sums
  const sum = rounds.reduce((acc, round) => ({
    avgSgTotal: acc.avgSgTotal + (round.sg_total || 0),
    avgSgOtt: acc.avgSgOtt + (round.sg_ott || 0),
    avgSgApp: acc.avgSgApp + (round.sg_app || 0),
    avgSgArg: acc.avgSgArg + (round.sg_arg || 0),
    avgSgPutt: acc.avgSgPutt + (round.sg_putt || 0),
    avgDrivingDist: acc.avgDrivingDist + (round.driving_dist || 0),
    avgDrivingAcc: acc.avgDrivingAcc + (round.driving_acc || 0),
  }), {
    avgSgTotal: 0,
    avgSgOtt: 0,
    avgSgApp: 0,
    avgSgArg: 0,
    avgSgPutt: 0,
    avgDrivingDist: 0,
    avgDrivingAcc: 0,
  });

  // Calculate averages
  const numRounds = rounds.length;
  return {
    rounds: numRounds,
    avgSgTotal: sum.avgSgTotal / numRounds,
    avgSgOtt: sum.avgSgOtt / numRounds,
    avgSgApp: sum.avgSgApp / numRounds,
    avgSgArg: sum.avgSgArg / numRounds,
    avgSgPutt: sum.avgSgPutt / numRounds,
    avgDrivingDist: sum.avgDrivingDist / numRounds,
    // Driving accuracy is already in percentage form (0-1), no need to multiply by 100 here
    avgDrivingAcc: sum.avgDrivingAcc / numRounds,
  };
};

export const useCourseFitStore = create<CourseFitState>()(
  persist(
    (set, get, api) => ({
      ...createSavedModelsSlice(set, get, api),
      selectedCourseId: null,
      comparisonCourseId: null,
      playerRounds: [],
      players: [],
      courseStats: {},
      loading: false,
      error: null,
      

      setSelectedCourse: (courseId) => set({ selectedCourseId: courseId }),
      setComparisonCourse: (courseId) => set({ comparisonCourseId: courseId }),

      fetchPlayerRounds: async (courseIds) => {
        set({ loading: true, error: null });
        try {
          console.log('Fetching player rounds for courses:', courseIds);
          
          // Get top 10 players from DataGolf rankings
          const rankingsResponse: RankingsResponse = await datagolfService.getPlayerRankings();
          console.log('Rankings response:', rankingsResponse);
          
          if (!rankingsResponse?.rankings || !Array.isArray(rankingsResponse.rankings)) {
            throw new Error('Invalid rankings data received');
          }

          // Sort rankings by datagolf_rank and take only top 10
          const top10Rankings = rankingsResponse.rankings
            .sort((a, b) => (a.datagolf_rank || 0) - (b.datagolf_rank || 0))
            .slice(0, 10);

          console.log('Top 10 rankings:', top10Rankings);

          // Get the dg_ids for the top 10 players
          const dgIds = top10Rankings.map(p => String(p.dg_id)).filter(Boolean);
          console.log('Player dg_ids:', dgIds);

          if (dgIds.length === 0) {
            throw new Error('No valid player IDs found in rankings');
          }

          // Fetch rounds for the top 10 players at the selected courses
          console.log('Fetching rounds from Supabase...');
          const rounds = await getPlayerRoundsByDgIds(
            dgIds,
            courseIds,
            {
              limit: 10000,
              startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
            }
          );
          console.log('Rounds fetched:', rounds.length);

          if (rounds.length === 0) {
            throw new Error('No rounds found for the selected courses');
          }

          set({ playerRounds: rounds });
          
          // Calculate stats for each course
          courseIds.forEach((courseId) => {
            get().calculateCourseStats(courseId);
          });
        } catch (error) {
          console.error('Failed to fetch player rounds:', error);
          set({ error: error instanceof Error ? error.message : 'Failed to fetch player rounds' });
        } finally {
          set({ loading: false });
        }
      },

      calculateCourseStats: (courseId) => {
        const { playerRounds } = get();
        const courseRounds = playerRounds.filter(round => round.course === courseId);
        const stats = calculateAverageStats(courseRounds);
        
        set(state => ({
          courseStats: {
            ...state.courseStats,
            [courseId]: {
              ...stats,
              courseId,
              courseName: courseId,
            }
          }
        }));
      },
    }),
    {
      name: 'course-fit-storage',
    }
  )
);