export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
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
    price: number;
    duration: number;
    level: 'beginner' | 'intermediate' | 'advanced';
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Enrollment {
    _id: string;
    userId: string;
    courseId: string;
    enrolledAt: Date;
    progress: number;
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