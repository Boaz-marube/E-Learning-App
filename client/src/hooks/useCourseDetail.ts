import { useState, useEffect } from 'react';
import type { CourseDetail } from '../types/course';

// Mock course data
const mockCourseData: CourseDetail = {
  id: "1",
  title: "Advanced React Development",
  description: "Build complex React applications with hooks, context, and modern patterns.",
  longDescription: "This comprehensive course covers advanced React concepts including custom hooks, context API, performance optimization, and modern development patterns. You'll learn to build scalable applications using the latest React features and best practices. Perfect for developers looking to take their React skills to the next level.",
  instructor: {
    name: "Alex Thompson",
    bio: "Senior Frontend Engineer with 8+ years of experience in React development. Previously worked at Google and Meta, now teaching full-time.",
    avatar: "/api/placeholder/80/80",
    credentials: "Senior Frontend Engineer at Meta"
  },
  duration: "12 weeks",
  students: 2450,
  rating: 4.9,
  level: "Advanced",
  category: "Web Development",
  thumbnail: "/api/placeholder/800/450",
  price: "$89.99",
  learningObjectives: [
    "Master advanced React hooks and custom hook patterns",
    "Implement complex state management with Context API and useReducer",
    "Optimize React applications for performance",
    "Build reusable component libraries",
    "Handle advanced routing and authentication patterns",
    "Implement server-side rendering with Next.js"
  ],
  prerequisites: [
    "Solid understanding of JavaScript ES6+ features",
    "Basic React knowledge (components, props, state)",
    "Familiarity with modern development tools",
    "Understanding of HTML and CSS"
  ],
  lessons: [
    { id: "1", title: "Advanced Hooks Patterns", duration: "45 min", type: "video", completed: true },
    { id: "2", title: "Custom Hooks Workshop", duration: "30 min", type: "exercise", completed: true },
    { id: "3", title: "Context API Deep Dive", duration: "50 min", type: "video", completed: false },
    { id: "4", title: "State Management Quiz", duration: "15 min", type: "quiz", completed: false },
    { id: "5", title: "Performance Optimization", duration: "40 min", type: "video", completed: false },
    { id: "6", title: "Building Component Libraries", duration: "60 min", type: "exercise", completed: false },
    { id: "7", title: "SSR with Next.js", duration: "55 min", type: "video", completed: false },
    { id: "8", title: "Final Project", duration: "120 min", type: "exercise", completed: false }
  ],
  isEnrolled: false,
  progress: 0
};

export const useCourseDetail = (courseId: string) => {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/courses/${courseId}`);
        // const data = await response.json();
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Use mock data for now
        setCourse({
          ...mockCourseData,
          id: courseId
        });
      } catch (err) {
        setError('Failed to fetch course details');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  return { course, loading, error };
};