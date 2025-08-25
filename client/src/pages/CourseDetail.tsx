import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, Star, Play, FileText, CheckCircle, BookOpen, Award, Globe, ArrowLeft } from 'lucide-react';
import { useCourseDetail } from '../hooks/useCourseDetail';
import ProgressRing from '../components/ui/ProgressRing';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { course, loading, error } = useCourseDetail(id || '');
  const [activeTab, setActiveTab] = useState('overview');
  const [isEnrolled, setIsEnrolled] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Course Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error || 'The course you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/courses')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  const completedLessons = course.lessons.filter(lesson => lesson.completed).length;
  const progress = (completedLessons / course.lessons.length) * 100;

  const handleEnroll = () => {
    setIsEnrolled(true);
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="w-4 h-4" />;
      case "exercise":
        return <FileText className="w-4 h-4" />;
      case "quiz":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
      case "Intermediate":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
      case "Advanced":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-xs font-medium rounded border border-blue-200 dark:border-blue-800">
                  {course.category}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded border ${getLevelColor(course.level)}`}>
                  {course.level}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{course.title}</h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">{course.description}</p>

              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{course.rating} ({Math.floor(course.students * 0.7)} reviews)</span>
                </div>
              </div>
            </div>

            {/* Course Video/Image */}
            <div className="aspect-video relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
              {course.previewVideoUrl ? (
                <video
                  src={course.previewVideoUrl}
                  poster={course.thumbnail}
                  controls
                  className="w-full h-full object-cover"
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={course.thumbnail}
                  alt={`${course.title} course preview`}
                  className="w-full h-full object-cover"
                />
              )}
              {!isEnrolled && !course.previewVideoUrl && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <button 
                    onClick={handleEnroll}
                    className="flex items-center gap-2 text-white px-6 py-3 rounded-lg font-medium transition-colors hover:opacity-90"
                    style={{ backgroundColor: '#006d3a' }}
                  >
                    <Play className="w-5 h-5" />
                    Preview Course
                  </button>
                </div>
              )}
            </div>

            {/* Course Details Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                {['overview', 'curriculum', 'instructor', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-3 text-sm font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? 'border-b-2'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                    style={activeTab === tab ? { borderBottomColor: '#006d3a', color: '#006d3a' } : {}}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About This Course</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{course.longDescription}</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">What You'll Learn</h3>
                      <ul className="space-y-2">
                        {course.learningObjectives.map((objective, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#006d3a' }} />
                            <span className="text-gray-600 dark:text-gray-400">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Prerequisites</h3>
                      <ul className="space-y-2">
                        {course.prerequisites.map((prerequisite, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-gray-400">{prerequisite}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'curriculum' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Course Curriculum</h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{course.lessons.length} lessons</span>
                    </div>

                    <div className="space-y-2">
                      {course.lessons.map((lesson, index) => (
                        <button
                          key={lesson.id}
                          onClick={() => navigate(`/courses/${id}/lessons/${lesson.id}`)}
                          className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">{lesson.title}</h4>
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                  {getLessonIcon(lesson.type)}
                                  <span>{lesson.duration}</span>
                                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded border border-gray-200 dark:border-gray-600">
                                    {lesson.type}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {lesson.completed && <CheckCircle className="w-5 h-5" style={{ color: '#006d3a' }} />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'instructor' && (
                  <div className="space-y-6">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
                      <div className="flex items-start gap-4">
                        <img
                          src={course.instructor.avatar}
                          alt={`${course.instructor.name} profile`}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{course.instructor.name}</h3>
                          <p className="text-sm mb-3" style={{ color: '#006d3a' }}>{course.instructor.credentials}</p>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{course.instructor.bio}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <Star className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No reviews yet</h3>
                      <p className="text-gray-600 dark:text-gray-400">Be the first to review this course after enrolling!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-8 space-y-6">
            {/* Enrollment Card */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <div className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2" style={{ color: '#006d3a' }}>{course.price}</div>
                  {isEnrolled && (
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <ProgressRing progress={progress} size={60} />
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Progress</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {completedLessons} of {course.lessons.length} lessons
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6 pt-0 space-y-4">
                {isEnrolled ? (
                  <button className="w-full text-white py-3 px-4 rounded-lg font-medium transition-colors hover:opacity-90" style={{ backgroundColor: '#006d3a' }}>
                    Continue Learning
                  </button>
                ) : (
                  <button 
                    onClick={handleEnroll}
                    className="w-full text-white py-3 px-4 rounded-lg font-medium transition-colors hover:opacity-90"
                    style={{ backgroundColor: '#006d3a' }}
                  >
                    Enroll Now
                  </button>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">{course.duration} to complete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Lifetime access</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Features */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">This course includes:</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">8 hours of video content</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Downloadable resources</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Quizzes and exercises</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Community access</span>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseDetail;