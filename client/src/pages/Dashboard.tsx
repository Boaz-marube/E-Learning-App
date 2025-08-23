import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Award, Clock, TrendingUp, Bell, MessageCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for dashboard
  const recentCourses = [
    {
      id: '1',
      title: 'Introduction to Web Development',
      progress: 75,
      thumbnail: '/api/placeholder/300/200',
      instructor: 'Sarah Johnson',
      nextLesson: 'CSS Flexbox'
    },
    {
      id: '2', 
      title: 'Data Science with Python',
      progress: 45,
      thumbnail: '/api/placeholder/300/200',
      instructor: 'Dr. Michael Chen',
      nextLesson: 'Data Visualization'
    }
  ];

  const notifications = [
    { id: 1, message: 'New lesson available in Web Development', time: '2 hours ago' },
    { id: 2, message: 'Assignment due tomorrow in Python course', time: '1 day ago' },
    { id: 3, message: 'Certificate ready for Digital Marketing', time: '3 days ago' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {user?.role === 'student' ? 'Continue your learning journey' : 'Manage your courses and students'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {user?.role === 'student' ? 'Enrolled Courses' : 'Total Courses'}
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {user?.role === 'student' ? '3' : '12'}
                </p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: '#006d3a20' }}>
                <BookOpen className="w-6 h-6" style={{ color: '#006d3a' }} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {user?.role === 'student' ? 'Completed' : 'Students'}
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {user?.role === 'student' ? '2' : '156'}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {user?.role === 'student' ? 'Hours Learned' : 'Revenue'}
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {user?.role === 'student' ? '24' : '$2,450'}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {user?.role === 'student' ? 'Streak' : 'Growth'}
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {user?.role === 'student' ? '7 days' : '+12%'}
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {user?.role === 'student' ? 'Continue Learning' : 'Recent Courses'}
                </h2>
                <button 
                  onClick={() => navigate('/my-courses')}
                  className="text-sm font-medium hover:underline"
                  style={{ color: '#006d3a' }}
                >
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {recentCourses.map((course) => (
                  <div key={course.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer" onClick={() => navigate(`/courses/${course.id}/lessons/1`)}>
                    <img src={course.thumbnail} alt={course.title} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">{course.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">by {course.instructor}</p>
                      {user?.role === 'student' && (
                        <>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Next: {course.nextLesson}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div className="h-2 rounded-full" style={{ backgroundColor: '#006d3a', width: `${course.progress}%` }} />
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{course.progress}%</span>
                          </div>
                        </>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => navigate('/courses')}
                  className="p-4 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <BookOpen className="w-8 h-8 mb-2" style={{ color: '#006d3a' }} />
                  <h3 className="font-medium text-gray-900 dark:text-white">Browse Courses</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Discover new learning opportunities</p>
                </button>
                
                <button 
                  onClick={() => navigate('/my-courses')}
                  className="p-4 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <Award className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                  <h3 className="font-medium text-gray-900 dark:text-white">My Progress</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Track your learning journey</p>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                <span className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs px-2 py-1 rounded-full">3</span>
              </div>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Assistant */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5" style={{ color: '#006d3a' }} />
                <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Need help with your studies? Ask our AI assistant for personalized learning guidance.
              </p>
              <button className="w-full text-white py-2 px-4 rounded-lg font-medium transition-colors hover:opacity-90" style={{ backgroundColor: '#006d3a' }}>
                Start Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;