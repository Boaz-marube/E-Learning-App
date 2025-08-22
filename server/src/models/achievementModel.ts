import mongoose, { Document, Schema } from 'mongoose';
import { Achievement } from '../../../types/shared';

export interface IAchievement extends Document, Omit<Achievement, '_id' | 'userId' | 'courseId'> {
  userId: mongoose.Types.ObjectId;
  courseId?: mongoose.Types.ObjectId;
}

const achievementSchema = new Schema<IAchievement>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  },
  type: {
    type: String,
    enum: ['course_completion', 'quiz_master', 'streak', 'first_course', 'fast_learner', 'course_creator', 'top_instructor', 'student_milestone'],
    required: true
  },
  title: {
    type: String,
    required: [true, 'Achievement title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Achievement description is required'],
    trim: true
  },
  badgeUrl: {
    type: String,
    trim: true
  },
  earnedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: false }); // No need for updatedAt since achievements don't change

// Indexes for efficient queries
achievementSchema.index({ userId: 1, earnedAt: -1 });
achievementSchema.index({ userId: 1, type: 1 });

export default mongoose.model<IAchievement>('Achievement', achievementSchema);