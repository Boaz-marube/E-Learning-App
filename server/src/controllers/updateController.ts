import { Request, Response } from 'express';
import CourseModel from '../models/courseModel';

export const updateCourseThumbnails = async (req: Request, res: Response) => {
  try {
    // Update specific courses with new thumbnails and video URLs
    await CourseModel.updateOne(
      { title: 'Complete React Development' },
      { 
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
        previewVideoUrl: 'https://res.cloudinary.com/dqtieesdu/video/upload/v1756091519/2887463-hd_1920_1080_25fps_xwzc8a.mp4'
      }
    );

    await CourseModel.updateOne(
      { title: 'Node.js Backend Mastery' },
      { thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop' }
    );

    await CourseModel.updateOne(
      { title: 'JavaScript Fundamentals' },
      { thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=250&fit=crop' }
    );

    await CourseModel.updateOne(
      { title: 'TypeScript for Developers' },
      { thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop' }
    );

    res.status(200).json({ 
      status: 'OK', 
      message: 'Course thumbnails updated successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Failed to update thumbnails', 
      error 
    });
  }
};