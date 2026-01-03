import React from 'react';
import ProfileSettingsLayout from './ProfileSettingsLayout';
import AccountSettingsContent from './components/AccountSettingsContent';
import { useProfileSettings } from './context/ProfileSettingsContext';

const AccountSettingsPage: React.FC = () => {
    const { tutorData } = useProfileSettings();

    return (
        <ProfileSettingsLayout activeTab="Account Settings" maxWidth="48rem">
            <AccountSettingsContent
                onSave={() => { }}
                timezone={tutorData?.timezone || undefined}
                zoomConnected={tutorData?.zoomConnected || false}
            />
        </ProfileSettingsLayout>
    );
};

export default AccountSettingsPage;