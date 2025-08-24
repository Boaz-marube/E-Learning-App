import React, { useState } from 'react';
import { Upload, Video, X } from 'lucide-react';
import { uploadVideo } from '../../utils/uploadHelpers';

interface VideoUploadProps {
  onUploadComplete: (videoUrl: string) => void;
  courseId?: string;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onUploadComplete, courseId }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Please select a video file');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadVideo(
        file,
        `Lesson Video - ${file.name}`,
        'Lesson video content',
        courseId
      );
      onUploadComplete(result.url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragActive
          ? 'border-[#00693F] bg-green-50 dark:bg-green-900/20'
          : 'border-gray-300 dark:border-gray-600'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      {uploading ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00693F] mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Uploading video...</p>
        </div>
      ) : (
        <>
          <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Drag and drop your video file here, or click to select
          </p>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
            id="video-upload"
          />
          <label
            htmlFor="video-upload"
            className="inline-flex items-center px-4 py-2 bg-[#00693F] text-white rounded-lg cursor-pointer hover:opacity-90"
          >
            <Upload className="w-4 h-4 mr-2" />
            Select Video
          </label>
          <p className="text-xs text-gray-500 mt-2">
            Supported formats: MP4, AVI, MOV, WebM (Max: 100MB)
          </p>
        </>
      )}
    </div>
  );
};

export default VideoUpload;