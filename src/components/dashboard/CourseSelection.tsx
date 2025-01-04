import React from 'react';
import { useGolfStore } from '../../store/useGolfStore';

interface CourseOption {
  id: string;
  name: string;
}

const COURSE_OPTIONS: CourseOption[] = [
  { id: 'augusta', name: 'Augusta National' },
  { id: 'valhalla', name: 'Valhalla GC' },
  { id: 'pinehurst', name: 'Pinehurst No. 2' },
  { id: 'royal-troon', name: 'Royal Troon' },
  { id: 'tpc-sawgrass', name: 'TPC Sawgrass' },
  { id: 'riviera', name: 'Riviera CC' },
  { id: 'bay-hill', name: 'Bay Hill' },
  { id: 'muirfield', name: 'Muirfield Village' }
];

export default function CourseSelection() {
  const { selectedCourses, toggleCourse } = useGolfStore();

  return (
    <div className="bg-white rounded-lg shadow p-4 flex-1">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-700">Course Filter</h3>
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => COURSE_OPTIONS.forEach(course => toggleCourse(course.id))}
            className="text-green-600 hover:text-green-700"
          >
            All
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => selectedCourses.forEach(id => toggleCourse(id))}
            className="text-red-600 hover:text-red-700"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {COURSE_OPTIONS.map((course) => (
          <button
            key={course.id}
            onClick={() => toggleCourse(course.id)}
            className={`
              px-2 py-1 rounded-md text-xs font-medium text-left
              transition-colors duration-150 flex justify-between items-center
              ${selectedCourses.includes(course.id)
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            <span className="truncate">{course.name}</span>
            <span className="text-xs opacity-60 ml-1">{course.tournament}</span>
          </button>
        ))}
      </div>
    </div>
  );
}