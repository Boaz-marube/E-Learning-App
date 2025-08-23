import { useState, useEffect } from 'react';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  students: number;
  rating: number;
  level: string;
  image: string;
}

export const useFeaturedCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const response = await fetch('/api/courses/featured');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const result = await response.json();
        if (result.success && result.data) {
          // Transform backend data to match frontend interface
          const transformedCourses = result.data.map((course: any) => ({
            id: course._id,
            title: course.title,
            description: course.description,
            instructor: typeof course.instructor === 'string' ? course.instructor : course.instructor.name || 'Unknown Instructor',
            duration: `${course.duration} hours`,
            students: course.enrollmentCount,
            rating: course.rating,
            level: course.level.charAt(0).toUpperCase() + course.level.slice(1),
            image: course.thumbnail
          }));
          setCourses(transformedCourses);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  return { courses, loading, error };
};