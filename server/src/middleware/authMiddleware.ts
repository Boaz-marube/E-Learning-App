import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import UserModel from '../models/userModel';
import ErrorHandler from '../utils/errorHandler';
import { Types } from 'mongoose';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        name: string;
        email: string;
        role: string;
        isVerified: boolean;
      };
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return next(new ErrorHandler('Access denied. No token provided', 401));
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Get user from database
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return next(new ErrorHandler('Token is valid but user not found', 401));
    }

    // Add user to request object
    req.user = {
      _id: (user._id as Types.ObjectId).toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified
    };

    next();
  } catch (error: any) {
    next(error);
  }
};

export const roleMiddleware = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler(`Access denied. Required role: ${roles.join(' or ')}`, 403));
    }

    next();
  };
};

// Specific role middlewares for convenience
export const studentOnly = roleMiddleware('student');
export const instructorOnly = roleMiddleware('instructor');
export const adminOnly = roleMiddleware('admin');
