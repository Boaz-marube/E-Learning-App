import mongoose from 'mongoose';
import UserModel from '../models/userModel';
import CourseModel from '../models/courseModel';
import TestimonialModel from '../models/testimonialModel';
import EnrollmentModel from '../models/enrollmentModel';
import { UserRole } from '../../../types/shared';
import { config } from '../config/config';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await Promise.all([
      CourseModel.deleteMany({}),
      TestimonialModel.deleteMany({}),
      EnrollmentModel.deleteMany({})
    ]);

    // Create sample instructors
    const instructor1 = await UserModel.create({
      name: 'Dr. Sarah Johnson',
      email: 'sarah.instructor@example.com',
      password: 'password123',
      role: UserRole.INSTRUCTOR,
      isVerified: true
    });

    const instructor2 = await UserModel.create({
      name: 'Prof. Michael Chen',
      email: 'michael.instructor@example.com',
      password: 'password123',
      role: UserRole.INSTRUCTOR,
      isVerified: true
    });

    // Create sample students
    const student1 = await UserModel.create({
      name: 'Alice Smith',
      email: 'alice.student@example.com',
      password: 'password123',
      role: UserRole.STUDENT,
      isVerified: true
    });

    const student2 = await UserModel.create({
      name: 'Bob Wilson',
      email: 'bob.student@example.com',
      password: 'password123',
      role: UserRole.STUDENT,
      isVerified: true
    });

    // Create sample courses
    const courses = await CourseModel.insertMany([
      {
        title: 'Complete React Development',
        description: 'Master React from basics to advanced concepts including hooks, context, and state management.',
        instructor: instructor1._id,
        price: 99.99,
        duration: 40,
        level: 'intermediate',
        thumbnail: 'https://via.placeholder.com/300x200?text=React+Course',
        isFeatured: true,
        isPublished: true,
        enrollmentCount: 150,
        rating: 4.8
      },
      {
        title: 'Node.js Backend Mastery',
        description: 'Build scalable backend applications with Node.js, Express, and MongoDB.',
        instructor: instructor2._id,
        price: 89.99,
        duration: 35,
        level: 'advanced',
        thumbnail: 'https://via.placeholder.com/300x200?text=Node.js+Course',
        isFeatured: true,
        isPublished: true,
        enrollmentCount: 120,
        rating: 4.7
      },
      {
        title: 'JavaScript Fundamentals',
        description: 'Learn JavaScript from scratch with hands-on projects and real-world examples.',
        instructor: instructor1._id,
        price: 49.99,
        duration: 25,
        level: 'beginner',
        thumbnail: 'https://via.placeholder.com/300x200?text=JavaScript+Course',
        isFeatured: true,
        isPublished: true,
        enrollmentCount: 300,
        rating: 4.9
      },
      {
        title: 'TypeScript for Developers',
        description: 'Add type safety to your JavaScript projects with TypeScript.',
        instructor: instructor2._id,
        price: 79.99,
        duration: 30,
        level: 'intermediate',
        thumbnail: 'https://via.placeholder.com/300x200?text=TypeScript+Course',
        isFeatured: false,
        isPublished: true,
        enrollmentCount: 80,
        rating: 4.6
      }
    ]);

    // Create sample testimonials
    await TestimonialModel.insertMany([
      {
        name: 'Alice Smith',
        role: 'student',
        message: 'The React course completely transformed my understanding of modern web development. Highly recommended!',
        rating: 5,
        avatar: 'https://via.placeholder.com/100x100?text=AS',
        courseTitle: 'Complete React Development',
        isActive: true
      },
      {
        name: 'Bob Wilson',
        role: 'student',
        message: 'Excellent content and clear explanations. The Node.js course helped me land my dream job!',
        rating: 5,
        avatar: 'https://via.placeholder.com/100x100?text=BW',
        courseTitle: 'Node.js Backend Mastery',
        isActive: true
      },
      {
        name: 'Dr. Sarah Johnson',
        role: 'instructor',
        message: 'Teaching on this platform has been incredibly rewarding. Great community of learners!',
        rating: 5,
        avatar: 'https://via.placeholder.com/100x100?text=SJ',
        isActive: true
      },
      {
        name: 'Emma Davis',
        role: 'student',
        message: 'The JavaScript fundamentals course is perfect for beginners. Step-by-step approach works great!',
        rating: 4,
        avatar: 'https://via.placeholder.com/100x100?text=ED',
        courseTitle: 'JavaScript Fundamentals',
        isActive: true
      }
    ]);

    // Create sample enrollments
    await EnrollmentModel.insertMany([
      {
        userId: student1._id,
        courseId: courses[0]._id,
        progress: 75,
        isActive: true
      },
      {
        userId: student2._id,
        courseId: courses[1]._id,
        progress: 50,
        isActive: true
      },
      {
        userId: student1._id,
        courseId: courses[2]._id,
        progress: 100,
        completedAt: new Date(),
        isActive: true
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('📊 Sample data created:');
    console.log('- 2 Instructors');
    console.log('- 2 Students');
    console.log('- 4 Courses (3 featured)');
    console.log('- 4 Testimonials');
    console.log('- 3 Enrollments');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};

// Run seeder if called directly
if (require.main === module) {
  mongoose.connect(config.mongo.url)
    .then(() => {
      console.log('📦 Connected to MongoDB for seeding');
      return seedDatabase();
    })
    .then(() => {
      console.log('🎉 Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}
