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
  { id: 'bent', label: 'Bent' },
  { id: 'poa-annua', label: 'Poa Annua' },
  { id: 'paspalum', label: 'Paspalum' }
];

const WIND_OPTIONS = [
  { id: 'all', label: 'All Wind' },
  { id: 'calm', label: 'Calm' },
  { id: 'breezy', label: 'Breezy' },
  { id: 'windy', label: 'Wind' }
];

const DESIGNER_OPTIONS = [
  { id: 'all', label: 'All Designers' },
  { id: 'pete-dye', label: 'Pete Dye' },
  { id: 'jack-nicklaus', label: 'Jack Nicklaus' },
  { id: 'donald-ross', label: 'Donald Ross' },
  { id: 'tom-weiskopf', label: 'Tom Weiskopf' },
  { id: 'arnold-palmer', label: 'Arnold Palmer' }
];

const SPEED_OPTIONS = [
  { id: 'all', label: 'All Speeds' },
  { id: 'slow', label: 'Slow' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'fast', label: 'Fast' }
];

// Course mappings
const DESIGNER_COURSES = {
  'pete-dye': [
    'Pete Dye Stadium Course',
    'Harbour Town Golf Links',
    'TPC River Highlands',
    'Ocean Course at Kiawah Island',
    'TPC Sawgrass (THE PLAYERS Stadium Course)',
    'TPC San Antonio (Oaks Course)',
  ],
  'jack-nicklaus': [
    'Nicklaus Tournament Course',
    'PGA National Resort (The Champion)',
    'Muirfield Village Golf Club',
    'The Concession Golf Club',
    'Sherwood Country Club',
  ],
  'donald-ross': [
    'Detroit Golf Club',
    'Pinehurst Resort & Country Club (Course No. 2)',
    'Sedgefield Country Club',
    'East Lake Golf Club',
    'Country Club of Jackson',
  ],
  'tom-weiskopf': [
    'TPC Scottsdale (Stadium Course)',
    'TPC Craig Ranch',
    'Torrey Pines Golf Course (North Course)',
    'Torrey Pines Golf Course (South Course)',
    'Black Desert Resort',
  ],
  'arnold-palmer': [
    'Arnold Palmer\'s Bay Hill Club & Lodge',
    'TPC Twin Cities',
  ],
};

const GRASS_TYPE_COURSES = {
  'bermuda': [
    'Plantation Course at Kapalua',
    'Waialae Country Club',
    'East Lake Golf Club',
    'TPC Southwind',
    'Sedgefield Country Club',
    'Pinehurst Resort & Country Club (Course No. 2)',
    'Quail Hollow Club',
    'Harbour Town Golf Links',
    'TPC Sawgrass (THE PLAYERS Stadium Course)',
    'Arnold Palmer\'s Bay Hill Club & Lodge',
    'Sea Island Golf Club (Plantation Course)',
    'Sea Island Golf Club (Seaside Course)',
    'Country Club of Jackson',
    'Pete Dye Stadium Course',
    'Nicklaus Tournament Course',
    'La Quinta Country Club',
    'Innisbrook Resort (Copperhead)',
    'Memorial Park Golf Course',
    'Ocean Course at Kiawah Island',
    'TPC Scottsdale (Stadium Course)',
    'TPC San Antonio (Oaks Course)',
    'Trinity Forest Golf Club',
    'Southern Hills Country Club',
    'PGA National Resort (The Champion)',
    'Albany GC',
  ],
  'bent': [
    'Augusta National Golf Club',
    'Muirfield Village Golf Club',
    'The Renaissance Club',
    'ACCORDIA GOLF Narashino Country Club',
    'TPC Twin Cities',
    'Detroit Golf Club',
    'Oak Hill Country Club',
    'TPC Craig Ranch',
    'Silverado Resort and Spa (North Course)',
    'Liberty National Golf Club',
    'TPC Summerlin',
    'TPC River Highlands',
    'Bethpage Black',
    'Caves Valley Golf Club',
    'Castle Pines Golf Club',
    'Sherwood Country Club',
    'St. Andrews Links (Old Course)',
    'TPC Boston',
    'TPC Deere Run',
  ],
  'poa-annua': [
    'Riviera Country Club',
    'Torrey Pines Golf Course (North Course)',
    'Torrey Pines Golf Course (South Course)',
    'Pebble Beach Golf Links',
  ],
  'paspalum': [
    'Vidanta Vallarta',
  ],
};

export default function CourseConditions() {
  const { conditions, updateConditions, selectedCourses, toggleCourse } = useGolfStore();

  const handleDesignerChange = (designerId: string) => {
    // Clear previous designer's courses if any
    if (conditions.course !== 'all') {
      DESIGNER_COURSES[conditions.course as keyof typeof DESIGNER_COURSES]?.forEach(course => {
        if (selectedCourses.includes(course)) {
          toggleCourse(course);
        }
      });
    }

    // Select new designer's courses
    if (designerId !== 'all') {
      DESIGNER_COURSES[designerId]?.forEach(course => {
        if (!selectedCourses.includes(course)) {
          toggleCourse(course);
        }
      });
    }

    updateConditions({ ...conditions, course: designerId });
  };

  const handleGrassTypeChange = (grassTypeId: string) => {
    // Clear previous grass type's courses if any
    if (conditions.grass !== 'all') {
      GRASS_TYPE_COURSES[conditions.grass as keyof typeof GRASS_TYPE_COURSES]?.forEach(course => {
        if (selectedCourses.includes(course)) {
          toggleCourse(course);
        }
      });
    }

    // Select new grass type's courses
    if (grassTypeId !== 'all') {
      GRASS_TYPE_COURSES[grassTypeId]?.forEach(course => {
        if (!selectedCourses.includes(course)) {
          toggleCourse(course);
        }
      });
    }

    updateConditions({ ...conditions, grass: grassTypeId });
  };

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <ConditionDropdown
        title="Course Grass"
        options={GRASS_OPTIONS}
        selectedId={conditions.grass}
        onSelect={handleGrassTypeChange}
      />
      <ConditionDropdown
        title="Wind Conditions"
        options={WIND_OPTIONS}
        selectedId={conditions.wind}
        onSelect={(id) => updateConditions({ ...conditions, wind: id })}
      />
      <ConditionDropdown
        title="Course Designer"
        options={DESIGNER_OPTIONS}
        selectedId={conditions.course}
        onSelect={handleDesignerChange}
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