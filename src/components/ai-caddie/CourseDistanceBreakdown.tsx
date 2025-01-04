import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useCourseData } from './hooks/useCourseData';

export default function CourseDistanceBreakdown() {
  const { courseDistances } = useCourseData();

  const COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0'];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Course Distance Distribution</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={courseDistances}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="percentage"
              >
                {courseDistances.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium mb-3">Distance Breakdown Analysis</h3>
          {courseDistances.map((distance, index) => (
            <div 
              key={distance.name}
              className="bg-gray-50 p-4 rounded-lg"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{distance.name}</span>
                <span className="text-green-600 font-semibold">
                  {(distance.percentage * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {distance.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}