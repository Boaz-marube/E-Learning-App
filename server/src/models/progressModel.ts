import mongoose, { Document, Schema } from 'mongoose';
import { Progress } from '../../../types';

export interface IProgress extends Document, Omit<Progress, '_id' | 'userId' | 'courseId'> {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
}

const progressSchema = new Schema<IProgress>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completedLessons: [{
    type: String,
    trim: true
  }],
  currentLesson: {
    type: String,
    trim: true
  },
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  timeSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  }
}, { timestamps: true });

// Compound index to ensure one progress record per user per course
progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Index for efficient queries
progressSchema.index({ userId: 1, lastAccessed: -1 });
progressSchema.index({ userId: 1, isCompleted: 1 });

export default mongoose.model<IProgress>('Progress', progressSchema);