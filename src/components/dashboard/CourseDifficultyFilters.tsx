import { useGolfStore } from '../../store/useGolfStore.js';
import { useState, useEffect } from 'react';
import { getCourseDifficulty } from '../../utils/supabase/queries.js';
import type { Database } from '../../types/supabase.js';

type CourseDifficultyRow = Database['public']['Tables']['course_difficulty']['Row'];

type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface DifficultyFilters {
  driving: Set<DifficultyLevel>;
  approach: Set<DifficultyLevel>;
  scoring: Set<DifficultyLevel>;
}

interface CourseDifficultyDetail {
  driving: number;
  scoring: number;
  approach: number;
  difficulty: {
    driving: DifficultyLevel;
    approach: DifficultyLevel;
    scoring: DifficultyLevel;
  };
}

type CourseDifficultyMap = Record<string, CourseDifficultyDetail>;

// COURSE_DIFFICULTY constant removed, data will be fetched from Supabase

export default function CourseDifficultyFilters() {
  const { conditions, updateConditions, selectedCourses, toggleCourse } = useGolfStore();
  const [courseData, setCourseData] = useState<CourseDifficultyMap>({});
  // TODO: Consider adding loading and error states for better UI feedback

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const rawData: CourseDifficultyRow[] = await getCourseDifficulty(); // Fetches all course difficulties
        const transformedData = rawData.reduce((acc, item) => {
          acc[item.course_name] = {
            driving: item.driving_rank,
            scoring: item.scoring_rank,
            approach: item.approach_rank,
            difficulty: {
              driving: item.driving_difficulty as DifficultyLevel,
              approach: item.approach_difficulty as DifficultyLevel,
              scoring: item.scoring_difficulty as DifficultyLevel,
            },
          };
          return acc;
        }, {} as CourseDifficultyMap);
        setCourseData(transformedData);
      } catch (error) {
        console.error("Failed to fetch course difficulty data:", error);
        // Optionally, set an error state here to inform the user or display a message
      }
    };

    fetchCourseData();
  }, []); // Empty dependency array ensures this effect runs once on mount


  // Convert string difficulty to Set for internal component use
  const getDifficultySet = (type: keyof DifficultyFilters): Set<DifficultyLevel> => {
    const value = conditions[type];
    return new Set(Array.isArray(value) ? value : [value]);
  };

  const handleFilterChange = (type: keyof DifficultyFilters, value: DifficultyLevel) => {
    // Clear previously selected courses
    selectedCourses.forEach(course => {
      toggleCourse(course);
    });

    // Toggle the difficulty level
    const currentSet = getDifficultySet(type);
    if (currentSet.has(value)) {
      currentSet.delete(value);
    } else {
      currentSet.add(value);
    }

    // Update conditions with the new set
    const newConditions = {
      ...conditions,
      [type]: Array.from(currentSet)
    };

    // If no difficulties are selected, don't filter courses
    if (currentSet.size === 0 || Object.keys(courseData).length === 0) {
      updateConditions(newConditions);
      return;
    }

    // Find courses that match any of the selected difficulty criteria
    const matchingCourses = Object.entries(courseData)
      .filter(([_, data]: [string, CourseDifficultyDetail]) => currentSet.has(data.difficulty[type]))
      .map(([course]) => course);

    // Select matching courses
    matchingCourses.forEach(course => {
      toggleCourse(course);
    });

    updateConditions(newConditions);
  };

  const FilterRow = ({
    label, 
    type, 
    value 
  }: { 
    label: string; 
    type: keyof DifficultyFilters; 
    value: Set<DifficultyLevel>;
  }) => (
    <div className="mb-2 last:mb-0">
      <div className="text-xs font-medium text-gray-700 mb-1">{label}</div>
      <div className="grid grid-cols-3 gap-1">
        {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((difficulty) => (
          <button
            key={difficulty}
            onClick={() => handleFilterChange(type, difficulty)}
            className={`
              px-2 py-1 text-xs font-medium rounded-md capitalize
              ${value.has(difficulty)
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
              transition-colors duration-150
            `}
          >
            {difficulty}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow p-4 w-[320px]">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Course Difficulty</h3>
      <div className="space-y-3">
        <FilterRow
          label="Driving Difficulty"
          type="driving"
          value={getDifficultySet('driving')}
        />
        <FilterRow
          label="Approach Difficulty"
          type="approach"
          value={getDifficultySet('approach')}
        />
        <FilterRow
          label="Scoring Difficulty"
          type="scoring"
          value={getDifficultySet('scoring')}
        />
      </div>
    </div>
  );
}
