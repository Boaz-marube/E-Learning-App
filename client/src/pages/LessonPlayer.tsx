import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLessonData } from '../hooks/useLessonData';
import LessonPlayerComponent from '../components/courses/LessonPlayer';

const LessonPlayer: React.FC = () => {
  const { id, lessonId } = useParams<{ id: string; lessonId: string }>();
  const navigate = useNavigate();
  const { lesson, course, loading, error } = useLessonData(id || '', lessonId || '');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson || !course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Lesson Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "The lesson you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate('/courses')}
            className="text-white px-6 py-2 rounded-lg hover:opacity-90"
            style={{ backgroundColor: '#006d3a' }}
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return <LessonPlayerComponent lesson={lesson} course={course} />;
};

export default LessonPlayer;