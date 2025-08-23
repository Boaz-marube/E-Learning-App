export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  transcript: string;
  notes: string;
  completed: boolean;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

export interface LessonCourse {
  id: string;
  title: string;
  lessons: CourseLesson[];
}