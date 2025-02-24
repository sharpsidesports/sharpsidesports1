import { StateCreator } from 'zustand';
import { CourseConditions } from '../../types/golf';

export interface ConditionsSlice {
  conditions: CourseConditions;
  selectedCourses: string[];
  updateConditions: (conditions: CourseConditions) => void;
  toggleCourse: (courseId: string) => void;
}

export const createConditionsSlice: StateCreator<ConditionsSlice> = (set) => ({
  conditions: {
    grass: 'all',
    course: 'all',
    driving: ['medium'],
    approach: ['medium'],
    scoring: ['medium']
  },
  selectedCourses: [
    'Augusta National Golf Club',
    'Muirfield Village Golf Club',
    'The Renaissance Club',
    'ACCORDIA GOLF Narashino Country Club',
    'TPC Twin Cities',
    'Detroit Golf Club',
    'Oak Hill Country Club',
    'TPC Craig Ranch',
    'Silverado Resort and Spa (North Course)',
    'Liberty National Golf Club',
    'TPC Summerlin',
    'TPC River Highlands',
    'Bethpage Black',
    'Caves Valley Golf Club',
    'Castle Pines Golf Club',
    'Sherwood Country Club',
    'St. Andrews Links (Old Course)',
    'TPC Boston',
    'TPC Deere Run',
    'TPC Sawgrass (Valspar Championship)',
    'TPC Scottsdale (Stadium Course)',
    'TPC San Antonio (Oaks Course)',
    'TPC Southwind',
    'TPC Stadium Course',
    
  ],
  
  updateConditions: (conditions) => set({ conditions }),
  
  toggleCourse: (courseId) => set((state) => ({
    selectedCourses: state.selectedCourses.includes(courseId)
      ? state.selectedCourses.filter(id => id !== courseId)
      : [...state.selectedCourses, courseId]
  }))
});