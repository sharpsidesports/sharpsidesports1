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
    driving: 'medium',
    approach: 'medium',
    scoring: 'medium'
  },
  selectedCourses: [
    'Augusta National Golf Club'
  ],
  
  updateConditions: (conditions) => set({ conditions }),
  
  toggleCourse: (courseId) => set((state) => ({
    selectedCourses: state.selectedCourses.includes(courseId)
      ? state.selectedCourses.filter(id => id !== courseId)
      : [...state.selectedCourses, courseId]
  }))
});