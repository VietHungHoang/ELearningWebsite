import React from "react";
import { HiUser, HiDocumentText, HiCog, HiBell } from "react-icons/hi";

type DetailTab =
    | "Personal Details"
    | "Resume Highlights"
    | "Account Settings"
    | "Notification Preferences"
    | "Identity Verification";

interface PersonalDetailsNavProps {
    activeTab: DetailTab;
    onTabChange: (tab: DetailTab) => void;
}

const NavItem: React.FC<{ label: DetailTab; icon: React.ReactNode; description: string; activeTab: DetailTab; onClick: () => void }> = ({
    label,
    icon,
    description,
    activeTab,
    onClick,
}) => (
    <button
        onClick={onClick}
        className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
            activeTab === label ? "bg-[#0b6459] text-white shadow-md" : "hover:bg-gray-100 text-gray-600"
        }`}
    >
        <div
            className={`mt-1 w-6 h-6 flex-shrink-0 flex items-center justify-center ${
                activeTab === label ? "text-white" : "text-gray-500"
            }`}
        >
            {icon}
        </div>
        <div>
            <p className={`font-bold text-sm ${activeTab === label ? "text-white" : "text-gray-800"}`}>{label}</p>
            <p className={`text-xs mt-0.5 ${activeTab === label ? "text-teal-100" : "text-gray-500"}`}>
                {description}
            </p>
        </div>
    </button>
);

const PersonalDetailsNav: React.FC<PersonalDetailsNavProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="w-full lg:w-70 flex-shrink-0 pr-4 border-r border-gray-100 lg:min-h-[600px]">
            <nav className="space-y-2">
                <NavItem
                    label="Personal Details"
                    icon={<HiUser />}
                    description="Basic information & profile"
                    activeTab={activeTab}
                    onClick={() => onTabChange("Personal Details")}
                />
                <NavItem
                    label="Resume Highlights"
                    icon={<HiDocumentText />}
                    description="Experience & achievements"
                    activeTab={activeTab}
                    onClick={() => onTabChange("Resume Highlights")}
                />
                <NavItem
                    label="Account Settings"
                    icon={<HiCog />}
                    description="Security & preferences"
                    activeTab={activeTab}
                    onClick={() => onTabChange("Account Settings")}
                />
                <NavItem
                    label="Notification Preferences"
                    icon={<HiBell />}
                    description="Email & push alerts"
                    activeTab={activeTab}
                    onClick={() => onTabChange("Notification Preferences")}
                />
            </nav>
        </div>
    );
};

export default PersonalDetailsNav;