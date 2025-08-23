import React, { useState } from 'react';
import { Search, Filter, Grid, List, X } from 'lucide-react';
import { useCourses } from '../hooks/useCourses';
import CourseCard from '../components/ui/CourseCard';
import type { CourseFilters } from '../types/filters';

const categories = ["All", "Programming", "Data Science", "Marketing", "Design"];
const levels = ["All", "Beginner", "Intermediate", "Advanced"];
const durations = ["All", "1-4 weeks", "5-8 weeks", "9-12 weeks", "13+ weeks"];

const Courses: React.FC = () => {
  const [filters, setFilters] = useState<CourseFilters>({
    search: "",
    category: "All",
    level: "All",
    duration: "All",
    sortBy: "popular"
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { courses, totalCourses, loading, error } = useCourses(filters);

  const updateFilter = (key: keyof CourseFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: "",
      category: "All",
      level: "All",
      duration: "All",
      sortBy: "popular"
    });
  };

  const activeFilters = [
    filters.category !== "All" && { key: "category", value: filters.category },
    filters.level !== "All" && { key: "level", value: filters.level },
    filters.duration !== "All" && { key: "duration", value: filters.duration }
  ].filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Courses</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Explore Courses</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">Discover {totalCourses} courses from expert instructors</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="search"
                placeholder="Search courses, instructors..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                style={{ '--tw-ring-color': '#006d3a' } as React.CSSProperties}
              />
            </div>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent text-gray-900 dark:text-white"
              style={{ '--tw-ring-color': '#006d3a' } as React.CSSProperties}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "All" ? "All Categories" : category}
                </option>
              ))}
            </select>

            {/* Level Filter */}
            <select
              value={filters.level}
              onChange={(e) => updateFilter('level', e.target.value)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent text-gray-900 dark:text-white"
              style={{ '--tw-ring-color': '#006d3a' } as React.CSSProperties}
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level === "All" ? "All Levels" : level}
                </option>
              ))}
            </select>

            {/* Duration Filter */}
            <select
              value={filters.duration}
              onChange={(e) => updateFilter('duration', e.target.value)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent text-gray-900 dark:text-white"
              style={{ '--tw-ring-color': '#006d3a' } as React.CSSProperties}
            >
              {durations.map((duration) => (
                <option key={duration} value={duration}>
                  {duration === "All" ? "Any Duration" : duration}
                </option>
              ))}
            </select>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter: any) => (
                <span
                  key={filter.key}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                  onClick={() => updateFilter(filter.key as keyof CourseFilters, "All")}
                >
                  {filter.value}
                  <X className="w-3 h-3" />
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="text-gray-600 dark:text-gray-400">
              {courses.length} course{courses.length !== 1 ? "s" : ""} found
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="w-40 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent text-gray-900 dark:text-white"
              style={{ '--tw-ring-color': '#006d3a' } as React.CSSProperties}
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-l-lg transition-colors ${
                  viewMode === "grid"
                    ? "text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                style={viewMode === "grid" ? { backgroundColor: '#006d3a' } : {}}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-r-lg transition-colors ${
                  viewMode === "list"
                    ? "text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                style={viewMode === "list" ? { backgroundColor: '#006d3a' } : {}}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Course Grid/List */}
        {courses.length > 0 ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                description={course.description}
                instructor={course.instructor}
                duration={course.duration}
                students={course.students}
                rating={course.rating}
                level={course.level}
                image={course.thumbnail}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No courses found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your search criteria or filters</p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Courses;