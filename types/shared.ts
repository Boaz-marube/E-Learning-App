// User roles enum
export enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin'
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    isVerified: boolean;
    avatar?: {
      public_id: string;
      url: string;
    };
    courses: Array<{ courseId: string }>;
  }
  
  export interface Course {
    _id: string;
    title: string;
    description: string;
    instructor: string;
    category: string;
    price: number;
    duration: number;
    level: 'beginner' | 'intermediate' | 'advanced';
    thumbnail?: string;
    tags?: string[];
    isFeatured: boolean;
    isPublished: boolean;
    enrollmentCount: number;
    rating: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Enrollment {
    _id: string;
    userId: string;
    courseId: string;
    enrolledAt: Date;
    progress: number;
    completedAt?: Date;
    isActive: boolean;
  }

  export interface Testimonial {
    _id: string;
    name: string;
    role: 'student' | 'instructor';
    message: string;
    rating: number;
    avatar?: string;
    courseTitle?: string;
    isActive: boolean;
    createdAt: Date;
  }

  export interface PlatformStats {
    totalCourses: number;
    totalStudents: number;
    totalInstructors: number;
    totalEnrollments: number;
  }

  export interface Notification {
    _id: string;
    userId: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    isRead: boolean;
    relatedId?: string;
    relatedType?: 'course' | 'enrollment' | 'quiz' | 'general';
    createdAt: Date;
  }

  export interface SearchQuery {
    query?: string;
    level?: 'beginner' | 'intermediate' | 'advanced';
    minPrice?: number;
    maxPrice?: number;
    instructor?: string;
    page?: number;
    limit?: number;
  }

  export interface SearchResults {
    courses: Course[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }

  export interface Content {
    _id: string;
    title: string;
    description?: string;
    fileType: 'video' | 'document' | 'image' | 'pdf';
    fileUrl: string;
    fileName: string;
    fileSize: number;
    uploadedBy: string;
    courseId?: string;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface UploadResponse {
    success: boolean;
    message: string;
    content?: Content;
  }

  export interface Progress {
    _id: string;
    userId: string;
    courseId: string;
    completedLessons: string[];
    currentLesson?: string;
    progressPercentage: number;
    timeSpent: number; // in minutes
    lastAccessed: Date;
    isCompleted: boolean;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Achievement {
    _id: string;
    userId: string;
    courseId?: string;
    type: 'course_completion' | 'quiz_master' | 'streak' | 'first_course' | 'fast_learner' | 'course_creator' | 'top_instructor' | 'student_milestone';
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

  export interface InstructorStudent {
    _id: string;
    name: string;
    email: string;
    enrolledCourses: {
      courseId: string;
      courseTitle: string;
      enrolledAt: Date;
      progress: number;
      isCompleted: boolean;
    }[];
    totalCoursesEnrolled: number;
    averageProgress: number;
  }

  export interface CourseFilters {
    search?: string;
    category?: string;
    level?: 'beginner' | 'intermediate' | 'advanced';
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'title' | 'price' | 'rating' | 'enrollmentCount' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }

  export interface PaginatedCourses {
    courses: Course[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }

  export interface CourseDetails {
    _id: string;
    title: string;
    description: string;
    instructor: {
      _id: string;
      name: string;
      email: string;
      bio?: string;
    };
    category: string;
    price: number;
    duration: number;
    level: 'beginner' | 'intermediate' | 'advanced';
    thumbnail?: string;
    tags?: string[];
    isFeatured: boolean;
    isPublished: boolean;
    rating: number;
    createdAt: Date;
    updatedAt: Date;
    lessons?: {
      _id: string;
      title: string;
      duration: number;
      isPreview: boolean;
    }[];
    enrollmentCount: number;
    averageRating: number;
    totalReviews: number;
    isEnrolled?: boolean;
    userProgress?: {
      progressPercentage: number;
      completedLessons: number;
      totalLessons: number;
    };
  }

  export interface CourseCreateRequest {
    title: string;
    description: string;
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    price: number;
    thumbnail?: string;
    tags?: string[];
  }

  export interface CourseUpdateRequest {
    title?: string;
    description?: string;
    category?: string;
    level?: 'beginner' | 'intermediate' | 'advanced';
    price?: number;
    thumbnail?: string;
    tags?: string[];
    isPublished?: boolean;
    isFeatured?: boolean;
  }
  
  export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
  }
  
  export interface AuthResponse {
    success: boolean;
    message: string;
    user?: User;
    token?: string;
  }

  export interface DemoLesson {
    videoUrl: string;
    title: string;
    duration: number;
  }

  export interface Lesson {
    _id: string;
    courseId: string;
    title: string;
    description?: string;
    videoUrl?: string;
    duration: number; // in seconds
    order: number;
    isPreview: boolean;
    materials?: {
      title: string;
      fileUrl: string;
      fileType: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
  }

  export interface LessonProgress {
    lessonId: string;
    isCompleted: boolean;
    timeWatched: number; // in seconds
    lastPosition: number; // video position in seconds
    completedAt?: Date;
  }

  export interface CourseProgress {
    courseId: string;
    userId: string;
    currentLessonId?: string;
    completedLessons: string[];
    lessonsProgress: LessonProgress[];
    totalTimeSpent: number; // in minutes
    progressPercentage: number;
    lastAccessed: Date;
    isCompleted: boolean;
    completedAt?: Date;
  }

  export interface LessonAccessRequest {
    courseId: string;
    lessonId: string;
  }

  export interface ProgressUpdateRequest {
    lessonId: string;
    timeWatched: number;
    currentPosition: number;
    isCompleted?: boolean;
  }

  export interface LessonWithAccess extends Lesson {
    isAccessible: boolean;
    userProgress?: {
      isCompleted: boolean;
      timeWatched: number;
      lastPosition: number;
    };
    nextLessonId?: string;
    previousLessonId?: string;
  }

  export interface CourseWithLessons {
    courseId: string;
    courseTitle: string;
    totalLessons: number;
    completedLessons: number;
    progressPercentage: number;
    currentLessonId?: string;
    lessons: LessonWithAccess[];
    canAccessNext: boolean;
  }
  