import { StateCreator } from 'zustand';
import { SavedModel } from '../../features/course-fit/types/model';

export interface SavedModelsSlice {
  savedModels: SavedModel[];
  saveModel: (data: { name: string; description?: string }) => void;
  loadModel: (id: string) => void;
  deleteModel: (id: string) => void;
}

export const createSavedModelsSlice: StateCreator<SavedModelsSlice> = (set, get) => ({
  savedModels: [],
  
  saveModel: (data) => set((state) => ({
    savedModels: [
      ...state.savedModels,
      {
        id: crypto.randomUUID(),
        name: data.name,
        description: data.description,
        createdAt: new Date().toISOString(),
        courseId: '', // Add current course ID
        comparisonCourseId: '', // Add comparison course ID if exists
        attributes: {
          drivingImportance: 0,
          approachImportance: 0,
          puttingImportance: 0,
        },
      },
    ],
  })),
  
  loadModel: (id) => {
    const model = get().savedModels.find(m => m.id === id);
    if (model) {
      // Implement loading logic
    }
  },
  
  deleteModel: (id) => set((state) => ({
    savedModels: state.savedModels.filter(m => m.id !== id),
  })),
});