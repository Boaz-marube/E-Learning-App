import { Router } from 'express';
import { 
  enrollInCourse, 
  getEnrollmentStatus, 
  getMyEnrollments, 
  unenrollFromCourse, 
  getEnrollmentStats 
} from '../controllers/enrollmentController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { UserRole } from '../../../types';

const router = Router();

// All enrollment routes require authentication
router.use(authMiddleware);

// Student enrollment routes
router.post('/:courseId', enrollInCourse);
router.get('/status/:courseId', getEnrollmentStatus);
router.get('/my-courses', getMyEnrollments);
router.delete('/:courseId', unenrollFromCourse);

// Instructor enrollment analytics
router.get('/stats/:courseId', roleMiddleware(UserRole.INSTRUCTOR), getEnrollmentStats);

export default router;