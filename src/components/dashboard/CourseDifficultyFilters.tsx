import React from 'react';
import { useGolfStore } from '../../store/useGolfStore';

type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface DifficultyFilters {
  driving: DifficultyLevel;
  approach: DifficultyLevel;
  scoring: DifficultyLevel;
}

export default function CourseDifficultyFilters() {
  const { conditions, updateConditions } = useGolfStore();

  const handleFilterChange = (type: keyof DifficultyFilters, value: DifficultyLevel) => {
    updateConditions({
      ...conditions,
      [type]: value
    });
  };

  const FilterRow = ({ 
    label, 
    type, 
    value 
  }: { 
    label: string; 
    type: keyof DifficultyFilters; 
    value: DifficultyLevel;
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
              ${value === difficulty
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
          value={conditions.driving as DifficultyLevel}
        />
        <FilterRow
          label="Approach Difficulty"
          type="approach"
          value={conditions.approach as DifficultyLevel}
        />
        <FilterRow
          label="Scoring Difficulty"
          type="scoring"
          value={conditions.scoring as DifficultyLevel}
        />
      </div>
    </div>
  );
}