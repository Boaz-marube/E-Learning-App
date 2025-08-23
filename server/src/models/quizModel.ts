import mongoose, { Document, Schema } from 'mongoose';
import { Quiz, Question } from '../../../types';

export interface IQuiz extends Document, Omit<Quiz, '_id' | 'lessonId' | 'questions'> {
  lessonId: mongoose.Types.ObjectId;
  questions: IQuestion[];
}

export interface IQuestion extends Document, Omit<Question, '_id'> {}

const questionSchema = new Schema<IQuestion>({
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer'],
    required: true
  },
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  options: [{
    type: String,
    trim: true
  }],
  correctAnswer: {
    type: Schema.Types.Mixed,
    required: [true, 'Correct answer is required']
  },
  explanation: {
    type: String,
    trim: true
  },
  points: {
    type: Number,
    required: [true, 'Points are required'],
    min: 1
  },
  order: {
    type: Number,
    required: [true, 'Question order is required'],
    min: 1
  }
});

const quizSchema = new Schema<IQuiz>({
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  questions: [questionSchema],
  timeLimit: {
    type: Number,
    min: 1 // minimum 1 minute
  },
  passingScore: {
    type: Number,
    required: [true, 'Passing score is required'],
    min: 0,
    max: 100
  },
  maxAttempts: {
    type: Number,
    required: [true, 'Max attempts is required'],
    min: 1,
    default: 3
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Ensure unique quiz per lesson
quizSchema.index({ lessonId: 1 }, { unique: true });

// Ensure unique question order within quiz
quizSchema.pre('save', function() {
  const orders = this.questions.map(q => q.order);
  const uniqueOrders = new Set(orders);
  if (orders.length !== uniqueOrders.size) {
    throw new Error('Question orders must be unique within a quiz');
  }
});

export default mongoose.model<IQuiz>('Quiz', quizSchema);