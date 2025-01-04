import React from 'react';
import { useCourseFitStore } from '../../store/useCourseFitStore';

export default function CourseStats() {
  const { courseStats } = useCourseFitStore();

  const StatRow = ({ label, value, description }: { 
    label: string; 
    value: string; 
    description: string;
  }) => (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-green-600">{value}</span>
      </div>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Course Statistics</h3>
      <div className="space-y-4">
        <StatRow
          label="Course Length"
          value="7,510 yards"
          description="Total distance from championship tees"
        />
        <StatRow
          label="Average Score"
          value="71.2"
          description="Historical scoring average"
        />
        <StatRow
          label="Fairway Width"
          value="28 yards"
          description="Average width of fairways"
        />
        <StatRow
          label="Green Size"
          value="6,500 sq ft"
          description="Average green size"
        />
        <StatRow
          label="Green Speed"
          value="13.5"
          description="Stimpmeter reading"
        />
      </div>
    </div>
  );
}