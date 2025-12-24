import React from 'react';
import ProfileSettingsLayout from './ProfileSettingsLayout';
import AccountSettingsContent from './components/AccountSettingsContent';

const AccountSettingsPage: React.FC = () => {
    return (
        <ProfileSettingsLayout activeTab="Account Settings" maxWidth="48rem">
            <AccountSettingsContent onSave={() => {}} />
        </ProfileSettingsLayout>
    );
};

export default AccountSettingsPage;