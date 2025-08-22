import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import CourseModel from '../models/courseModel';
import EnrollmentModel from '../models/enrollmentModel';
import ProgressModel from '../models/progressModel';
import UserModel from '../models/userModel';
import LessonModel from '../models/lessonModel';
import { 
  ApiResponse, 
  InstructorDashboardStats, 
  CourseAnalytics, 
  InstructorEarnings, 
  InstructorStudent,
  UserRole 
} from '../../../types/shared';
import ErrorHandler from '../utils/errorHandler';

// Get instructor dashboard overview
export const getInstructorDashboard = async (
  req: Request, 
  res: Response<ApiResponse<InstructorDashboardStats>>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const instructorId = req.user._id;

    // Get instructor's courses
    const courses = await CourseModel.find({ instructor: instructorId });
    const courseIds = courses.map(course => course._id);

    // Get enrollment stats
    const [enrollments, progressRecords] = await Promise.all([
      EnrollmentModel.find({ courseId: { $in: courseIds }, isActive: true })
        .populate('userId', 'name')
        .populate('courseId', 'title'),
      ProgressModel.find({ courseId: { $in: courseIds } })
    ]);

    const totalStudentsEnrolled = enrollments.length;
    const completedStudents = progressRecords.filter(p => p.isCompleted).length;
    const completionRate = totalStudentsEnrolled > 0 
      ? Math.round((completedStudents / totalStudentsEnrolled) * 100) 
      : 0;

    // Calculate revenue (price * enrollments)
    const totalRevenue = enrollments.reduce((sum, enrollment) => {
      const course = enrollment.courseId as any;
      return sum + (course.price || 0);
    }, 0);

    // Calculate average rating
    const averageRating = courses.length > 0
      ? Math.round((courses.reduce((sum, course) => sum + course.rating, 0) / courses.length) * 10) / 10
      : 0;

    // Recent enrollments (last 5)
    const recentEnrollments = enrollments
      .sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime())
      .slice(0, 5)
      .map(enrollment => ({
        studentName: (enrollment.userId as any).name,
        courseTitle: (enrollment.courseId as any).title,
        enrolledAt: enrollment.enrolledAt
      }));

    // Top performing courses
    const courseStats = courses.map(course => {
      const courseEnrollments = enrollments.filter(e => 
        (e.courseId as any)._id.toString() === (course._id as Types.ObjectId).toString()
      );
      return {
        courseTitle: course.title,
        enrollmentCount: courseEnrollments.length,
        rating: course.rating,
        revenue: courseEnrollments.length * course.price
      };
    }).sort((a, b) => b.enrollmentCount - a.enrollmentCount).slice(0, 3);

    const dashboardStats: InstructorDashboardStats = {
      totalCoursesCreated: courses.length,
      totalStudentsEnrolled,
      totalRevenue,
      averageRating,
      completionRate,
      recentEnrollments,
      topPerformingCourses: courseStats
    };

    res.status(200).json({
      success: true,
      message: 'Instructor dashboard data retrieved successfully',
      data: dashboardStats
    });

  } catch (error: any) {
    next(error);
  }
};

// Get instructor's courses with basic analytics
export const getInstructorCourses = async (
  req: Request, 
  res: Response<ApiResponse<any[]>>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const courses = await CourseModel.find({ instructor: req.user._id });

    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const enrollments = await EnrollmentModel.countDocuments({ 
          courseId: course._id, 
          isActive: true 
        });
        
        const progressRecords = await ProgressModel.find({ courseId: course._id });
        const completedCount = progressRecords.filter(p => p.isCompleted).length;
        const averageProgress = progressRecords.length > 0
          ? Math.round(progressRecords.reduce((sum, p) => sum + p.progressPercentage, 0) / progressRecords.length)
          : 0;

        return {
          _id: (course._id as Types.ObjectId).toString(),
          title: course.title,
          description: course.description,
          thumbnail: course.thumbnail,
          price: course.price,
          level: course.level,
          isPublished: course.isPublished,
          isFeatured: course.isFeatured,
          rating: course.rating,
          createdAt: course.createdAt,
          analytics: {
            totalEnrollments: enrollments,
            completedStudents: completedCount,
            averageProgress,
            revenue: enrollments * course.price
          }
        };
      })
    );

    res.status(200).json({
      success: true,
      message: 'Instructor courses retrieved successfully',
      data: coursesWithStats
    });

  } catch (error: any) {
    next(error);
  }
};

