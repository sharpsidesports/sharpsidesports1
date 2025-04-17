import { COURSE_OPTIONS } from '../../components/dashboard/CourseSelection';

interface CourseSelectorProps {
  selectedCourseId: string | null;
  comparisonCourseId: string | null;
  onSelectCourse: (courseId: string) => void;
  onSelectComparison: (courseId: string) => void;
  loading?: boolean;
}

export default function CourseSelector({
  selectedCourseId,
  comparisonCourseId,
  onSelectCourse,
  onSelectComparison,
  loading = false,
}: CourseSelectorProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading courses...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
          Select Course
        </label>
        <select
          id="course"
          value={selectedCourseId || ''}
          onChange={(e) => onSelectCourse(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          {!selectedCourseId && <option value="">Select a course...</option>}
          {COURSE_OPTIONS.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="comparison" className="block text-sm font-medium text-gray-700 mb-2">
          Compare With (Optional)
        </label>
        <select
          id="comparison"
          value={comparisonCourseId || ''}
          onChange={(e) => onSelectComparison(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">Select a course...</option>
          {COURSE_OPTIONS
            .filter(course => course.id !== selectedCourseId)
            .map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}