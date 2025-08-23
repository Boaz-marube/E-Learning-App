import mongoose, { Document, Schema } from 'mongoose';
import { Notification } from '../../../types';

export interface INotification extends Document, Omit<Notification, '_id' | 'userId'> {
  userId: mongoose.Types.ObjectId;
}

const notificationSchema = new Schema<INotification>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  relatedId: {
    type: String,
    trim: true
  },
  relatedType: {
    type: String,
    enum: ['course', 'enrollment', 'quiz', 'general'],
    default: 'general'
  }
}, { timestamps: true });

// Index for efficient queries
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });

export default mongoose.model<INotification>('Notification', notificationSchema);