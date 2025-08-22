import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import EnrollmentModel from '../models/enrollmentModel';
import CourseModel from '../models/courseModel';
import ErrorHandler from '../utils/errorHandler';

// Extend Request interface to include course property
declare global {
  namespace Express {
    interface Request {
      course?: {
        _id: string;
        title: string;
        instructor: string;
      };
    }
  }
}

// Validate progress update request
export const validateProgressUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { lessonId, timeWatched, progressPercentage } = req.body;

  if (!lessonId) {
    return next(new ErrorHandler('Lesson ID is required', 400));
  }

  if (timeWatched !== undefined && (typeof timeWatched !== 'number' || timeWatched < 0)) {
    return next(new ErrorHandler('Time watched must be a positive number', 400));
  }

  if (progressPercentage !== undefined && (typeof progressPercentage !== 'number' || progressPercentage < 0 || progressPercentage > 100)) {
    return next(new ErrorHandler('Progress percentage must be between 0 and 100', 400));
  }

  next();
};

// Verify user enrollment in course
export const verifyEnrollment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const courseId = req.params.courseId || req.params.id;

    if (!courseId || !Types.ObjectId.isValid(courseId)) {
      return next(new ErrorHandler('Valid course ID is required', 400));
    }

    // Check if course exists
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return next(new ErrorHandler('Course not found', 404));
    }

    // Check enrollment
    const enrollment = await EnrollmentModel.findOne({
      userId: req.user._id,
      courseId,
      isActive: true
    });

    if (!enrollment) {
      return next(new ErrorHandler('You are not enrolled in this course', 403));
    }

    // Add course to request for use in controller
    req.course = {
      _id: (course._id as Types.ObjectId).toString(),
      title: course.title,
      instructor: (course.instructor as Types.ObjectId).toString()
    };
    next();

  } catch (error: any) {
    next(error);
  }
};