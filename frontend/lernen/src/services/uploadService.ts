import apiService from './apiService';

export interface PreSignedUrlResponse {
    objectKey: string;
    presignedUrl: string;
    finalUrl: string;
    expiresAt: string;
}

export const uploadService = {
    getPreSignedUrl: async (contentType: string): Promise<PreSignedUrlResponse> => {
        const response = await apiService.post<PreSignedUrlResponse>('/v1/file/documents/presigned-url', {
            contentType,
        });
        return response.data;
    },

    uploadFileToS3: async (uploadUrl: string, file: File): Promise<void> => {
        const response = await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to upload file to S3');
        }
    },
};