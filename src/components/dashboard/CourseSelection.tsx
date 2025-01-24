import React from 'react';
import { useGolfStore } from '../../store/useGolfStore';

interface CourseOption {
  id: string;
  name: string;
}

const COURSE_OPTIONS: CourseOption[] = [
  { id: 'ACCORDIA GOLF Narashino Country Club', name: 'ACCORDIA GOLF Narashino Country Club' },
  { id: 'Albany GC', name: 'Albany GC' },
  { id: 'Arnold Palmer\'s Bay Hill Club & Lodge', name: 'Arnold Palmer\'s Bay Hill Club & Lodge' },
  { id: 'Aronimink GC', name: 'Aronimink GC' },
  { id: 'Augusta National Golf Club', name: 'Augusta National Golf Club' },
  { id: 'Bay Hill Club & Lodge', name: 'Bay Hill Club & Lodge' },
  { id: 'Bellerive CC', name: 'Bellerive CC' },
  { id: 'Bethpage Black', name: 'Bethpage Black' },
  { id: 'Black Desert Resort', name: 'Black Desert Resort' },
  { id: 'Castle Pines Golf Club', name: 'Castle Pines Golf Club' },
  { id: 'Caves Valley Golf Club', name: 'Caves Valley Golf Club' },
  { id: 'Club de Golf Chapultepec', name: 'Club de Golf Chapultepec' },
  { id: 'Colonial Country Club', name: 'Colonial Country Club' },
  { id: 'Congaree Golf Club', name: 'Congaree Golf Club' },
  { id: 'Country Club of Jackson', name: 'Country Club of Jackson' },
  { id: 'Detroit Golf Club', name: 'Detroit Golf Club' },
  { id: 'East Lake Golf Club', name: 'East Lake Golf Club' },
  { id: 'Firestone CC (South)', name: 'Firestone CC (South)' },
  { id: 'Golf Club of Houston', name: 'Golf Club of Houston' },
  { id: 'Glen Abbey GC', name: 'Glen Abbey GC' },
  { id: 'Glen Oaks Club', name: 'Glen Oaks Club' },
  { id: 'Hamilton Golf & Country Club', name: 'Hamilton Golf & Country Club' },
  { id: 'Harbour Town Golf Links', name: 'Harbour Town Golf Links' },
  { id: 'Innisbrook Resort (Copperhead)', name: 'Innisbrook Resort (Copperhead)' },
  { id: 'La Quinta Country Club', name: 'La Quinta Country Club' },
  { id: 'Le Golf National', name: 'Le Golf National' },
  { id: 'Liberty National Golf Club', name: 'Liberty National Golf Club' },
  { id: 'Medinah Country Club (No. 3)', name: 'Medinah Country Club (No. 3)' },
  { id: 'Memorial Park Golf Course', name: 'Memorial Park Golf Course' },
  { id: 'Muirfield Village Golf Club', name: 'Muirfield Village Golf Club' },
  { id: 'Nicklaus Tournament Course', name: 'Nicklaus Tournament Course' },
  { id: 'Oak Hill Country Club', name: 'Oak Hill Country Club' },
  { id: 'Oakdale Golf & Country Club', name: 'Oakdale Golf & Country Club' },
  { id: 'Ocean Course at Kiawah Island', name: 'Ocean Course at Kiawah Island' },
  { id: 'Olympia Fields Country Club (North Course)', name: 'Olympia Fields Country Club (North Course)' },
  { id: 'PGA National Resort (The Champion)', name: 'PGA National Resort (The Champion)' },
  { id: 'Pebble Beach Golf Links', name: 'Pebble Beach Golf Links' },
  { id: 'Pete Dye Stadium Course', name: 'Pete Dye Stadium Course' },
  { id: 'Pinehurst Resort & Country Club (Course No. 2)', name: 'Pinehurst Resort & Country Club (Course No. 2)' },
  { id: 'Plantation Course at Kapalua', name: 'Plantation Course at Kapalua' },
  { id: 'Quail Hollow Club', name: 'Quail Hollow Club' },
  { id: 'Ridgewood CC', name: 'Ridgewood CC' },
  { id: 'Riviera Country Club', name: 'Riviera Country Club' },
  { id: 'Royal Liverpool', name: 'Royal Liverpool' },
  { id: 'Royal Troon', name: 'Royal Troon' },
  { id: 'Sea Island Golf Club (Plantation Course)', name: 'Sea Island Golf Club (Plantation Course)' },
  { id: 'Sea Island Golf Club (Seaside Course)', name: 'Sea Island Golf Club (Seaside Course)' },
  { id: 'Sedgefield Country Club', name: 'Sedgefield Country Club' },
  { id: 'Shadow Creek Golf Course', name: 'Shadow Creek Golf Course' },
  { id: 'Sherwood Country Club', name: 'Sherwood Country Club' },
  { id: 'Silverado Resort and Spa (North Course)', name: 'Silverado Resort and Spa (North Course)' },
  { id: 'Southern Hills Country Club', name: 'Southern Hills Country Club' },
  { id: 'St. Andrews Links (Old Course)', name: 'St. Andrews Links (Old Course)' },
  { id: 'St. George\'s G&CC', name: 'St. George\'s G&CC' },
  { id: 'TPC Boston', name: 'TPC Boston' },
  { id: 'TPC Craig Ranch', name: 'TPC Craig Ranch' },
  { id: 'TPC Deere Run', name: 'TPC Deere Run' },
  { id: 'TPC Harding Park', name: 'TPC Harding Park' },
  { id: 'TPC Potomac at Avenel Farm', name: 'TPC Potomac at Avenel Farm' },
  { id: 'TPC River Highlands', name: 'TPC River Highlands' },
  { id: 'TPC San Antonio (Oaks Course)', name: 'TPC San Antonio (Oaks Course)' },
  { id: 'TPC Sawgrass (THE PLAYERS Stadium Course)', name: 'TPC Sawgrass (THE PLAYERS Stadium Course)' },
  { id: 'TPC Scottsdale (Stadium Course)', name: 'TPC Scottsdale (Stadium Course)' },
  { id: 'TPC Southwind', name: 'TPC Southwind' },
  { id: 'TPC Summerlin', name: 'TPC Summerlin' },
  { id: 'TPC Twin Cities', name: 'TPC Twin Cities' },
  { id: 'The Concession Golf Club', name: 'The Concession Golf Club' },
  { id: 'The Old White TPC', name: 'The Old White TPC' },
  { id: 'The Renaissance Club', name: 'The Renaissance Club' },
  { id: 'Torrey Pines Golf Course (North Course)', name: 'Torrey Pines Golf Course (North Course)' },
  { id: 'Torrey Pines Golf Course (South Course)', name: 'Torrey Pines Golf Course (South Course)' },
  { id: 'Trinity Forest Golf Club', name: 'Trinity Forest Golf Club' },
  { id: 'Vidanta Vallarta', name: 'Vidanta Vallarta' },
  { id: 'Waialae Country Club', name: 'Waialae Country Club' },
  { id: 'Wilmington Country Club', name: 'Wilmington Country Club' },
  { id: 'Winged Foot GC', name: 'Winged Foot GC' }
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