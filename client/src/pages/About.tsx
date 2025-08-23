import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About DirectEd</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make quality education accessible to everyone, everywhere. Through innovative
            technology and expert instruction, we're breaking down barriers to learning and empowering individuals to
            achieve their goals.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Our Mission Card */}
          <div className="p-8 bg-white rounded-lg shadow-sm border group hover:bg-[#00693F] transition-colors">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 mr-3 text-gray-600 group-hover:text-white transition-colors">🎯</div>
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-white transition-colors">
                Our Mission
              </h2>
            </div>
            <p className="text-gray-600 group-hover:text-white leading-relaxed">
              To democratize education by providing high-quality, accessible learning experiences that empower
              individuals to develop new skills, advance their careers, and achieve their personal and professional
              goals.
            </p>
          </div>

          {/* Our Vision Card */}
          <div className="p-8 bg-white rounded-lg shadow-sm border group hover:bg-[#00693F] transition-colors">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 mr-3 text-gray-600 group-hover:text-white transition-colors">❤️</div>
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-white transition-colors">
                Our Vision
              </h2>
            </div>
            <p className="text-gray-600 group-hover:text-white leading-relaxed">
              A world where quality education is accessible to all, regardless of location, background, or
              circumstances. We envision a future where learning is personalized, engaging, and directly applicable to
              real-world challenges.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Accessibility</h3>
              <p className="text-gray-600">
                Education should be available to everyone, regardless of their circumstances or background.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-600">
                We maintain the highest standards in course content, instruction, and learning outcomes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously evolve our platform and methods to enhance the learning experience.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-green-50 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Impact</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">50K+</div>
              <div className="text-gray-600">Students Enrolled</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">200+</div>
              <div className="text-gray-600">Expert Instructors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Courses Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600">Completion Rate</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
