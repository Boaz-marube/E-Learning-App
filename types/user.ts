import { UserRole } from './common';

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