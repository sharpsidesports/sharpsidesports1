import { useEffect } from 'react';
import CourseSelector from '../components/course-fit/CourseSelector';
import CourseComparison from '../components/course-fit/CourseComparison';
import PlayerFitList from '../components/course-fit/PlayerFitList';
import { useCourseFitStore } from '../store/useCourseFitStore';

export default function CourseFitTool() {
  const {
    selectedCourseId,
    comparisonCourseId,
    courseStats,
    loading,
    error,
    setSelectedCourse,
    setComparisonCourse,
    fetchPlayerRounds,
  } = useCourseFitStore();

  // Fetch player rounds when courses are selected
  useEffect(() => {
    const coursesToFetch = [selectedCourseId, comparisonCourseId]
      .filter(Boolean) as string[];
    
    if (coursesToFetch.length > 0) {
      fetchPlayerRounds(coursesToFetch);
    }
  }, [selectedCourseId, comparisonCourseId, fetchPlayerRounds]);

  // Set default courses on mount
  useEffect(() => {
    if (!selectedCourseId && !comparisonCourseId) {
      setSelectedCourse('Augusta National Golf Club');
      setComparisonCourse('Castle Pines Golf Club');
    }
  }, []); // Run only on mount

  const selectedCourse = selectedCourseId ? courseStats[selectedCourseId] : null;
  const comparisonCourse = comparisonCourseId ? courseStats[comparisonCourseId] : null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-2">Course Fit Tool</h1>
        <p className="text-gray-600 mb-6">
          Compare course characteristics and analyze player performance across different venues
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <CourseSelector 
            selectedCourseId={selectedCourseId}
            comparisonCourseId={comparisonCourseId}
            onSelectCourse={setSelectedCourse}
            onSelectComparison={setComparisonCourse}
            loading={loading}
          />

          <CourseComparison
            selectedCourse={selectedCourse}
            comparisonCourse={comparisonCourse}
            loading={loading}
          />
        </div>

        {selectedCourse && (
          <div className="mt-6">
            <PlayerFitList courseId={selectedCourseId!} loading={loading} />
          </div>
        )}
      </div>
    </div>
  );
}