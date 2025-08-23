import type React from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import AfricaTechHero from "../components/ui/HeroSection"
import FeaturedCourses from "../components/ui/FeaturedCourses"

const Home: React.FC = () => {
  const { user } = useAuth()

  return (
    <div className="relative">
      {/* Hero Section */}
      <AfricaTechHero />
      
      {/* Featured Courses */}
      <FeaturedCourses />

      {/* Why Choose DirectEd section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center transition-colors duration-300">
            Why Choose DirectEd?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            {/* Feature Card 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8 text-center shadow-sm hover:shadow-md transition-all duration-300">
              <div
                className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-lg transition-transform duration-300 hover:scale-105"
                style={{ backgroundColor: "#00693F" }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                Industry Professionals
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm md:text-base leading-relaxed transition-colors duration-300">
                Learn from experts at Google, Microsoft, and Amazon. Our instructors bring real-world experience to every lesson.
              </p>
              <Link 
                to="/" 
                className="text-green-700 dark:text-green-400 font-medium hover:text-green-800 dark:hover:text-green-300 hover:underline transition-colors duration-300"
              >
                Meet Our Instructors
              </Link>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8 text-center shadow-sm hover:shadow-md transition-all duration-300">
              <div
                className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-lg transition-transform duration-300 hover:scale-105"
                style={{ backgroundColor: "#00693F" }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                Flexible Learning Plans
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm md:text-base leading-relaxed transition-colors duration-300">
                Start learning for just $29/month. Choose from monthly, quarterly, or annual plans with no hidden fees.
              </p>
              <Link 
                to="/" 
                className="text-green-700 dark:text-green-400 font-medium hover:text-green-800 dark:hover:text-green-300 hover:underline transition-colors duration-300"
              >
                View Pricing
              </Link>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8 text-center shadow-sm hover:shadow-md transition-all duration-300 md:col-span-2 lg:col-span-1">
              <div
                className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-lg transition-transform duration-300 hover:scale-105"
                style={{ backgroundColor: "#00693F" }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8m0 10h8m-8 0a2 2 0 002 2h4a2 2 0 002-2m-8 0V8a2 2 0 012-2h4a2 2 0 012 2v8"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                Career-Ready Skills
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm md:text-base leading-relaxed transition-colors duration-300">
                85% of our graduates land jobs within 6 months. Build portfolio projects and get career support throughout your journey.
              </p>
              <Link 
                to="/" 
                className="text-green-700 dark:text-green-400 font-medium hover:text-green-800 dark:hover:text-green-300 hover:underline transition-colors duration-300"
              >
                Success Stories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center transition-colors duration-300">
            What our Students Say About their Experience
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Testimonial 1 */}
            <div className="relative flex justify-center">
              <div className="relative bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-lg w-full max-w-sm transition-colors duration-300">
                {/* Green accent shadow */}
                <div
                  className="absolute inset-0 rounded-3xl -z-10 transform translate-x-2 translate-y-2"
                  style={{ backgroundColor: "#00693F" }}
                ></div>

                <div className="flex items-start mb-4">
                  <img
                    src="/assets/student1.jpg"
                    alt="Hannah Schmitt"
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover mr-3 md:mr-4 flex-shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-base md:text-lg transition-colors duration-300">Hannah Schmitt</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm transition-colors duration-300">Lead Designer</p>
                  </div>
                </div>
                <div className="text-3xl md:text-4xl mb-3 text-green-700 dark:text-green-400 transition-colors duration-300">
                  "
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base transition-colors duration-300">
                  DirectEd transformed my career! The hands-on projects and expert mentorship helped me land my dream job at a top design agency.
                </p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="relative flex justify-center">
              <div className="relative bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-lg w-full max-w-sm transition-colors duration-300">
                {/* Green accent shadow */}
                <div
                  className="absolute inset-0 rounded-3xl -z-10 transform translate-x-2 translate-y-2"
                  style={{ backgroundColor: "#00693F" }}
                ></div>

                <div className="flex items-start mb-4">
                  <img
                    src="/assets/student2.jpg"
                    alt="John Doe"
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover mr-3 md:mr-4 flex-shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-base md:text-lg transition-colors duration-300">John Doe</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm transition-colors duration-300">Software Developer</p>
                  </div>
                </div>
                <div className="text-3xl md:text-4xl mb-3 text-green-700 dark:text-green-400 transition-colors duration-300">
                  "
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base transition-colors duration-300">
                  The practical approach and real-world projects at DirectEd gave me the confidence to switch careers. Now I'm a full-stack developer!
                </p>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="relative flex justify-center md:col-span-2 lg:col-span-1">
              <div className="relative bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-lg w-full max-w-sm transition-colors duration-300">
                {/* Green accent shadow */}
                <div
                  className="absolute inset-0 rounded-3xl -z-10 transform translate-x-2 translate-y-2"
                  style={{ backgroundColor: "#00693F" }}
                ></div>

                <div className="flex items-start mb-4">
                  <img
                    src="/assets/student1.jpg"
                    alt="Sarah Johnson"
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover mr-3 md:mr-4 flex-shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-base md:text-lg transition-colors duration-300">Sarah Johnson</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm transition-colors duration-300">Data Scientist</p>
                  </div>
                </div>
                <div className="text-3xl md:text-4xl mb-3 text-green-700 dark:text-green-400 transition-colors duration-300">
                  "
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base transition-colors duration-300">
                  Amazing learning experience! The AI course was comprehensive and the instructors were incredibly supportive throughout my journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  )
}

export default Home;
