import { AchievementType } from './common';

export interface Achievement {
  _id: string;
  userId: string;
  courseId?: string;
  type: AchievementType;
  title: string;
  description: string;
  badgeUrl?: string;
  earnedAt: Date;
}

export interface DashboardStats {
  totalEnrolledCourses: number;
  coursesInProgress: number;
  completedCourses: number;
  totalTimeSpent: number;
  overallProgress: number;
  recentAchievements: Achievement[];
  recentActivity: {
    courseTitle: string;
    lastAccessed: Date;
    progressPercentage: number;
  }[];
}

export interface InstructorDashboardStats {
  totalCoursesCreated: number;
  totalStudentsEnrolled: number;
  totalRevenue: number;
  averageRating: number;
  completionRate: number;
  recentEnrollments: {
    studentName: string;
    courseTitle: string;
    enrolledAt: Date;
  }[];
  topPerformingCourses: {
    courseTitle: string;
    enrollmentCount: number;
    rating: number;
    revenue: number;
  }[];
}

export interface CourseAnalytics {
  courseId: string;
  courseTitle: string;
  totalEnrollments: number;
  activeStudents: number;
  completedStudents: number;
  averageProgress: number;
  averageTimeSpent: number;
  completionRate: number;
  rating: number;
  revenue: number;
  enrollmentTrend: {
    month: string;
    enrollments: number;
  }[];
}

export interface InstructorEarnings {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayouts: number;
  completedPayouts: number;
  revenueByMonth: {
    month: string;
    revenue: number;
  }[];
  topEarningCourses: {
    courseTitle: string;
    revenue: number;
    enrollments: number;
  }[];
}

export interface PlatformStats {
  totalCourses: number;
  totalStudents: number;
  totalInstructors: number;
  totalEnrollments: number;
}