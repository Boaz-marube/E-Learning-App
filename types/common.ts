// User roles enum
export enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin'
}

// Common level type
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

// Common sort orders
export type SortOrder = 'asc' | 'desc';

// File types
export type FileType = 'video' | 'document' | 'image' | 'pdf';

// Notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

// Quiz question types
export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer';

// Achievement types
export type AchievementType = 'course_completion' | 'quiz_master' | 'streak' | 'first_course' | 'fast_learner' | 'course_creator' | 'top_instructor' | 'student_milestone';

// Related types for notifications
export type RelatedType = 'course' | 'enrollment' | 'quiz' | 'general';

// Testimonial roles
export type TestimonialRole = 'student' | 'instructor';