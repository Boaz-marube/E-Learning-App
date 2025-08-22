import { Router } from 'express';
import { signup, login, resetPassword,getUserCourses } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/roleMiddleware';

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

// using role middleware
router.get('/admin-only', authMiddleware, adminOnly, (req, res) => {
    res.json({ message: 'Admin access granted' });
  });

router.get('/courses', authMiddleware, getUserCourses);
export default router;
