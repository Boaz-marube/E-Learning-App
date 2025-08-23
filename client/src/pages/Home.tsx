"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { useAuth } from "..//context/AuthContext"
import Footer from "..//components/layout/footer"

const Home: React.FC = () => {
  const { user } = useAuth()

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <img
          src="/assets/heroimage.jpg"
          alt="African student with books"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Empowering Africa's Next Generation of <span style={{ color: "#00693F" }}>Tech Leaders</span>
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed">
              World-class training and remote paid internships with US and European companies. Web development, UIX and
              Artificial Intelligence. $0 upfront cost.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {!user ? (
                <>
                  <Link
                    to="/courses"
                    className="text-white px-8 py-6 rounded-md text-lg font-medium transition-colors inline-flex items-center shadow-sm"
                    style={{ backgroundColor: "#00693F" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005a35")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#00693F")}
                  >
                    Browse Courses
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    to="/signup"
                    className="border border-white hover:bg-white hover:text-gray-900 text-white px-8 py-6 rounded-md text-lg font-medium transition-colors bg-transparent shadow-sm"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="text-white px-8 py-6 rounded-md text-lg font-medium transition-colors inline-flex items-center shadow-sm"
                  style={{ backgroundColor: "#00693F" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005a35")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#00693F")}
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
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Featured Courses</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Course Card 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <img src="/assets/python-course.jpg" alt="Python Course" className="w-full h-48 object-cover" />
                <span className="absolute top-4 right-4 bg-gray-600 text-white px-3 py-1 rounded-full text-sm">
                  Beginner
                </span>
              </div>
              <div className="p-6 bg-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-2">CS50 Python Course</h3>
                <p className="text-gray-600 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
                </p>
                <p className="text-gray-700 font-medium mb-4">By Instructor</p>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    8 weeks
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                      />
                    </svg>
                    1250
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    4.8
                  </div>
                </div>

                <button
                  className="w-full text-white py-3 rounded-md font-medium transition-colors"
                  style={{ backgroundColor: "#00693F" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005a35")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#00693F")}
                >
                  Enroll Now
                </button>
              </div>
            </div>

            {/* Course Card 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <img src="/assets/python-course.jpg" alt="Python Course" className="w-full h-48 object-cover" />
                <span className="absolute top-4 right-4 bg-gray-600 text-white px-3 py-1 rounded-full text-sm">
                  Beginner
                </span>
              </div>
              <div className="p-6 bg-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-2">CS50 Python Course</h3>
                <p className="text-gray-600 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
                </p>
                <p className="text-gray-700 font-medium mb-4">By Instructor</p>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    8 weeks
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                      />
                    </svg>
                    1250
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    4.8
                  </div>
                </div>

                <button
                  className="w-full text-white py-3 rounded-md font-medium transition-colors"
                  style={{ backgroundColor: "#00693F" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005a35")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#00693F")}
                >
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose DirectEd section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Why Choose DirectEd?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature Card 1 */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div
                className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-lg"
                style={{ backgroundColor: "#00693F" }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Expert Instructors</h3>
              <p className="text-gray-600 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
              </p>
              <Link to="/about" style={{ color: "#00693F" }} className="font-medium hover:underline">
                Learn More
              </Link>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div
                className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-lg"
                style={{ backgroundColor: "#00693F" }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Affordable Pricing</h3>
              <p className="text-gray-600 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
              </p>
              <Link to="/about" style={{ color: "#00693F" }} className="font-medium hover:underline">
                Learn More
              </Link>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div
                className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-lg"
                style={{ backgroundColor: "#00693F" }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Global Opportunities</h3>
              <p className="text-gray-600 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
              </p>
              <Link to="/about" style={{ color: "#00693F" }} className="font-medium hover:underline">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            What our Students Say About their Experience
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="relative flex justify-center">
              <div className="relative bg-white p-8 rounded-3xl shadow-lg max-w-sm">
                {/* Green accent shadow */}
                <div
                  className="absolute inset-0 rounded-3xl -z-10 transform translate-x-2 translate-y-2"
                  style={{ backgroundColor: "#00693F" }}
                ></div>

                <div className="flex items-start mb-4">
                  <img
                    src="/assets/student1.jpg"
                    alt="Hannah Schmitt"
                    className="w-16 h-16 rounded-full object-cover mr-4 flex-shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Hannah Schmitt</h4>
                    <p className="text-gray-600 text-sm">Lead designer</p>
                  </div>
                </div>
                <div className="text-4xl mb-3" style={{ color: "#00693F" }}>
                  "
                </div>
                <p className="text-gray-700 leading-relaxed text-base">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus
                  maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu.
                </p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="relative flex justify-center">
              <div className="relative bg-white p-8 rounded-3xl shadow-lg max-w-sm">
                {/* Green accent shadow */}
                <div
                  className="absolute inset-0 rounded-3xl -z-10 transform translate-x-2 translate-y-2"
                  style={{ backgroundColor: "#00693F" }}
                ></div>

                <div className="flex items-start mb-4">
                  <img
                    src="/assets/student2.jpg"
                    alt="John Doe"
                    className="w-16 h-16 rounded-full object-cover mr-4 flex-shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">John Doe</h4>
                    <p className="text-gray-600 text-sm">Software Developer</p>
                  </div>
                </div>
                <div className="text-4xl mb-3" style={{ color: "#00693F" }}>
                  "
                </div>
                <p className="text-gray-700 leading-relaxed text-base">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus
                  maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home;
