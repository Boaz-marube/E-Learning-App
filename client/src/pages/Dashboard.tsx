import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {user?.role === 'student' ? 'Continue your learning journey' : 'Manage your courses and students'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {user?.role === 'student' ? 'Enrolled Courses' : 'Total Courses'}
            </h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">0</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {user?.role === 'student' ? 'Start learning today' : 'Create your first course'}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {user?.role === 'student' ? 'Completed' : 'Students'}
            </h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">0</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {user?.role === 'student' ? 'Courses completed' : 'Total students'}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {user?.role === 'student' ? 'Certificates' : 'Revenue'}
            </h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">0</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {user?.role === 'student' ? 'Earned certificates' : 'Total earnings'}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {user?.role === 'student' ? 'Recent Activity' : 'Course Management'}
          </h2>
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-lg mb-4">
              {user?.role === 'student' 
                ? 'No recent activity. Start exploring courses!' 
                : 'No courses yet. Create your first course to get started!'
              }
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors">
              {user?.role === 'student' ? 'Browse Courses' : 'Create Course'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;