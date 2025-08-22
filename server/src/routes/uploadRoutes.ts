import { Router } from 'express';
import { uploadDocument, getUserContent, deleteContent } from '../controllers/uploadController';
import { authMiddleware } from '../middleware/authMiddleware';
import { uploadSingle } from '../middleware/uploadMiddleware';

const router = Router();

// All upload routes require authentication
router.use(authMiddleware);

// Note: Multer middleware will be added when implementing actual file upload
router.post('/document', uploadSingle, uploadDocument);
router.get('/my-content', getUserContent);
router.delete('/:id', deleteContent);

export default router;