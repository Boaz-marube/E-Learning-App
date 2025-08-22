import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import CourseModel from '../models/courseModel';
import EnrollmentModel from '../models/enrollmentModel';
import ProgressModel from '../models/progressModel';
import { 
  ApiResponse, 
  CourseFilters, 
  PaginatedCourses, 
  CourseDetails,
  CourseCreateRequest,
  CourseUpdateRequest,
  Course
} from '../../../types/shared';
import ErrorHandler from '../utils/errorHandler';

// Get paginated courses with filters (Public)
export const getCourses = async (
  req: Request<{}, {}, {}, CourseFilters>, 
  res: Response<ApiResponse<PaginatedCourses>>, 
  next: NextFunction
) => {
  try {
    const {
      search,
      category,
      level,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    // Build filter query
    const filter: any = { isPublished: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (level) {
      filter.level = level;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    // Pagination
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Sort configuration
    const sortConfig: any = {};
    sortConfig[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute queries
    const [courses, totalCount] = await Promise.all([
      CourseModel.find(filter)
        .populate('instructor', 'name email')
        .sort(sortConfig)
        .skip(skip)
        .limit(limitNum),
      CourseModel.countDocuments(filter)
    ]);

    // Transform to shared type format
    const courseData: Course[] = courses.map(course => ({
      _id: (course._id as Types.ObjectId).toString(),
      title: course.title,
      description: course.description,
      instructor: (course.instructor as Types.ObjectId).toString(),
      category: course.category,
      level: course.level,
      price: course.price,
      duration: course.duration || 0,
      thumbnail: course.thumbnail,
      tags: course.tags,
      isPublished: course.isPublished,
      isFeatured: course.isFeatured,
      enrollmentCount: course.enrollmentCount,
      rating: course.rating,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    }));

    const totalPages = Math.ceil(totalCount / limitNum);

    const paginatedResult: PaginatedCourses = {
      courses: courseData,
      totalCount,
      currentPage: pageNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1
    };

    res.status(200).json({
      success: true,
      message: `Found ${totalCount} courses`,
      data: paginatedResult
    });

  } catch (error: any) {
    next(error);
  }
};

// Get single course by ID (Public)
export const getCourseById = async (
  req: Request<{ id: string }>, 
  res: Response<ApiResponse<CourseDetails>>, 
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler('Invalid course ID', 400));
    }

    const course = await CourseModel.findOne({ 
      _id: id, 
      isPublished: true 
    }).populate('instructor', 'name email bio');

    if (!course) {
      return next(new ErrorHandler('Course not found', 404));
    }

    // Get enrollment count
    const enrollmentCount = await EnrollmentModel.countDocuments({ 
      courseId: id, 
      isActive: true 
    });

    // Check if user is enrolled (if authenticated)
    let isEnrolled = false;
    let userProgress;

    if (req.user) {
      const enrollment = await EnrollmentModel.findOne({
        userId: req.user._id,
        courseId: id,
        isActive: true
      });

      isEnrolled = !!enrollment;

      if (isEnrolled) {
        const progress = await ProgressModel.findOne({
          userId: req.user._id,
          courseId: id
        });

        if (progress) {
          userProgress = {
            progressPercentage: progress.progressPercentage,
            completedLessons: progress.completedLessons.length,
            totalLessons: 10 // Mock total lessons
          };
        }
      }
    }

    // Transform to CourseDetails format
    const courseDetails: CourseDetails = {
      _id: (course._id as Types.ObjectId).toString(),
      title: course.title,
      description: course.description,
      instructor: {
        _id: (course.instructor as any)._id.toString(),
        name: (course.instructor as any).name,
        email: (course.instructor as any).email,
        bio: (course.instructor as any).bio
      },
      category: course.category,
      level: course.level,
      price: course.price,
      duration: course.duration || 0,
      thumbnail: course.thumbnail,
      tags: course.tags,
      isPublished: course.isPublished,
      isFeatured: course.isFeatured,
      enrollmentCount,
      rating: course.rating,
      averageRating: course.rating,
      totalReviews: Math.floor(enrollmentCount * 0.3), // Mock 30% review rate
      isEnrolled,
      userProgress,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    };

    res.status(200).json({
      success: true,
      message: 'Course details retrieved successfully',
      data: courseDetails
    });

  } catch (error: any) {
    next(error);
  }
};

// Create course (Instructor only)
export const createCourse = async (
  req: Request<{}, {}, CourseCreateRequest>, 
  res: Response<ApiResponse>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { title, description, category, level, price, thumbnail, tags } = req.body;

    if (!title || !description || !category || !level || price === undefined) {
      return next(new ErrorHandler('Title, description, category, level, and price are required', 400));
    }

    const course = await CourseModel.create({
      title,
      description,
      instructor: req.user._id,
      category,
      level,
      price,
      thumbnail: thumbnail || '',
      tags: tags || [],
      isPublished: false,
      isFeatured: false,
      enrollmentCount: 0,
      rating: 0
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: {
        _id: (course._id as Types.ObjectId).toString(),
        title: course.title
      }
    });

  } catch (error: any) {
    next(error);
  }
};

// Update course (Instructor only - ownership verified)
export const updateCourse = async (
  req: Request<{ id: string }, {}, CourseUpdateRequest>, 
  res: Response<ApiResponse>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler('Invalid course ID', 400));
    }

    const course = await CourseModel.findOneAndUpdate(
      { _id: id, instructor: req.user._id },
      { ...req.body },
      { new: true }
    );

    if (!course) {
      return next(new ErrorHandler('Course not found or unauthorized', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Course updated successfully'
    });

  } catch (error: any) {
    next(error);
  }
};

// Delete course (Instructor only - ownership verified)
export const deleteCourse = async (
  req: Request<{ id: string }>, 
  res: Response<ApiResponse>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler('Invalid course ID', 400));
    }

    // Check for active enrollments
    const enrollmentCount = await EnrollmentModel.countDocuments({ 
      courseId: id, 
      isActive: true 
    });

    if (enrollmentCount > 0) {
      return next(new ErrorHandler('Cannot delete course with active enrollments', 400));
    }

    const course = await CourseModel.findOneAndDelete({
      _id: id,
      instructor: req.user._id
    });

    if (!course) {
      return next(new ErrorHandler('Course not found or unauthorized', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });

  } catch (error: any) {
    next(error);
  }
};