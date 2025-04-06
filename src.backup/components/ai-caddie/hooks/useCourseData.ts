import { useMemo } from 'react';

interface CourseDistance {
  name: string;
  percentage: number;
  description: string;
}

export function useCourseData() {
  const courseDistances = useMemo<CourseDistance[]>(() => [
    {
      name: '100-125 yards',
      percentage: 0.25,
      description: 'Key scoring range for approach shots on par 4s and layups on par 5s'
    },
    {
      name: '125-150 yards',
      percentage: 0.20,
      description: 'Common approach distance after good drive on par 4s'
    },
    {
      name: '175-200 yards',
      percentage: 0.30,
      description: 'Critical range for par 3s and long par 4 approaches'
    },
    {
      name: '200-225 yards',
      percentage: 0.15,
      description: 'Long par 3s and second shots on par 5s'
    },
    {
      name: '225+ yards',
      percentage: 0.10,
      description: 'Long approach shots and par 3s into the wind'
    }
  ], []);

  return {
    courseDistances
  };
}