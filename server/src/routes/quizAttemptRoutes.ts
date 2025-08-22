import { Router } from 'express';
import { 
  submitQuizAttempt, 
  getUserQuizAttempts 
} from '../controllers/quizController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// All quiz attempt routes require authentication
router.use(authMiddleware);

// Quiz attempt routes
router.post('/', submitQuizAttempt); // POST /api/quiz-attempts
router.get('/:quizId', getUserQuizAttempts); // GET /api/quiz-attempts/:quizId

export default router;