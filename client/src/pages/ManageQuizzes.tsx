import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FileQuestion, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Users, 
  BarChart3,
  Search,
  Filter,
  Clock,
  Trophy
} from 'lucide-react';

interface InstructorQuiz {
  _id: string;
  title: string;
  description?: string;
  lessonId: string;
  lessonTitle: string;
  courseTitle: string;
  timeLimit?: number;
  passingScore: number;
  maxAttempts: number;
  totalQuestions: number;
  isActive: boolean;
  totalAttempts: number;
  averageScore: number;
  passRate: number;
  createdAt: Date;
  updatedAt: Date;
}

const ManageQuizzes: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - replace with API call
  const quizzes: InstructorQuiz[] = [
    {
      _id: '1',
      title: 'HTML & CSS Fundamentals',
      description: 'Test your knowledge of HTML and CSS basics',
      lessonId: '1',
      lessonTitle: 'Introduction to HTML',
      courseTitle: 'Web Development Bootcamp',
      timeLimit: 30,
      passingScore: 70,
      maxAttempts: 3,
      totalQuestions: 10,
      isActive: true,
      totalAttempts: 25,
      averageScore: 78,
      passRate: 80,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-15')
    },
    {
      _id: '2',
      title: 'JavaScript Basics Quiz',
      description: 'Variables, functions, and control structures',
      lessonId: '2',
      lessonTitle: 'JavaScript Fundamentals',
      courseTitle: 'Web Development Bootcamp',
      timeLimit: 45,
      passingScore: 75,
      maxAttempts: 2,
      totalQuestions: 15,
      isActive: true,
      totalAttempts: 18,
      averageScore: 82,
      passRate: 89,
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-18')
    }
  ];

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quiz.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'active') return matchesSearch && quiz.isActive;
    if (filterStatus === 'inactive') return matchesSearch && !quiz.isActive;
    
    return matchesSearch;
  });

  const handleCreateQuiz = () => {
    navigate('/instructor/create-quiz');
  };

  const handleEditQuiz = (quizId: string) => {
    navigate(`/instructor/edit-quiz/${quizId}`);
  };

  const handleViewResults = (quizId: string) => {
    navigate(`/instructor/quiz-results/${quizId}`);
  };

  const handleDeleteQuiz = (quizId: string) => {
    if (window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      // API call to delete quiz
      console.log('Deleting quiz:', quizId);
    }
  };

  const toggleQuizStatus = (quizId: string, currentStatus: boolean) => {
    // API call to toggle quiz active status
    console.log('Toggling quiz status:', quizId, !currentStatus);
  };

  if (user?.role !== 'instructor') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">This page is only available for instructors.</p>
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Manage Quizzes</h1>
                <p className="text-gray-600 dark:text-gray-400">Create and manage quizzes for your courses</p>
              </div>
              <button
                onClick={handleCreateQuiz}
                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#006d3a' }}
              >
                <Plus className="w-4 h-4" />
                Create Quiz
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="search"
                placeholder="Search quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent text-gray-900 dark:text-white"
                style={{ '--tw-ring-color': '#006d3a' } as React.CSSProperties}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent text-gray-900 dark:text-white"
              style={{ '--tw-ring-color': '#006d3a' } as React.CSSProperties}
            >
              <option value="all">All Quizzes</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Quiz Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredQuizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {quiz.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        quiz.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {quiz.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {quiz.courseTitle} • {quiz.lessonTitle}
                    </p>
                    {quiz.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {quiz.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <FileQuestion className="w-4 h-4" />
                      <span>{quiz.totalQuestions} questions</span>
                    </div>
                    {quiz.timeLimit && (
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{quiz.timeLimit} min</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Trophy className="w-4 h-4" />
                      <span>Pass: {quiz.passingScore}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{quiz.totalAttempts} attempts</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Avg Score:</span>
                        <span className="ml-1 font-medium text-gray-900 dark:text-white">
                          {quiz.averageScore}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Pass Rate:</span>
                        <span className="ml-1 font-medium text-gray-900 dark:text-white">
                          {quiz.passRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditQuiz(quiz._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleViewResults(quiz._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Results
                  </button>
                  <button
                    onClick={() => handleDeleteQuiz(quiz._id)}
                    className="px-3 py-2 border border-red-300 dark:border-red-600 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredQuizzes.length === 0 && (
            <div className="text-center py-12">
              <FileQuestion className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No quizzes found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchQuery ? 'Try adjusting your search terms.' : 'You haven\'t created any quizzes yet.'}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleCreateQuiz}
                  className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity mx-auto"
                  style={{ backgroundColor: '#006d3a' }}
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Quiz
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageQuizzes;