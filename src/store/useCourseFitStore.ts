import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SavedModelsSlice, createSavedModelsSlice } from './slices/savedModelsSlice';
import { getPlayerRoundsByDgIds } from '../utils/supabase/queries';
import { datagolfService } from '../services/api/datagolfService';
import type { Database } from '../types/supabase';

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
}

interface CourseFitState extends SavedModelsSlice {
  selectedCourseId: string | null;
  comparisonCourseId: string | null;
  playerRounds: PlayerRound[];
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
  };

  const sum = rounds.reduce((acc, round) => ({
    avgSgTotal: acc.avgSgTotal + (round.sg_total || 0),
    avgSgOtt: acc.avgSgOtt + (round.sg_ott || 0),
    avgSgApp: acc.avgSgApp + (round.sg_app || 0),
    avgSgArg: acc.avgSgArg + (round.sg_arg || 0),
    avgSgPutt: acc.avgSgPutt + (round.sg_putt || 0),
  }), {
    avgSgTotal: 0,
    avgSgOtt: 0,
    avgSgApp: 0,
    avgSgArg: 0,
    avgSgPutt: 0,
  });

  return {
    rounds: rounds.length,
    avgSgTotal: sum.avgSgTotal / rounds.length,
    avgSgOtt: sum.avgSgOtt / rounds.length,
    avgSgApp: sum.avgSgApp / rounds.length,
    avgSgArg: sum.avgSgArg / rounds.length,
    avgSgPutt: sum.avgSgPutt / rounds.length,
  };
};

export const useCourseFitStore = create<CourseFitState>()(
  persist(
    (set, get) => ({
      ...createSavedModelsSlice(set, get),
      selectedCourseId: null,
      comparisonCourseId: null,
      playerRounds: [],
      courseStats: {},
      loading: false,
      error: null,

      setSelectedCourse: (courseId) => set({ selectedCourseId: courseId }),
      setComparisonCourse: (courseId) => set({ comparisonCourseId: courseId }),

      fetchPlayerRounds: async (courseIds) => {
        set({ loading: true, error: null });
        try {
          // Get top 10 players from DataGolf rankings
          const rankingsResponse = await datagolfService.getPlayerRankings();
          
          if (!rankingsResponse?.rankings || !Array.isArray(rankingsResponse.rankings)) {
            throw new Error('Invalid rankings data received');
          }

          // Sort rankings by datagolf_rank and take only top 10
          const top10Rankings = rankingsResponse.rankings
            .sort((a, b) => (a.datagolf_rank || 0) - (b.datagolf_rank || 0))
            .slice(0, 10);

          // Get the dg_ids for the top 10 players
          const dgIds = top10Rankings.map(p => String(p.dg_id)).filter(Boolean);

          if (dgIds.length === 0) {
            throw new Error('No valid player IDs found in rankings');
          }

          // Fetch rounds for the top 10 players at the selected courses
          const rounds = await getPlayerRoundsByDgIds(
            dgIds,
            courseIds,
            {
              limit: 10000,
              startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
            }
          );

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