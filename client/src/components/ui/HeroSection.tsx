import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import heroImg from '../../assets/HeroImg.svg';

const AfricaTechHero = () => {
  const { user } = useAuth();
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-gray-800"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${heroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      




      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            Empowering Africa's Next Generation of Tech Leaders
          </h1>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            {!user ? (
              <>
                <Link
                  to="/courses"
                  className="text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
                  style={{ backgroundColor: "#00693F" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005a35")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#00693F")}
                >
                  Browse Courses
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  to="/signup"
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-3 rounded-lg transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
                style={{ backgroundColor: "#00693F" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005a35")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#00693F")}
              >
                Go to Dashboard
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
          
          {/* Description Text */}
          <p className="text-white text-lg md:text-xl max-w-3xl mx-auto leading-relaxed opacity-90">
            World-class training and remote paid internships with US and European companies. Web development, UI/UX and Artificial Intelligence. $0 upfront cost.
          </p>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="absolute bottom-16 left-0 right-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: "#00693F" }}>
                10,000+
              </div>
              <div className="text-white">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: "#00693F" }}>
                500+
              </div>
              <div className="text-white">Expert Instructors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: "#00693F" }}>
                1,200+
              </div>
              <div className="text-white">Quality Courses</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>
  );
};

export default AfricaTechHero;