import mongoose, { Types } from 'mongoose';
import UserModel from '../models/userModel';
import CourseModel from '../models/courseModel';
import TestimonialModel from '../models/testimonialModel';
import EnrollmentModel from '../models/enrollmentModel';
import NotificationModel from '../models/notificationModel';
import ContentModel from '../models/contentModel';
import ProgressModel from '../models/progressModel';
import AchievementModel from '../models/achievementModel';
import { UserRole } from '../../../types/shared';
import { config } from '../config/config';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await Promise.all([
      UserModel.deleteMany({}),
      CourseModel.deleteMany({}),
      TestimonialModel.deleteMany({}),
      EnrollmentModel.deleteMany({}),
      NotificationModel.deleteMany({}),
      ProgressModel.deleteMany({}),
      AchievementModel.deleteMany({})
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
// Create sample notifications
    await NotificationModel.insertMany([
      {
        userId: student1._id,
        title: 'Welcome to DirectEd!',
        message: 'Welcome to our e-learning platform. Start exploring courses now!',
        type: 'info',
        isRead: false,
        relatedType: 'general'
      },
      {
        userId: student1._id,
        title: 'Course Progress Update',
        message: 'Great job! You have completed 75% of the React Development course.',
        type: 'success',
        isRead: false,
        relatedId: (courses[0]._id as Types.ObjectId).toString(),
        relatedType: 'course'
      },
      {
        userId: student2._id,
        title: 'New Course Available',
        message: 'Check out the new TypeScript course by Prof. Michael Chen!',
        type: 'info',
        isRead: true,
        relatedId: (courses[3]._id as Types.ObjectId).toString(),
        relatedType: 'course'
      }
    ]);

    // Create sample content
    await ContentModel.insertMany([
      {
        title: 'Course Introduction PDF',
        description: 'Welcome document for new students',
        fileType: 'pdf',
        fileUrl: 'https://res.cloudinary.com/demo/image/upload/sample_pdf.pdf',
        fileName: 'course_intro.pdf',
        fileSize: 2048000, // 2MB
        uploadedBy: instructor1._id,
        courseId: courses[0]._id,
        isPublic: true
      },
      {
        title: 'JavaScript Cheat Sheet',
        description: 'Quick reference for JavaScript syntax',
        fileType: 'image',
        fileUrl: 'https://res.cloudinary.com/demo/image/upload/sample_cheatsheet.jpg',
        fileName: 'js_cheatsheet.jpg',
        fileSize: 1024000, // 1MB
        uploadedBy: instructor1._id,
        courseId: courses[2]._id,
        isPublic: true
      },
      {
        title: 'Private Notes',
        description: 'Personal study notes',
        fileType: 'document',
        fileUrl: 'https://res.cloudinary.com/demo/raw/upload/sample_notes.docx',
        fileName: 'my_notes.docx',
        fileSize: 512000, // 512KB
        uploadedBy: student1._id,
        isPublic: false
      }
    ]);

    // Create sample progress
    await ProgressModel.insertMany([
      {
        userId: student1._id,
        courseId: courses[0]._id, // React course
        completedLessons: ['lesson1', 'lesson2', 'lesson3'],
        currentLesson: 'lesson4',
        progressPercentage: 75,
        timeSpent: 180, // 3 hours
        lastAccessed: new Date(),
        isCompleted: false
      },
      {
        userId: student1._id,
        courseId: courses[2]._id, // JavaScript course
        completedLessons: ['lesson1', 'lesson2', 'lesson3', 'lesson4', 'lesson5'],
        progressPercentage: 100,
        timeSpent: 150, // 2.5 hours
        lastAccessed: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        isCompleted: true,
        completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        userId: student2._id,
        courseId: courses[1]._id, // Node.js course
        completedLessons: ['lesson1', 'lesson2'],
        currentLesson: 'lesson3',
        progressPercentage: 40,
        timeSpent: 120, // 2 hours
        lastAccessed: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isCompleted: false
      }
    ]);

    // Create sample achievements
    await AchievementModel.insertMany([
      // Student achievements
      {
        userId: student1._id,
        courseId: courses[2]._id,
        type: 'course_completion',
        title: 'JavaScript Master',
        description: 'Completed the JavaScript Fundamentals course',
        badgeUrl: 'https://res.cloudinary.com/demo/image/upload/js_badge.png',
        earnedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        userId: student1._id,
        type: 'first_course',
        title: 'First Steps',
        description: 'Completed your first course on the platform',
        badgeUrl: 'https://res.cloudinary.com/demo/image/upload/first_course_badge.png',
        earnedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        userId: student2._id,
        type: 'streak',
        title: '7-Day Streak',
        description: 'Learned for 7 consecutive days',
        badgeUrl: 'https://res.cloudinary.com/demo/image/upload/streak_badge.png',
        earnedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
      },
      // Instructor achievements
      {
        userId: instructor1._id,
        type: 'first_course',
        title: 'Course Creator',
        description: 'Created your first course on the platform',
        badgeUrl: 'https://res.cloudinary.com/demo/image/upload/course_creator_badge.png',
        earnedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        userId: instructor1._id,
        type: 'streak',
        title: '100 Students',
        description: 'Reached 100 total student enrollments',
        badgeUrl: 'https://res.cloudinary.com/demo/image/upload/100_students_badge.png',
        earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        userId: instructor2._id,
        type: 'first_course',
        title: 'Course Creator',
        description: 'Created your first course on the platform',
        badgeUrl: 'https://res.cloudinary.com/demo/image/upload/course_creator_badge.png',
        earnedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('📊 Sample data created:');
    console.log('- 2 Instructors');
    console.log('- 2 Students');
    console.log('- 4 Courses (3 featured)');
    console.log('- 4 Testimonials');
    console.log('- 3 Enrollments');
    console.log('- 3 Notifications');
    console.log('- 3 Content Items');
    console.log('- 3 Progress Records');
    console.log('- 6 Achievements (3 student + 3 instructor)');

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
