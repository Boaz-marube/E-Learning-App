import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import EnrollmentModel from '../models/enrollmentModel';
import CourseModel from '../models/courseModel';
import ProgressModel from '../models/progressModel';
import { ApiResponse, Enrollment } from '../../../types';
import ErrorHandler from '../utils/errorHandler';

// Enroll in a course
export const enrollInCourse = async (
  req: Request<{ courseId: string }>, 
  res: Response<ApiResponse>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { courseId } = req.params;

    if (!Types.ObjectId.isValid(courseId)) {
      return next(new ErrorHandler('Invalid course ID', 400));
    }

    // Check if course exists and is published
    const course = await CourseModel.findOne({ 
      _id: courseId, 
      isPublished: true 
    });

    if (!course) {
      return next(new ErrorHandler('Course not found or not available', 404));
    }

    // Check if already enrolled
    const existingEnrollment = await EnrollmentModel.findOne({
      userId: req.user._id,
      courseId,
      isActive: true
    });

    if (existingEnrollment) {
      return next(new ErrorHandler('Already enrolled in this course', 400));
    }

    // Create enrollment
    const enrollment = await EnrollmentModel.create({
      userId: req.user._id,
      courseId,
      progress: 0,
      isActive: true
    });

    // Update course enrollment count
    await CourseModel.findByIdAndUpdate(courseId, {
      $inc: { enrollmentCount: 1 }
    });

    // Create initial progress record
    await ProgressModel.create({
      userId: req.user._id,
      courseId,
      completedLessons: [],
      progressPercentage: 0,
      timeSpent: 0,
      lastAccessed: new Date(),
      isCompleted: false
    });

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: {
        enrollmentId: (enrollment._id as Types.ObjectId).toString(),
        courseTitle: course.title
      }
    });

  } catch (error: any) {
    next(error);
  }
};

// Get enrollment status for a course
export const getEnrollmentStatus = async (
  req: Request<{ courseId: string }>, 
  res: Response<ApiResponse<{ isEnrolled: boolean; enrollmentDate?: Date }>>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { courseId } = req.params;

    if (!Types.ObjectId.isValid(courseId)) {
      return next(new ErrorHandler('Invalid course ID', 400));
    }

    const enrollment = await EnrollmentModel.findOne({
      userId: req.user._id,
      courseId,
      isActive: true
    });

    res.status(200).json({
      success: true,
      message: 'Enrollment status retrieved',
      data: {
        isEnrolled: !!enrollment,
        enrollmentDate: enrollment?.enrolledAt
      }
    });

  } catch (error: any) {
    next(error);
  }
};

// Get user's enrollments
export const getMyEnrollments = async (
  req: Request, 
  res: Response<ApiResponse<any[]>>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const enrollments = await EnrollmentModel.find({ 
      userId: req.user._id, 
      isActive: true 
    })
    .populate('courseId', 'title description thumbnail price level rating')
    .sort({ enrolledAt: -1 })
    .skip(skip)
    .limit(limitNum);

    // Get progress for each enrollment
    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const progress = await ProgressModel.findOne({
          userId: req.user!._id,
          courseId: enrollment.courseId
        });

        const course = enrollment.courseId as any;
        return {
          _id: (enrollment._id as Types.ObjectId).toString(),
          course: {
            _id: course._id.toString(),
            title: course.title,
            description: course.description,
            thumbnail: course.thumbnail,
            price: course.price,
            level: course.level,
            rating: course.rating
          },
          enrolledAt: enrollment.enrolledAt,
          progress: {
            progressPercentage: progress?.progressPercentage || 0,
            timeSpent: progress?.timeSpent || 0,
            lastAccessed: progress?.lastAccessed || enrollment.enrolledAt,
            isCompleted: progress?.isCompleted || false
          }
        };
      })
    );

    res.status(200).json({
      success: true,
      message: 'Enrollments retrieved successfully',
      data: enrollmentsWithProgress
    });

  } catch (error: any) {
    next(error);
  }
};

// Unenroll from a course
export const unenrollFromCourse = async (
  req: Request<{ courseId: string }>, 
  res: Response<ApiResponse>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { courseId } = req.params;

    if (!Types.ObjectId.isValid(courseId)) {
      return next(new ErrorHandler('Invalid course ID', 400));
    }

    // Find and deactivate enrollment
    const enrollment = await EnrollmentModel.findOneAndUpdate(
      {
        userId: req.user._id,
        courseId,
        isActive: true
      },
      { isActive: false },
      { new: true }
    );

    if (!enrollment) {
      return next(new ErrorHandler('Enrollment not found', 404));
    }

    // Update course enrollment count
    await CourseModel.findByIdAndUpdate(courseId, {
      $inc: { enrollmentCount: -1 }
    });

    res.status(200).json({
      success: true,
      message: 'Successfully unenrolled from course'
    });

  } catch (error: any) {
    next(error);
  }
};

// Get enrollment statistics (for instructors)
export const getEnrollmentStats = async (
  req: Request<{ courseId: string }>, 
  res: Response<ApiResponse<any>>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { courseId } = req.params;

    if (!Types.ObjectId.isValid(courseId)) {
      return next(new ErrorHandler('Invalid course ID', 400));
    }

    // Verify course ownership
    const course = await CourseModel.findOne({ 
      _id: courseId, 
      instructor: req.user._id 
    });

    if (!course) {
      return next(new ErrorHandler('Course not found or unauthorized', 404));
    }

    // Get enrollment statistics
    const [totalEnrollments, activeEnrollments, recentEnrollments] = await Promise.all([
      EnrollmentModel.countDocuments({ courseId }),
      EnrollmentModel.countDocuments({ courseId, isActive: true }),
      EnrollmentModel.find({ courseId, isActive: true })
        .populate('userId', 'name email')
        .sort({ enrolledAt: -1 })
        .limit(10)
    ]);

    const stats = {
      totalEnrollments,
      activeEnrollments,
      unenrollments: totalEnrollments - activeEnrollments,
      recentEnrollments: recentEnrollments.map(enrollment => ({
        studentName: (enrollment.userId as any).name,
        studentEmail: (enrollment.userId as any).email,
        enrolledAt: enrollment.enrolledAt,
        progress: enrollment.progress
      }))
    };

    res.status(200).json({
      success: true,
      message: 'Enrollment statistics retrieved',
      data: stats
    });

  } catch (error: any) {
    next(error);
  }
};