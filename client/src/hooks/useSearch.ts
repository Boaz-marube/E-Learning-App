import { useState } from 'react';
import { api } from '../utils/api';

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

interface SearchResult {
  courses: Course[];
  total: number;
  loading: boolean;
  error: string | null;
}

export const useSearch = () => {
  const [result, setResult] = useState<SearchResult>({
    courses: [],
    total: 0,
    loading: false,
    error: null
  });

  const searchCourses = async (query: string, filters?: {
    category?: string;
    level?: string;
    page?: number;
    limit?: number;
  }) => {
    if (!query.trim()) {
      setResult(prev => ({ ...prev, courses: [], total: 0, error: null }));
      return;
    }

    setResult(prev => ({ ...prev, loading: true, error: null }));

    try {
      const params = new URLSearchParams({
        q: query,
        ...(filters?.category && { category: filters.category }),
        ...(filters?.level && { level: filters.level }),
        ...(filters?.page && { page: filters.page.toString() }),
        ...(filters?.limit && { limit: filters.limit.toString() })
      });

      const response = await api.get(`/api/search/courses?${params}`);
      
      if (response.data.success) {
        setResult({
          courses: response.data.data || [],
          total: response.data.pagination?.total || 0,
          loading: false,
          error: null
        });
      } else {
        throw new Error(response.data.message || 'Search failed');
      }
    } catch (error: any) {
      setResult({
        courses: [],
        total: 0,
        loading: false,
        error: error.response?.data?.message || 'Failed to search courses'
      });
    }
  };

  return {
    ...result,
    searchCourses
  };
};