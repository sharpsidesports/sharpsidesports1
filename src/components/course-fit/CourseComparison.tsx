import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Course } from '../../types/courseFit';

interface CourseComparisonProps {
  selectedCourse: Course | null;
  comparisonCourse: Course | null;
}

export default function CourseComparison({ selectedCourse, comparisonCourse }: CourseComparisonProps) {
  if (!selectedCourse) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-500">Select a course to view analysis</p>
      </div>
    );
  }

  const radarData = [
    { 
      attribute: 'Driving Distance',
      selected: selectedCourse.attributes.drivingDistance,
      comparison: comparisonCourse?.attributes.drivingDistance || 0.5,
      tour: 0.5
    },
    { 
      attribute: 'Driving Accuracy',
      selected: selectedCourse.attributes.drivingAccuracy,
      comparison: comparisonCourse?.attributes.drivingAccuracy || 0.5,
      tour: 0.5
    },
    { 
      attribute: 'Approach',
      selected: selectedCourse.attributes.approach,
      comparison: comparisonCourse?.attributes.approach || 0.5,
      tour: 0.5
    },
    { 
      attribute: 'Around Green',
      selected: selectedCourse.attributes.aroundGreen,
      comparison: comparisonCourse?.attributes.aroundGreen || 0.5,
      tour: 0.5
    },
    { 
      attribute: 'Putting',
      selected: selectedCourse.attributes.putting,
      comparison: comparisonCourse?.attributes.putting || 0.5,
      tour: 0.5
    },
  ];

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Course Attributes Comparison</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="attribute" />
            <PolarRadiusAxis angle={30} domain={[0, 1]} />
            <Radar
              name={selectedCourse.name}
              dataKey="selected"
              stroke="#059669"
              fill="#059669"
              fillOpacity={0.3}
            />
            {comparisonCourse && (
              <Radar
                name={comparisonCourse.name}
                dataKey="comparison"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
              />
            )}
            <Radar
              name="Tour Average"
              dataKey="tour"
              stroke="#6B7280"
              fill="#6B7280"
              fillOpacity={0.3}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}