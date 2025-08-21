import { Router } from 'express';
import { signup, login, resetPassword } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/reset-password', resetPassword);

// Protected route example (get current user profile)
router.get('/profile', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Profile retrieved successfully',
    data: req.user
  });
});

export default router;
