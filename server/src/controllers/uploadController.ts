import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import ContentModel from '../models/contentModel';
import { ApiResponse, Content, UploadResponse } from '../../../types/shared';
import ErrorHandler from '../utils/errorHandler';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';

// Extend Request interface for file upload
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}



// Upload document/image
export const uploadDocument = async (
  req: MulterRequest, 
  res: Response<UploadResponse>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    if (!req.file) {
      return next(new ErrorHandler('No file uploaded', 400));
    }

    const { title, description, courseId, isPublic = false } = req.body;

    if (!title) {
      return next(new ErrorHandler('Content title is required', 400));
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(req.file.mimetype)) {
      return next(new ErrorHandler('Invalid file type. Only images, PDFs, and documents are allowed', 400));
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (req.file.size > maxSize) {
      return next(new ErrorHandler('File size too large. Maximum 10MB allowed', 400));
    }

    // Determine file type
    let fileType: 'video' | 'document' | 'image' | 'pdf';
    if (req.file.mimetype.startsWith('image/')) {
      fileType = 'image';
    } else if (req.file.mimetype === 'application/pdf') {
      fileType = 'pdf';
    } else {
      fileType = 'document';
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    // Validate courseId if provided
    if (courseId && !Types.ObjectId.isValid(courseId)) {
      return next(new ErrorHandler('Invalid course ID', 400));
    }

    // Save to database
    const content = await ContentModel.create({
      title,
      description,
      fileType,
      fileUrl: uploadResult.url,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      uploadedBy: req.user._id,
      courseId: courseId ? new Types.ObjectId(courseId) : undefined,
      isPublic: Boolean(isPublic)
    });

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

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      content: contentData
    });

  } catch (error: any) {
    next(error);
  }
};

// Get user's uploaded content
export const getUserContent = async (
  req: Request, 
  res: Response<ApiResponse<Content[]>>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { page = 1, limit = 20, fileType, courseId } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: any = { uploadedBy: req.user._id };
    if (fileType) filter.fileType = fileType;
    if (courseId) filter.courseId = courseId;

    const content = await ContentModel.find(filter)
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
      message: 'Content retrieved successfully',
      data: contentData
    });

  } catch (error: any) {
    next(error);
  }
};

// Delete content
export const deleteContent = async (
  req: Request<{ id: string }>, 
  res: Response<ApiResponse>, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler('Invalid content ID', 400));
    }

    const content = await ContentModel.findOneAndDelete({
      _id: id,
      uploadedBy: req.user._id
    });

    if (!content) {
      return next(new ErrorHandler('Content not found or unauthorized', 404));
    }

    // Delete from Cloudinary
    try {
      // Extract public_id from URL (assuming standard Cloudinary URL format)
      const urlParts = content.fileUrl.split('/');
      const publicIdWithExt = urlParts[urlParts.length - 1];
      const publicId = `elearning/${publicIdWithExt.split('.')[0]}`;
      await deleteFromCloudinary(publicId);
    } catch (cloudinaryError) {
      console.error('Failed to delete from Cloudinary:', cloudinaryError);
      // Continue with database deletion even if Cloudinary fails
    }

    res.status(200).json({
      success: true,
      message: 'Content deleted successfully'
    });

  } catch (error: any) {
    next(error);
  }
};

