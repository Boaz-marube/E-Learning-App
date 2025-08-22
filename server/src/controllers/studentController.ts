import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import ProgressModel from '../models/progressModel';
import AchievementModel from '../models/achievementModel';
import EnrollmentModel from '../models/enrollmentModel';
import { ApiResponse, DashboardStats, Progress, Achievement } from '../../../types/shared';
import ErrorHandler from '../utils/errorHandler';
import { createCourseCompletionAchievement } from '../utils/achievementHelper';

// Get student dashboard overview
export const getStudentDashboard = async (
  req: Request, 
  res: Response<ApiResponse<DashboardStats>>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const userId = req.user._id;

    // Get enrollment stats
    const [totalEnrolled, progressRecords, achievements] = await Promise.all([
      EnrollmentModel.countDocuments({ userId, isActive: true }),
      ProgressModel.find({ userId }).populate('courseId', 'title'),
      AchievementModel.find({ userId }).sort({ earnedAt: -1 }).limit(5)
    ]);

    const completedCourses = progressRecords.filter(p => p.isCompleted).length;
    const coursesInProgress = totalEnrolled - completedCourses;
    const totalTimeSpent = progressRecords.reduce((sum, p) => sum + p.timeSpent, 0);
    const overallProgress = totalEnrolled > 0 
      ? Math.round(progressRecords.reduce((sum, p) => sum + p.progressPercentage, 0) / totalEnrolled)
      : 0;

    // Recent activity (last 5 accessed courses)
    const recentActivity = progressRecords
      .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())
      .slice(0, 5)
      .map(p => ({
        courseTitle: (p.courseId as any).title,
        lastAccessed: p.lastAccessed,
        progressPercentage: p.progressPercentage
      }));

    // Transform achievements
    const recentAchievements: Achievement[] = achievements.map(achievement => ({
      _id: (achievement._id as Types.ObjectId).toString(),
      userId: (achievement.userId as Types.ObjectId).toString(),
      courseId: achievement.courseId ? (achievement.courseId as Types.ObjectId).toString() : undefined,
      type: achievement.type,
      title: achievement.title,
      description: achievement.description,
      badgeUrl: achievement.badgeUrl,
      earnedAt: achievement.earnedAt
    }));

    const dashboardStats: DashboardStats = {
      totalEnrolledCourses: totalEnrolled,
      coursesInProgress,
      completedCourses,
      totalTimeSpent,
      overallProgress,
      recentAchievements,
      recentActivity
    };

    res.status(200).json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: dashboardStats
    });

  } catch (error: any) {
    next(error);
  }
};

// Get student's enrolled courses with progress
export const getEnrolledCourses = async (
  req: Request, 
  res: Response<ApiResponse<any[]>>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const enrollments = await EnrollmentModel.find({ 
      userId: req.user._id, 
      isActive: true 
    }).populate('courseId');

    const coursesWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const progress = await ProgressModel.findOne({
          userId: req.user!._id,
          courseId: enrollment.courseId
        });

        const course = enrollment.courseId as any;
        return {
          _id: course._id.toString(),
          title: course.title,
          description: course.description,
          thumbnail: course.thumbnail,
          instructor: course.instructor,
          enrolledAt: enrollment.enrolledAt,
          progress: progress ? {
            progressPercentage: progress.progressPercentage,
            timeSpent: progress.timeSpent,
            lastAccessed: progress.lastAccessed,
            isCompleted: progress.isCompleted,
            completedAt: progress.completedAt
          } : {
            progressPercentage: 0,
            timeSpent: 0,
            lastAccessed: enrollment.enrolledAt,
            isCompleted: false,
            completedAt: null
          }
        };
      })
    );

    res.status(200).json({
      success: true,
      message: 'Enrolled courses retrieved successfully',
      data: coursesWithProgress
    });

  } catch (error: any) {
    next(error);
  }
};

