export interface CourseFilters {
  search: string;
  category: string;
  level: string;
  duration: string;
  sortBy: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  students: number;
  rating: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  thumbnail: string;
  price: string;
}