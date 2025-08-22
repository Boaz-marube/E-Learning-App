import { Router } from 'express';
import { 
  updateLessonProgress, 
  getCourseProgress, 
  updateCourseProgress 
} from '../controllers/progressController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateProgressUpdate, verifyEnrollment } from '../middleware/progressMiddleware';

const router = Router();

// All progress routes require authentication
router.use(authMiddleware);

// Progress tracking APIs 
router.post('/lesson', validateProgressUpdate, updateLessonProgress);
router.get('/course/:id', verifyEnrollment, getCourseProgress);
router.put('/course/:id', verifyEnrollment, updateCourseProgress);

export default router;