import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import type { Course, CourseFilters } from '../types/filters';

// Fallback mock data
const mockCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.",
    instructor: "Sarah Johnson",
    duration: "8 weeks",
    students: 1250,
    rating: 4.8,
    level: "Beginner",
    category: "Programming",
    thumbnail: "/api/placeholder/320/180",
    price: "$99",
  },
  {
    id: "2",
    title: "Data Science with Python",
    description: "Master data analysis, visualization, and machine learning using Python.",
    instructor: "Dr. Michael Chen",
    duration: "12 weeks",
    students: 890,
    rating: 4.9,
    level: "Intermediate",
    category: "Data Science",
    thumbnail: "/api/placeholder/320/180",
    price: "$149",
  },
  {
    id: "3",
    title: "Digital Marketing Fundamentals",
    description: "Learn effective digital marketing strategies and tools for modern businesses.",
    instructor: "Emma Rodriguez",
    duration: "6 weeks",
    students: 2100,
    rating: 4.7,
    level: "Beginner",
    category: "Marketing",
    thumbnail: "/api/placeholder/320/180",
    price: "$79",
  },
  {
    id: "4",
    title: "Advanced React Development",
    description: "Build complex React applications with hooks, context, and modern patterns.",
    instructor: "Alex Thompson",
    duration: "10 weeks",
    students: 650,
    rating: 4.9,
    level: "Advanced",
    category: "Programming",
    thumbnail: "/api/placeholder/320/180",
    price: "$199",
  },
  {
    id: "5",
    title: "UX/UI Design Principles",
    description: "Create user-centered designs with modern UX/UI principles and tools.",
    instructor: "Jessica Park",
    duration: "8 weeks",
    students: 980,
    rating: 4.6,
    level: "Intermediate",
    category: "Design",
    thumbnail: "/api/placeholder/320/180",
    price: "$129",
  },
  {
    id: "6",
    title: "Machine Learning Basics",
    description: "Introduction to machine learning algorithms and practical applications.",
    instructor: "Dr. Robert Kim",
    duration: "14 weeks",
    students: 720,
    rating: 4.8,
    level: "Intermediate",
    category: "Data Science",
    thumbnail: "/api/placeholder/320/180",
    price: "$179",
  },
];

export const useCourses = (filters: CourseFilters) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (filters.search.trim()) {
          // Use search API if there's a search query
          const params = new URLSearchParams({ q: filters.search });
          if (filters.category !== 'All') params.append('category', filters.category);
          if (filters.level !== 'All') params.append('level', filters.level.toLowerCase());
          
          const response = await api.get(`/api/search/courses?${params}`);
          if (response.data.success) {
            const apiCourses = response.data.data.map((course: any) => ({
              id: course._id,
              title: course.title,
              description: course.description,
              instructor: course.instructor,
              duration: `${course.duration} hours`,
              students: course.enrollmentCount,
              rating: course.rating,
              level: course.level.charAt(0).toUpperCase() + course.level.slice(1),
              category: course.category,
              thumbnail: course.thumbnail,
              price: `$${course.price}`
            }));
            setCourses(apiCourses);
            setTotalCourses(response.data.pagination?.total || apiCourses.length);
          }
        } else {
          // Use featured courses API for no search
          const response = await api.get('/api/courses/featured');
          if (response.data.success) {
            const apiCourses = response.data.data.map((course: any) => ({
              id: course._id,
              title: course.title,
              description: course.description,
              instructor: course.instructor,
              duration: `${course.duration} hours`,
              students: course.enrollmentCount,
              rating: course.rating,
              level: course.level.charAt(0).toUpperCase() + course.level.slice(1),
              category: course.category,
              thumbnail: course.thumbnail,
              price: `$${course.price}`
            }));
            setCourses(apiCourses);
            setTotalCourses(apiCourses.length);
          }
        }
      } catch (err: any) {
        // Fallback to mock data on error
        console.warn('API failed, using mock data:', err);
        setCourses(mockCourses);
        setTotalCourses(mockCourses.length);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchCourses, 2000);
    return () => clearTimeout(debounceTimer);
  }, [filters.search, filters.category, filters.level]);

  return { courses, totalCourses, loading, error };
};