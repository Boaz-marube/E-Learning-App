import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate API call
      console.log('Sending code to:', email);
      
      // Navigate to verification page with email
      setTimeout(() => {
        navigate('/verify-code', { state: { email } });
      }, 1000);
    } catch (err: any) {
      setError('Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Forgot Your Password?</h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Please enter your email address and we'll send you password reset link
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSendCode} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700"
                required
              />
            </div>

            {/* Send Code Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#00693F" }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "#005a35")}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = "#00693F")}
            >
              <span></span>
              <span>{loading ? 'Sending...' : 'Send Code'}</span>
              {!loading && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              {loading && <span></span>}
            </button>

            {/* Back to Login */}
            <div className="text-center">
              <Link 
                to="/login" 
                className="text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                style={{ color: "#00693F" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#005a35")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#00693F")}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to login</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;