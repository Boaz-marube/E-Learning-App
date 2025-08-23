import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  FolderOpen, 
  PlusCircle, 
  FileQuestion, 
  TrendingUp, 
  Bell, 
  User, 
  Bot, 
  Settings, 
  LogOut,
  Search,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import type { MenuItem, SidebarProps, UserRole } from '../../types/sidebar';

const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed = false, 
  className = "" 
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/dashboard',
      roles: ['student', 'instructor'] as UserRole[]
    },
    {
      id: 'browse-courses',
      label: 'Browse Courses',
      icon: <Search className="w-5 h-5" />,
      path: '/courses',
      roles: ['student'] as UserRole[]
    },
    {
      id: 'my-courses',
      label: 'My Courses',
      icon: <FolderOpen className="w-5 h-5" />,
      path: '/my-courses',
      roles: ['student', 'instructor'] as UserRole[]
    },
    {
      id: 'create-course',
      label: 'Create Course',
      icon: <PlusCircle className="w-5 h-5" />,
      path: '/create-course',
      roles: ['instructor'] as UserRole[]
    },
    {
      id: 'quizzes',
      label: 'Quizzes/Assessments',
      icon: <FileQuestion className="w-5 h-5" />,
      path: '/quizzes',
      roles: ['instructor'] as UserRole[]
    },
    {
      id: 'student-progress',
      label: 'Student Progress',
      icon: <TrendingUp className="w-5 h-5" />,
      path: '/student-progress',
      roles: ['instructor'] as UserRole[]
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      path: '/notifications',
      roles: ['student', 'instructor'] as UserRole[]
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-5 h-5" />,
      path: '/profile',
      roles: ['student', 'instructor'] as UserRole[]
    },
    {
      id: 'ai-assistant',
      label: 'AI Assistant',
      icon: <Bot className="w-5 h-5" />,
      path: '/ai-assistant',
      roles: ['student', 'instructor'] as UserRole[]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      path: '/settings',
      roles: ['student', 'instructor'] as UserRole[]
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const isActive = (path: string) => location.pathname === path;

  if (!user) return null;

  return (
    <nav 
      className={`
        ${isCollapsed ? 'w-16' : 'w-64'} 
        bg-white dark:bg-gray-800 
        border-r border-gray-200 dark:border-gray-700 
        h-screen flex flex-col 
        transition-all duration-300 ease-in-out
        ${className}
      `}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <img src="/DirectED.png" alt="DirectEd" className="h-8 w-8" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                DirectEd
              </span>
            </div>
          )}
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3" role="menu">
          {filteredMenuItems.map((item) => (
            <li key={item.id} role="none">
              <Link
                to={item.path}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg 
                  transition-colors duration-200 group
                  ${
                    isActive(item.path)
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
                role="menuitem"
                aria-label={item.label}
                aria-current={isActive(item.path) ? 'page' : undefined}
                title={isCollapsed ? item.label : undefined}
              >
                <span className={`
                  ${isActive(item.path) ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}
                `}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout Button */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg 
            text-gray-700 dark:text-gray-300 
            hover:bg-red-50 dark:hover:bg-red-900/20 
            hover:text-red-600 dark:hover:text-red-400
            transition-colors duration-200 group
          `}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && (
            <span className="font-medium text-sm">Logout</span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;