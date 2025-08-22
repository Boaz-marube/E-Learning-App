import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-white to-slate-50/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Empower Your Learning Journey with <span className="text-blue-600">DirectEd</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Access world-class education with our accessible, inclusive e-learning platform designed for students and instructors worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {!user ? (
                <>
                  <Link
                    to="/courses"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-md text-lg font-medium transition-colors inline-flex items-center shadow-sm"
                  >
                    Browse Courses
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    to="/signup"
                    className="border border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50 px-8 py-6 rounded-md text-lg font-medium transition-colors bg-white shadow-sm"
                  >
                    Sign Up Free
                  </Link>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-md text-lg font-medium transition-colors inline-flex items-center shadow-sm"
                >
                  Go to Dashboard
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                <div className="text-slate-600">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-slate-600">Expert Instructors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">1,200+</div>
                <div className="text-slate-600">Quality Courses</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Expert Instructors</h3>
              <p className="text-slate-600">Learn from industry professionals with years of experience</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Flexible Learning</h3>
              <p className="text-slate-600">Study at your own pace, anywhere and anytime</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-violet-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Certificates</h3>
              <p className="text-slate-600">Earn certificates upon course completion</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;