import api from './api';
import { ApiResponse } from '@/types';

export interface UploadResult {
  url: string;
  publicId: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  duration?: number;
}

export const mediaService = {
  async upload(file: File): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post<ApiResponse<UploadResult>>('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
};
