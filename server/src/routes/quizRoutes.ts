import { Router } from 'express';
import { 
  getQuizByLesson, 
  createQuiz, 
  submitQuizAttempt, 
  getUserQuizAttempts 
} from '../controllers/quizController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { UserRole } from '../../../types';

const router = Router();

// All quiz routes require authentication
router.use(authMiddleware);

// Quiz management routes
router.get('/:lessonId', getQuizByLesson); // GET /api/quizzes/:lessonId
router.post('/', roleMiddleware(UserRole.INSTRUCTOR), createQuiz); // POST /api/quizzes

export default router;