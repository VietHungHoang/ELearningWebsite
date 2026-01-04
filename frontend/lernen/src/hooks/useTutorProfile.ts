import { useState, useEffect } from "react";
import { tutorService } from "../services/tutorService";
import type { TutorProfile, UpdateTutorProfileRequest, EducationItem, ExperienceItem, CertificationItem } from "../types/api";

export const useTutorProfile = () => {
    const [profile, setProfile] = useState<TutorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch profile data
    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await tutorService.getTutorProfile();
            if (response.success) {
                setProfile(response.data);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError("Failed to fetch profile data");
            console.error("Error fetching profile:", err);
        } finally {
            setLoading(false);
        }
    };

    // Update profile data
    const updateProfile = async (data: UpdateTutorProfileRequest) => {
        try {
            setError(null);
            const response = await tutorService.updateTutorProfile(data);
            if (response.success) {
                setProfile(response.data);
                return { success: true, message: response.message };
            } else {
                setError(response.message);
                return { success: false, message: response.message };
            }
        } catch (err) {
            const errorMessage = "Failed to update profile";
            setError(errorMessage);
            console.error("Error updating profile:", err);
            return { success: false, message: errorMessage };
        }
    };

    // Upload profile photo
    const uploadPhoto = async (file: File) => {
        try {
            setError(null);
            const response = await tutorService.uploadProfilePhoto(file);
            if (response.success && profile) {
                // Update profile with new photo URL
                setProfile({
                    ...profile,
                    avatarUrl: response.data.fileUrl,
                });
                return { success: true, message: response.message, fileUrl: response.data.fileUrl };
            } else {
                setError(response.message);
                return { success: false, message: response.message };
            }
        } catch (err) {
            const errorMessage = "Failed to upload photo";
            setError(errorMessage);
            console.error("Error uploading photo:", err);
            return { success: false, message: errorMessage };
        }
    };

    // Upload introduction video
    const uploadVideo = async (file: File) => {
        try {
            setError(null);
            const response = await tutorService.uploadIntroductionVideo(file);
            if (response.success && profile) {
                // Update profile with new video URL
                setProfile({
                    ...profile,
                    videoUrl: response.data.fileUrl,
                    introductionVideoUrl: response.data.fileUrl,
                });
                return { success: true, message: response.message, fileUrl: response.data.fileUrl };
            } else {
                setError(response.message);
                return { success: false, message: response.message };
            }
        } catch (err) {
            const errorMessage = "Failed to upload video";
            setError(errorMessage);
            console.error("Error uploading video:", err);
            return { success: false, message: errorMessage };
        }
    };

    // Update resume highlights
    const updateResume = async (resumeData: {
        education?: EducationItem[];
        experience?: ExperienceItem[];
        certifications?: CertificationItem[];
    }) => {
        try {
            setError(null);
            const response = await tutorService.updateResumeHighlights(resumeData);
            if (response.success && profile) {
                // Update profile with new resume data
                setProfile({
                    ...profile,
                    education: response.data.education,
                    experience: response.data.experience,
                    certifications: response.data.certifications,
                });
                return { success: true, message: response.message };
            } else {
                setError(response.message);
                return { success: false, message: response.message };
            }
        } catch (err) {
            const errorMessage = "Failed to update resume";
            setError(errorMessage);
            console.error("Error updating resume:", err);
            return { success: false, message: errorMessage };
        }
    };

    // Load profile on mount
    useEffect(() => {
        fetchProfile();
    }, []);

    return {
        profile,
        loading,
        error,
        fetchProfile,
        updateProfile,
        uploadPhoto,
        uploadVideo,
        updateResume,
        clearError: () => setError(null),
    };
};
