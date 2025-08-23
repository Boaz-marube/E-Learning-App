import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const VerifyCode: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [code, setCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    
    if (fullCode.length !== 4) {
      setError('Please enter the complete 4-digit code');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Simulate API call
      console.log('Verifying code:', fullCode);
      
      // Navigate to reset password page or login
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err: any) {
      setError('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      console.log('Resending code to:', email);
      // Simulate resend API call
      setError('');
      // Show success message or handle resend logic
    } catch (err: any) {
      setError('Failed to resend code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Enter your Verification code</h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Please enter the 4-digit code sent to your email
              {email && (
                <span className="block mt-1 font-medium text-gray-800 dark:text-gray-200">
                  {email}
                </span>
              )}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleVerifyCode} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            {/* Code Input Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Verification Code
              </label>
              <div className="flex justify-center space-x-3">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                  />
                ))}
              </div>
            </div>

            {/* Verify Code Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#00693F" }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "#005a35")}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = "#00693F")}
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>

            {/* Resend Code */}
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">Didn't receive the code?</p>
              <button
                type="button"
                onClick={handleResendCode}
                className="text-sm font-medium transition-colors"
                style={{ color: "#00693F" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#005a35")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#00693F")}
              >
                Resend Code
              </button>
            </div>

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

export default VerifyCode;