import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';
import CourseCard from '../components/ui/CourseCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SearchBar from '../components/ui/SearchBar';
import { useNavigate } from 'react-router-dom';

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  price: number;
  duration: number;
  level: string;
  thumbnail: string;
  enrollmentCount: number;
  rating: number;
}

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  
  const query = searchParams.get('q') || '';

  const searchCourses = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/api/search/courses?q=${encodeURIComponent(searchQuery)}`);
      if (response.data.success) {
        setCourses(response.data.data || []);
        setTotal(response.data.pagination?.total || 0);
      }
    } catch (err: any) {
      setError('Failed to search courses. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      searchCourses(query);
    }
  }, [query]);

  const handleNewSearch = (newQuery: string) => {
    navigate(`/search?q=${encodeURIComponent(newQuery)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {query ? `Search Results for "${query}"` : 'Search Courses'}
          </h1>
          
          <SearchBar 
            placeholder="Search courses..."
            onSearch={handleNewSearch}
            className="max-w-md"
          />
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : query && courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No courses found for "{query}"
            </p>
            <p className="text-gray-500 dark:text-gray-500 mt-2">
              Try searching with different keywords
            </p>
          </div>
        ) : query && courses.length > 0 ? (
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Found {total} course{total !== 1 ? 's' : ''}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course._id}
                  id={course._id}
                  title={course.title}
                  description={course.description}
                  instructor={course.instructor}
                  duration={`${course.duration} hours`}
                  students={course.enrollmentCount}
                  rating={course.rating}
                  level={course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                  image={course.thumbnail}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Enter a search term to find courses
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;