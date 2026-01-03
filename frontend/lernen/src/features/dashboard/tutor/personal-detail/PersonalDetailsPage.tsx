import React from 'react';
import ProfileSettingsLayout from './ProfileSettingsLayout';
import PersonalDetailsContent from './components/PersonalDetailsContent';
import { useProfileSettings, emptyTutorDetail } from './context/ProfileSettingsContext';

const PersonalDetailsPage: React.FC = () => {
    // Fetch tutor detail data from shared context
    const { tutorData, error: tutorError, loading } = useProfileSettings();

    const tutorToDisplay = tutorError ? emptyTutorDetail : tutorData;

    if (loading) {
        return (
            <ProfileSettingsLayout activeTab="Personal Details">
                <div className="space-y-6 animate-pulse">
                    <div>
                        <div className="h-8 bg-gray-300 rounded w-1/4 mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </div>
                    <div className="flex gap-4">
                        <div className="h-10 bg-gray-300 rounded w-32"></div>
                        <div className="h-10 bg-gray-300 rounded w-32"></div>
                        <div className="h-10 bg-gray-300 rounded w-32"></div>
                        <div className="h-10 bg-gray-300 rounded w-32"></div>
                    </div>
                </div>
            </ProfileSettingsLayout>
        );
    }

    return (
        <ProfileSettingsLayout activeTab="Personal Details">
            <PersonalDetailsContent tutor={tutorToDisplay} />
        </ProfileSettingsLayout>
    );
};

export default PersonalDetailsPage;

