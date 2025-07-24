import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createSavedModelsSlice, SavedModelsSlice } from './slices/savedModelsSlice.js';
import { getPlayerRoundsByDgIds } from '../utils/supabase/queries.js';
import { datagolfService } from '../services/api/datagolfService.js';
import { Database } from '../types/supabase.js';
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
          // Fetch player rounds for the specified courses
          const response = await datagolfService.getRoundScoring();
          
          if (response && response.data) {
            // Filter rounds for the specified courses
            const filteredRounds = response.data.filter((round: any) => 
              courseIds.includes(round.course_name || round.course)
            );

            // Transform the data to match our PlayerRound type
            const playerRounds: PlayerRound[] = filteredRounds.map((round: any) => ({
              dg_id: round.dg_id?.toString() || '',
              player_name: round.player_name || '',
              course: round.course_name || round.course || '',
              event_name: round.event_name || '',
              event_id: round.event_id || 0,
              round_num: round.round || 1,
              round_date: round.date || '',
              tee_time: round.tee_time || '',
              course_num: round.course_num || 1,
              course_par: round.course_par || 72,
              start_hole: round.start_hole || 1,
              score: round.score || 0,
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
            }));

            set({ playerRounds, loading: false });
          } else {
            set({ loading: false, error: 'No player rounds data available' });
          }
        } catch (error) {
          console.error('Error fetching player rounds:', error);
          set({ loading: false, error: 'Failed to fetch player rounds' });
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