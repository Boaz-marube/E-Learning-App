export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "exercise" | "quiz";
  completed: boolean;
}

export interface Instructor {
  name: string;
  bio: string;
  avatar: string;
  credentials: string;
}

export interface CourseDetail {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  instructor: Instructor;
  duration: string;
  students: number;
  rating: number;
  level: string;
  category: string;
  thumbnail: string;
  previewVideoUrl?: string;
  videoUrl?: string;
  price: string;
  learningObjectives: string[];
  prerequisites: string[];
  lessons: Lesson[];
  isEnrolled?: boolean;
  progress?: number;
}