import mongoose, { Document, Schema } from 'mongoose';
import { Lesson } from '../../../types/shared';

export interface ILesson extends Document, Omit<Lesson, '_id' | 'courseId'> {
  courseId: mongoose.Types.ObjectId;
}

const lessonSchema = new Schema<ILesson>({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  videoUrl: {
    type: String,
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'Lesson duration is required'],
    min: 0
  },
  order: {
    type: Number,
    required: [true, 'Lesson order is required'],
    min: 1
  },
  isPreview: {
    type: Boolean,
    default: false
  },
  materials: [{
    title: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      required: true
    }
  }]
}, { timestamps: true });

// Ensure unique order per course
lessonSchema.index({ courseId: 1, order: 1 }, { unique: true });

export default mongoose.model<ILesson>('Lesson', lessonSchema);