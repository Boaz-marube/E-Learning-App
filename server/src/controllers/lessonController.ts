import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import EnrollmentModel from '../models/enrollmentModel';
import ProgressModel from '../models/progressModel';
import CourseModel from '../models/courseModel';
import { 
  ApiResponse, 
  CourseWithLessons, 
  LessonWithAccess, 
  ProgressUpdateRequest,
  CourseProgress
} from '../../../types/shared';
import ErrorHandler from '../utils/errorHandler';

// Get course lessons (enrolled students only)
export const getCourseLessons = async (
  req: Request<{ courseId: string }>, 
  res: Response<ApiResponse<CourseWithLessons>>, 
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

    // Check enrollment
    const enrollment = await EnrollmentModel.findOne({
      userId: req.user._id,
      courseId,
      isActive: true
    });

    if (!enrollment) {
      return next(new ErrorHandler('You are not enrolled in this course', 403));
    }

    // Get course details
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return next(new ErrorHandler('Course not found', 404));
    }

    // Get user progress
    const progress = await ProgressModel.findOne({
      userId: req.user._id,
      courseId
    });

    // Mock lessons data (in real app, you'd have a Lesson model)
    const mockLessons = [
      {
        _id: 'lesson1',
        courseId,
        title: 'Introduction to the Course',
        description: 'Welcome and course overview',
        videoUrl: 'https://res.cloudinary.com/demo/video/upload/sample_video.mp4',
        duration: 300, // 5 minutes
        order: 1,
        isPreview: true,
        materials: [
          {
            title: 'Course Syllabus',
            fileUrl: 'https://res.cloudinary.com/demo/raw/upload/syllabus.pdf',
            fileType: 'pdf'
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'lesson2',
        courseId,
        title: 'Getting Started',
        description: 'Setting up your development environment',
        videoUrl: 'https://res.cloudinary.com/demo/video/upload/lesson2.mp4',
        duration: 600, // 10 minutes
        order: 2,
        isPreview: false,
        materials: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'lesson3',
        courseId,
        title: 'Core Concepts',
        description: 'Understanding the fundamentals',
        videoUrl: 'https://res.cloudinary.com/demo/video/upload/lesson3.mp4',
        duration: 900, // 15 minutes
        order: 3,
        isPreview: false,
        materials: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'lesson4',
        courseId,
        title: 'Advanced Topics',
        description: 'Deep dive into advanced concepts',
        videoUrl: 'https://res.cloudinary.com/demo/video/upload/lesson4.mp4',
        duration: 1200, // 20 minutes
        order: 4,
        isPreview: false,
        materials: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const completedLessons = progress?.completedLessons || [];
    const totalLessons = mockLessons.length;
    const completedCount = completedLessons.length;

    // Add access control and progress to lessons
    const lessonsWithAccess: LessonWithAccess[] = mockLessons.map((lesson, index) => {
      const isCompleted = completedLessons.includes(lesson._id);
      const isAccessible = lesson.isPreview || index === 0 || completedLessons.includes(mockLessons[index - 1]._id);
      
      return {
        ...lesson,
        isAccessible,
        userProgress: {
          isCompleted,
          timeWatched: isCompleted ? lesson.duration : 0,
          lastPosition: 0
        },
        nextLessonId: index < mockLessons.length - 1 ? mockLessons[index + 1]._id : undefined,
        previousLessonId: index > 0 ? mockLessons[index - 1]._id : undefined
      };
    });

    const courseWithLessons: CourseWithLessons = {
      courseId,
      courseTitle: course.title,
      totalLessons,
      completedLessons: completedCount,
      progressPercentage: Math.round((completedCount / totalLessons) * 100),
      currentLessonId: progress?.currentLesson,
      lessons: lessonsWithAccess,
      canAccessNext: completedCount < totalLessons
    };

    res.status(200).json({
      success: true,
      message: 'Course lessons retrieved successfully',
      data: courseWithLessons
    });

  } catch (error: any) {
    next(error);
  }
};

// Get single lesson content
export const getLesson = async (
  req: Request<{ courseId: string; lessonId: string }>, 
  res: Response<ApiResponse<LessonWithAccess>>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { courseId, lessonId } = req.params;

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

    // Get user progress
    const progress = await ProgressModel.findOne({
      userId: req.user._id,
      courseId
    });

    // Mock lesson data (find by lessonId)
    const mockLessons = [
      { _id: 'lesson1', order: 1, isPreview: true },
      { _id: 'lesson2', order: 2, isPreview: false },
      { _id: 'lesson3', order: 3, isPreview: false },
      { _id: 'lesson4', order: 4, isPreview: false }
    ];

    const lessonIndex = mockLessons.findIndex(l => l._id === lessonId);
    if (lessonIndex === -1) {
      return next(new ErrorHandler('Lesson not found', 404));
    }

    const lesson = mockLessons[lessonIndex];
    const completedLessons = progress?.completedLessons || [];
    
    // Check access permissions
    const isAccessible = lesson.isPreview || 
                        lessonIndex === 0 || 
                        completedLessons.includes(mockLessons[lessonIndex - 1]._id);

    if (!isAccessible) {
      return next(new ErrorHandler('Complete previous lessons to access this content', 403));
    }

    const lessonData: LessonWithAccess = {
      _id: lessonId,
      courseId,
      title: `Lesson ${lesson.order}: Sample Title`,
      description: 'Sample lesson description',
      videoUrl: `https://res.cloudinary.com/demo/video/upload/lesson${lesson.order}.mp4`,
      duration: 600 + (lesson.order * 300), // Variable duration
      order: lesson.order,
      isPreview: lesson.isPreview,
      materials: [],
      isAccessible: true,
      userProgress: {
        isCompleted: completedLessons.includes(lessonId),
        timeWatched: completedLessons.includes(lessonId) ? 600 : 0,
        lastPosition: 0
      },
      nextLessonId: lessonIndex < mockLessons.length - 1 ? mockLessons[lessonIndex + 1]._id : undefined,
      previousLessonId: lessonIndex > 0 ? mockLessons[lessonIndex - 1]._id : undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.status(200).json({
      success: true,
      message: 'Lesson retrieved successfully',
      data: lessonData
    });

  } catch (error: any) {
    next(error);
  }
};

// Update lesson progress
export const updateLessonProgress = async (
  req: Request<{ courseId: string; lessonId: string }, {}, ProgressUpdateRequest>, 
  res: Response<ApiResponse>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { courseId, lessonId } = req.params;
    const { timeWatched, currentPosition, isCompleted } = req.body;

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
        $inc: { timeSpent: Math.round(timeWatched / 60) } // Convert to minutes
      },
      { new: true, upsert: true }
    );

    // Calculate progress percentage
    const totalLessons = 4; // Mock total lessons
    const completedCount = progress.completedLessons.length;
    const progressPercentage = Math.round((completedCount / totalLessons) * 100);

    await ProgressModel.findByIdAndUpdate(progress._id, {
      progressPercentage,
      isCompleted: progressPercentage >= 100,
      completedAt: progressPercentage >= 100 ? new Date() : undefined
    });

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data: {
        progressPercentage,
        completedLessons: completedCount,
        totalLessons
      }
    });

  } catch (error: any) {
    next(error);
  }
};

