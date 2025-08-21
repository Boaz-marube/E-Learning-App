import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import CourseModel from '../models/courseModel';
import TestimonialModel from '../models/testimonialModel';
import EnrollmentModel from '../models/enrollmentModel';
import UserModel from '../models/userModel';
import { ApiResponse, Course, Testimonial, PlatformStats, UserRole } from '../../../types/shared';
import ErrorHandler from '../utils/errorHandler';

// Get featured courses for homepage
export const getFeaturedCourses = async (req: Request, res: Response<ApiResponse<Course[]>>, next: NextFunction) => {
  try {
    const featuredCourses = await CourseModel.find({ 
      isFeatured: true, 
      isPublished: true 
    })
    .populate('instructor', 'name email')
    .limit(6)
    .sort({ createdAt: -1 });

    const courses: Course[] = featuredCourses.map(course => ({
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

    res.status(200).json({
      success: true,
      message: 'Featured courses retrieved successfully',
      data: courses
    });
  } catch (error: any) {
    next(error);
  }
};

// Get testimonials for homepage
export const getTestimonials = async (req: Request, res: Response<ApiResponse<Testimonial[]>>, next: NextFunction) => {
  try {
    const testimonials = await TestimonialModel.find({ isActive: true })
      .limit(10)
      .sort({ createdAt: -1 });

    const testimonialData: Testimonial[] = testimonials.map(testimonial => ({
      _id: (testimonial._id as Types.ObjectId).toString(),
      name: testimonial.name,
      role: testimonial.role,
      message: testimonial.message,
      rating: testimonial.rating,
      avatar: testimonial.avatar,
      courseTitle: testimonial.courseTitle,
      isActive: testimonial.isActive,
      createdAt: testimonial.createdAt
    }));

    res.status(200).json({
      success: true,
      message: 'Testimonials retrieved successfully',
      data: testimonialData
    });
  } catch (error: any) {
    next(error);
  }
};

// Get platform statistics
export const getPlatformStats = async (req: Request, res: Response<ApiResponse<PlatformStats>>, next: NextFunction) => {
  try {
    const [totalCourses, totalStudents, totalInstructors, totalEnrollments] = await Promise.all([
      CourseModel.countDocuments({ isPublished: true }),
      UserModel.countDocuments({ role: UserRole.STUDENT }),
      UserModel.countDocuments({ role: UserRole.INSTRUCTOR }),
      EnrollmentModel.countDocuments({ isActive: true })
    ]);

    const stats: PlatformStats = {
      totalCourses,
      totalStudents,
      totalInstructors,
      totalEnrollments
    };

    res.status(200).json({
      success: true,
      message: 'Platform statistics retrieved successfully',
      data: stats
    });
  } catch (error: any) {
    next(error);
  }
};
