import React from 'react';
import CourseCard from './CourseCard';
import { useFeaturedCourses } from '../../hooks/useFeaturedCourses';
import coursecards from '../../assets/coursecards.jpg'

const FeaturedCourses: React.FC = () => {
  const { courses, loading, error } = useFeaturedCourses();

  // Fallback mock data
  const mockCourses = [
    {
      id: '1',
      title: "CS50 Python Course",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.",
      instructor: "Instructor",
      duration: "8 weeks",
      students: 1250,
      rating: 4.8,
      level: "Beginner",
      image: `${coursecards}`
    },
    {
      id: '2',
      title: "Web Development Bootcamp",
      description: "Learn full-stack web development with modern technologies and frameworks.",
      instructor: "Sarah Johnson",
      duration: "12 weeks",
      students: 2100,
      rating: 4.9,
      level: "Intermediate",
      image: `${coursecards}`
    },
    {
      id: '3',
      title: "AI & Machine Learning",
      description: "Master artificial intelligence and machine learning fundamentals.",
      instructor: "Dr. Michael Chen",
      duration: "10 weeks",
      students: 890,
      rating: 4.7,
      level: "Advanced",
      image: `${coursecards}`
    }
  ];

  const featuredCourses = courses.length > 0 ? courses : mockCourses;

  if (loading) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600 dark:text-gray-300">Loading courses...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.warn('Failed to load courses from API, using mock data:', error);
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Featured Courses
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 text-center">
          Explore our featured courses and find the perfect one for you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {featuredCourses.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              description={course.description}
              instructor={course.instructor}
              duration={course.duration}
              students={course.students}
              rating={course.rating}
              level={course.level}
              image={course.image}
            />
          ))}
        </div>

        {/* View All Courses Button */}
        <div className="flex justify-center mt-12">
          <a
            href="/courses"
            className="inline-flex items-center px-8 py-3 text-lg font-medium text-white rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: "#00693F" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#005a35";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#00693F";
            }}
          >
            View All Courses
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;