// Get detailed course progress
export const getCourseProgress = async (
  req: Request<{ courseId: string }>, 
  res: Response<ApiResponse<Progress>>, 
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

    // Check if user is enrolled
    const enrollment = await EnrollmentModel.findOne({
      userId: req.user._id,
      courseId,
      isActive: true
    });

    if (!enrollment) {
      return next(new ErrorHandler('You are not enrolled in this course', 403));
    }

    let progress = await ProgressModel.findOne({
      userId: req.user._id,
      courseId
    });

    // Create progress record if it doesn't exist
    if (!progress) {
      progress = await ProgressModel.create({
        userId: req.user._id,
        courseId,
        completedLessons: [],
        progressPercentage: 0,
        timeSpent: 0,
        lastAccessed: new Date(),
        isCompleted: false
      });
    }

    // Transform to shared type format
    const progressData: Progress = {
      _id: (progress._id as Types.ObjectId).toString(),
      userId: (progress.userId as Types.ObjectId).toString(),
      courseId: (progress.courseId as Types.ObjectId).toString(),
      completedLessons: progress.completedLessons,
      currentLesson: progress.currentLesson,
      progressPercentage: progress.progressPercentage,
      timeSpent: progress.timeSpent,
      lastAccessed: progress.lastAccessed,
      isCompleted: progress.isCompleted,
      completedAt: progress.completedAt,
      createdAt: progress.createdAt,
      updatedAt: progress.updatedAt
    };

    res.status(200).json({
      success: true,
      message: 'Course progress retrieved successfully',
      data: progressData
    });

  } catch (error: any) {
    next(error);
  }
};

// Get student achievements
export const getStudentAchievements = async (
  req: Request, 
  res: Response<ApiResponse<Achievement[]>>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const achievements = await AchievementModel.find({ userId: req.user._id })
      .sort({ earnedAt: -1 });

    // Transform to shared type format
    const achievementData: Achievement[] = achievements.map(achievement => ({
      _id: (achievement._id as Types.ObjectId).toString(),
      userId: (achievement.userId as Types.ObjectId).toString(),
      courseId: achievement.courseId ? (achievement.courseId as Types.ObjectId).toString() : undefined,
      type: achievement.type,
      title: achievement.title,
      description: achievement.description,
      badgeUrl: achievement.badgeUrl,
      earnedAt: achievement.earnedAt
    }));

    res.status(200).json({
      success: true,
      message: 'Achievements retrieved successfully',
      data: achievementData
    });

  } catch (error: any) {
    next(error);
  }
};

// Update course progress
export const updateCourseProgress = async (
  req: Request<{ courseId: string }>, 
  res: Response<ApiResponse>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { courseId } = req.params;
    const { lessonId, timeSpent, progressPercentage } = req.body;

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

    // Update or create progress
    const progress = await ProgressModel.findOneAndUpdate(
      { userId: req.user._id, courseId },
      {
        $addToSet: lessonId ? { completedLessons: lessonId } : {},
        $set: {
          currentLesson: lessonId,
          progressPercentage: progressPercentage || 0,
          lastAccessed: new Date(),
          isCompleted: progressPercentage >= 100,
          completedAt: progressPercentage >= 100 ? new Date() : undefined
        },
        $inc: { timeSpent: timeSpent || 0 }
      },
      { new: true, upsert: true }
    );

    // Auto-create achievements if course completed
    if (progressPercentage >= 100) {
      const course = await EnrollmentModel.findOne({ 
        userId: req.user._id, 
        courseId 
      }).populate('courseId', 'title');
      
      if (course) {
        await createCourseCompletionAchievement(
          new Types.ObjectId(req.user._id),
          new Types.ObjectId(courseId),
          (course.courseId as any).title
        );
      }
    }

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully'
    });

  } catch (error: any) {
    next(error);
  }
};

// Get student recent activity
export const getStudentActivity = async (
  req: Request, 
  res: Response<ApiResponse<any[]>>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Get recent progress updates
    const recentActivity = await ProgressModel.find({ userId: req.user._id })
      .populate('courseId', 'title thumbnail')
      .sort({ lastAccessed: -1 })
      .skip(skip)
      .limit(limitNum);

    const activityData = recentActivity.map(activity => ({
      _id: (activity._id as Types.ObjectId).toString(),
      courseId: (activity.courseId as any)._id.toString(),
      courseTitle: (activity.courseId as any).title,
      courseThumbnail: (activity.courseId as any).thumbnail,
      progressPercentage: activity.progressPercentage,
      timeSpent: activity.timeSpent,
      lastAccessed: activity.lastAccessed,
      currentLesson: activity.currentLesson,
      isCompleted: activity.isCompleted
    }));

    res.status(200).json({
      success: true,
      message: 'Student activity retrieved successfully',
      data: activityData
    });

  } catch (error: any) {
    next(error);
  }
};
