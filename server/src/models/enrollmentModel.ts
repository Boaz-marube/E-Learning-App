import mongoose, { Document, Schema } from 'mongoose';
import { Enrollment } from '../../../types/shared';

export interface IEnrollment extends Document, Omit<Enrollment, '_id' | 'userId' | 'courseId'> {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
}

const enrollmentSchema = new Schema<IEnrollment>({
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
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Compound index to prevent duplicate enrollments
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model<IEnrollment>('Enrollment', enrollmentSchema);