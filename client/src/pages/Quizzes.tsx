import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ClipboardList, 
  Clock, 
  Trophy, 
  CheckCircle, 
  XCircle,
  Play,
  RotateCcw,
  Search,
  Filter
} from 'lucide-react';

interface QuizSummary {
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
  userAttempts: {
    attemptNumber: number;
    score: number;
    isPassed: boolean;
    submittedAt: Date;
  }[];
  canAttempt: boolean;
  attemptsRemaining: number;
}

const Quizzes: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - replace with API call
  const quizzes: QuizSummary[] = [
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
      userAttempts: [
        { attemptNumber: 1, score: 65, isPassed: false, submittedAt: new Date('2024-01-15') }
      ],
      canAttempt: true,
      attemptsRemaining: 2
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
      userAttempts: [
        { attemptNumber: 1, score: 85, isPassed: true, submittedAt: new Date('2024-01-20') }
      ],
      canAttempt: true,
      attemptsRemaining: 1
    }
  ];

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quiz.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'passed') return matchesSearch && quiz.userAttempts.some(a => a.isPassed);
    if (filterStatus === 'failed') return matchesSearch && quiz.userAttempts.length > 0 && !quiz.userAttempts.some(a => a.isPassed);
    if (filterStatus === 'not-attempted') return matchesSearch && quiz.userAttempts.length === 0;
    
    return matchesSearch;
  });

  const getQuizStatus = (quiz: QuizSummary) => {
    if (quiz.userAttempts.length === 0) return 'not-attempted';
    if (quiz.userAttempts.some(a => a.isPassed)) return 'passed';
    return 'failed';
  };

  const getBestScore = (quiz: QuizSummary) => {
    if (quiz.userAttempts.length === 0) return null;
    return Math.max(...quiz.userAttempts.map(a => a.score));
  };

  const handleStartQuiz = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  if (user?.role !== 'student') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">This page is only available for students.</p>
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Quizzes</h1>
            <p className="text-gray-600 dark:text-gray-400">Test your knowledge and track your progress</p>
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
              <option value="not-attempted">Not Attempted</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Quiz Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredQuizzes.map((quiz) => {
              const status = getQuizStatus(quiz);
              const bestScore = getBestScore(quiz);

              return (
                <div
                  key={quiz._id}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                        {quiz.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {quiz.courseTitle} • {quiz.lessonTitle}
                      </p>
                      {quiz.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {quiz.description}
                        </p>
                      )}
                    </div>
                    <div className="ml-4">
                      {status === 'passed' && <CheckCircle className="w-6 h-6 text-green-500" />}
                      {status === 'failed' && <XCircle className="w-6 h-6 text-red-500" />}
                      {status === 'not-attempted' && <ClipboardList className="w-6 h-6 text-gray-400" />}
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <ClipboardList className="w-4 h-4" />
                        <span>{quiz.totalQuestions} questions</span>
                      </div>
                      {quiz.timeLimit && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{quiz.timeLimit} min</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        <span>Pass: {quiz.passingScore}%</span>
                      </div>
                      <span>Attempts: {quiz.userAttempts.length}/{quiz.maxAttempts}</span>
                    </div>

                    {bestScore !== null && (
                      <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Best Score: </span>
                        <span className={`font-medium ${bestScore >= quiz.passingScore ? 'text-green-600' : 'text-red-600'}`}>
                          {bestScore}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {quiz.canAttempt ? (
                      <button
                        onClick={() => handleStartQuiz(quiz._id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#006d3a' }}
                      >
                        {quiz.userAttempts.length === 0 ? (
                          <>
                            <Play className="w-4 h-4" />
                            Start Quiz
                          </>
                        ) : (
                          <>
                            <RotateCcw className="w-4 h-4" />
                            Retake ({quiz.attemptsRemaining} left)
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg text-center text-sm">
                        No attempts remaining
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredQuizzes.length === 0 && (
            <div className="text-center py-12">
              <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No quizzes found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery ? 'Try adjusting your search terms.' : 'No quizzes are available at the moment.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quizzes;