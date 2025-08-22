import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import NotificationModel from '../models/notificationModel';
import { ApiResponse, Notification } from '../../../types/shared';
import ErrorHandler from '../utils/errorHandler';

// Get user notifications
export const getUserNotifications = async (
  req: Request, 
  res: Response<ApiResponse<Notification[]>>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { page = 1, limit = 20, unreadOnly } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: any = { userId: req.user._id };
    if (unreadOnly === 'true') {
      filter.isRead = false;
    }

    const notifications = await NotificationModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Transform to shared type format
    const notificationData: Notification[] = notifications.map(notification => ({
      _id: (notification._id as Types.ObjectId).toString(),
      userId: (notification.userId as Types.ObjectId).toString(),
      title: notification.title,
      message: notification.message,
      type: notification.type,
      isRead: notification.isRead,
      relatedId: notification.relatedId,
      relatedType: notification.relatedType,
      createdAt: notification.createdAt
    }));

    res.status(200).json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: notificationData
    });

  } catch (error: any) {
    next(error);
  }
};

// Mark notification as read
export const markNotificationAsRead = async (
  req: Request<{ id: string }>, 
  res: Response<ApiResponse>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler('Invalid notification ID', 400));
    }

    const notification = await NotificationModel.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return next(new ErrorHandler('Notification not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error: any) {
    next(error);
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (
  req: Request, 
  res: Response<ApiResponse>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    await NotificationModel.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });

  } catch (error: any) {
    next(error);
  }
};

// Get unread notification count
export const getUnreadCount = async (
  req: Request, 
  res: Response<ApiResponse<{ count: number }>>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const count = await NotificationModel.countDocuments({
      userId: req.user._id,
      isRead: false
    });

    res.status(200).json({
      success: true,
      message: 'Unread count retrieved successfully',
      data: { count }
    });

  } catch (error: any) {
    next(error);
  }
};

// Delete notification
export const deleteNotification = async (
  req: Request<{ id: string }>, 
  res: Response<ApiResponse>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler('Invalid notification ID', 400));
    }

    const notification = await NotificationModel.findOneAndDelete({
      _id: id,
      userId: req.user._id
    });

    if (!notification) {
      return next(new ErrorHandler('Notification not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });

  } catch (error: any) {
    next(error);
  }
};
