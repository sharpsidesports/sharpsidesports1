import React from 'react';
import { mockCourses } from '../../data/mockData/mockCourses';

interface CourseSelectorProps {
  selectedCourseId: string;
  comparisonCourseId: string;
  onSelectCourse: (courseId: string) => void;
  onSelectComparison: (courseId: string) => void;
}

export default function CourseSelector({
  selectedCourseId,
  comparisonCourseId,
  onSelectCourse,
  onSelectComparison
}: CourseSelectorProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Select Courses</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Course
          </label>
          <select
            value={selectedCourseId}
            onChange={(e) => onSelectCourse(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="">Select a course</option>
            <optgroup label="Major Venues">
              {mockCourses
                .filter(c => ['augusta', 'pebble', 'oakhill'].includes(c.id))
                .map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
            </optgroup>
            <optgroup label="PGA Tour Venues">
              {mockCourses
                .filter(c => ['sawgrass', 'riviera', 'bay-hill'].includes(c.id))
                .map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
            </optgroup>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comparison Course (Optional)
          </label>
          <select
            value={comparisonCourseId}
            onChange={(e) => onSelectComparison(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="">None</option>
            <optgroup label="Major Venues">
              {mockCourses
                .filter(c => 
                  ['augusta', 'pebble', 'oakhill'].includes(c.id) && 
                  c.id !== selectedCourseId
                )
                .map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
            </optgroup>
            <optgroup label="PGA Tour Venues">
              {mockCourses
                .filter(c => 
                  ['sawgrass', 'riviera', 'bay-hill'].includes(c.id) && 
                  c.id !== selectedCourseId
                )
                .map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
            </optgroup>
          </select>
        </div>

        {selectedCourseId && (
          <div className="mt-6 space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Course Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500">Length</div>
                <div className="text-sm font-medium">
                  {mockCourses.find(c => c.id === selectedCourseId)?.length} yards
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Par</div>
                <div className="text-sm font-medium">
                  {mockCourses.find(c => c.id === selectedCourseId)?.par}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Green Speed</div>
                <div className="text-sm font-medium">
                  {mockCourses.find(c => c.id === selectedCourseId)?.stats.greenSpeed} stimp
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Average Score</div>
                <div className="text-sm font-medium">
                  {mockCourses.find(c => c.id === selectedCourseId)?.stats.avgScore}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}