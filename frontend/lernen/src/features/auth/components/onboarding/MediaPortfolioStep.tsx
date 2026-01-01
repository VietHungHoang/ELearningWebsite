import React, { useState, useEffect } from "react";
import { HiCloudUpload, HiOutlineTrash, HiOutlineCamera } from "react-icons/hi";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import type { TutorSocial, Tutor } from "../../../../types/tutor";
import { uploadService } from "../../../../services/uploadService";
import apiService from "../../../../services/apiService";

interface MediaPortfolioStepProps {
    data: Partial<Tutor>;
    onChange: (data: Partial<Tutor>) => void;
}

const MediaPortfolioStep: React.FC<MediaPortfolioStepProps> = ({ data, onChange }) => {
    const { t } = useTranslation();
    const [photoPreview, setPhotoPreview] = useState<string | null>(data.avatarUrl || null);
    const [videoPreview, setVideoPreview] = useState<string | null>(data.videoUrl || null);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [photoUploadError, setPhotoUploadError] = useState(false);
    const [photoUploadSuccess, setPhotoUploadSuccess] = useState(false);
    const [isUploadingVideo, setIsUploadingVideo] = useState(false);
    const [videoUploadError, setVideoUploadError] = useState(false);
    const [videoUploadSuccess, setVideoUploadSuccess] = useState(false);
    const [photoFileInfo, setPhotoFileInfo] = useState<{ name: string; size: number; type: string } | null>(null);
    const [videoFileInfo, setVideoFileInfo] = useState<{ name: string; size: number; type: string } | null>(null);

    // Update preview when data changes (e.g., when loading from backend)
    useEffect(() => {
        if (data.avatarUrl) {
            setPhotoPreview(data.avatarUrl);
        }
    }, [data.avatarUrl]);

    useEffect(() => {
        if (data.videoUrl) {
            setVideoPreview(data.videoUrl);
        }
    }, [data.videoUrl]);

    // Format file size helper
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    // Get file extension from mime type
    const getFileExtension = (mimeType: string): string => {
        const extensionMap: { [key: string]: string } = {
            'image/jpeg': 'JPG',
            'image/jpg': 'JPG',
            'image/png': 'PNG',
            'image/gif': 'GIF',
            'image/webp': 'WEBP',
            'video/mp4': 'MP4',
            'video/quicktime': 'MOV',
            'video/x-msvideo': 'AVI',
            'video/webm': 'WEBM',
            'video/x-ms-wmv': 'WMV',
        };
        return extensionMap[mimeType] || mimeType.split('/')[1].toUpperCase();
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Reset error state
            setPhotoUploadError(false);
            
            // Save file info
            setPhotoFileInfo({
                name: file.name,
                size: file.size,
                type: file.type,
            });
            
            // Show preview immediately
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Start upload
            setIsUploadingPhoto(true);
            setPhotoUploadSuccess(false);
            try {
                // Get pre-signed URL for image
                const response = await apiService.post<{ 
                    objectKey: string;
                    presignedUrl: string;
                    finalUrl: string;
                    expiresAt: string;
                }>('/v1/file/images/presigned-url', {
                    contentType: file.type,
                });

                const { presignedUrl } = response.data;

                // Upload to S3
                await uploadService.uploadFileToS3(presignedUrl, file);

                // Extract base URL from presignedUrl (remove query parameters)
                const imageUrl = presignedUrl.split('?')[0];

                // Update data with imageUrl
                onChange({ avatarUrl: imageUrl });
                
                // Mark upload as successful
                setPhotoUploadSuccess(true);
            } catch (error) {
                console.error("Failed to upload photo:", error);
                // Keep preview but show error
                setPhotoUploadError(true);
                setPhotoUploadSuccess(false);
            } finally {
                setIsUploadingPhoto(false);
            }
        }
    };

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Reset error state
            setVideoUploadError(false);
            
            // Save file info
            setVideoFileInfo({
                name: file.name,
                size: file.size,
                type: file.type,
            });
            
            // Show preview immediately
            const url = URL.createObjectURL(file);
            setVideoPreview(url);

            // Start upload
            setIsUploadingVideo(true);
            setVideoUploadSuccess(false);
            try {
                // Get pre-signed URL for video
                const response = await apiService.post<{ 
                    objectKey: string;
                    presignedUrl: string;
                    finalUrl: string;
                    expiresAt: string;
                }>('/v1/file/videos/presigned-url', {
                    contentType: file.type,
                });

                const { presignedUrl } = response.data;

                // Upload to S3
                await uploadService.uploadFileToS3(presignedUrl, file);

                // Extract base URL from presignedUrl (remove query parameters)
                const videoUrl = presignedUrl.split('?')[0];

                // Update data with videoUrl
                onChange({ videoUrl });
                
                // Mark upload as successful
                setVideoUploadSuccess(true);
            } catch (error) {
                console.error("Failed to upload video:", error);
                // Keep preview but show error
                setVideoUploadError(true);
                setVideoUploadSuccess(false);
            } finally {
                setIsUploadingVideo(false);
            }
        }
    };

    const handleRemovePhoto = () => {
        setPhotoPreview(null);
        setPhotoUploadError(false);
        setPhotoUploadSuccess(false);
        setPhotoFileInfo(null);
        onChange({ avatarUrl: undefined });
    };

    const handleRemoveVideo = () => {
        // Only revoke object URL if it's a blob URL (from local file)
        if (videoPreview && videoPreview.startsWith('blob:')) {
            URL.revokeObjectURL(videoPreview);
        }
        setVideoPreview(null);
        setVideoUploadError(false);
        setVideoUploadSuccess(false);
        setVideoFileInfo(null);
        onChange({ videoUrl: undefined });
    };

    const socialPlatforms = [
        { id: "facebook", name: "Facebook", icon: FaFacebook, placeholder: "https://facebook.com/yourprofile" },
        { id: "twitter", name: "Twitter", icon: FaTwitter, placeholder: "https://twitter.com/yourprofile" },
        { id: "linkedin", name: "LinkedIn", icon: FaLinkedin, placeholder: "https://linkedin.com/in/yourprofile" },
        { id: "instagram", name: "Instagram", icon: FaInstagram, placeholder: "https://instagram.com/yourprofile" },
        { id: "youtube", name: "YouTube", icon: FaYoutube, placeholder: "https://youtube.com/@yourchannel" },
    ];

    const handleSocialLinkChange = (platform: string, url: string) => {
        const existingLinks = data.socialLinks || [];
        const linkIndex = existingLinks.findIndex((link: TutorSocial) => link.platform === platform);

        let updatedLinks: TutorSocial[];
        if (linkIndex >= 0) {
            // Update existing link
            updatedLinks = existingLinks.map((link: TutorSocial, idx: number) => (idx === linkIndex ? { ...link, url } : link));
        } else {
            // Add new link
            updatedLinks = [...existingLinks, { platform, url }];
        }

        onChange({ socialLinks: updatedLinks });
    };

    const getSocialLinkValue = (platform: string): string => {
        return data.socialLinks?.find((link: TutorSocial) => link.platform === platform)?.url || "";
    };

    const inputStyles =
        "w-full bg-gray-100 border border-transparent rounded-lg px-4 py-2.5 text-gray-800 placeholder:text-gray-400 placeholder:font-thin hover:bg-white hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-0 focus:border-[#0b6459] transition-all duration-500 ease-in-out";

    return (
        <div className="space-y-6">

            {/* Profile Photo & Intro Video */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Photo */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('onboarding.mediaPortfolio.profilePhoto')} <span className="text-red-500">*</span>
                    </label>
                    {photoPreview ? (
                        <div className="relative">
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden border-4 border-gray-200">
                                <img
                                    src={photoPreview}
                                    alt="Profile preview"
                                    className="w-full h-full object-cover"
                                />
                                {isUploadingPhoto && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/30 border-t-white"></div>
                                    </div>
                                )}
                                {!isUploadingPhoto && (
                                    <div className="absolute inset-0 flex items-center justify-center z-20 group">
                                        {photoUploadSuccess ? (
                                            <div className="opacity-100">
                                                <HiOutlineCamera className="w-8 h-8 text-white" />
                                            </div>
                                        ) : (
                                            <div className="opacity-0 hover:opacity-100 transition-opacity">
                                                <button
                                                    type="button"
                                                    onClick={handleRemovePhoto}
                                                    className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
                                                >
                                                    <HiOutlineTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs px-3 py-2 z-10">
                                    {photoFileInfo ? (
                                        <div className="flex items-center justify-between">
                                            <span>{getFileExtension(photoFileInfo.type)}</span>
                                            <span>{formatFileSize(photoFileInfo.size)}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <span>Ảnh</span>
                                            <span>-</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">{t('onboarding.mediaPortfolio.photoRecommendation')}</p>
                        </div>
                    ) : (
                        <div>
                            <label
                                htmlFor="photo-upload"
                                className="cursor-pointer flex flex-col items-center justify-center gap-2 w-full aspect-video bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                <HiCloudUpload className="w-8 h-8 text-gray-500" />
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-sm text-gray-600">{t('onboarding.mediaPortfolio.uploadProfilePhoto')}</span>
                                    <span className="text-xs text-gray-500">(JPG, PNG, GIF, WEBP - Tối đa 10MB)</span>
                                </div>
                            </label>
                            <input
                                id="photo-upload"
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="hidden"
                            />
                            <p className="text-xs text-gray-500 mt-2">{t('onboarding.mediaPortfolio.photoRecommendation')}</p>
                        </div>
                    )}
                </div>

                {/* Intro Video */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('onboarding.mediaPortfolio.introVideo')}</label>
                    {videoPreview ? (
                        <div className="relative">
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden border-4 border-gray-200">
                                <video
                                    src={videoPreview}
                                    controls
                                    className="w-full h-full object-cover"
                                />
                                {isUploadingVideo && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/30 border-t-white"></div>
                                    </div>
                                )}
                                {!isUploadingVideo && (
                                    <div className="absolute inset-0 flex items-center justify-center z-20 group">
                                        {videoUploadSuccess ? (
                                            <div className="opacity-100">
                                                <HiOutlineCamera className="w-8 h-8 text-white" />
                                            </div>
                                        ) : (
                                            <div className="opacity-0 hover:opacity-100 transition-opacity">
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveVideo}
                                                    className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
                                                >
                                                    <HiOutlineTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs px-3 py-2 z-10">
                                    {videoFileInfo ? (
                                        <div className="flex items-center justify-between">
                                            <span>{getFileExtension(videoFileInfo.type)}</span>
                                            <span>{formatFileSize(videoFileInfo.size)}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <span>Video</span>
                                            <span>-</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                {t('onboarding.mediaPortfolio.videoRecommendation')}
                            </p>
                        </div>
                    ) : (
                        <div>
                            <label
                                htmlFor="video-upload"
                                className="cursor-pointer flex flex-col items-center justify-center gap-2 w-full aspect-video bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                <HiCloudUpload className="w-8 h-8 text-gray-500" />
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-sm text-gray-600">{t('onboarding.mediaPortfolio.uploadIntroVideo')}</span>
                                    <span className="text-xs text-gray-500">(MP4, MOV, AVI, WEBM - Tối đa 500MB)</span>
                                </div>
                            </label>
                            <input
                                id="video-upload"
                                type="file"
                                accept="video/*"
                                onChange={handleVideoUpload}
                                className="hidden"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                {t('onboarding.mediaPortfolio.videoRecommendation')}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Social Links */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">{t('onboarding.mediaPortfolio.socialLinks')}</label>
                <div className="space-y-3">
                    {socialPlatforms.map((platform) => {
                        const Icon = platform.icon;
                        return (
                            <div key={platform.id} className="flex items-center gap-3">
                                <div className="flex items-center gap-2 w-32">
                                    <Icon className="w-5 h-5 text-gray-600" />
                                    <span className="text-sm text-gray-700">{platform.name}</span>
                                </div>
                                <input
                                    type="url"
                                    value={getSocialLinkValue(platform.id)}
                                    onChange={(e) => handleSocialLinkChange(platform.id, e.target.value)}
                                    placeholder={platform.placeholder}
                                    className={inputStyles}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MediaPortfolioStep;
