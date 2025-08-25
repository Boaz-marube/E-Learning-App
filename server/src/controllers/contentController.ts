import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import ContentModel from '../models/contentModel';
import { ApiResponse, Content } from '../../../types';
import ErrorHandler from '../utils/errorHandler';

// Get content by ID (secure access)
export const getContentById = async (
  req: Request<{ id: string }>, 
  res: Response<ApiResponse<Content>>, 
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler('Invalid content ID', 400));
    }

    const content = await ContentModel.findById(id)
      .populate('uploadedBy', 'name email')
      .populate('courseId', 'title');

    if (!content) {
      return next(new ErrorHandler('Content not found', 404));
    }

    // Check access permissions
    const isOwner = req.user && req.user._id === content.uploadedBy.toString();
    const isPublic = content.isPublic;

    if (!isPublic && !isOwner) {
      return next(new ErrorHandler('Access denied. Content is private', 403));
    }

    // Transform to shared type format
    const contentData: Content = {
      _id: (content._id as Types.ObjectId).toString(),
      title: content.title,
      description: content.description,
      fileType: content.fileType,
      fileUrl: content.fileUrl,
      fileName: content.fileName,
      fileSize: content.fileSize,
      uploadedBy: (content.uploadedBy as Types.ObjectId).toString(),
      courseId: content.courseId ? (content.courseId as Types.ObjectId).toString() : undefined,
      isPublic: content.isPublic,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt
    };

    res.status(200).json({
      success: true,
      message: 'Content retrieved successfully',
      data: contentData
    });

  } catch (error: any) {
    next(error);
  }
};

// Get course content (for enrolled students/course owner)
export const getCourseContent = async (
  req: Request<{ courseId: string }>, 
  res: Response<ApiResponse<Content[]>>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { courseId } = req.params;

    if (!Types.ObjectId.isValid(courseId)) {
      return next(new ErrorHandler('Invalid course ID', 400));
    }

    // TODO: Add enrollment check here when enrollment controller is ready
    // For now, just check if user is authenticated

    const content = await ContentModel.find({ 
      courseId: courseId,
      $or: [
        { isPublic: true },
        { uploadedBy: req.user._id }
      ]
    })
    .populate('uploadedBy', 'name email')
    .sort({ createdAt: -1 });

    // Transform to shared type format
    const contentData: Content[] = content.map(item => ({
      _id: (item._id as Types.ObjectId).toString(),
      title: item.title,
      description: item.description,
      fileType: item.fileType,
      fileUrl: item.fileUrl,
      fileName: item.fileName,
      fileSize: item.fileSize,
      uploadedBy: (item.uploadedBy as Types.ObjectId).toString(),
      courseId: item.courseId ? (item.courseId as Types.ObjectId).toString() : undefined,
      isPublic: item.isPublic,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    res.status(200).json({
      success: true,
      message: `Found ${contentData.length} content items for course`,
      data: contentData
    });

  } catch (error: any) {
    next(error);
  }
};

// Get public content (for landing page/preview)
export const getPublicContent = async (
  req: Request, 
  res: Response<ApiResponse<Content[]>>, 
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 10, fileType } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(20, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter for public content only
    const filter: any = { isPublic: true };
    if (fileType) filter.fileType = fileType;

    const content = await ContentModel.find(filter)
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Transform to shared type format
    const contentData: Content[] = content.map(item => ({
      _id: (item._id as Types.ObjectId).toString(),
      title: item.title,
      description: item.description,
      fileType: item.fileType,
      fileUrl: item.fileUrl,
      fileName: item.fileName,
      fileSize: item.fileSize,
      uploadedBy: (item.uploadedBy as Types.ObjectId).toString(),
      courseId: item.courseId ? (item.courseId as Types.ObjectId).toString() : undefined,
      isPublic: item.isPublic,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    res.status(200).json({
      success: true,
      message: 'Public content retrieved successfully',
      data: contentData
    });

  } catch (error: any) {
    next(error);
  }
};

// Get hardcoded demo lesson video
export const getDemoLesson = async (
  req: Request, 
  res: Response<ApiResponse<{ videoUrl: string; title: string; duration: number }>>, 
  next: NextFunction
) => {
  try {
    // Hardcoded demo video 
    const demoVideo = {
      videoUrl: "https://res.cloudinary.com/demo/video/upload/v1234567890/sample_demo_lesson.mp4",
      title: "Introduction to Programming - Demo Lesson",
      duration: 300 // 5 minutes in seconds
    };

    res.status(200).json({
      success: true,
      message: 'Demo lesson retrieved successfully',
      data: demoVideo
    });

  } catch (error: any) {
    next(error);
  }
};
