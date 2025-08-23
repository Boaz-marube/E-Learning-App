import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  X, 
  Save, 
  ChevronLeft, 
  ChevronRight,
  Trash2
} from 'lucide-react';

interface QuizQuestion {
  _id?: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string | number | boolean;
  explanation?: string;
  points: number;
  order: number;
}

interface QuizFormData {
  lessonId: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  timeLimit?: number;
  passingScore: number;
  maxAttempts: number;
}

const EditQuiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<QuizFormData>({
    lessonId: '',
    title: '',
    description: '',
    questions: [],
    timeLimit: 30,
    passingScore: 70,
    maxAttempts: 3
  });

  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>({
    type: 'multiple-choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    points: 1,
    order: 1
  });

  const [errors, setErrors] = useState<any>({});

  // Mock lessons data
  const lessons = [
    { _id: '1', title: 'Introduction to HTML', courseTitle: 'Web Development Bootcamp' },
    { _id: '2', title: 'CSS Fundamentals', courseTitle: 'Web Development Bootcamp' },
    { _id: '3', title: 'JavaScript Basics', courseTitle: 'Web Development Bootcamp' }
  ];

  useEffect(() => {
    // Mock loading existing quiz data
    if (id) {
      const mockQuiz = {
        lessonId: '1',
        title: 'HTML & CSS Fundamentals Quiz',
        description: 'Test your knowledge of HTML and CSS basics',
        timeLimit: 30,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            _id: '1',
            type: 'multiple-choice' as const,
            question: 'What does HTML stand for?',
            options: [
              'Hyper Text Markup Language',
              'High Tech Modern Language',
              'Home Tool Markup Language',
              'Hyperlink and Text Markup Language',
            ],
            correctAnswer: 0,
            explanation: 'HTML stands for Hyper Text Markup Language.',
            points: 1,
            order: 1
          }
        ]
      };
      setFormData(mockQuiz);
    }
  }, [id]);

  const handleInputChange = (field: keyof QuizFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleQuestionChange = (field: keyof QuizQuestion, value: any) => {
    setCurrentQuestion(prev => ({ ...prev, [field]: value }));
  };

  const addOption = () => {
    if (currentQuestion.options && currentQuestion.options.length < 6) {
      setCurrentQuestion(prev => ({
        ...prev,
        options: [...(prev.options || []), '']
      }));
    }
  };

  const removeOption = (index: number) => {
    if (currentQuestion.options && currentQuestion.options.length > 2) {
      const newOptions = currentQuestion.options.filter((_, i) => i !== index);
      setCurrentQuestion(prev => ({
        ...prev,
        options: newOptions,
        correctAnswer: typeof prev.correctAnswer === 'number' && prev.correctAnswer >= index 
          ? Math.max(0, prev.correctAnswer - 1) 
          : prev.correctAnswer
      }));
    }
  };

  const updateOption = (index: number, value: string) => {
    if (currentQuestion.options) {
      const newOptions = [...currentQuestion.options];
      newOptions[index] = value;
      setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
    }
  };

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) return;

    const newQuestion = {
      ...currentQuestion,
      order: formData.questions.length + 1
    };

    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));

    resetCurrentQuestion();
  };

  const editQuestion = (index: number) => {
    const question = formData.questions[index];
    setCurrentQuestion(question);
    setEditingQuestionIndex(index);
  };

  const updateQuestion = () => {
    if (editingQuestionIndex === null) return;

    const updatedQuestions = [...formData.questions];
    updatedQuestions[editingQuestionIndex] = currentQuestion;

    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));

    setEditingQuestionIndex(null);
    resetCurrentQuestion();
  };

  const removeQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index).map((q, i) => ({ ...q, order: i + 1 }))
    }));
  };

  const resetCurrentQuestion = () => {
    setCurrentQuestion({
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      points: 1,
      order: formData.questions.length + 1
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log('Updating quiz:', formData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate('/instructor/quizzes');
    } catch (error) {
      console.error('Error updating quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user?.role !== 'instructor') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">This page is only available for instructors.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Edit Quiz</h1>
          <p className="text-gray-600 dark:text-gray-400">Update your quiz content and settings</p>
        </div>

        {/* Quiz Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quiz Details</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quiz Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-800 dark:text-white"
                style={{ '--tw-ring-color': '#006d3a' } as React.CSSProperties}
                placeholder="Enter quiz title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-800 dark:text-white"
                style={{ '--tw-ring-color': '#006d3a' } as React.CSSProperties}
                placeholder="Brief description of the quiz"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.timeLimit || ''}
                  onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value) || undefined)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  style={{ '--tw-ring-color': '#006d3a' } as React.CSSProperties}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Passing Score (%) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.passingScore}
                  onChange={(e) => handleInputChange('passingScore', parseInt(e.target.value) || 0)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  style={{ '--tw-ring-color': '#006d3a' } as React.CSSProperties}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Attempts *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxAttempts}
                  onChange={(e) => handleInputChange('maxAttempts', parseInt(e.target.value) || 1)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  style={{ '--tw-ring-color': '#006d3a' } as React.CSSProperties}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        {formData.questions.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Questions ({formData.questions.length})
            </h2>
            <div className="space-y-3">
              {formData.questions.map((question, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Q{question.order}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                          {question.type.replace('-', ' ')}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded text-xs">
                          {question.points} pts
                        </span>
                      </div>
                      <p className="text-gray-900 dark:text-white font-medium">{question.question}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => editQuestion(index)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeQuestion(index)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Question Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {editingQuestionIndex !== null ? 'Edit Question' : 'Add New Question'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Question Type
              </label>
              <select
                value={currentQuestion.type}
                onChange={(e) => handleQuestionChange('type', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-800 dark:text-white"
                style={{ '--tw-ring-color': '#006d3a' } as React.CSSProperties}
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True/False</option>
                <option value="short-answer">Short Answer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Question Text
              </label>
              <textarea
                value={currentQuestion.question}
                onChange={(e) => handleQuestionChange('question', e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-800 dark:text-white"
                style={{ '--tw-ring-color': '#006d3a' } as React.CSSProperties}
                placeholder="Enter your question"
              />
            </div>

            {currentQuestion.type === 'multiple-choice' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Answer Options
                </label>
                <div className="space-y-2">
                  {currentQuestion.options?.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="radio"
                        name="correct-answer"
                        checked={currentQuestion.correctAnswer === index}
                        onChange={() => handleQuestionChange('correctAnswer', index)}
                        className="mt-3"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                        placeholder={`Option ${index + 1}`}
                      />
                      {currentQuestion.options && currentQuestion.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {currentQuestion.options && currentQuestion.options.length < 6 && (
                    <button
                      type="button"
                      onClick={addOption}
                      className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                    >
                      <Plus className="w-4 h-4" />
                      Add Option
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Points
                </label>
                <input
                  type="number"
                  min="1"
                  value={currentQuestion.points}
                  onChange={(e) => handleQuestionChange('points', parseInt(e.target.value) || 1)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Explanation (Optional)
                </label>
                <input
                  type="text"
                  value={currentQuestion.explanation}
                  onChange={(e) => handleQuestionChange('explanation', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                  placeholder="Explain the correct answer"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {editingQuestionIndex !== null ? (
                <>
                  <button
                    type="button"
                    onClick={updateQuestion}
                    disabled={!currentQuestion.question.trim()}
                    className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: '#006d3a' }}
                  >
                    <Save className="w-4 h-4" />
                    Update Question
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingQuestionIndex(null);
                      resetCurrentQuestion();
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={addQuestion}
                  disabled={!currentQuestion.question.trim()}
                  className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: '#006d3a' }}
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-between">
          <button
            onClick={() => navigate('/instructor/quizzes')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Quizzes
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#006d3a' }}
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditQuiz;