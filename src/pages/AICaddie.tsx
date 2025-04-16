import { useEffect } from 'react';
import { useGolfStore } from '../store/useGolfStore.js';
import AICaddieAnalysis from '../components/ai-caddie/AICaddieAnalysis.js';

export default function AICaddie() {
  const { fetchGolferData, loading } = useGolfStore();

  useEffect(() => {
    fetchGolferData();
  }, [fetchGolferData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sharpside-green"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-2">AI Caddie Analysis</h1>
        <p className="text-gray-600 mb-6">Course-specific insights and player performance metrics</p>
        
        <AICaddieAnalysis />
      </div>
    </div>
  );
}