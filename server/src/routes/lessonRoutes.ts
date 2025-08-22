import { Router } from 'express';
import { 
  getCourseLessons, 
  getLesson, 
  updateLessonProgress, 
  completeLesson, 
  getCourseProgress 
} from '../controllers/lessonController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// All lesson routes require authentication
router.use(authMiddleware);

// Lesson player routes (enrolled students only)
router.get('/:courseId', getCourseLessons);
router.get('/:courseId/progress', getCourseProgress);
router.get('/:courseId/:lessonId', getLesson);
router.post('/:courseId/:lessonId/progress', updateLessonProgress);
router.post('/:courseId/:lessonId/complete', completeLesson);

export default router;