import React from 'react';
import { HiGlobe } from 'react-icons/hi';

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

const ActionRow: React.FC<{ buttonText: string }> = ({ buttonText }) => (
    <div className="flex justify-end items-center mt-4 gap-4">
        <p className="text-sm text-gray-500">Save & update the latest changes to the live</p>
        <button className="bg-[#0b6459] text-white font-semibold py-2.5 px-5 rounded-lg text-sm hover:bg-[#084c43] transition-colors">
            {buttonText}
        </button>
    </div>
);

const AccountSettingsForm: React.FC = () => {
    const inputStyles = "w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-0 focus:border-[#0b6459] transition";

    return (
        <div className="space-y-8">
            {/* Change Password */}
            <FormSection title="Change Your Password" subtitle="You can reset your password from here. Choose the best password.">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Current Password <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="password" 
                            placeholder="Enter current password" 
                            className={`mt-1 ${inputStyles}`}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-medium text-gray-700">
                                New Password <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="password" 
                                placeholder="Enter new password" 
                                className={`mt-1 ${inputStyles}`}
                            />
                        </div>
                       <div>
                             <label className="block text-sm font-medium text-gray-700">
                                Re-type new password <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="password" 
                                placeholder="Re-type new password" 
                                className={`mt-1 ${inputStyles}`}
                            />
                       </div>
                    </div>
                </div>
                <ActionRow buttonText="Update Password" />
            </FormSection>

            {/* Update Time Zone */}
            <FormSection title="Update Your Time Zone" subtitle="Stay on schedule by updating your time zone settings easily.">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                    <label className="block text-sm font-medium text-gray-700">
                        Time Zone <span className="text-red-500">*</span>
                        <select defaultValue="Pacific/Tongatapu" className={`mt-1 ${inputStyles}`}>
                            <option>Pacific/Tongatapu</option>
                            <option>(GMT+07:00) Asia/Ho_Chi_Minh</option>
                        </select>
                    </label>
                </div>
                <ActionRow buttonText="Save & Update" />
            </FormSection>

            {/* Link Google Calendar */}
            <FormSection title="Link Your Google Calendar" subtitle="Link your Google Calendar to sync all your lessons with your personal schedule.">
                <div className="flex items-center justify-between gap-4 p-2 border border-gray-200 rounded-lg">
                    <span className="pl-2 text-sm text-gray-500">No calendar linked at the moment</span>
                    <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                        <HiGlobe className="w-4 h-4" />
                        Connect Google Calendar
                    </button>
                </div>
            </FormSection>

            {/* Link Zoom Account */}
            <FormSection title="Link Zoom Account" subtitle={
                <>Link your Zoom account to sync all your lessons and meetings. Follow these <a href="#" className="font-semibold text-[#0b6459] underline">steps</a> to create your Zoom credentials.</>
            } hideBorder>
                 <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                        <label htmlFor="zoom-id" className="text-sm font-medium text-gray-700">Zoom Account Id <span className="text-red-500">*</span></label>
                        <input id="zoom-id" type="text" placeholder="Enter Zoom Account ID" className={`sm:col-span-2 ${inputStyles}`} />
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                        <label htmlFor="zoom-client-id" className="text-sm font-medium text-gray-700">Zoom Client Id <span className="text-red-500">*</span></label>
                        <input id="zoom-client-id" type="text" placeholder="Enter Zoom Client ID" className={`sm:col-span-2 ${inputStyles}`} />
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                        <label htmlFor="zoom-secret" className="text-sm font-medium text-gray-700">Zoom Client Secret <span className="text-red-500">*</span></label>
                        <input id="zoom-secret" type="password" placeholder="Enter Zoom Client Secret" className={`sm:col-span-2 ${inputStyles}`} />
                    </div>
                </div>
                <ActionRow buttonText="Save & Update" />
            </FormSection>
        </div>
    );
};

export default AccountSettingsForm;