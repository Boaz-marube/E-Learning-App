import mongoose, { Document, Schema } from 'mongoose';
import { Content } from '../../../types';

export interface IContent extends Document, Omit<Content, '_id' | 'uploadedBy' | 'courseId'> {
  uploadedBy: mongoose.Types.ObjectId;
  courseId?: mongoose.Types.ObjectId;
}

const contentSchema = new Schema<IContent>({
  title: {
    type: String,
    required: [true, 'Content title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  fileType: {
    type: String,
    enum: ['video', 'document', 'image', 'pdf'],
    required: true
  },
  fileUrl: {
    type: String,
    required: [true, 'Cloudinary URL is required']
  },
  fileName: {
    type: String,
    required: [true, 'File name is required'],
    trim: true
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required'],
    min: 0
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Indexes for efficient queries
contentSchema.index({ uploadedBy: 1, createdAt: -1 });
contentSchema.index({ courseId: 1 });
contentSchema.index({ fileType: 1 });

export default mongoose.model<IContent>('Content', contentSchema);