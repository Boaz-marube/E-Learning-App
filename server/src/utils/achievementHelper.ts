import AchievementModel from '../models/achievementModel';
import ProgressModel from '../models/progressModel';
import { Types } from 'mongoose';

// Create achievement when course is completed
export const createCourseCompletionAchievement = async (
  userId: Types.ObjectId, 
  courseId: Types.ObjectId,
  courseTitle: string
) => {
  try {
    // Check if achievement already exists
    const existingAchievement = await AchievementModel.findOne({
      userId,
      courseId,
      type: 'course_completion'
    });

    if (existingAchievement) {
      return; // Achievement already exists
    }

    // Create course completion achievement
    await AchievementModel.create({
      userId,
      courseId,
      type: 'course_completion',
      title: `${courseTitle} Master`,
      description: `Completed the ${courseTitle} course`,
      badgeUrl: 'https://res.cloudinary.com/demo/image/upload/course_completion_badge.png'
    });

    // Check for first course achievement
    const completedCourses = await ProgressModel.countDocuments({
      userId,
      isCompleted: true
    });

    if (completedCourses === 1) {
      const firstCourseExists = await AchievementModel.findOne({
        userId,
        type: 'first_course'
      });

      if (!firstCourseExists) {
        await AchievementModel.create({
          userId,
          type: 'first_course',
          title: 'First Steps',
          description: 'Completed your first course on the platform',
          badgeUrl: 'https://res.cloudinary.com/demo/image/upload/first_course_badge.png'
        });
      }
    }

    // Check for fast learner achievement (completed in less than average time)
    const progress = await ProgressModel.findOne({ userId, courseId });
    if (progress && progress.timeSpent < 120) { // Less than 2 hours
      const fastLearnerExists = await AchievementModel.findOne({
        userId,
        courseId,
        type: 'fast_learner'
      });

      if (!fastLearnerExists) {
        await AchievementModel.create({
          userId,
          courseId,
          type: 'fast_learner',
          title: 'Speed Demon',
          description: `Completed ${courseTitle} in record time!`,
          badgeUrl: 'https://res.cloudinary.com/demo/image/upload/fast_learner_badge.png'
        });
      }
    }

  } catch (error) {
    console.error('Error creating achievements:', error);
  }
};

// Create achievement when instructor creates first course
export const createInstructorAchievements = async (
  instructorId: Types.ObjectId,
  eventType: 'first_course' | 'student_milestone' | 'top_instructor',
  courseTitle?: string,
  studentCount?: number
) => {
  try {
    let achievement;

    switch (eventType) {
      case 'first_course':
        const firstCourseExists = await AchievementModel.findOne({
          userId: instructorId,
          type: 'course_creator'
        });

        if (!firstCourseExists) {
          achievement = await AchievementModel.create({
            userId: instructorId,
            type: 'course_creator',
            title: 'Course Creator',
            description: 'Created your first course on the platform',
            badgeUrl: 'https://res.cloudinary.com/demo/image/upload/course_creator_badge.png'
          });
        }
        break;

      case 'student_milestone':
        if (studentCount && studentCount >= 100) {
          const milestoneExists = await AchievementModel.findOne({
            userId: instructorId,
            type: 'student_milestone'
          });

          if (!milestoneExists) {
            achievement = await AchievementModel.create({
              userId: instructorId,
              type: 'student_milestone',
              title: '100 Students',
              description: 'Reached 100 total student enrollments',
              badgeUrl: 'https://res.cloudinary.com/demo/image/upload/100_students_badge.png'
            });
          }
        }
        break;

      case 'top_instructor':
        const topInstructorExists = await AchievementModel.findOne({
          userId: instructorId,
          type: 'top_instructor'
        });

        if (!topInstructorExists) {
          achievement = await AchievementModel.create({
            userId: instructorId,
            type: 'top_instructor',
            title: 'Top Instructor',
            description: 'Achieved top instructor status with excellent ratings',
            badgeUrl: 'https://res.cloudinary.com/demo/image/upload/top_instructor_badge.png'
          });
        }
        break;
    }

    return achievement;
  } catch (error) {
    console.error('Error creating instructor achievements:', error);
  }
};

export default { createCourseCompletionAchievement, createInstructorAchievements };