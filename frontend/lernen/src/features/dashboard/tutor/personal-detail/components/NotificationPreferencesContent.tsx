import React, { useState } from 'react';

interface NotificationPreferencesContentProps {
    onSave: () => void;
}

const NotificationPreferencesContent: React.FC<NotificationPreferencesContentProps> = ({ onSave }) => {
    const [notifications, setNotifications] = useState({
        email: {
            newRequest: true,
            message: true,
            marketing: false,
            classReminder: true,
        },
        push: {
            newRequest: true,
            message: true,
            classReminder: true,
        }
    });

    const toggle = (type: 'email' | 'push', key: string) => {
        setNotifications(prev => {
            const category = prev[type];
            if (key in category) {
                return {
                    ...prev,
                    [type]: {
                        ...category,
                        [key as keyof typeof category]: !category[key as keyof typeof category]
                    }
                };
            }
            return prev;
        });
    };

    const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
        <button
            onClick={onChange}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-[#0b6459]' : 'bg-gray-200'}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    );

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Notification Preferences</h2>
                <p className="text-sm text-gray-500 mt-1">Manage how you want to be notified.</p>
            </div>

            <div className="space-y-8">
                {/* Email Notifications */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Email Notifications</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-700">New Lesson Requests</p>
                                <p className="text-xs text-gray-500">Get notified when a student requests a session</p>
                            </div>
                            <ToggleSwitch checked={notifications.email.newRequest} onChange={() => toggle('email', 'newRequest')} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-700">New Messages</p>
                                <p className="text-xs text-gray-500">Get notified when you receive a new message</p>
                            </div>
                            <ToggleSwitch checked={notifications.email.message} onChange={() => toggle('email', 'message')} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Class Reminders</p>
                                <p className="text-xs text-gray-500">Receive reminders 1 hour before class starts</p>
                            </div>
                            <ToggleSwitch checked={notifications.email.classReminder} onChange={() => toggle('email', 'classReminder')} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Marketing & Updates</p>
                                <p className="text-xs text-gray-500">Receive news, updates, and promotional offers</p>
                            </div>
                            <ToggleSwitch checked={notifications.email.marketing} onChange={() => toggle('email', 'marketing')} />
                        </div>
                    </div>
                </div>

                {/* Push Notifications */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Push Notifications</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-700">New Lesson Requests</p>
                            </div>
                            <ToggleSwitch checked={notifications.push.newRequest} onChange={() => toggle('push', 'newRequest')} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-700">New Messages</p>
                            </div>
                            <ToggleSwitch checked={notifications.push.message} onChange={() => toggle('push', 'message')} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Class Reminders</p>
                            </div>
                            <ToggleSwitch checked={notifications.push.classReminder} onChange={() => toggle('push', 'classReminder')} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={onSave}
                    className="bg-[#0b6459] text-white font-semibold py-2.5 px-6 rounded-lg text-sm hover:bg-[#084c43] transition-colors shadow-sm"
                >
                    Save Preferences
                </button>
            </div>
        </div>
    );
};

export default NotificationPreferencesContent;