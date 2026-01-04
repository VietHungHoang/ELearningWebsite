import React from 'react';
import { useTranslation } from 'react-i18next';

interface AccountSettingsContentProps {
    onSave: () => void;
    zoomConnected?: boolean;
    tutorId?: string;
}

// Fix: Changed the type of the `subtitle` prop from `string` to `React.ReactNode` to allow passing JSX elements.
const FormSection: React.FC<{ title: string; subtitle: React.ReactNode; children: React.ReactNode, hideBorder?: boolean }> = ({ title, subtitle, children, hideBorder }) => (
    <div className={` ${hideBorder ? '' : 'border-b border-gray-200 pb-8 mb-8'}`}>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        <div className="mt-6">
            {children}
        </div>
    </div>
);

const ActionRow: React.FC<{ buttonText: string; onSave: () => void }> = ({ buttonText, onSave }) => {
    const { t } = useTranslation();
    return (
        <div className="flex justify-end items-center mt-4 gap-4">
            <p className="text-sm text-gray-500">{t('dashboard.tutor.accountSettings.saveDescription')}</p>
            <button
                onClick={onSave}
                className="bg-[#0b6459] text-white font-semibold py-2.5 px-5 rounded-lg text-sm hover:bg-[#084c43] transition-colors"
            >
                {buttonText}
            </button>
        </div>
    );
};

const AccountSettingsContent: React.FC<AccountSettingsContentProps> = ({ onSave, zoomConnected, tutorId }) => {
    const { t } = useTranslation();
    // Match input styles with PersonalDetailsContent - white background, no hover bg effect
    const inputStyles = "w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-800 placeholder:text-gray-400 placeholder:font-thin hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-0 focus:border-[#0b6459] transition-all duration-500 ease-in-out";

    return (
        <div className="space-y-8">

            {/* Change Password */}
            <FormSection title={t('dashboard.tutor.accountSettings.changePassword.title')} subtitle={t('dashboard.tutor.accountSettings.changePassword.subtitle')}>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {t('dashboard.tutor.accountSettings.changePassword.currentPassword')} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            placeholder={t('dashboard.tutor.accountSettings.changePassword.currentPasswordPlaceholder')}
                            className={`mt-1 ${inputStyles}`}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                {t('dashboard.tutor.accountSettings.changePassword.newPassword')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                placeholder={t('dashboard.tutor.accountSettings.changePassword.newPasswordPlaceholder')}
                                className={`mt-1 ${inputStyles}`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                {t('dashboard.tutor.accountSettings.changePassword.retypePassword')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                placeholder={t('dashboard.tutor.accountSettings.changePassword.retypePasswordPlaceholder')}
                                className={`mt-1 ${inputStyles}`}
                            />
                        </div>
                    </div>
                </div>
                <ActionRow buttonText={t('dashboard.tutor.accountSettings.changePassword.updatePassword')} onSave={onSave} />
            </FormSection>

            <FormSection title={t('dashboard.tutor.accountSettings.zoom.title')} subtitle={
                <>{t('dashboard.tutor.accountSettings.zoom.subtitle')} <a href="#" className="font-semibold text-[#0b6459] underline">{t('dashboard.tutor.accountSettings.zoom.steps')}</a> {t('dashboard.tutor.accountSettings.zoom.toCreate')}</>
            } hideBorder>
                <div className="flex flex-col gap-2">
                    <button
                        onClick={async () => {
                            if (!tutorId) {
                                console.error("Tutor ID is missing");
                                return;
                            }
                            try {
                                const response = await import('../../../../../services/tutorService').then(m => m.tutorService.getZoomAuthorizationUrl(tutorId));
                                if (response.success && response.data.authorizationUrl) {
                                    window.location.href = response.data.authorizationUrl;
                                } else {
                                    console.error("Failed to get Zoom authorization URL", response);
                                }
                            } catch (error) {
                                console.error("Error connecting to Zoom:", error);
                            }
                        }}
                        disabled={zoomConnected}
                        className={`flex items-center justify-center gap-2 font-semibold py-2.5 px-5 rounded-lg text-sm transition-colors w-fit ${zoomConnected
                            ? 'bg-green-100 text-green-700 cursor-default'
                            : 'bg-[#0b6459] text-white hover:bg-[#084c43]'
                            }`}
                    >
                        {zoomConnected ? '✓ Đã liên kết Zoom' : 'Liên kết Zoom'}
                    </button>
                    {!zoomConnected && (
                        <p className="text-xs text-gray-500 italic">
                            * Bạn sẽ được chuyển hướng đến Zoom để xác thực tài khoản.
                        </p>
                    )}
                </div>
            </FormSection>
        </div>
    );
};

export default AccountSettingsContent;