// Get detailed course analytics
export const getCourseAnalytics = async (
  req: Request<{ courseId: string }>, 
  res: Response<ApiResponse<CourseAnalytics>>, 
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

    // Get analytics data
    const [enrollments, progressRecords] = await Promise.all([
      EnrollmentModel.find({ courseId, isActive: true }),
      ProgressModel.find({ courseId })
    ]);

    const totalEnrollments = enrollments.length;
    const activeStudents = progressRecords.filter(p => !p.isCompleted).length;
    const completedStudents = progressRecords.filter(p => p.isCompleted).length;
    const averageProgress = progressRecords.length > 0
      ? Math.round(progressRecords.reduce((sum, p) => sum + p.progressPercentage, 0) / progressRecords.length)
      : 0;
    const averageTimeSpent = progressRecords.length > 0
      ? Math.round(progressRecords.reduce((sum, p) => sum + p.timeSpent, 0) / progressRecords.length)
      : 0;
    const completionRate = totalEnrollments > 0
      ? Math.round((completedStudents / totalEnrollments) * 100)
      : 0;

    // Mock enrollment trend (in real app, you'd group by month)
    const enrollmentTrend = [
      { month: 'Jan', enrollments: Math.floor(totalEnrollments * 0.1) },
      { month: 'Feb', enrollments: Math.floor(totalEnrollments * 0.2) },
      { month: 'Mar', enrollments: Math.floor(totalEnrollments * 0.3) },
      { month: 'Apr', enrollments: Math.floor(totalEnrollments * 0.4) }
    ];

    const analytics: CourseAnalytics = {
      courseId: (course._id as Types.ObjectId).toString(),
      courseTitle: course.title,
      totalEnrollments,
      activeStudents,
      completedStudents,
      averageProgress,
      averageTimeSpent,
      completionRate,
      rating: course.rating,
      revenue: totalEnrollments * course.price,
      enrollmentTrend
    };

    res.status(200).json({
      success: true,
      message: 'Course analytics retrieved successfully',
      data: analytics
    });

  } catch (error: any) {
    next(error);
  }
};

// Get instructor's students
export const getInstructorStudents = async (
  req: Request, 
  res: Response<ApiResponse<InstructorStudent[]>>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    // Get instructor's courses
    const courses = await CourseModel.find({ instructor: req.user._id });
    const courseIds = courses.map(course => course._id);

    // Get enrollments for instructor's courses
    const enrollments = await EnrollmentModel.find({ 
      courseId: { $in: courseIds }, 
      isActive: true 
    })
    .populate('userId', 'name email')
    .populate('courseId', 'title');

    // Group by student
    const studentMap = new Map();

    for (const enrollment of enrollments) {
      const student = enrollment.userId as any;
      const course = enrollment.courseId as any;
      
      if (!studentMap.has(student._id.toString())) {
        studentMap.set(student._id.toString(), {
          _id: student._id.toString(),
          name: student.name,
          email: student.email,
          enrolledCourses: [],
          totalCoursesEnrolled: 0,
          averageProgress: 0
        });
      }

      // Get progress for this enrollment
      const progress = await ProgressModel.findOne({
        userId: student._id,
        courseId: course._id
      });

      const studentData = studentMap.get(student._id.toString());
      studentData.enrolledCourses.push({
        courseId: course._id.toString(),
        courseTitle: course.title,
        enrolledAt: enrollment.enrolledAt,
        progress: progress ? progress.progressPercentage : 0,
        isCompleted: progress ? progress.isCompleted : false
      });
    }

    // Calculate averages
    const students: InstructorStudent[] = Array.from(studentMap.values()).map(student => {
      student.totalCoursesEnrolled = student.enrolledCourses.length;
      student.averageProgress = student.enrolledCourses.length > 0
        ? Math.round(student.enrolledCourses.reduce((sum: number, course: any) => sum + course.progress, 0) / student.enrolledCourses.length)
        : 0;
      return student;
    });

    res.status(200).json({
      success: true,
      message: 'Instructor students retrieved successfully',
      data: students
    });

  } catch (error: any) {
    next(error);
  }
};

