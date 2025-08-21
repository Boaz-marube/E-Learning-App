import { Router } from 'express';
import { getFeaturedCourses, getTestimonials, getPlatformStats } from '../controllers/landingController';

const router = Router();

// Public routes for landing page
router.get('/courses/featured', getFeaturedCourses);
router.get('/testimonials', getTestimonials);
router.get('/platform/stats', getPlatformStats);

export default router;
