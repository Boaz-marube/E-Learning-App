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

export default { createCourseCompletionAchievement };