import apiService from './apiService';

export interface PreSignedUrlResponse {
    uploadUrl: string;
    fileUrl: string;
}

export const uploadService = {
    getPreSignedUrl: async (fileName: string, contentType: string): Promise<PreSignedUrlResponse> => {
        const response = await apiService.post<PreSignedUrlResponse>('/v1/common/upload/pre-signed-url', {
            fileName,
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