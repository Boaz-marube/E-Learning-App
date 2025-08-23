export interface Enrollment {
  _id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  progress: number;
  completedAt?: Date;
  isActive: boolean;
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

export interface ProgressUpdateRequest {
  lessonId: string;
  timeWatched: number;
  currentPosition: number;
  isCompleted?: boolean;
}