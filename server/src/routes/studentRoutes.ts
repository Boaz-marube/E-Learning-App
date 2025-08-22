import { Router } from 'express';
import { 
  getStudentDashboard, 
  getEnrolledCourses, 
  getCourseProgress, 
  getStudentAchievements, 
  updateCourseProgress,
  getStudentActivity
} from '../controllers/studentController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { UserRole } from '../../../types/shared';

const router = Router();

// All student routes require authentication and student role
router.use(authMiddleware);
router.use(roleMiddleware(UserRole.STUDENT));

// Student dashboard routes
router.get('/dashboard', getStudentDashboard);
router.get('/enrolled-courses', getEnrolledCourses);
router.get('/achievements', getStudentAchievements);
router.get('/activity', getStudentActivity);
router.get('/progress/:courseId', getCourseProgress);
router.put('/progress/:courseId', updateCourseProgress);

export default router;
