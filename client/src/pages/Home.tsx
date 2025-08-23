import type React from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import AfricaTechHero from "../components/ui/HeroSection"
import FeaturedCourses from "../components/ui/FeaturedCourses" 

const Home: React.FC = () => {
  // const { user } = useAuth()

  return (
    <div className="relative">
      {/* Hero Section */}
      <AfricaTechHero />
      
      {/* Featured Courses */}
      <FeaturedCourses />

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

      
    </div>
  )
}

export default Home;
