import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { tutorService } from '../../../../../services/tutorService';
import type { TutorDetail } from '../../../../../types/tutor';

interface ProfileSettingsContextType {
    tutorData: TutorDetail | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

const ProfileSettingsContext = createContext<ProfileSettingsContextType | undefined>(undefined);

// Empty tutor detail object for fallback
const emptyTutorDetail: TutorDetail = {
    id: "",
    fullName: "",
    avatarUrl: "",
    email: "",
    isVerified: false,
    introduction: "",
    headline: "",
    gender: "Not specified",
    timezone: "",
    videoUrl: "",
    currentSessionFee: 0,
    originalSessionFee: undefined,
    averageRating: 0,
    reviewCount: 0,
    bookedSessionsCount: 0,
    studentCount: 0,
    hasTrialSession: false,
    zoomConnected: false,
    country: { code: "", name: "", flag: "" },
    languages: [],
    subjects: [],
    reviews: [],
    availabilities: [],
    socialLinks: [],
    educations: [],
    experiences: [],
    certifications: [],
    groupClasses: undefined,
};

interface ProfileSettingsProviderProps {
    children: React.ReactNode;
}

export const ProfileSettingsProvider: React.FC<ProfileSettingsProviderProps> = ({ children }) => {
    const [tutorData, setTutorData] = useState<TutorDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTutorProfile = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await tutorService.getTutorProfile();
            if (response.success && response.data) {
                // Map API response to TutorDetail
                const data = response.data;
                const mappedData: TutorDetail = {
                    id: data.id || "",
                    fullName: data.fullName || "",
                    avatarUrl: data.avatarUrl || "",
                    email: data.email || "",
                    isVerified: data.isVerified || false,
                    introduction: data.introduction || "",
                    headline: data.headline || "",
                    gender: data.gender || "Not specified",
                    timezone: data.timezone || "",
                    videoUrl: data.videoUrl || "",
                    currentSessionFee: data.currentSessionFee || 0,
                    originalSessionFee: data.originalSessionFee,
                    averageRating: data.averageRating || 0,
                    reviewCount: data.reviews?.length || 0,
                    bookedSessionsCount: data.bookedSessionsCount || 0,
                    studentCount: data.studentCount || 0,
                    hasTrialSession: data.hasTrialSession || false,
                    zoomConnected: data.zoomConnected || false,
                    country: data.countryCode ? { code: data.countryCode, name: "", flag: "" } : { code: "", name: "", flag: "" },
                    languages: data.languageCodes?.map((lang: any) => ({
                        language: { code: lang.languageCode, name: lang.languageCode },
                        proficiency: lang.proficiency || "",
                        isNative: lang.isNative || false,
                    })) || [],
                    subjects: data.subjectIds?.map((id: string) => ({ id, name: "" })) || [],
                    reviews: data.reviews || [],
                    availabilities: [],
                    socialLinks: data.socialLinks?.map((link: any) => ({
                        platform: link.platform,
                        url: link.url,
                    })) || [],
                    educations: data.educations?.map((edu: any) => ({
                        id: edu.id || String(Math.random()),
                        title: edu.title || "",
                        institution: edu.institution || "",
                        startDate: edu.startDate || "",
                        endDate: edu.endDate,
                        location: edu.location || "",
                        description: edu.description || "",
                    })) || [],
                    experiences: data.experiences?.map((exp: any) => ({
                        id: exp.id || String(Math.random()),
                        title: exp.title || "",
                        institution: exp.institution || exp.company || "",
                        startDate: exp.startDate || "",
                        endDate: exp.endDate,
                        location: exp.location || "",
                        description: exp.description || "",
                    })) || [],
                    certifications: data.certificates?.map((cert: any) => ({
                        id: cert.id || String(Math.random()),
                        name: cert.name || "",
                        issuingOrganization: cert.issuingOrganization || cert.issuer || "",
                        issueDate: cert.issueDate || "",
                        expirationDate: cert.expirationDate,
                        credentialId: cert.credentialId || "",
                        credentialUrl: cert.credentialUrl || "",
                    })) || [],
                    groupClasses: undefined,
                };
                setTutorData(mappedData);
            } else {
                setError(response.message || "Failed to fetch tutor profile");
                setTutorData(emptyTutorDetail);
            }
        } catch (err) {
            console.error("Error fetching tutor profile:", err);
            setError("Failed to fetch tutor profile");
            setTutorData(emptyTutorDetail);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTutorProfile();
    }, [fetchTutorProfile]);

    const contextValue = useMemo(() => ({
        tutorData,
        loading,
        error,
        refetch: fetchTutorProfile,
    }), [tutorData, loading, error, fetchTutorProfile]);

    return (
        <ProfileSettingsContext.Provider value={contextValue}>
            {children}
        </ProfileSettingsContext.Provider>
    );
};

export const useProfileSettings = (): ProfileSettingsContextType => {
    const context = useContext(ProfileSettingsContext);
    if (context === undefined) {
        throw new Error('useProfileSettings must be used within a ProfileSettingsProvider');
    }
    return context;
};

export { emptyTutorDetail };
