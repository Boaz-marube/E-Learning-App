import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../../../types';

interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
  agreeTerms: boolean;
}

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [activeTab, setActiveTab] = useState<'student' | 'instructor'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<SignUpFormData>({
    fullName: '',
    email: '',
    password: '',
    agreeTerms: false
  });

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
    if (!/\d/.test(password)) errors.push('One number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('One special character');
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (name === 'password') {
      setPasswordErrors(validatePassword(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate password before submission
    const errors = validatePassword(formData.password);
    if (errors.length > 0) {
      setPasswordErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use actual signup function from AuthContext
      const role = activeTab === 'student' ? UserRole.STUDENT : UserRole.INSTRUCTOR;
      await signup(formData.fullName, formData.email, formData.password, role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-3xl border-2 shadow-lg p-8" style={{ borderColor: "#00693F" }}>
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sign Up</h1>
            <p className="text-gray-600 dark:text-gray-300">Create an account to unlock exclusive features.</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1 mb-8">
            <button
              onClick={() => setActiveTab('student')}
              className={`flex-1 py-2 px-4 rounded-full font-medium transition-all duration-200 ${
                activeTab === 'student'
                  ? 'text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
              }`}
              style={activeTab === 'student' ? { backgroundColor: "#00693F" } : {}}
            >
              Student
            </button>
            <button
              onClick={() => setActiveTab('instructor')}
              className={`flex-1 py-2 px-4 rounded-full font-medium transition-all duration-200 ${
                activeTab === 'instructor'
                  ? 'text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
              }`}
              style={activeTab === 'instructor' ? { backgroundColor: "#00693F" } : {}}
            >
              Instructor
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your Name"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your Email"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your Password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordErrors.length > 0 && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                  <p className="font-medium">Password must include:</p>
                  <ul className="list-disc list-inside mt-1">
                    {passwordErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              {passwordErrors.length === 0 && formData.password && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                  ✓ Password meets all requirements
                </p>
              )}
            </div>

            {/* Terms and Privacy Checkbox */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded focus:ring-2"
                style={{ accentColor: "#00693F" }}
                required
              />
              <label htmlFor="agreeTerms" className="text-sm text-gray-600 dark:text-gray-300">
                I agree with{' '}
                <Link to="/terms" className="text-gray-800 dark:text-gray-200 underline hover:text-green-600">
                  Terms of Use
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-gray-800 dark:text-gray-200 underline hover:text-green-600">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#00693F" }}
              onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = "#005a35")}
              onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = "#00693F")}
            >
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>



            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Already have an account?{' '}
                <Link to="/login" className="text-gray-900 dark:text-gray-100 font-medium hover:text-green-600 inline-flex items-center">
                  Login
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
