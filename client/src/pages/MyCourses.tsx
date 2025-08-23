import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, Users, Star, BookOpen, Award, ChevronRight, Edit3, Trash2, Eye, Plus, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  students: number;
  rating: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  thumbnail: string;
  isEnrolled: boolean;
  progress: number;
  status?: "in-progress" | "completed";
  completedDate?: string;
  isPublished?: boolean;
  enrollmentCount?: number;
}

const enrolledCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.",
    instructor: "Sarah Johnson",
    duration: "8 weeks",
    students: 1250,
    rating: 4.8,
    level: "Beginner",
    thumbnail: "/api/placeholder/320/180",
    isEnrolled: true,
    progress: 75,
    status: "in-progress",
  },
  {
    id: "2",
    title: "Data Science with Python",
    description: "Master data analysis, visualization, and machine learning using Python.",
    instructor: "Dr. Michael Chen",
    duration: "12 weeks",
    students: 890,
    rating: 4.9,
    level: "Intermediate",
    thumbnail: "/api/placeholder/320/180",
    isEnrolled: true,
    progress: 45,
    status: "in-progress",
  },
  {
    id: "4",
    title: "Advanced React Development",
    description: "Build complex React applications with hooks, context, and modern patterns.",
    instructor: "Alex Thompson",
    duration: "10 weeks",
    students: 650,
    rating: 4.9,
    level: "Advanced",
    thumbnail: "/api/placeholder/320/180",
    isEnrolled: true,
    progress: 20,
    status: "in-progress",
  },
];

const completedCourses: Course[] = [
  {
    id: "3",
    title: "Digital Marketing Fundamentals",
    description: "Learn effective digital marketing strategies and tools for modern businesses.",
    instructor: "Emma Rodriguez",
    duration: "6 weeks",
    students: 2100,
    rating: 4.7,
    level: "Beginner",
    thumbnail: "/api/placeholder/320/180",
    isEnrolled: true,
    progress: 100,
    status: "completed",
    completedDate: "2024-01-10",
  },
  {
    id: "5",
    title: "UX/UI Design Principles",
    description: "Create user-centered designs with modern UX/UI principles and tools.",
    instructor: "Jessica Park",
    duration: "8 weeks",
    students: 980,
    rating: 4.6,
    level: "Intermediate",
    thumbnail: "/api/placeholder/320/180",
    isEnrolled: true,
    progress: 100,
    status: "completed",
    completedDate: "2023-12-15",
  },
];

