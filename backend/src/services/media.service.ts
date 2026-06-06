import { v2 as cloudinaryUpload } from 'cloudinary';
import { cloudinary, configureCloudinary, isCloudinaryConfigured } from '../config/cloudinary';
import { AppError } from '../utils/errors';
import { Readable } from 'stream';

configureCloudinary();

export class MediaService {
  async uploadFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<{
    url: string;
    publicId: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
    width?: number;
    height?: number;
    duration?: number;
  }> {
    if (!isCloudinaryConfigured()) {
      throw new AppError('Cloudinary is not configured', 503, 'STORAGE_UNAVAILABLE');
    }

    const resourceType = this.getResourceType(mimeType);
    const folder = 'chatflow-ai';

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          public_id: `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
        },
        (error, result) => {
          if (error || !result) {
            reject(new AppError('File upload failed', 500, 'UPLOAD_FAILED'));
            return;
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            fileName: originalName,
            mimeType,
            fileSize: result.bytes,
            width: result.width,
            height: result.height,
            duration: result.duration,
          });
        }
      );

      const readable = new Readable();
      readable.push(buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }

  async deleteFile(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image') {
    if (!isCloudinaryConfigured()) return;
    await cloudinaryUpload.uploader.destroy(publicId, { resource_type: resourceType });
  }

  private getResourceType(mimeType: string): 'image' | 'video' | 'raw' {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    return 'raw';
  }
}

export const mediaService = new MediaService();
