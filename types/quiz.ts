import { QuestionType } from './common';

export interface Question {
  _id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // For multiple-choice
  correctAnswer: string | number; // Answer index for MC, boolean for T/F, string for short-answer
  explanation?: string;
  points: number;
  order: number;
}

export interface Quiz {
  _id: string;
  lessonId: string;
  title: string;
  description?: string;
  questions: Question[];
  timeLimit?: number; // in minutes
  passingScore: number; // percentage
  maxAttempts: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizAnswer {
  questionId: string;
  answer: string | number | boolean;
  timeSpent?: number; // in seconds
}

export interface QuizAttempt {
  _id: string;
  quizId: string;
  userId: string;
  answers: QuizAnswer[];
  score: number; // percentage
  totalPoints: number;
  earnedPoints: number;
  timeSpent: number; // in seconds
  isCompleted: boolean;
  isPassed: boolean;
  attemptNumber: number;
  submittedAt: Date;
  createdAt: Date;
}

export interface QuizResult {
  attempt: QuizAttempt;
  quiz: Quiz;
  questionResults: {
    questionId: string;
    question: string;
    userAnswer: string | number | boolean;
    correctAnswer: string | number;
    isCorrect: boolean;
    points: number;
    earnedPoints: number;
    explanation?: string;
  }[];
  canRetake: boolean;
  attemptsRemaining: number;
}

export interface QuizCreateRequest {
  lessonId: string;
  title: string;
  description?: string;
  questions: {
    type: QuestionType;
    question: string;
    options?: string[];
    correctAnswer: string | number;
    explanation?: string;
    points: number;
    order: number;
  }[];
  timeLimit?: number;
  passingScore: number;
  maxAttempts: number;
}

export interface QuizSubmissionRequest {
  quizId: string;
  answers: {
    questionId: string;
    answer: string | number | boolean;
    timeSpent?: number;
  }[];
  totalTimeSpent: number;
}

export interface QuizStats {
  totalQuizzes: number;
  totalAttempts: number;
  averageScore: number;
  passRate: number;
  topPerformers: {
    userName: string;
    score: number;
    attemptDate: Date;
  }[];
}