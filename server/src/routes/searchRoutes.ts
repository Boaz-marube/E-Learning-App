import { Router } from 'express';
import { searchCourses, getSearchSuggestions } from '../controllers/searchController';

const router = Router();

// Public search routes
router.get('/courses', searchCourses);
router.get('/suggestions', getSearchSuggestions);

export default router;
