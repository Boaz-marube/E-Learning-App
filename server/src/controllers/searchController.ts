import { Request, Response, NextFunction } from 'express';
import CourseModel from '../models/courseModel';
import { ApiResponse, Course } from '../../../types';
import ErrorHandler from '../utils/errorHandler';
import { Types } from 'mongoose';

interface SearchQuery {
  q?: string;
  category?: string;
  level?: string;
  page?: string;
  limit?: string;
}

export const searchCourses = async (
  req: Request<{}, ApiResponse<Course[]>, {}, SearchQuery>,
  res: Response<ApiResponse<Course[]>>,
  next: NextFunction
) => {
  try {
    const { q, category, level, page = '1', limit = '12' } = req.query;

    if (!q || q.trim().length === 0) {
      return next(new ErrorHandler('Search query is required', 400));
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build search filter
    const searchFilter: any = {
      isPublished: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    };

    // Add additional filters
    if (category) {
      searchFilter.category = category;
    }
    if (level) {
      searchFilter.level = level;
    }

    // Execute search
    const courses = await CourseModel.find(searchFilter)
      .populate('instructor', 'name email')
      .sort({ rating: -1, enrollmentCount: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await CourseModel.countDocuments(searchFilter);

    // Transform to shared type format
    const courseData: Course[] = courses.map(course => ({
      _id: (course._id as Types.ObjectId).toString(),
      title: course.title,
      description: course.description,
      instructor: (course.instructor._id as Types.ObjectId).toString(),
      category: course.category || 'General',
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

    res.status(200).json({
      success: true,
      message: `Found ${total} courses for "${q}"`,
      data: courseData,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (error: any) {
    next(error);
  }
};