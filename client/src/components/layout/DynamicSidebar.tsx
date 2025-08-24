import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';
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
  Moon, 
  Sun,
  Settings, 
  LogOut,
  Search,
  ClipboardList,
  Edit3
} from "lucide-react";
import type { MenuItem, SidebarProps, UserRole } from '../../types/sidebar';

const DynamicSidebar: React.FC<SidebarProps> = ({ className = "", isCollapsed = true, onNavigate }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/dashboard',
      roles: ['student', 'instructor', 'admin'] as UserRole[]
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
      label: 'Take Quizzes',
      icon: <ClipboardList className="w-5 h-5" />,
      path: '/quizzes',
      roles: ['student'] as UserRole[]
    },
    {
      id: 'manage-quizzes',
      label: 'Manage Quizzes',
      icon: <FileQuestion className="w-5 h-5" />,
      path: '/instructor/quizzes',
      roles: ['instructor'] as UserRole[]
    },
    {
      id: 'create-quiz',
      label: 'Create Quiz',
      icon: <Edit3 className="w-5 h-5" />,
      path: '/instructor/create-quiz',
      roles: ['instructor'] as UserRole[]
    },
    {
      id: 'progress',
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
      roles: ['student', 'instructor'] as UserRole[],
      badge: '3'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-5 h-5" />,
      path: '/profile',
      roles: ['student', 'instructor'] as UserRole[]
    },
    {
      id: 'chatbot',
      label: 'AI Assistant',
      icon: <Bot className="w-5 h-5" />,
      path: '/chatbot',
      roles: ['student', 'instructor'] as UserRole[]
    },
    {
      id: 'theme-toggle',
      label: 'Dark Mode',
      icon: theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />,
      roles: ['student', 'instructor'] as UserRole[],
      action: toggleTheme
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      path: '/settings',
      roles: ['student', 'instructor'] as UserRole[]
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: <LogOut className="w-5 h-5" />,
      roles: ['student', 'instructor'] as UserRole[],
      action: handleLogout
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const isActive = (path?: string) => path && location.pathname === path;

  const handleItemClick = (item: MenuItem) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
      onNavigate?.(); // Close sidebar on mobile after navigation
    }
  };

  if (!user) return null;

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-gray-800 shadow-lg h-screen flex flex-col transition-all duration-300 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center">
          <img src="/DirectED.png" alt="DirectEd" className="h-8 w-8 dark:invert-0 invert" />
          {!isCollapsed && (
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
              DirectEd
            </span>
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
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-3">
          {filteredMenuItems.map((item) => {
            const active = isActive(item.path);
            
            if (item.path) {
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={() => onNavigate?.()}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                      active
                        ? 'bg-green-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span className={`${active ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <div className="flex items-center justify-between flex-1">
                        <span className="font-medium text-sm">{item.label}</span>
                        {item.badge && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                </li>
              );
            }

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 text-left rounded-lg transition-colors duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="text-gray-500 dark:text-gray-400">
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="font-medium text-sm">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default DynamicSidebar;