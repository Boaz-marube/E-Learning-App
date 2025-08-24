import { api } from './api';

export interface UploadResult {
  url: string;
  contentId: string;
}

export const uploadImage = async (
  file: File, 
  title: string, 
  description?: string,
  courseId?: string
): Promise<UploadResult> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  if (description) formData.append('description', description);
  if (courseId) formData.append('courseId', courseId);
  formData.append('isPublic', 'true');

  const response = await api.post('/api/upload/document', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return {
    url: response.data.content.fileUrl,
    contentId: response.data.content._id
  };
};

export const uploadVideo = async (
  file: File, 
  title: string, 
  description?: string,
  courseId?: string
): Promise<UploadResult> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  if (description) formData.append('description', description);
  if (courseId) formData.append('courseId', courseId);
  formData.append('isPublic', 'true');

  const response = await api.post('/api/upload/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return {
    url: response.data.content.fileUrl,
    contentId: response.data.content._id
  };
};