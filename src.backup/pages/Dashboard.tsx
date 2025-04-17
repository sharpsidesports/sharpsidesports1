import { useEffect } from 'react';
import { useGolfStore } from '../store/useGolfStore';
// import { useDataGolf } from '../hooks/useDataGolf';
import CourseConditions from '../components/dashboard/CourseConditions';
import AnalyticalModel from '../components/dashboard/AnalyticalModel';
import SimulationStats from '../components/dashboard/SimulationStats';
import PerformanceTable from '../components/dashboard/PerformanceTable';
import CourseInsights from '../components/dashboard/CourseInsights';
import RoundRangeSelector from '../components/dashboard/RoundRangeSelector';
import CourseDifficultyFilters from '../components/dashboard/CourseDifficultyFilters';
import CourseSelection from '../components/dashboard/CourseSelection';
import GolferList from '../components/dashboard/GolferList';
import GolferCard from '../components/dashboard/GolferCard';

const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sharpside-green"></div>
        <p className="text-gray-700">Loading...</p>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { runSimulation, golfers, fetchGolferData, selectedCourses, loading, error } = useGolfStore();

  useEffect(() => {
    fetchGolferData().then(() => {
      runSimulation();
    });
  }, [fetchGolferData, runSimulation, selectedCourses]);

  return (
    <div className="space-y-6">
      {loading && <LoadingOverlay />}
      {error && <p className="text-red-500">{error}</p>}
      <RoundRangeSelector />
      
      <div className="flex gap-4">
        <div className="space-y-4">
          <CourseDifficultyFilters />
          <CourseConditions />
        </div>
        <div className="flex-1 flex">
          <CourseSelection />
        </div>
      </div>

      <AnalyticalModel />

      <div className="flex justify-center mb-6">
        <button
          onClick={() => runSimulation()}
          className="bg-sharpside-green text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Run Simulation
        </button>
      </div>

      {/* <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Simulation Statistics</h2>
        <SimulationStats />
      </div> */}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Model Analysis</h2>
        <PerformanceTable />
      </div>

      <CourseInsights />
      <GolferList />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(golfers) && golfers.length > 0 ? (
          golfers.map((golfer) => (
            <GolferCard key={golfer.id} golfer={golfer} />
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">No golfers available</p>
        )}
      </div>
    </div>
  );
}