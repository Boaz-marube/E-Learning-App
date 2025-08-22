import { Router } from 'express';
import { getContentById, getCourseContent, getPublicContent, getDemoLesson } from '../controllers/contentController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/public', getPublicContent);
router.get('/demo-lesson', getDemoLesson); // Hardcoded demo video

// Protected routes
router.get('/:id', authMiddleware, getContentById);
router.get('/course/:courseId', authMiddleware, getCourseContent);

export default router;
