import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import CourseModel from '../models/courseModel';
import { ApiResponse, SearchQuery, SearchResults, Course } from '../../../types';
import ErrorHandler from '../utils/errorHandler';

// Search courses with filters
export const searchCourses = async (
  req: Request<{}, ApiResponse<SearchResults>, {}, SearchQuery>, 
  res: Response<ApiResponse<SearchResults>>, 
  next: NextFunction
) => {
  try {
    const { 
      query = '', 
      level, 
      minPrice, 
      maxPrice, 
      instructor, 
      page = 1, 
      limit = 10 
    } = req.query;

    // Build search filter
    const searchFilter: any = {
      isPublished: true
    };

    // Text search
    if (query) {
      searchFilter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    // Level filter
    if (level) {
      searchFilter.level = level;
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      searchFilter.price = {};
      if (minPrice !== undefined) {
        searchFilter.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined) {
        searchFilter.price.$lte = Number(maxPrice);
      }
    }

    // Instructor filter
    if (instructor) {
      searchFilter.instructor = instructor;
    }

    // Pagination
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit))); // Max 50 results per page
    const skip = (pageNum - 1) * limitNum;

    // Execute search with pagination
    const [courses, totalCount] = await Promise.all([
      CourseModel.find(searchFilter)
        .populate('instructor', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      CourseModel.countDocuments(searchFilter)
    ]);

    if (!courses || courses.length === 0) {
      return next(new ErrorHandler('No courses found matching your criteria', 404));
    }

    // Transform to shared type format
    const courseData: Course[] = courses.map(course => ({
      _id: (course._id as Types.ObjectId).toString(),
      title: course.title,
      description: course.description,
      instructor: (course.instructor as Types.ObjectId).toString(),
      price: course.price,
      duration: course.duration,
      level: course.level,
      thumbnail: course.thumbnail,
      isFeatured: course.isFeatured,
      isPublished: course.isPublished,
      enrollmentCount: course.enrollmentCount,
      rating: course.rating,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    }));

    const totalPages = Math.ceil(totalCount / limitNum);

    const searchResults: SearchResults = {
      courses: courseData,
      totalCount,
      currentPage: pageNum,
      totalPages
    };

    res.status(200).json({
      success: true,
      message: `Found ${totalCount} courses`,
      data: searchResults
    });

  } catch (error: any) {
    next(error);
  }
};

// Get search suggestions (autocomplete)
export const getSearchSuggestions = async (
  req: Request<{}, ApiResponse<string[]>, {}, { q: string }>, 
  res: Response<ApiResponse<string[]>>, 
  next: NextFunction
) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return next(new ErrorHandler('Query must be at least 2 characters long', 400));
    }

    const suggestions = await CourseModel.find({
      isPublished: true,
      title: { $regex: q, $options: 'i' }
    })
    .select('title')
    .limit(5);

    const suggestionTitles = suggestions.map(course => course.title);

    res.status(200).json({
      success: true,
      message: 'Search suggestions retrieved successfully',
      data: suggestionTitles
    });

  } catch (error: any) {
    next(error);
  }
};
