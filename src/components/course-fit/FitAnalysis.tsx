import { useCourseFitStore } from '../../store/useCourseFitStore.js';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function FitAnalysis() {
  const { courseStats } = useCourseFitStore();

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Course Fit Analysis</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg">
          <div className="text-sm text-gray-600">Driving Importance</div>
          <div className="text-2xl font-bold text-green-600">35%</div>
          <div className="text-xs text-gray-500">Based on course characteristics</div>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <div className="text-sm text-gray-600">Approach Importance</div>
          <div className="text-2xl font-bold text-green-600">45%</div>
          <div className="text-xs text-gray-500">Based on historical data</div>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <div className="text-sm text-gray-600">Putting Importance</div>
          <div className="text-2xl font-bold text-green-600">20%</div>
          <div className="text-xs text-gray-500">Based on green complexity</div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={Object.values(courseStats)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="driving" name="Driving" fill="#34d399" />
            <Bar dataKey="approach" name="Approach" fill="#60a5fa" />
            <Bar dataKey="putting" name="Putting" fill="#f472b6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}