import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, SkipBack, SkipForward, FileText, BookOpen, CheckCircle, ArrowLeft } from 'lucide-react';
import type { Lesson, LessonCourse } from '../../types/lesson';

interface LessonPlayerProps {
  lesson: Lesson;
  course: LessonCourse;
}

const LessonPlayer: React.FC<LessonPlayerProps> = ({ lesson, course }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('transcript');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(lesson.completed);

  const currentLessonIndex = course.lessons.findIndex(l => l.id === lesson.id);
  const previousLesson = currentLessonIndex > 0 ? course.lessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < course.lessons.length - 1 ? course.lessons[currentLessonIndex + 1] : null;

  const handleMarkComplete = () => {
    setIsCompleted(!isCompleted);
    // TODO: Save completion status to backend
  };

  const handlePreviousLesson = () => {
    if (previousLesson) {
      navigate(`/courses/${course.id}/lessons/${previousLesson.id}`);
    }
  };

  const handleNextLesson = () => {
    if (nextLesson) {
      navigate(`/courses/${course.id}/lessons/${nextLesson.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
          {/* Main Content */}
          <div className="lg:col-span-3 bg-black">
            {/* Video Player */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <img 
                src={lesson.videoUrl} 
                alt={lesson.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-white/20 hover:bg-white/30 rounded-full p-4 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-12 h-12 text-white" />
                  ) : (
                    <Play className="w-12 h-12 text-white ml-1" />
                  )}
                </button>
              </div>
            </div>

            {/* Video Controls */}
            <div className="bg-gray-900 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePreviousLesson}
                    disabled={!previousLesson}
                    className="p-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 rounded hover:bg-gray-700"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={handleNextLesson}
                    disabled={!nextLesson}
                    className="p-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-sm text-gray-300">
                  {lesson.duration}
                </div>
              </div>
            </div>

            {/* Lesson Info */}
            <div className="bg-white dark:bg-gray-800 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {lesson.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {lesson.description}
                  </p>
                </div>
                <button
                  onClick={handleMarkComplete}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isCompleted
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  style={isCompleted ? { backgroundColor: '#006d3a' } : {}}
                >
                  <CheckCircle className="w-4 h-4" />
                  {isCompleted ? 'Completed' : 'Mark Complete'}
                </button>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('transcript')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'transcript'
                        ? 'border-transparent'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                    style={activeTab === 'transcript' ? { borderBottomColor: '#006d3a', color: '#006d3a' } : {}}
                  >
                    <FileText className="w-4 h-4 inline mr-2" />
                    Transcript
                  </button>
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'notes'
                        ? 'border-transparent'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                    style={activeTab === 'notes' ? { borderBottomColor: '#006d3a', color: '#006d3a' } : {}}
                  >
                    <BookOpen className="w-4 h-4 inline mr-2" />
                    Notes
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="mt-6">
                {activeTab === 'transcript' && (
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {lesson.transcript}
                    </p>
                  </div>
                )}
                {activeTab === 'notes' && (
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {lesson.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
            {/* Course Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => navigate(`/courses/${course.id}`)}
                className="flex items-center text-gray-600 dark:text-gray-400 transition-colors mb-3"
                onMouseEnter={(e) => e.currentTarget.style.color = '#006d3a'}
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Course
              </button>
              <h2 className="font-semibold text-gray-900 dark:text-white text-sm">
                {course.title}
              </h2>
            </div>

            {/* Lesson List */}
            <div className="p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4 text-sm">
                Course Content
              </h3>
              <div className="space-y-2">
                {course.lessons.map((courseLesson, index) => (
                  <button
                    key={courseLesson.id}
                    onClick={() => navigate(`/courses/${course.id}/lessons/${courseLesson.id}`)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      courseLesson.id === lesson.id
                        ? 'text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                    style={courseLesson.id === lesson.id ? { backgroundColor: '#006d3a' } : {}}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          courseLesson.completed
                            ? 'text-white'
                            : courseLesson.id === lesson.id
                            ? 'text-white'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                        }`}
                        style={(courseLesson.completed || courseLesson.id === lesson.id) ? { backgroundColor: '#006d3a' } : {}}>
                          {courseLesson.completed ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {courseLesson.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {courseLesson.duration}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlayer;