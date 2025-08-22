import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import QuizModel from '../models/quizModel';
import QuizAttemptModel from '../models/quizAttemptModel';
import CourseModel from '../models/courseModel';
import EnrollmentModel from '../models/enrollmentModel';
import { 
  ApiResponse, 
  Quiz, 
  QuizCreateRequest, 
  QuizSubmissionRequest, 
  QuizResult, 
  QuizAttempt 
} from '../../../types/shared';
import ErrorHandler from '../utils/errorHandler';

// Fetch quiz for lesson
export const getQuizByLesson = async (
  req: Request<{ lessonId: string }>, 
  res: Response<ApiResponse<Quiz>>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { lessonId } = req.params;

    if (!Types.ObjectId.isValid(lessonId)) {
      return next(new ErrorHandler('Invalid lesson ID', 400));
    }

    // Find quiz for lesson
    const quiz = await QuizModel.findOne({ 
      lessonId, 
      isActive: true 
    });

    if (!quiz) {
      return next(new ErrorHandler('Quiz not found for this lesson', 404));
    }

    // Transform to shared type format
    const quizData: Quiz = {
      _id: (quiz._id as Types.ObjectId).toString(),
      lessonId: (quiz.lessonId as Types.ObjectId).toString(),
      title: quiz.title,
      description: quiz.description,
      questions: quiz.questions.map(q => ({
        _id: (q._id as Types.ObjectId).toString(),
        type: q.type,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        points: q.points,
        order: q.order
      })),
      timeLimit: quiz.timeLimit,
      passingScore: quiz.passingScore,
      maxAttempts: quiz.maxAttempts,
      isActive: quiz.isActive,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt
    };

    res.status(200).json({
      success: true,
      message: 'Quiz retrieved successfully',
      data: quizData
    });

  } catch (error: any) {
    next(error);
  }
};

// Create quiz (instructor only)
export const createQuiz = async (
  req: Request<{}, {}, QuizCreateRequest>, 
  res: Response<ApiResponse>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { lessonId, title, description, questions, timeLimit, passingScore, maxAttempts } = req.body;

    if (!lessonId || !title || !questions || questions.length === 0) {
      return next(new ErrorHandler('Lesson ID, title, and questions are required', 400));
    }

    if (!Types.ObjectId.isValid(lessonId)) {
      return next(new ErrorHandler('Invalid lesson ID', 400));
    }

    // Verify lesson exists and instructor owns the course
    // Note: In real app, you'd verify lesson ownership through course
    // For now, we'll create the quiz directly

    // Validate questions
    for (const question of questions) {
      if (!question.question || !question.type || question.points <= 0) {
        return next(new ErrorHandler('All questions must have text, type, and positive points', 400));
      }

      if (question.type === 'multiple-choice' && (!question.options || question.options.length < 2)) {
        return next(new ErrorHandler('Multiple choice questions must have at least 2 options', 400));
      }
    }

    const quiz = await QuizModel.create({
      lessonId,
      title,
      description: description || '',
      questions: questions.map((q, index) => ({
        type: q.type,
        question: q.question,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || '',
        points: q.points,
        order: q.order || index + 1
      })),
      timeLimit,
      passingScore: passingScore || 70,
      maxAttempts: maxAttempts || 3,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: {
        _id: (quiz._id as Types.ObjectId).toString(),
        title: quiz.title,
        questionsCount: quiz.questions.length
      }
    });

  } catch (error: any) {
    if (error.code === 11000) {
      return next(new ErrorHandler('Quiz already exists for this lesson', 400));
    }
    next(error);
  }
};

