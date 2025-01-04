import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SavedModelsSlice, createSavedModelsSlice } from './slices/savedModelsSlice';

type CourseFitStore = SavedModelsSlice;

export const useCourseFitStore = create<CourseFitStore>()(
  persist(
    (...a) => ({
      ...createSavedModelsSlice(...a),
    }),
    {
      name: 'course-fit-storage',
    }
  )
);