import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Trophy,
  AlertCircle,
  Play,
  Pause
} from 'lucide-react';

interface QuizQuestion {
  _id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string | number | boolean;
  explanation?: string;
  points: number;
  order: number;
}

interface Quiz {
  _id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  timeLimit?: number;
  passingScore: number;
  maxAttempts: number;
}

const QuizTaker: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Mock quiz data - replace with API call
  const quiz: Quiz = {
    _id: id || '1',
    title: 'HTML & CSS Fundamentals Quiz',
    description: 'Test your knowledge of HTML and CSS basics covered in the first few lessons.',
    timeLimit: 30,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        _id: '1',
        type: 'multiple-choice',
        question: 'What does HTML stand for?',
        options: [
          'Hyper Text Markup Language',
          'High Tech Modern Language',
          'Home Tool Markup Language',
          'Hyperlink and Text Markup Language',
        ],
        correctAnswer: 0,
        explanation: 'HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages.',
        points: 1,
        order: 1
      },
      {
        _id: '2',
        type: 'multiple-choice',
        question: 'Which HTML element is used for the largest heading?',
        options: ['<h6>', '<h1>', '<heading>', '<header>'],
        correctAnswer: 1,
        explanation: 'The <h1> element represents the largest heading in HTML, with <h6> being the smallest.',
        points: 1,
        order: 2
      },
      {
        _id: '3',
        type: 'true-false',
        question: 'CSS stands for Cascading Style Sheets.',
        correctAnswer: true,
        explanation: 'Yes, CSS stands for Cascading Style Sheets, which is used to style HTML elements.',
        points: 1,
        order: 3
      }
    ]
  };

  useEffect(() => {
    if (quiz.timeLimit) {
      setTimeRemaining(quiz.timeLimit * 60);
    }
  }, [quiz.timeLimit]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeRemaining > 0 && !showResults) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            setIsTimerRunning(false);
            setShowResults(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeRemaining, showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setIsTimerRunning(true);
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = () => {
    setIsTimerRunning(false);
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach(question => {
      const userAnswer = answers[question._id];
      if (question.type === 'multiple-choice' || question.type === 'true-false') {
        if (userAnswer === question.correctAnswer) correct++;
      } else if (question.type === 'short-answer') {
        if (userAnswer && userAnswer.toLowerCase().trim() === (question.correctAnswer as string).toLowerCase().trim()) {
          correct++;
        }
      }
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setTimeRemaining(quiz.timeLimit ? quiz.timeLimit * 60 : 0);
    setQuizStarted(false);
    setIsTimerRunning(false);
  };

  const renderQuestion = (question: QuizQuestion) => {
    const userAnswer = answers[question._id];

    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label 
                key={index}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  userAnswer === index 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question._id}`}
                  value={index}
                  checked={userAnswer === index}
                  onChange={() => handleAnswer(question._id, index)}
                  className="mr-3"
                />
                <span className="text-gray-900 dark:text-white">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'true-false':
        return (
          <div className="space-y-3">
            {[
              { value: true, label: 'True' },
              { value: false, label: 'False' }
            ].map((option) => (
              <label 
                key={option.label}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  userAnswer === option.value 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question._id}`}
                  value={option.value.toString()}
                  checked={userAnswer === option.value}
                  onChange={() => handleAnswer(question._id, option.value)}
                  className="mr-3"
                />
                <span className="text-gray-900 dark:text-white">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'short-answer':
        return (
          <div>
            <textarea
              value={userAnswer || ''}
              onChange={(e) => handleAnswer(question._id, e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-800 dark:text-white"
              style={{ '--tw-ring-color': '#006d3a' } as React.CSSProperties}
              rows={3}
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (user?.role !== 'student') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">This page is only available for students.</p>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{quiz.title}</h1>
              {quiz.description && (
                <p className="text-gray-600 dark:text-gray-400">{quiz.description}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {quiz.timeLimit && (
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Time Limit</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{quiz.timeLimit} minutes</div>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Passing Score</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{quiz.passingScore}%</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Questions</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{quiz.questions.length} questions</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Attempts</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{quiz.maxAttempts} max</div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-medium mb-1">Before you start:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Make sure you have a stable internet connection</li>
                    <li>You cannot pause the timer once started</li>
                    <li>All questions must be answered to submit</li>
                    <li>You can review your answers before submitting</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={startQuiz}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 text-white rounded-lg hover:opacity-90 transition-opacity text-lg font-medium"
              style={{ backgroundColor: '#006d3a' }}
            >
              <Play className="w-5 h-5" />
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const passed = score >= quiz.passingScore;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                passed ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
              }`}>
                {passed ? (
                  <Trophy className="w-8 h-8 text-green-600" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-600" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {passed ? 'Congratulations!' : 'Quiz Complete'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {passed 
                  ? 'You passed the quiz successfully!' 
                  : `You need ${quiz.passingScore}% to pass. Keep studying and try again!`
                }
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{score}%</div>
                <div className="text-gray-600 dark:text-gray-400">Your Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {Object.keys(answers).length}/{quiz.questions.length}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Questions Answered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {quiz.timeLimit ? formatTime((quiz.timeLimit * 60) - timeRemaining) : 'N/A'}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Time Taken</div>
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={restartQuiz}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Quiz
              </button>
              <button
                onClick={() => navigate('/quizzes')}
                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90"
                style={{ backgroundColor: '#006d3a' }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Quizzes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        {/* Quiz Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>
              {quiz.timeLimit && (
                <div className={`flex items-center space-x-2 ${
                  timeRemaining < 300 ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span className="font-mono font-medium">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              )}
            </div>
            <button 
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="flex items-center gap-2 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isTimerRunning ? 'Pause' : 'Resume'}
            </button>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, backgroundColor: '#006d3a' }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{question.question}</h2>
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-sm">
              {question.type.replace('-', ' ')}
            </span>
          </div>
          {renderQuestion(question)}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center space-x-2">
            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={submitQuiz}
                className="flex items-center gap-2 px-6 py-2 text-white rounded-lg hover:opacity-90"
                style={{ backgroundColor: '#006d3a' }}
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="flex items-center gap-2 px-6 py-2 text-white rounded-lg hover:opacity-90"
                style={{ backgroundColor: '#006d3a' }}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTaker;