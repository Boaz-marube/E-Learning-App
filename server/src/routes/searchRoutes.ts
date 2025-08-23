import { Router } from 'express';
import { searchCourses } from '../controllers/searchController';

const router = Router();

// Search courses
router.get('/courses', searchCourses);

export default router;