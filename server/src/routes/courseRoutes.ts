import { Router } from 'express';
import { 
  getCourses, 
  getCourseById, 
  createCourse, 
  updateCourse, 
  deleteCourse 
} from '../controllers/courseController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { UserRole } from '../../../types/shared';

const router = Router();

// Public routes (no authentication required)
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Protected routes (instructor only)
router.post('/', authMiddleware, roleMiddleware(UserRole.INSTRUCTOR), createCourse);
router.put('/:id', authMiddleware, roleMiddleware(UserRole.INSTRUCTOR), updateCourse);
router.delete('/:id', authMiddleware, roleMiddleware(UserRole.INSTRUCTOR), deleteCourse);

export default router;