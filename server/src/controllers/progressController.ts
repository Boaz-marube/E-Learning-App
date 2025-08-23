import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import ProgressModel from '../models/progressModel';
import EnrollmentModel from '../models/enrollmentModel';
import { ApiResponse, CourseProgress } from '../../../types';
import ErrorHandler from '../utils/errorHandler';
import { createCourseCompletionAchievement } from '../utils/achievementHelper';

// Update lesson completion with validation
export const updateLessonProgress = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { lessonId, timeWatched, progressPercentage, isCompleted, courseId } = req.body;

    if (!lessonId || !courseId) {
      return next(new ErrorHandler('Lesson ID and Course ID are required', 400));
    }

    if (!Types.ObjectId.isValid(courseId)) {
      return next(new ErrorHandler('Invalid course ID', 400));
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

    // Update progress
    const progress = await ProgressModel.findOneAndUpdate(
      { userId: req.user._id, courseId },
      {
        $set: {
          currentLesson: lessonId,
          lastAccessed: new Date()
        },
        $addToSet: isCompleted ? { completedLessons: lessonId } : {},
        $inc: { timeSpent: timeWatched ? Math.round(timeWatched / 60) : 0 }
      },
      { new: true, upsert: true }
    );

    // Calculate overall progress
    const totalLessons = 4; // Mock total lessons
    const completedCount = progress.completedLessons.length;
    const calculatedProgress = Math.round((completedCount / totalLessons) * 100);

    // Update progress percentage
    await ProgressModel.findByIdAndUpdate(progress._id, {
      progressPercentage: calculatedProgress,
      isCompleted: calculatedProgress >= 100,
      completedAt: calculatedProgress >= 100 ? new Date() : undefined
    });

    // Create achievement if course completed
    if (calculatedProgress >= 100 && req.course) {
      await createCourseCompletionAchievement(
        new Types.ObjectId(req.user._id),
        new Types.ObjectId(courseId),
        req.course.title
      );
    }

    res.status(200).json({
      success: true,
      message: 'Lesson progress updated successfully',
      data: {
        lessonId,
        progressPercentage: calculatedProgress,
        completedLessons: completedCount,
        totalLessons,
        isCompleted: calculatedProgress >= 100
      }
    });

  } catch (error: any) {
    next(error);
  }
};

// Get course progress data
export const getCourseProgress = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<CourseProgress>>,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { id: courseId } = req.params;

    if (!Types.ObjectId.isValid(courseId)) {
      return next(new ErrorHandler('Invalid course ID', 400));
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

    // Get progress
    const progress = await ProgressModel.findOne({
      userId: req.user._id,
      courseId
    });

    if (!progress) {
      // Create initial progress if not exists
      const newProgress = await ProgressModel.create({
        userId: req.user._id,
        courseId,
        completedLessons: [],
        progressPercentage: 0,
        timeSpent: 0,
        lastAccessed: new Date(),
        isCompleted: false
      });

      const courseProgress: CourseProgress = {
        courseId,
        userId: req.user._id,
        currentLessonId: undefined,
        completedLessons: [],
        lessonsProgress: [],
        totalTimeSpent: 0,
        progressPercentage: 0,
        lastAccessed: new Date(),
        isCompleted: false
      };

      return res.status(200).json({
        success: true,
        message: 'Course progress retrieved successfully',
        data: courseProgress
      });
    }

    // Format lessons progress
    const lessonsProgress = progress.completedLessons.map(lessonId => ({
      lessonId,
      isCompleted: true,
      timeWatched: 600, // Mock time per lesson
      lastPosition: 600,
      completedAt: new Date()
    }));

    const courseProgress: CourseProgress = {
      courseId,
      userId: (progress.userId as Types.ObjectId).toString(),
      currentLessonId: progress.currentLesson,
      completedLessons: progress.completedLessons,
      lessonsProgress,
      totalTimeSpent: progress.timeSpent,
      progressPercentage: progress.progressPercentage,
      lastAccessed: progress.lastAccessed,
      isCompleted: progress.isCompleted,
      completedAt: progress.completedAt
    };

    res.status(200).json({
      success: true,
      message: 'Course progress retrieved successfully',
      data: courseProgress
    });

  } catch (error: any) {
    next(error);
  }
};

// Update overall course progress
export const updateCourseProgress = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { id: courseId } = req.params;
    const { currentLessonId, timeSpent, progressPercentage } = req.body;

    if (!Types.ObjectId.isValid(courseId)) {
      return next(new ErrorHandler('Invalid course ID', 400));
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

    // Update progress
    const updateData: any = {
      lastAccessed: new Date()
    };

    if (currentLessonId) updateData.currentLesson = currentLessonId;
    if (timeSpent !== undefined) updateData.$inc = { timeSpent: Math.round(timeSpent / 60) };
    if (progressPercentage !== undefined) {
      updateData.progressPercentage = Math.min(100, Math.max(0, progressPercentage));
      updateData.isCompleted = progressPercentage >= 100;
      if (progressPercentage >= 100) updateData.completedAt = new Date();
    }

    const progress = await ProgressModel.findOneAndUpdate(
      { userId: req.user._id, courseId },
      updateData,
      { new: true, upsert: true }
    );

    // Create achievement if course completed
    if (progressPercentage >= 100 && req.course) {
      await createCourseCompletionAchievement(
        new Types.ObjectId(req.user._id),
        new Types.ObjectId(courseId),
        req.course.title
      );
    }

    res.status(200).json({
      success: true,
      message: 'Course progress updated successfully',
      data: {
        progressPercentage: progress.progressPercentage,
        currentLessonId: progress.currentLesson,
        totalTimeSpent: progress.timeSpent,
        isCompleted: progress.isCompleted
      }
    });

  } catch (error: any) {
    next(error);
  }
};