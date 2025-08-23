import type { Course, CourseLevel } from './course';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface SearchQuery {
  query?: string;
  level?: CourseLevel;
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