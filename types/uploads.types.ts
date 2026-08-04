export interface GetPresignedUrlPayload {
  fileName: string;
  contentType: string;
  folder?: string;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  fileUrl: string;
  key: string;
}
