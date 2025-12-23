import React from 'react';
import ProfileSettingsLayout from './ProfileSettingsLayout';
import PersonalDetailsContent from './components/PersonalDetailsContent';
import { useTutorDetail } from '../../../../hooks/useTutorDetail';

const PersonalDetailsPage: React.FC = () => {
    // Fetch tutor detail data
    const { tutor, error: tutorError } = useTutorDetail();

    // If there's an error fetching tutor data, use empty tutor detail object
    const emptyTutorDetail: any = {
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

    const tutorData = tutorError ? emptyTutorDetail : tutor;

    return (
        <ProfileSettingsLayout activeTab="Personal Details">
            <PersonalDetailsContent tutor={tutorData} />
        </ProfileSettingsLayout>
    );
};

export default PersonalDetailsPage;
