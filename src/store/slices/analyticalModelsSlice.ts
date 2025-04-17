import { StateCreator } from 'zustand';
import { AnalyticalModel } from '../../types/analyticalModel.js';

export interface AnalyticalModelsState {
  savedModels: AnalyticalModel[];
  weights?: any; // Assuming weights is of type any, adjust as necessary
  saveModel: (data: { name: string; weights: any }) => void;
  loadModel: (id: string) => void;
  deleteModel: (id: string) => void;
}

export const createAnalyticalModelsSlice: StateCreator<AnalyticalModelsState> = (set, get) => ({
  savedModels: [],
  
  saveModel: (data) => set((state) => ({
    savedModels: [
      ...state.savedModels,
      {
        id: crypto.randomUUID(),
        name: data.name,
        createdAt: new Date().toISOString(),
        weights: data.weights
      }
    ]
  })),
  
  loadModel: (id) => {
    const model = get().savedModels.find(m => m.id === id);
    if (model) {
      set({ weights: model.weights });
    }
  },
  
  deleteModel: (id) => set((state) => ({
    savedModels: state.savedModels.filter(m => m.id !== id)
  }))
});