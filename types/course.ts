import { CourseLevel, SortOrder } from './common';

export interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  price: number;
  duration: number;
  level: CourseLevel;
  thumbnail?: string;
  tags?: string[];
  isFeatured: boolean;
  isPublished: boolean;
  enrollmentCount: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
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
  level: CourseLevel;
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
  level: CourseLevel;
  price: number;
  thumbnail?: string;
  tags?: string[];
}

export interface CourseUpdateRequest {
  title?: string;
  description?: string;
  category?: string;
  level?: CourseLevel;
  price?: number;
  thumbnail?: string;
  tags?: string[];
  isPublished?: boolean;
  isFeatured?: boolean;
}

export interface CourseFilters {
  search?: string;
  category?: string;
  level?: CourseLevel;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'title' | 'price' | 'rating' | 'enrollmentCount' | 'createdAt';
  sortOrder?: SortOrder;
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

export interface LessonAccessRequest {
  courseId: string;
  lessonId: string;
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