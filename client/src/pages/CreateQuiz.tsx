import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  X, 
  Save, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  FileQuestion,
  Clock,
  Trophy,
  Hash,
  Trash2
} from 'lucide-react';

interface QuizQuestion {
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

const CreateQuiz: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const steps = [
    { number: 1, title: "Quiz Details", description: "Basic quiz information" },
    { number: 2, title: "Add Questions", description: "Create quiz questions" },
    { number: 3, title: "Review & Publish", description: "Review and publish your quiz" }
  ];

  // Mock lessons data - replace with API call
  const lessons = [
    { _id: '1', title: 'Introduction to HTML', courseTitle: 'Web Development Bootcamp' },
    { _id: '2', title: 'CSS Fundamentals', courseTitle: 'Web Development Bootcamp' },
    { _id: '3', title: 'JavaScript Basics', courseTitle: 'Web Development Bootcamp' }
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: any = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.lessonId) newErrors.lessonId = 'Lesson is required';
        if (formData.passingScore < 0 || formData.passingScore > 100) {
          newErrors.passingScore = 'Passing score must be between 0 and 100';
        }
        if (formData.maxAttempts < 1) newErrors.maxAttempts = 'Max attempts must be at least 1';
        break;
      case 2:
        if (formData.questions.length === 0) {
          newErrors.questions = 'At least one question is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

    // Reset current question
    setCurrentQuestion({
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      points: 1,
      order: formData.questions.length + 2
    });
  };

  const removeQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index).map((q, i) => ({ ...q, order: i + 1 }))
    }));
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    try {
      console.log('Creating quiz:', formData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate('/instructor/quizzes');
    } catch (error) {
      console.error('Error creating quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quiz Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-800 dark:text-white ${
                  errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                style={{ '--tw-ring-color': '#006d3a' } as React.CSSProperties}
                placeholder="Enter quiz title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lesson *
              </label>
              <select
                value={formData.lessonId}
                onChange={(e) => handleInputChange('lessonId', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-800 dark:text-white ${
                  errors.lessonId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                style={{ '--tw-ring-color': '#006d3a' } as React.CSSProperties}
              >
                <option value="">Select a lesson</option>
                {lessons.map(lesson => (
                  <option key={lesson._id} value={lesson._id}>
                    {lesson.courseTitle} - {lesson.title}
                  </option>
                ))}
              </select>
              {errors.lessonId && <p className="text-red-500 text-sm mt-1">{errors.lessonId}</p>}
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
                  placeholder="30"
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
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-800 dark:text-white ${
                    errors.passingScore ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  style={{ '--tw-ring-color': '#006d3a' } as React.CSSProperties}
                />
                {errors.passingScore && <p className="text-red-500 text-sm mt-1">{errors.passingScore}</p>}
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
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-800 dark:text-white ${
                    errors.maxAttempts ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  style={{ '--tw-ring-color': '#006d3a' } as React.CSSProperties}
                />
                {errors.maxAttempts && <p className="text-red-500 text-sm mt-1">{errors.maxAttempts}</p>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Question Form */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Add Question #{formData.questions.length + 1}
              </h3>

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

                {currentQuestion.type === 'true-false' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Correct Answer
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="tf-answer"
                          checked={currentQuestion.correctAnswer === true}
                          onChange={() => handleQuestionChange('correctAnswer', true)}
                          className="mr-2"
                        />
                        True
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="tf-answer"
                          checked={currentQuestion.correctAnswer === false}
                          onChange={() => handleQuestionChange('correctAnswer', false)}
                          className="mr-2"
                        />
                        False
                      </label>
                    </div>
                  </div>
                )}

                {currentQuestion.type === 'short-answer' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Correct Answer
                    </label>
                    <input
                      type="text"
                      value={currentQuestion.correctAnswer as string}
                      onChange={(e) => handleQuestionChange('correctAnswer', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                      placeholder="Enter the correct answer"
                    />
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

                <button
                  type="button"
                  onClick={addQuestion}
                  disabled={!currentQuestion.question.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  style={{ backgroundColor: currentQuestion.question.trim() ? '#006d3a' : '#9ca3af' }}
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </button>
              </div>
            </div>

            {/* Questions List */}
            {formData.questions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Questions ({formData.questions.length})
                </h3>
                <div className="space-y-3">
                  {formData.questions.map((question, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
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
                        <button
                          onClick={() => removeQuestion(index)}
                          className="ml-4 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errors.questions && <p className="text-red-500 text-sm">{errors.questions}</p>}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quiz Preview</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {formData.title}
                  </h4>
                  {formData.description && (
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{formData.description}</p>
                  )}
                </div>
                
                <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <FileQuestion className="w-4 h-4" />
                    {formData.questions.length} questions
                  </div>
                  {formData.timeLimit && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formData.timeLimit} minutes
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    {formData.passingScore}% to pass
                  </div>
                  <div className="flex items-center gap-1">
                    <Hash className="w-4 h-4" />
                    {formData.maxAttempts} max attempts
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Questions Summary</h5>
                  <div className="space-y-2">
                    {formData.questions.map((question, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">
                          Q{index + 1}: {question.question.substring(0, 50)}...
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {question.points} pts
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-gray-700 dark:text-gray-300">Total Points:</span>
                      <span className="text-gray-900 dark:text-white">
                        {formData.questions.reduce((sum, q) => sum + q.points, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 dark:text-green-400 mb-2">Ready to publish?</h4>
              <p className="text-green-700 dark:text-green-300 text-sm">
                Once you publish this quiz, students will be able to take it. You can always edit the quiz later.
              </p>
            </div>
          </div>
        );

      default:
        return null;
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create New Quiz</h1>
          <p className="text-gray-600 dark:text-gray-400">Create engaging quizzes to test student knowledge</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.number 
                    ? 'text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
                style={currentStep >= step.number ? { backgroundColor: '#006d3a' } : {}}
                >
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-24 h-0.5 mx-2 ${
                    currentStep > step.number ? 'bg-[#006d3a]' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{steps[currentStep - 1].title}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex gap-2">
            {currentStep === 3 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#006d3a' }}
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? 'Publishing...' : 'Publish Quiz'}
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2 text-white rounded-lg hover:opacity-90"
                style={{ backgroundColor: '#006d3a' }}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;