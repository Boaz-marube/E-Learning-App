import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload file to Cloudinary
export const uploadToCloudinary = async (
  fileBuffer: Buffer, 
  fileName: string, 
  fileType: string
): Promise<{ url: string; public_id: string }> => {
  
  return new Promise((resolve, reject) => {
    const isVideo = fileType.startsWith('video/');
    const uploadOptions: any = {
      resource_type: 'auto', // Automatically detect file type
      public_id: `elearning/${Date.now()}_${fileName.split('.')[0]}`,
      use_filename: true,
      unique_filename: false,
      ...(isVideo && {
        video_codec: 'h264',
        quality: 'auto:good',
        format: 'mp4'
      })
    };

    // Upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            public_id: result.public_id
          });
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

// Delete file from Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

export default cloudinary;