// Get instructor earnings
export const getInstructorEarnings = async (
  req: Request, 
  res: Response<ApiResponse<InstructorEarnings>>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    // Get instructor's courses
    const courses = await CourseModel.find({ instructor: req.user._id });
    const courseIds = courses.map(course => course._id);

    // Get all enrollments
    const enrollments = await EnrollmentModel.find({ 
      courseId: { $in: courseIds }, 
      isActive: true 
    }).populate('courseId', 'title price');

    const totalRevenue = enrollments.reduce((sum, enrollment) => {
      const course = enrollment.courseId as any;
      return sum + (course.price || 0);
    }, 0);

    // Mock monthly revenue (in real app, you'd group by month)
    const currentMonth = new Date().getMonth();
    const monthlyRevenue = Math.floor(totalRevenue * 0.3); // Assume 30% this month

    // Mock revenue by month
    const revenueByMonth = [
      { month: 'Jan', revenue: Math.floor(totalRevenue * 0.1) },
      { month: 'Feb', revenue: Math.floor(totalRevenue * 0.15) },
      { month: 'Mar', revenue: Math.floor(totalRevenue * 0.25) },
      { month: 'Apr', revenue: monthlyRevenue }
    ];

    // Top earning courses
    const courseRevenue = courses.map(course => {
      const courseEnrollments = enrollments.filter(e => 
        (e.courseId as any)._id.toString() === (course._id as Types.ObjectId).toString()
      );
      return {
        courseTitle: course.title,
        revenue: courseEnrollments.length * course.price,
        enrollments: courseEnrollments.length
      };
    }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    const earnings: InstructorEarnings = {
      totalRevenue,
      monthlyRevenue,
      pendingPayouts: Math.floor(totalRevenue * 0.2), // Mock 20% pending
      completedPayouts: Math.floor(totalRevenue * 0.8), // Mock 80% completed
      revenueByMonth,
      topEarningCourses: courseRevenue
    };

    res.status(200).json({
      success: true,
      message: 'Instructor earnings retrieved successfully',
      data: earnings
    });

  } catch (error: any) {
    next(error);
  }
};

// Publish/unpublish course
export const publishCourse = async (
  req: Request<{ courseId: string }>, 
  res: Response<ApiResponse>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { courseId } = req.params;
    const { isPublished } = req.body;

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

    // Update publish status
    await CourseModel.findByIdAndUpdate(courseId, { 
      isPublished: Boolean(isPublished) 
    });

    res.status(200).json({
      success: true,
      message: `Course ${isPublished ? 'published' : 'unpublished'} successfully`
    });

  } catch (error: any) {
    next(error);
  }
};

// Create new course
export const createCourse = async (
  req: Request, 
  res: Response<ApiResponse>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { title, description, price, level, thumbnail } = req.body;

    if (!title || !description) {
      return next(new ErrorHandler('Title and description are required', 400));
    }

    const course = await CourseModel.create({
      title,
      description,
      instructor: req.user._id,
      price: price || 0,
      level: level || 'beginner',
      thumbnail: thumbnail || '',
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
        title: course.title,
        description: course.description
      }
    });

  } catch (error: any) {
    next(error);
  }
};

