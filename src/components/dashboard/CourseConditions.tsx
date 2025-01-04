import React from 'react';
import { useGolfStore } from '../../store/useGolfStore';

interface ConditionOption {
  id: string;
  label: string;
}

interface ConditionDropdownProps {
  title: string;
  options: ConditionOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

function ConditionDropdown({ title, options, selectedId, onSelect }: ConditionDropdownProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <label className="block text-sm font-semibold mb-2" htmlFor={title}>
        {title}
      </label>
      <select
        id={title}
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

const GRASS_OPTIONS = [
  { id: 'all', label: 'All Grass' },
  { id: 'bermuda', label: 'Bermuda' },
  { id: 'bentgrass', label: 'Bentgrass' },
  { id: 'other', label: 'Other' }
];

const WIND_OPTIONS = [
  { id: 'all', label: 'All Wind' },
  { id: 'calm', label: 'Calm' },
  { id: 'breezy', label: 'Breezy' },
  { id: 'windy', label: 'Wind' }
];

const COURSE_OPTIONS = [
  { id: 'all', label: 'All Courses' },
  { id: 'pete-dye', label: 'Pete Dye' },
  { id: 'donald-ross', label: 'Donald Ross' },
  { id: 'other', label: 'Other' }
];

const SPEED_OPTIONS = [
  { id: 'all', label: 'All Speeds' },
  { id: 'slow', label: 'Slow' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'fast', label: 'Fast' }
];

export default function CourseConditions() {
  const { conditions, updateConditions } = useGolfStore();

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <ConditionDropdown
        title="Course Grass"
        options={GRASS_OPTIONS}
        selectedId={conditions.grass}
        onSelect={(id) => updateConditions({ ...conditions, grass: id })}
      />
      <ConditionDropdown
        title="Wind Conditions"
        options={WIND_OPTIONS}
        selectedId={conditions.wind}
        onSelect={(id) => updateConditions({ ...conditions, wind: id })}
      />
      <ConditionDropdown
        title="Course Designer"
        options={COURSE_OPTIONS}
        selectedId={conditions.course}
        onSelect={(id) => updateConditions({ ...conditions, course: id })}
      />
      <ConditionDropdown
        title="Green Speed"
        options={SPEED_OPTIONS}
        selectedId={conditions.speed}
        onSelect={(id) => updateConditions({ ...conditions, speed: id })}
      />
    </div>
  );
}