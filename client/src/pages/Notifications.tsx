import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Bell,
  CheckCircle,
  Clock,
  Trophy,
  BookOpen,
  AlertCircle,
  Trash2,
  BookMarked,
  Users,
  DollarSign,
  MessageSquare,
  Star,
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'achievement' | 'reminder' | 'course_update' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon: React.ComponentType<any>;
  color: string;
  course: string | null;
}

const studentNotifications: Notification[] = [
  {
    id: "1",
    type: "achievement",
    title: "Congratulations! Course Completed",
    message: "You've successfully completed 'Introduction to Web Development'. Your certificate is ready!",
    timestamp: "2 hours ago",
    read: false,
    icon: Trophy,
    color: "text-yellow-600",
    course: "Introduction to Web Development",
  },
  {
    id: "2",
    type: "reminder",
    title: "Assignment Due Soon",
    message: "Your Python Data Analysis assignment is due in 2 days. Don't forget to submit!",
    timestamp: "1 day ago",
    read: false,
    icon: AlertCircle,
    color: "text-orange-600",
    course: "Data Science with Python",
  },
  {
    id: "3",
    type: "course_update",
    title: "New Lesson Available",
    message: "A new lesson 'Advanced React Hooks' has been added to your course.",
    timestamp: "2 days ago",
    read: true,
    icon: BookOpen,
    color: "text-blue-600",
    course: "Advanced React Development",
  },
  {
    id: "4",
    type: "system",
    title: "Weekly Progress Report",
    message: "You've completed 3 lessons this week! Keep up the great work.",
    timestamp: "3 days ago",
    read: true,
    icon: CheckCircle,
    color: "text-green-600",
    course: null,
  },
];

const instructorNotifications: Notification[] = [
  {
    id: "1",
    type: "system",
    title: "New Student Enrollment",
    message: "5 new students have enrolled in your 'React Development' course today.",
    timestamp: "1 hour ago",
    read: false,
    icon: Users,
    color: "text-blue-600",
    course: "React Development",
  },
  {
    id: "2",
    type: "achievement",
    title: "Course Milestone Reached",
    message: "Your course 'Web Development Basics' has reached 100 students!",
    timestamp: "3 hours ago",
    read: false,
    icon: Trophy,
    color: "text-yellow-600",
    course: "Web Development Basics",
  },
  {
    id: "3",
    type: "reminder",
    title: "Assignment Submissions",
    message: "12 assignments are pending review in your Python course.",
    timestamp: "1 day ago",
    read: true,
    icon: AlertCircle,
    color: "text-orange-600",
    course: "Python for Beginners",
  },
  {
    id: "4",
    type: "system",
    title: "Payment Received",
    message: "You've received $450 in course sales this week.",
    timestamp: "2 days ago",
    read: true,
    icon: DollarSign,
    color: "text-green-600",
    course: null,
  },
  {
    id: "5",
    type: "course_update",
    title: "Student Question",
    message: "A student asked a question in your 'Advanced JavaScript' course discussion.",
    timestamp: "3 days ago",
    read: true,
    icon: MessageSquare,
    color: "text-purple-600",
    course: "Advanced JavaScript",
  },
  {
    id: "6",
    type: "achievement",
    title: "5-Star Review Received",
    message: "Your course received a new 5-star review: 'Excellent content and teaching!'",
    timestamp: "1 week ago",
    read: true,
    icon: Star,
    color: "text-yellow-600",
    course: "Web Development Basics",
  },
];

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const [notificationList, setNotificationList] = useState(
    user?.role === 'instructor' ? instructorNotifications : studentNotifications
  );
  const [filter, setFilter] = useState("all");

  const unreadCount = notificationList.filter((n) => !n.read).length;

  const filteredNotifications = notificationList.filter((notification) => {
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    return true;
  });

  const handleMarkAsRead = (id: string) => {
    setNotificationList((prev) =>
      prev.map((notification) => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotificationList((prev) => 
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const handleDeleteNotification = (id: string) => {
    setNotificationList((prev) => 
      prev.filter((notification) => notification.id !== id)
    );
  };

  const getNotificationsByType = (type: string) => {
    return notificationList.filter((n) => n.type === type);
  };

  if (!user || (user.role !== 'student' && user.role !== 'instructor')) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">This page is only available for students and instructors.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Notifications</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {user?.role === 'student' 
                  ? 'Stay updated with your learning progress and important announcements'
                  : 'Stay updated with your course management and student activities'
                }
              </p>
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <BookMarked className="w-4 h-4" />
                Mark All as Read
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{notificationList.length}</p>
                </div>
                <Bell className="w-6 h-6" style={{ color: '#006d3a' }} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unread</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{unreadCount}</p>
                </div>
                <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                  {unreadCount}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {user?.role === 'student' ? 'Achievements' : 'Milestones'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {getNotificationsByType("achievement").length}
                  </p>
                </div>
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {user?.role === 'student' ? 'Reminders' : 'Tasks'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {getNotificationsByType("reminder").length}
                  </p>
                </div>
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="w-full">
            <div className="flex bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
              <button
                onClick={() => setFilter("all")}
                className={`flex-1 px-4 py-3 text-sm font-medium rounded-l-lg transition-colors ${
                  filter === "all"
                    ? "text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                style={filter === "all" ? { backgroundColor: '#006d3a' } : {}}
              >
                All ({notificationList.length})
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  filter === "unread"
                    ? "text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                style={filter === "unread" ? { backgroundColor: '#006d3a' } : {}}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilter("read")}
                className={`flex-1 px-4 py-3 text-sm font-medium rounded-r-lg transition-colors ${
                  filter === "read"
                    ? "text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                style={filter === "read" ? { backgroundColor: '#006d3a' } : {}}
              >
                Read ({notificationList.length - unreadCount})
              </button>
            </div>

            {filteredNotifications.length > 0 ? (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200 ${
                        !notification.read ? "ring-2 ring-opacity-20" : ""
                      }`}
                      style={{}}
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700 ${notification.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className={`font-semibold ${!notification.read ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>
                                  {notification.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                                {notification.course && (
                                  <span className="inline-block mt-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded border border-gray-200 dark:border-gray-600">
                                    {notification.course}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                  {notification.timestamp}
                                </span>
                                {!notification.read && (
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#006d3a' }} />
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                              {!notification.read && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                  Mark as Read
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteNotification(notification.id)}
                                className="flex items-center gap-1 px-3 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {filter === "unread" ? "No unread notifications" : "No notifications"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {filter === "unread"
                    ? "You're all caught up! Check back later for new updates."
                    : "You don't have any notifications yet."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;