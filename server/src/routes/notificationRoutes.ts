import { Router } from 'express';
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  getUnreadCount, 
  deleteNotification 
} from '../controllers/notificationController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// All notification routes require authentication
router.use(authMiddleware);

router.get('/', getUserNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/:id/read', markNotificationAsRead);
router.put('/mark-all-read', markAllNotificationsAsRead);
router.delete('/:id', deleteNotification);

export default router;
