import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, Heart, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function About() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">About DirectEd</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make quality education accessible to everyone, everywhere. Through innovative
            technology and expert instruction, we're breaking down barriers to learning and empowering individuals to
            achieve their goals.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <Target className="w-8 h-8 text-[#00693F] mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              To democratize education by providing high-quality, accessible learning experiences that empower
              individuals to develop new skills, advance their careers, and achieve their personal and professional
              goals.
            </p>
          </div>

          <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <Heart className="w-8 h-8 text-[#00693F] mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Vision</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              A world where quality education is accessible to all, regardless of location, background, or
              circumstances. We envision a future where learning is personalized, engaging, and directly applicable to
              real-world challenges.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00693F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-[#00693F]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Accessibility</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Education should be available to everyone, regardless of their circumstances or background.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00693F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-[#00693F]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Excellence</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We maintain the highest standards in course content, instruction, and learning outcomes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00693F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-[#00693F]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Innovation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We continuously evolve our platform and methods to enhance the learning experience.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">BM</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Boaz Marube</h3>
              <p className="text-[#00693F] font-medium mb-3">Full Stack Developer</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Full-stack developer with expertise in React, Node.js, and modern web technologies.
              </p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">BE</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Bereket Eshete</h3>
              <p className="text-[#00693F] font-medium mb-3">Full Stack Developer</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Experienced developer specializing in scalable web applications and database design.
              </p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">SK</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Sena Kebede</h3>
              <p className="text-[#00693F] font-medium mb-3">Gen AI Developer</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                AI specialist focused on integrating machine learning and generative AI into educational platforms.
              </p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">MH</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Mahder Hawaz</h3>
              <p className="text-[#00693F] font-medium mb-3">Full Stack Developer</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Full-stack developer with expertise in modern frameworks and cloud technologies.
              </p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">SN</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Solomon Nderitu</h3>
              <p className="text-[#00693F] font-medium mb-3">Gen AI Developer</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Generative AI developer specializing in natural language processing and educational AI tools.
              </p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">JA</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">June Aminga</h3>
              <p className="text-[#00693F] font-medium mb-3">UI/UX Designer</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Creative UI/UX designer focused on creating intuitive and engaging user experiences for educational platforms.
              </p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">FL</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Finlay</h3>
              <p className="text-[#00693F] font-medium mb-3">UI/UX Designer</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Innovative designer specializing in user-centered design and accessibility for educational technology.
              </p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">NK</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Nuhamin</h3>
              <p className="text-[#00693F] font-medium mb-3">UI/UX Designer</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Design expert passionate about creating seamless learning experiences through thoughtful interface design.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#00693F] mb-2">10,000+</div>
              <div className="text-gray-600 dark:text-gray-300">Students Enrolled</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#00693F] mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-300">Courses Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#00693F] mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-300">Expert Instructors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#00693F] mb-2">95%</div>
              <div className="text-gray-600 dark:text-gray-300">Completion Rate</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-[#00693F] text-white rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students who are already advancing their careers with DirectEd.
          </p>
          <div className="space-x-4">
            <Link
              to="/courses"
              className="inline-block bg-white text-[#00693F] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Courses
            </Link>
            {!user && (
              <Link
                to="/signup"
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#00693F] transition-colors"
              >
                Sign Up Now
              </Link>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}