// Mark lesson as completed
export const completeLesson = async (
  req: Request<{ courseId: string; lessonId: string }>, 
  res: Response<ApiResponse>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { courseId, lessonId } = req.params;

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

    // Mark lesson as completed
    const progress = await ProgressModel.findOneAndUpdate(
      { userId: req.user._id, courseId },
      {
        $addToSet: { completedLessons: lessonId },
        $set: {
          currentLesson: lessonId,
          lastAccessed: new Date()
        }
      },
      { new: true, upsert: true }
    );

    // Update progress percentage
    const totalLessons = 4; // Mock total lessons
    const completedCount = progress.completedLessons.length;
    const progressPercentage = Math.round((completedCount / totalLessons) * 100);

    await ProgressModel.findByIdAndUpdate(progress._id, {
      progressPercentage,
      isCompleted: progressPercentage >= 100,
      completedAt: progressPercentage >= 100 ? new Date() : undefined
    });

    res.status(200).json({
      success: true,
      message: 'Lesson marked as completed',
      data: {
        progressPercentage,
        completedLessons: completedCount,
        isCompleted: progressPercentage >= 100
      }
    });

  } catch (error: any) {
    next(error);
  }
};

// Get course progress summary
export const getCourseProgress = async (
  req: Request<{ courseId: string }>, 
  res: Response<ApiResponse<CourseProgress>>, 
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
      return next(new ErrorHandler('Progress not found', 404));
    }

    // Mock lesson progress data
    const lessonsProgress = progress.completedLessons.map(lessonId => ({
      lessonId,
      isCompleted: true,
      timeWatched: 600, // Mock time
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