// Submit quiz answers with scoring
export const submitQuizAttempt = async (
  req: Request<{}, {}, QuizSubmissionRequest>, 
  res: Response<ApiResponse<QuizResult>>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { quizId, answers, totalTimeSpent } = req.body;

    if (!quizId || !answers || answers.length === 0) {
      return next(new ErrorHandler('Quiz ID and answers are required', 400));
    }

    if (!Types.ObjectId.isValid(quizId)) {
      return next(new ErrorHandler('Invalid quiz ID', 400));
    }

    // Get quiz
    const quiz = await QuizModel.findById(quizId);
    if (!quiz) {
      return next(new ErrorHandler('Quiz not found', 404));
    }

    // Check previous attempts
    const previousAttempts = await QuizAttemptModel.countDocuments({
      userId: req.user._id,
      quizId
    });

    if (previousAttempts >= quiz.maxAttempts) {
      return next(new ErrorHandler('Maximum attempts exceeded', 400));
    }

    // Calculate score
    let earnedPoints = 0;
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const questionResults = [];

    for (const question of quiz.questions) {
      const userAnswer = answers.find(a => a.questionId === (question._id as Types.ObjectId).toString());
      const isCorrect = userAnswer && userAnswer.answer === question.correctAnswer;
      const points = isCorrect ? question.points : 0;
      
      earnedPoints += points;

      questionResults.push({
        questionId: (question._id as Types.ObjectId).toString(),
        question: question.question,
        userAnswer: userAnswer?.answer || '',
        correctAnswer: question.correctAnswer,
        isCorrect: !!isCorrect,
        points: question.points,
        earnedPoints: points,
        explanation: question.explanation
      });
    }

    const score = Math.round((earnedPoints / totalPoints) * 100);
    const isPassed = score >= quiz.passingScore;

    // Create attempt record
    const attempt = await QuizAttemptModel.create({
      quizId,
      userId: req.user._id,
      answers: answers.map(a => ({
        questionId: a.questionId,
        answer: a.answer,
        timeSpent: a.timeSpent || 0
      })),
      score,
      totalPoints,
      earnedPoints,
      timeSpent: totalTimeSpent,
      isCompleted: true,
      isPassed,
      attemptNumber: previousAttempts + 1,
      submittedAt: new Date()
    });

    // Format result
    const quizResult: QuizResult = {
      attempt: {
        _id: (attempt._id as Types.ObjectId).toString(),
        quizId: (attempt.quizId as Types.ObjectId).toString(),
        userId: (attempt.userId as Types.ObjectId).toString(),
        answers: attempt.answers.map(a => ({
          questionId: (a.questionId as Types.ObjectId).toString(),
          answer: a.answer,
          timeSpent: a.timeSpent
        })),
        score: attempt.score,
        totalPoints: attempt.totalPoints,
        earnedPoints: attempt.earnedPoints,
        timeSpent: attempt.timeSpent,
        isCompleted: attempt.isCompleted,
        isPassed: attempt.isPassed,
        attemptNumber: attempt.attemptNumber,
        submittedAt: attempt.submittedAt,
        createdAt: attempt.createdAt
      },
      quiz: {
        _id: (quiz._id as Types.ObjectId).toString(),
        lessonId: (quiz.lessonId as Types.ObjectId).toString(),
        title: quiz.title,
        description: quiz.description,
        questions: quiz.questions.map(q => ({
          _id: (q._id as Types.ObjectId).toString(),
          type: q.type,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          points: q.points,
          order: q.order
        })),
        timeLimit: quiz.timeLimit,
        passingScore: quiz.passingScore,
        maxAttempts: quiz.maxAttempts,
        isActive: quiz.isActive,
        createdAt: quiz.createdAt,
        updatedAt: quiz.updatedAt
      },
      questionResults,
      canRetake: (previousAttempts + 1) < quiz.maxAttempts && !isPassed,
      attemptsRemaining: quiz.maxAttempts - (previousAttempts + 1)
    };

    res.status(201).json({
      success: true,
      message: `Quiz ${isPassed ? 'passed' : 'failed'}! Score: ${score}%`,
      data: quizResult
    });

  } catch (error: any) {
    next(error);
  }
};

// Get user's quiz attempts
export const getUserQuizAttempts = async (
  req: Request<{ quizId: string }>, 
  res: Response<ApiResponse<QuizAttempt[]>>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { quizId } = req.params;

    if (!Types.ObjectId.isValid(quizId)) {
      return next(new ErrorHandler('Invalid quiz ID', 400));
    }

    const attempts = await QuizAttemptModel.find({
      userId: req.user._id,
      quizId
    }).sort({ attemptNumber: -1 });

    const attemptsData: QuizAttempt[] = attempts.map(attempt => ({
      _id: (attempt._id as Types.ObjectId).toString(),
      quizId: (attempt.quizId as Types.ObjectId).toString(),
      userId: (attempt.userId as Types.ObjectId).toString(),
      answers: attempt.answers.map(a => ({
        questionId: (a.questionId as Types.ObjectId).toString(),
        answer: a.answer,
        timeSpent: a.timeSpent
      })),
      score: attempt.score,
      totalPoints: attempt.totalPoints,
      earnedPoints: attempt.earnedPoints,
      timeSpent: attempt.timeSpent,
      isCompleted: attempt.isCompleted,
      isPassed: attempt.isPassed,
      attemptNumber: attempt.attemptNumber,
      submittedAt: attempt.submittedAt,
      createdAt: attempt.createdAt
    }));

    res.status(200).json({
      success: true,
      message: 'Quiz attempts retrieved successfully',
      data: attemptsData
    });

  } catch (error: any) {
    next(error);
  }
};