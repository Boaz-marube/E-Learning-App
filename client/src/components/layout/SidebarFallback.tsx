import React from 'react';
import { Home, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const SidebarFallback: React.FC = () => (
  <nav className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col">
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <span className="text-xl font-bold text-gray-900 dark:text-white">DirectEd</span>
    </div>
    
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
        Navigation temporarily unavailable
      </p>
      <Link 
        to="/dashboard"
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        <Home className="w-4 h-4" />
        Dashboard
      </Link>
    </div>
  </nav>
);

export default SidebarFallback;