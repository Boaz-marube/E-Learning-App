import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../../types/shared';
import ErrorHandler from '../utils/errorHandler';

export const roleMiddleware = (...roles: UserRole[]) => {
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

// Specific role middlewares using enum
export const studentOnly = roleMiddleware(UserRole.STUDENT);
export const instructorOnly = roleMiddleware(UserRole.INSTRUCTOR);
export const adminOnly = roleMiddleware(UserRole.ADMIN);
export const instructorOrAdmin = roleMiddleware(UserRole.INSTRUCTOR, UserRole.ADMIN);
