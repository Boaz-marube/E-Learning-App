import mongoose, { Document, Schema } from 'mongoose';
import { Course } from '../../../types';

export interface ICourse extends Document, Omit<Course, '_id' | 'instructor'> {
  instructor: mongoose.Types.ObjectId;
}

const courseSchema = new Schema<ICourse>({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Course description is required']
  },
  instructor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Course price is required'],
    min: 0
  },
  duration: {
    type: Number,
    required: [true, 'Course duration is required'],
    min: 1
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  category: {
    type: String,
    required: [true, 'Course category is required'],
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  thumbnail: {
    type: String,
    default: ''
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  enrollmentCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
}, { timestamps: true });

export default mongoose.model<ICourse>('Course', courseSchema);