import { GetPresignedUrlPayload, PresignedUrlResponse } from '@/types';
import { request } from './axios.config';

export const uploadsApi = {
  getPresignedUrl: (data: GetPresignedUrlPayload) =>
    request<PresignedUrlResponse>({
      url: '/uploads/presigned-url',
      method: 'POST',
      data,
    }),
};