const StudentCourseCard = ({ course }: { course: Course }) => {
  const navigate = useNavigate();
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

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    return "bg-orange-500";
  };

  return (
    <div className="group hover:shadow-lg transition-all duration-300 overflow-hidden bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="relative">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <span className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-medium border ${getLevelColor(course.level)}`}>
          {course.level}
        </span>
        {course.progress !== undefined && (
          <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
            Progress: {course.progress}%
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="space-y-2 mb-4">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:transition-colors text-gray-900 dark:text-white" onMouseEnter={(e) => e.currentTarget.style.color = '#006d3a'} onMouseLeave={(e) => e.currentTarget.style.color = ''}>
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {course.description}
          </p>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            by {course.instructor}
          </p>
        </div>

        <div className="space-y-3 mb-4">
          {/* Progress Bar */}
          {course.progress !== undefined && (
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                <span className="font-medium text-gray-900 dark:text-white">{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(course.progress)}`}
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Course Stats */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.students.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{course.rating}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => navigate(`/courses/${course.id}`)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            View Details
          </button>
          <button 
            onClick={() => navigate(`/courses/${course.id}/lessons/1`)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              course.status === "completed" 
                ? "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" 
                : "text-white hover:opacity-90"
            }`}
            style={course.status !== "completed" ? { backgroundColor: '#006d3a' } : {}}
          >
            {course.status === "completed" ? "Certificate" : "Continue"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const MyCourses: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [activeTab, setActiveTab] = useState(user?.role === 'instructor' ? 'published' : 'in-progress');

  const filterCourses = (courses: Course[]) => {
    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  // Mock instructor courses
  const instructorCourses: Course[] = [
    {
      id: '1',
      title: 'Complete Web Development Bootcamp',
      description: 'Learn HTML, CSS, JavaScript, React, Node.js and more',
      instructor: user?.name || 'Instructor',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
      level: 'Beginner',
      duration: '40 hours',
      students: 0,
      rating: 4.5,
      isEnrolled: false,
      progress: 0,
      isPublished: true,
      enrollmentCount: 25
    },
    {
      id: '2',
      title: 'Advanced React Patterns',
      description: 'Master advanced React concepts and patterns',
      instructor: user?.name || 'Instructor',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
      level: 'Advanced',
      duration: '25 hours',
      students: 0,
      rating: 0,
      isEnrolled: false,
      progress: 0,
      isPublished: false,
      enrollmentCount: 0
    }
  ];

  const handleEditCourse = (courseId: string) => {
    navigate(`/edit-course/${courseId}`);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      console.log('Deleting course:', courseId);
    }
  };

  const handleTogglePublish = (courseId: string, shouldPublish: boolean) => {
    console.log('Toggling publish status:', courseId, shouldPublish);
  };

  const handleCreateCourse = () => {
    navigate('/create-course');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Authentication Required</h2>
          <p className="text-gray-600 dark:text-gray-400">Please log in to view your courses.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Courses</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {user.role === 'instructor' 
                    ? 'Manage your created courses' 
                    : 'Manage your enrolled and completed courses'
                  }
                </p>
              </div>
              {user.role === 'instructor' && (
                <button
                  onClick={handleCreateCourse}
                  className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#006d3a' }}
                >
                  <Plus className="w-4 h-4" />
                  Create Course
                </button>
              )}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-3/5">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="search"
                placeholder="Search your courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                style={{ '--tw-ring-color': '#006d3a' } as React.CSSProperties}
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-48 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent text-gray-900 dark:text-white"
              style={{ '--tw-ring-color': '#006d3a' } as React.CSSProperties}
            >
              <option value="recent">Recently Accessed</option>
              <option value="progress">Progress</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="completion">Completion Date</option>
            </select>
          </div>

          {/* Course Tabs */}
          <div className="w-full">
            <div className="flex bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              {user.role === 'student' ? (
                <>
                  <button
                    onClick={() => setActiveTab("in-progress")}
                    className={`flex-1 px-4 py-3 text-sm font-medium rounded-l-lg transition-colors ${
                      activeTab === "in-progress"
                        ? "text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                    style={activeTab === "in-progress" ? { backgroundColor: '#006d3a' } : {}}
                  >
                    In Progress ({enrolledCourses.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("completed")}
                    className={`flex-1 px-4 py-3 text-sm font-medium rounded-r-lg transition-colors ${
                      activeTab === "completed"
                        ? "text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                    style={activeTab === "completed" ? { backgroundColor: '#006d3a' } : {}}
                  >
                    Completed ({completedCourses.length})
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setActiveTab("published")}
                    className={`flex-1 px-4 py-3 text-sm font-medium rounded-l-lg transition-colors ${
                      activeTab === "published"
                        ? "text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                    style={activeTab === "published" ? { backgroundColor: '#006d3a' } : {}}
                  >
                    Published ({instructorCourses.filter(c => c.isPublished).length})
                  </button>
                  <button
                    onClick={() => setActiveTab("draft")}
                    className={`flex-1 px-4 py-3 text-sm font-medium rounded-r-lg transition-colors ${
                      activeTab === "draft"
                        ? "text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                    style={activeTab === "draft" ? { backgroundColor: '#006d3a' } : {}}
                  >
                    Drafts ({instructorCourses.filter(c => !c.isPublished).length})
                  </button>
                </>
              )}
            </div>

            <div className="mt-6">
              {user.role === 'student' ? (
                <>
                  {activeTab === "in-progress" && (
                    <div className="space-y-6">
                      {filterCourses(enrolledCourses).length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filterCourses(enrolledCourses).map((course) => (
                            <StudentCourseCard key={course.id} course={course} />
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                          <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No courses in progress</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-6">Start learning by enrolling in a new course</p>
                          <a href="/courses" className="inline-block text-white px-6 py-2 rounded-lg font-medium transition-colors hover:opacity-90" style={{ backgroundColor: '#006d3a' }}>
                            Browse Courses
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                  {activeTab === "completed" && (
                    <div className="space-y-6">
                      {filterCourses(completedCourses).length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filterCourses(completedCourses).map((course) => (
                            <StudentCourseCard key={course.id} course={course} />
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                          <Award className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No completed courses yet</h3>
                          <p className="text-gray-600 dark:text-gray-400">Complete your first course to see it here</p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {activeTab === "published" && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filterCourses(instructorCourses.filter(c => c.isPublished)).map((course) => (
                        <InstructorCourseCard 
                          key={course.id} 
                          course={course} 
                          onEdit={handleEditCourse}
                          onDelete={handleDeleteCourse}
                          onTogglePublish={handleTogglePublish}
                        />
                      ))}
                    </div>
                  )}
                  {activeTab === "draft" && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filterCourses(instructorCourses.filter(c => !c.isPublished)).map((course) => (
                        <InstructorCourseCard 
                          key={course.id} 
                          course={course} 
                          onEdit={handleEditCourse}
                          onDelete={handleDeleteCourse}
                          onTogglePublish={handleTogglePublish}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InstructorCourseCard: React.FC<{ course: Course; onEdit: (id: string) => void; onDelete: (id: string) => void; onTogglePublish: (id: string, isPublished: boolean) => void }> = ({ course, onEdit, onDelete, onTogglePublish }) => {
  const navigate = useNavigate();

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
    <div className="group hover:shadow-lg transition-all duration-300 overflow-hidden bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="relative">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <span className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-medium border ${getLevelColor(course.level)}`}>
          {course.level}
        </span>
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            course.isPublished 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {course.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="space-y-2 mb-4">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:transition-colors text-gray-900 dark:text-white" onMouseEnter={(e) => e.currentTarget.style.color = '#006d3a'} onMouseLeave={(e) => e.currentTarget.style.color = ''}>
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {course.description}
          </p>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.enrollmentCount || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{course.rating}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => navigate(`/courses/${course.id}`)}
            className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg font-medium transition-colors border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onEdit(course.id)}
            className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg font-medium transition-colors border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onTogglePublish(course.id, !course.isPublished)}
            className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg font-medium transition-colors border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {course.isPublished ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => onDelete(course.id)}
            className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg font-medium transition-colors border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;