import { useState, useEffect, useMemo } from 'react';
import type { Course, CourseFilters } from '../types/filters';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const filteredAndSortedCourses = useMemo(() => {
    let filtered = mockCourses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.instructor.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory = filters.category === "All" || course.category === filters.category;
      const matchesLevel = filters.level === "All" || course.level === filters.level;

      let matchesDuration = true;
      if (filters.duration !== "All") {
        const weeks = parseInt(course.duration);
        switch (filters.duration) {
          case "1-4 weeks":
            matchesDuration = weeks <= 4;
            break;
          case "5-8 weeks":
            matchesDuration = weeks >= 5 && weeks <= 8;
            break;
          case "9-12 weeks":
            matchesDuration = weeks >= 9 && weeks <= 12;
            break;
          case "13+ weeks":
            matchesDuration = weeks >= 13;
            break;
        }
      }

      return matchesSearch && matchesCategory && matchesLevel && matchesDuration;
    });

    // Sort courses
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "popular":
          return b.students - a.students;
        case "rating":
          return b.rating - a.rating;
        case "price-low":
          return parseInt(a.price.replace("$", "")) - parseInt(b.price.replace("$", ""));
        case "price-high":
          return parseInt(b.price.replace("$", "")) - parseInt(a.price.replace("$", ""));
        case "newest":
          return 0; // Would sort by creation date in real app
        default:
          return 0;
      }
    });

    return filtered;
  }, [filters]);

  return {
    courses: filteredAndSortedCourses,
    totalCourses: mockCourses.length,
    loading,
    error
  };
};