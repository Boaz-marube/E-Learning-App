import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CourseCardProps {
  id?: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  students: number;
  rating: number;
  level: string;
  image: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id = '1',
  title,
  description,
  instructor,
  duration,
  students,
  rating,
  level,
  image
}) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="relative">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <span className="absolute top-4 right-4 bg-gray-600 text-white px-3 py-1 rounded-full text-sm">
          {level}
        </span>
      </div>
      <div className="p-6 bg-gray-100 dark:bg-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        <p className="text-gray-700 dark:text-gray-200 font-medium mb-4">By {instructor}</p>

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {duration}
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            {students}
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {rating}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/courses/${id}`)}
            className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-md font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            View Details
          </button>
          <button
            className="flex-1 text-white py-3 rounded-md font-medium transition-colors"
            style={{ backgroundColor: "#006d3a" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005a35")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#006d3a")}
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;