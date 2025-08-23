import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/userModel';
import { generateToken } from '../utils/jwt';
import { ApiResponse, AuthResponse, UserRole } from '../../../types';
import ErrorHandler from '../utils/errorHandler';
import CourseModel from '../models/courseModel';
import EnrollmentModel from '../models/enrollmentModel';
import { Course } from '../../../types';
import { Types } from 'mongoose';

interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

interface LoginRequest {
  email: string;
  password: string;
}

export const signup = async (req: Request<{}, AuthResponse, SignupRequest>, res: Response<AuthResponse>, next: NextFunction) => {
  try {
    const { name, email, password, role = UserRole.STUDENT } = req.body;

    // Check if user exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler('User already exists with this email', 400));
    }

    // Create user
    const user = await UserModel.create({
      name,
      email,
      password,
      role
    });

    // Generate token
    const token = generateToken((user._id as Types.ObjectId).toString());

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        _id: (user._id as Types.ObjectId).toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        courses: user.courses
      },
      token
    });
  } catch (error: any) {
    next(error);
  }
};

export const login = async (req: Request<{}, AuthResponse, LoginRequest>, res: Response<AuthResponse>, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await UserModel.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorHandler('Invalid email or password', 401));
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(new ErrorHandler('Invalid email or password', 401));
    }

    // Generate token
    const token = generateToken((user._id as Types.ObjectId).toString());

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        _id: (user._id as Types.ObjectId).toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        courses: user.courses
      },
      token
    });
  } catch (error: any) {
    next(error);
  }
};

export const resetPassword = async (req: Request<{}, ApiResponse, { email: string }>, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return next(new ErrorHandler('User not found with this email', 404));
    }

    // TODO: Implement email sending logic here
    res.status(200).json({
      success: true,
      message: 'Password reset instructions sent to your email'
    });
  } catch (error: any) {
    next(error);
  }
};

// Get user's courses (enrolled for students, created for instructors)
export const getUserCourses = async (
  req: Request, 
  res: Response<ApiResponse<Course[]>>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    let courses;

    if (req.user.role === UserRole.STUDENT) {
      // For students: Get enrolled courses
      const enrollments = await EnrollmentModel.find({ 
        userId: req.user._id, 
        isActive: true 
      }).populate({
        path: 'courseId',
        populate: {
          path: 'instructor',
          select: 'name email'
        }
      });

      courses = enrollments
        .filter(enrollment => enrollment.courseId) // Filter out null courseId
        .map(enrollment => enrollment.courseId);

    } else if (req.user.role === UserRole.INSTRUCTOR) {
      // For instructors: Get created courses
      courses = await CourseModel.find({ 
        instructor: req.user._id 
      }).populate('instructor', 'name email');

    } else {
      return next(new ErrorHandler('Invalid user role', 403));
    }

    if (!courses || courses.length === 0) {
      return res.status(200).json({
        success: true,
        message: req.user.role === UserRole.STUDENT ? 'No enrolled courses found' : 'No created courses found',
        data: []
      });
    }

    // Transform to shared type format
    const courseData: Course[] = courses.map((course: any) => ({
      _id: (course._id as Types.ObjectId).toString(),
      title: course.title,
      description: course.description,
      instructor: (course.instructor._id as Types.ObjectId).toString(),
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
      message: `${req.user.role === UserRole.STUDENT ? 'Enrolled' : 'Created'} courses retrieved successfully`,
      data: courseData
    });

  } catch (error: any) {
    next(error);
  }
};