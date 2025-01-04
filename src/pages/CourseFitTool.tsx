import React, { useState } from 'react';
import CourseSelector from '../components/course-fit/CourseSelector';
import CourseComparison from '../components/course-fit/CourseComparison';
import PlayerFitList from '../components/course-fit/PlayerFitList';
import { mockCourses } from '../data/mockData/mockCourses';

export default function CourseFitTool() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [comparisonCourseId, setComparisonCourseId] = useState<string>('');

  const selectedCourse = mockCourses.find(c => c.id === selectedCourseId) || null;
  const comparisonCourse = mockCourses.find(c => c.id === comparisonCourseId) || null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-2">Course Fit Tool</h1>
        <p className="text-gray-600 mb-6">
          Compare course characteristics and analyze player performance across different venues
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CourseSelector 
              selectedCourseId={selectedCourseId}
              comparisonCourseId={comparisonCourseId}
              onSelectCourse={setSelectedCourseId}
              onSelectComparison={setComparisonCourseId}
            />
          </div>

          <div className="lg:col-span-2">
            <CourseComparison
              selectedCourse={selectedCourse}
              comparisonCourse={comparisonCourse}
            />
          </div>
        </div>

        {selectedCourse && (
          <div className="mt-6">
            <PlayerFitList course={selectedCourse} />
          </div>
        )}
      </div>
    </div>
  );
}