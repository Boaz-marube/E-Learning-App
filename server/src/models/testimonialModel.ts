import mongoose, { Document, Schema } from 'mongoose';
import { Testimonial } from '../../../types/shared';

export interface ITestimonial extends Document, Omit<Testimonial, '_id'> {}

const testimonialSchema = new Schema<ITestimonial>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  role: {
    type: String,
    enum: ['student', 'instructor'],
    required: true
  },
  message: {
    type: String,
    required: [true, 'Testimonial message is required'],
    maxlength: 500
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  avatar: {
    type: String,
    default: ''
  },
  courseTitle: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model<ITestimonial>('Testimonial', testimonialSchema);