// Update course
export const updateCourse = async (
  req: Request<{ courseId: string }>, 
  res: Response<ApiResponse>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { courseId } = req.params;
    const { title, description, price, level, thumbnail, isFeatured } = req.body;

    if (!Types.ObjectId.isValid(courseId)) {
      return next(new ErrorHandler('Invalid course ID', 400));
    }

    const course = await CourseModel.findOneAndUpdate(
      { _id: courseId, instructor: req.user._id },
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(price !== undefined && { price }),
        ...(level && { level }),
        ...(thumbnail && { thumbnail }),
        ...(isFeatured !== undefined && { isFeatured })
      },
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

// Delete course
export const deleteCourse = async (
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

    // Check if course has enrollments
    const enrollmentCount = await EnrollmentModel.countDocuments({ 
      courseId, 
      isActive: true 
    });

    if (enrollmentCount > 0) {
      return next(new ErrorHandler('Cannot delete course with active enrollments', 400));
    }

    const course = await CourseModel.findOneAndDelete({
      _id: courseId,
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

// Get single course
export const getCourse = async (
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

    const course = await CourseModel.findOne({ 
      _id: courseId, 
      instructor: req.user._id 
    });

    if (!course) {
      return next(new ErrorHandler('Course not found or unauthorized', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Course retrieved successfully',
      data: {
        _id: (course._id as Types.ObjectId).toString(),
        title: course.title,
        description: course.description,
        price: course.price,
        level: course.level,
        thumbnail: course.thumbnail,
        isPublished: course.isPublished,
        isFeatured: course.isFeatured,
        enrollmentCount: course.enrollmentCount,
        rating: course.rating
      }
    });

  } catch (error: any) {
    next(error);
  }
};

// Create lesson for course
export const createLesson = async (
  req: Request<{ courseId: string }>, 
  res: Response<ApiResponse>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { courseId } = req.params;
    const { title, description, videoUrl, duration, order, isPreview, materials } = req.body;

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

    if (!title || !duration || !order) {
      return next(new ErrorHandler('Title, duration, and order are required', 400));
    }

    const lesson = await LessonModel.create({
      courseId,
      title,
      description: description || '',
      videoUrl: videoUrl || '',
      duration,
      order,
      isPreview: isPreview || false,
      materials: materials || []
    });

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: {
        _id: (lesson._id as Types.ObjectId).toString(),
        title: lesson.title,
        order: lesson.order
      }
    });

  } catch (error: any) {
    if (error.code === 11000) {
      return next(new ErrorHandler('Lesson order already exists for this course', 400));
    }
    next(error);
  }
};

// Get course lessons (instructor)
export const getCourseLessonsForInstructor = async (
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

    // Verify course ownership
    const course = await CourseModel.findOne({ 
      _id: courseId, 
      instructor: req.user._id 
    });

    if (!course) {
      return next(new ErrorHandler('Course not found or unauthorized', 404));
    }

    const lessons = await LessonModel.find({ courseId })
      .sort({ order: 1 })
      .select('title description duration order isPreview createdAt');

    res.status(200).json({
      success: true,
      message: 'Course lessons retrieved successfully',
      data: lessons
    });

  } catch (error: any) {
    next(error);
  }
};

// Update lesson
export const updateLesson = async (
  req: Request<{ courseId: string; lessonId: string }>, 
  res: Response<ApiResponse>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { courseId, lessonId } = req.params;

    if (!Types.ObjectId.isValid(courseId) || !Types.ObjectId.isValid(lessonId)) {
      return next(new ErrorHandler('Invalid course or lesson ID', 400));
    }

    // Verify course ownership
    const course = await CourseModel.findOne({ 
      _id: courseId, 
      instructor: req.user._id 
    });

    if (!course) {
      return next(new ErrorHandler('Course not found or unauthorized', 404));
    }

    const lesson = await LessonModel.findOneAndUpdate(
      { _id: lessonId, courseId },
      { ...req.body },
      { new: true }
    );

    if (!lesson) {
      return next(new ErrorHandler('Lesson not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Lesson updated successfully'
    });

  } catch (error: any) {
    next(error);
  }
};

// Delete lesson
export const deleteLesson = async (
  req: Request<{ courseId: string; lessonId: string }>, 
  res: Response<ApiResponse>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { courseId, lessonId } = req.params;

    if (!Types.ObjectId.isValid(courseId) || !Types.ObjectId.isValid(lessonId)) {
      return next(new ErrorHandler('Invalid course or lesson ID', 400));
    }

    // Verify course ownership
    const course = await CourseModel.findOne({ 
      _id: courseId, 
      instructor: req.user._id 
    });

    if (!course) {
      return next(new ErrorHandler('Course not found or unauthorized', 404));
    }

    const lesson = await LessonModel.findOneAndDelete({ 
      _id: lessonId, 
      courseId 
    });

    if (!lesson) {
      return next(new ErrorHandler('Lesson not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully'
    });

  } catch (error: any) {
    next(error);
  }
};
