import { Router } from 'express';
import { 
  getInstructorDashboard, 
  getInstructorCourses, 
  getCourseAnalytics, 
  getInstructorStudents, 
  getInstructorEarnings,
  publishCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourse
} from '../controllers/instructorController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { UserRole } from '../../../types/shared';

const router = Router();

// All instructor routes require authentication and instructor role
router.use(authMiddleware);
router.use(roleMiddleware(UserRole.INSTRUCTOR));

// Instructor dashboard routes
router.get('/dashboard', getInstructorDashboard);
router.get('/courses', getInstructorCourses);
router.get('/students', getInstructorStudents);
router.get('/earnings', getInstructorEarnings);
router.get('/analytics/:courseId', getCourseAnalytics);

// Course CRUD operations
router.post('/courses', createCourse);
router.get('/courses/:courseId', getCourse);
router.put('/courses/:courseId', updateCourse);
router.delete('/courses/:courseId', deleteCourse);
router.post('/courses/:courseId/publish', publishCourse);

export default router;