import React, { useState } from 'react';
import { HiCloudUpload, HiTrash } from 'react-icons/hi';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';
import type { SocialLink } from '../../../../types/api';

interface MediaPortfolioData {
    profilePhoto: { name: string; url: string } | null;
    introVideo: File | null;
    socialLinks: SocialLink[];
}

interface MediaPortfolioStepProps {
    data: MediaPortfolioData;
    onChange: (data: Partial<MediaPortfolioData>) => void;
}

const MediaPortfolioStep: React.FC<MediaPortfolioStepProps> = ({ data, onChange }) => {
    const [photoPreview, setPhotoPreview] = useState<string | null>(
        data.profilePhoto?.url || null
    );
    const [videoPreview, setVideoPreview] = useState<string | null>(null);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
                // Temporarily not saving profilePhoto, keep as null
                // onChange({
                //     profilePhoto: {
                //         name: file.name,
                //         url: reader.result as string,
                //     },
                // });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setVideoPreview(url);
            onChange({ introVideo: file });
        }
    };

    const handleRemovePhoto = () => {
        setPhotoPreview(null);
        // Temporarily not saving profilePhoto, keep as null
        // onChange({ profilePhoto: null });
    };

    const handleRemoveVideo = () => {
        if (videoPreview) {
            URL.revokeObjectURL(videoPreview);
        }
        setVideoPreview(null);
        onChange({ introVideo: null });
    };

    const socialPlatforms = [
        { id: 'facebook', name: 'Facebook', icon: FaFacebook, placeholder: 'https://facebook.com/yourprofile' },
        { id: 'twitter', name: 'Twitter', icon: FaTwitter, placeholder: 'https://twitter.com/yourprofile' },
        { id: 'linkedin', name: 'LinkedIn', icon: FaLinkedin, placeholder: 'https://linkedin.com/in/yourprofile' },
        { id: 'instagram', name: 'Instagram', icon: FaInstagram, placeholder: 'https://instagram.com/yourprofile' },
        { id: 'youtube', name: 'YouTube', icon: FaYoutube, placeholder: 'https://youtube.com/@yourchannel' },
    ];

    const handleSocialLinkChange = (platform: string, url: string) => {
        const existingLinks = data.socialLinks || [];
        const linkIndex = existingLinks.findIndex(link => link.id === platform);

        let updatedLinks: SocialLink[];
        if (linkIndex >= 0) {
            // Update existing link
            updatedLinks = existingLinks.map((link, idx) =>
                idx === linkIndex ? { ...link, url } : link
            );
        } else {
            // Add new link
            updatedLinks = [...existingLinks, { id: platform, platform: platform, url }];
        }

        onChange({ socialLinks: updatedLinks });
    };

    const getSocialLinkValue = (platform: string): string => {
        return data.socialLinks?.find(link => link.id === platform)?.url || '';
    };

    const inputStyles =
        'w-full bg-gray-100 border border-transparent rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-0 focus:border-[#0b6459] transition';

    return (
        <div className="space-y-3">
            <div>
                <h3 className="text-lg font-bold text-gray-800">Media & Portfolio</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                    Add visual content to make your profile stand out
                </p>
            </div>

            {/* Profile Photo & Video in 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Profile Photo */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Photo <span className="text-red-500">*</span>
                    </label>
                    {photoPreview ? (
                        <div className="relative inline-block">
                            <img
                                src={photoPreview}
                                alt="Profile preview"
                                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                            />
                            <button
                                type="button"
                                onClick={handleRemovePhoto}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                            >
                                <HiTrash className="w-3 h-3" />
                            </button>
                        </div>
                    ) : (
                        <div>
                            <label
                                htmlFor="photo-upload"
                                className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                <HiCloudUpload className="w-3.5 h-3.5 text-gray-500" />
                                <span className="text-xs text-gray-600">Upload Photo</span>
                            </label>
                            <input
                                id="photo-upload"
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="hidden"
                            />
                            <p className="text-xs text-gray-500 mt-0.5">
                                Square, 400x400px
                            </p>
                        </div>
                    )}
                </div>

                {/* Intro Video */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Introduction Video <span className="text-xs text-gray-500 font-normal">(Optional)</span>
                    </label>
                    {videoPreview ? (
                        <div className="space-y-1">
                            <video
                                src={videoPreview}
                                controls
                                className="w-full max-w-xs rounded-lg border border-gray-200"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveVideo}
                                className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                            >
                                <HiTrash className="w-3 h-3" />
                                Remove
                            </button>
                        </div>
                    ) : (
                        <div>
                            <label
                                htmlFor="video-upload"
                                className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                <HiCloudUpload className="w-3.5 h-3.5 text-gray-500" />
                                <span className="text-xs text-gray-600">Upload Video</span>
                            </label>
                            <input
                                id="video-upload"
                                type="file"
                                accept="video/*"
                                onChange={handleVideoUpload}
                                className="hidden"
                            />
                            <p className="text-xs text-gray-500 mt-0.5">
                                Max 2 minutes
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Social Links - Compact Grid */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Social Links <span className="text-xs text-gray-500 font-normal">(Optional)</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {socialPlatforms.map((platform) => {
                        const Icon = platform.icon;
                        return (
                            <div key={platform.id} className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 w-24 flex-shrink-0">
                                    <Icon className="w-3.5 h-3.5 text-gray-600" />
                                    <span className="text-xs text-gray-700">{platform.name}</span>
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
