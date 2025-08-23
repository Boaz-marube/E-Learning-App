import { FileType } from './common';

export interface Content {
  _id: string;
  title: string;
  description?: string;
  fileType: FileType;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  uploadedBy: string;
  courseId?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  content?: Content;
}