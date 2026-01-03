import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Toast from "../../../../components/ui/Toast";
import WriteWithAIModal from "../pages/components/WriteWithAIModal";
import { useBreadcrumb } from "../../context/BreadcrumbContext";
import { useAuth } from "../../../../context/AuthContext";
import { classService } from "../../../../services/classService";

type ProfileTab = "Personal Details" | "Resume Highlights" | "Account Settings" | "Subjects I Can Teach";

interface ProfileSettingsLayoutProps {
    children: React.ReactNode;
    activeTab: ProfileTab;
    maxWidth?: string;
}

const ProfileSettingsLayout: React.FC<ProfileSettingsLayoutProps> = ({
    children,
    activeTab,
    maxWidth = "48rem"
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const { state: authState } = useAuth();
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const { setBreadcrumb } = useBreadcrumb();

    // Note: Tutor data is now provided by ProfileSettingsContext at the route level

    useEffect(() => {
        const tabLabels: Record<ProfileTab, string> = {
            "Personal Details": t('dashboard.tutor.profileSettings.tabs.personalDetails'),
            "Resume Highlights": t('dashboard.tutor.profileSettings.tabs.resumeHighlights'),
            "Account Settings": t('dashboard.tutor.profileSettings.tabs.accountSettings'),
            "Subjects I Can Teach": t('dashboard.tutor.profileSettings.tabs.subjectsICanTeach')
        };
        setBreadcrumb([
            { label: t('dashboard.header.breadcrumb.dashboard'), path: "/dashboard" },
            { label: t('dashboard.tutor.profileSettings.breadcrumb.profileSettings'), path: "/dashboard/profile-settings/personal-details" },
            { label: tabLabels[activeTab], path: `/dashboard/profile-settings/${activeTab.toLowerCase().replace(' ', '-')}` }
        ]);
    }, [setBreadcrumb, activeTab, t]);

    // Handle Zoom OAuth callback
    useEffect(() => {
        const code = searchParams.get("code");
        const error = searchParams.get("error");

        if (code) {
            // Handle successful authorization
            handleZoomCallback(code);
        } else if (error) {
            // Handle authorization error
            setToast({ message: "Zoom authorization failed", type: "error" });
            // Clean up URL
            navigate(window.location.pathname, { replace: true });
        }
    }, [searchParams]);

    const handleZoomCallback = async (code: string) => {
        try {
            const tutorId = authState.user?.id;
            if (!tutorId) {
                setToast({ message: "User not authenticated", type: "error" });
                return;
            }

            const response = await classService.zoomCallback(code, tutorId);
            if (response.success) {
                setToast({ message: "Zoom account connected successfully!", type: "success" });
                // Refresh profile to update zoomConnected status
                window.location.reload();
            } else {
                setToast({ message: response.message || "Failed to connect Zoom account", type: "error" });
            }
        } catch (error) {
            console.error("Zoom callback error:", error);
            setToast({ message: "Failed to connect Zoom account", type: "error" });
        } finally {
            // Clean up URL parameters
            navigate(window.location.pathname, { replace: true });
        }
    };

    const handleTabChange = (tab: ProfileTab) => {
        const pathMap = {
            "Personal Details": "/dashboard/profile-settings/personal-details",
            "Resume Highlights": "/dashboard/profile-settings/resume-highlights",
            "Account Settings": "/dashboard/profile-settings/account-settings",
            "Subjects I Can Teach": "/dashboard/profile-settings/subjects-i-can-teach"
        };
        navigate(pathMap[tab]);
    };

    return (
        <>
            {/* Main Container */}
            <div className="bg-white h-full">
                {/* Tab Navigation */}
                <div className="bg-gray-100 p-1.5 rounded-2xl">
                    <div className="flex justify-center">
                        <div className="flex items-center gap-1 max-w-3xl w-full">
                            {(["Personal Details", "Resume Highlights", "Account Settings", "Subjects I Can Teach"] as ProfileTab[]).map((tab) => {
                                const tabLabels: Record<ProfileTab, string> = {
                                    "Personal Details": t('dashboard.tutor.profileSettings.tabs.personalDetails'),
                                    "Resume Highlights": t('dashboard.tutor.profileSettings.tabs.resumeHighlights'),
                                    "Account Settings": t('dashboard.tutor.profileSettings.tabs.accountSettings'),
                                    "Subjects I Can Teach": t('dashboard.tutor.profileSettings.tabs.subjectsICanTeach')
                                };
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => handleTabChange(tab)}
                                        className={`flex-1 px-6 py-2.5 text-sm font-semibold rounded-xl transition-colors ${activeTab === tab
                                                ? "bg-white text-gray-800 shadow-sm"
                                                : "text-gray-500 hover:bg-white/50"
                                            }`}
                                    >
                                        {tabLabels[tab]}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
                {/* Tab Content */}
                <div className="p-6 mx-auto" style={{ maxWidth }}>
                    {children}
                </div>
            </div>

            {/* Modals */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <WriteWithAIModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
        </>
    );
};

export default ProfileSettingsLayout;