import { StateCreator } from 'zustand';
import { CourseConditions } from '../../types/golf.js';

export interface ConditionsSlice {
  conditions: CourseConditions;
  selectedCourses: string[];
  updateConditions: (conditions: CourseConditions) => void;
  toggleCourse: (courseId: string) => void;
}

export const createConditionsSlice: StateCreator<ConditionsSlice> = (set) => ({
  conditions: {
    grass: 'all',
    course: 'all',
    driving: ['medium'],
    approach: ['medium'],
    scoring: ['medium']
  },
  selectedCourses: [
    'ACCORDIA GOLF Narashino Country Club',
    'Albany GC',
    'Arnold Palmer\'s Bay Hill Club & Lodge',
    'Aronimink GC',
    'Augusta National Golf Club',
    'Bay Hill Club & Lodge',
    'Bellerive CC',
    'Bethpage Black',
    'Black Desert Resort',
    'Castle Pines Golf Club',
    'Caves Valley Golf Club',
    'Club de Golf Chapultepec',
    'Colonial Country Club',
    'Congaree Golf Club',
    'Country Club of Jackson',
    'Detroit Golf Club',
    'East Lake Golf Club',
    'Firestone CC (South)',
    'Golf Club of Houston',
    'Glen Abbey GC',
    'Glen Oaks Club',
    'Hamilton Golf & Country Club',
    'Harbour Town Golf Links',
    'Innisbrook Resort (Copperhead)',
    'La Quinta Country Club',
    'Le Golf National',
    'Liberty National Golf Club',
    'Medinah Country Club (No. 3)',
    'Memorial Park Golf Course',
    'Muirfield Village Golf Club',
    'Nicklaus Tournament Course',
    'Oak Hill Country Club',
    'Oakdale Golf & Country Club',
    'Ocean Course at Kiawah Island',
    'Olympia Fields Country Club (North Course)',
    'PGA National Resort (The Champion)',
    'Pebble Beach Golf Links',
    'Pete Dye Stadium Course',
    'Pinehurst Resort & Country Club (Course No. 2)',
    'Plantation Course at Kapalua',
    'Quail Hollow Club',
    'Ridgewood CC',
    'Riviera Country Club',
    'Royal Liverpool',
    'Royal Troon',
    'Sea Island Golf Club (Plantation Course)',
    'Sea Island Golf Club (Seaside Course)',
    'Sedgefield Country Club',
    'Shadow Creek Golf Course',
    'Sherwood Country Club',
    'Silverado Resort and Spa (North Course)',
    'Southern Hills Country Club',
    'St. Andrews Links (Old Course)',
    'St. George\'s G&CC',
    'TPC Boston',
    'TPC Craig Ranch',
    'TPC Deere Run',
    'TPC Harding Park',
    'TPC Potomac at Avenel Farm',
    'TPC River Highlands',
    'TPC San Antonio (Oaks Course)',
    'TPC Sawgrass (THE PLAYERS Stadium Course)',
    'TPC Scottsdale (Stadium Course)',
    'TPC Southwind',
    'TPC Summerlin',
    'TPC Twin Cities',
    'The Concession Golf Club',
    'The Old White TPC',
    'The Renaissance Club',
    'Torrey Pines Golf Course (North Course)',
    'Torrey Pines Golf Course (South Course)',
    'Trinity Forest Golf Club',
    'Vidanta Vallarta',
    'Waialae Country Club',
    'Wilmington Country Club',
    'Winged Foot GC'
  ],
  
  updateConditions: (conditions) => set({ conditions }),
  
  toggleCourse: (courseId) => set((state) => ({
    selectedCourses: state.selectedCourses.includes(courseId)
      ? state.selectedCourses.filter(id => id !== courseId)
      : [...state.selectedCourses, courseId]
  }))
});