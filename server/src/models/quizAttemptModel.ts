import mongoose, { Document, Schema } from 'mongoose';
import { QuizAttempt, QuizAnswer } from '../../../types';

export interface IQuizAttempt extends Document, Omit<QuizAttempt, '_id' | 'quizId' | 'userId' | 'answers'> {
  quizId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  answers: IQuizAnswer[];
}

export interface IQuizAnswer extends Document, Omit<QuizAnswer, 'questionId'> {
  questionId: mongoose.Types.ObjectId;
}

const quizAnswerSchema = new Schema<IQuizAnswer>({
  questionId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  answer: {
    type: Schema.Types.Mixed,
    required: [true, 'Answer is required']
  },
  timeSpent: {
    type: Number,
    min: 0,
    default: 0
  }
});

const quizAttemptSchema = new Schema<IQuizAttempt>({
  quizId: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [quizAnswerSchema],
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  totalPoints: {
    type: Number,
    required: true,
    min: 0
  },
  earnedPoints: {
    type: Number,
    required: true,
    min: 0
  },
  timeSpent: {
    type: Number,
    required: true,
    min: 0
  },
  isCompleted: {
    type: Boolean,
    required: true,
    default: false
  },
  isPassed: {
    type: Boolean,
    required: true,
    default: false
  },
  attemptNumber: {
    type: Number,
    required: true,
    min: 1
  },
  submittedAt: {
    type: Date,
    required: true,
    default: Date.now
  }
}, { timestamps: true });

// Compound index for user quiz attempts
quizAttemptSchema.index({ userId: 1, quizId: 1, attemptNumber: 1 }, { unique: true });

// Index for querying user attempts
quizAttemptSchema.index({ userId: 1, quizId: 1 });

export default mongoose.model<IQuizAttempt>('QuizAttempt', quizAttemptSchema);