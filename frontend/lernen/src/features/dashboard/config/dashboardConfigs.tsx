import { type ReactNode } from "react";
import {
    HiHome,
    HiUserGroup,
    HiBookOpen,
    HiAcademicCap,
    HiCalendar,
    HiCreditCard,
    HiChat,
    HiCog,
    HiChatAlt2,
    HiTag,
    HiQuestionMarkCircle,
    HiBell,
    HiShoppingBag,
    HiDocumentText,
    HiCode,
} from "react-icons/hi";

export interface SidebarOption {
    icon: ReactNode;
    activeIcon: ReactNode;
    label: string;
    path: string;
    count?: number;
}

export interface UserInfo {
    name: string;
    email: string;
    avatar?: string;
    role: "tutor" | "student" | "admin";
    balance?: number;
}

export interface DashboardLayoutProps {
    children: ReactNode;
    sidebarOptions: SidebarOption[];
    headerProps: {
        userInfo: UserInfo;
    };
}

// Tutor sidebar options
export const TUTOR_SIDEBAR_OPTIONS: SidebarOption[] = [
    {
        icon: <HiHome className="w-5 h-5" />,
        activeIcon: <HiHome className="w-5 h-5" />,
        label: "Dashboard",
        path: "/dashboard",
    },
    {
        icon: <HiUserGroup className="w-5 h-5" />,
        activeIcon: <HiUserGroup className="w-5 h-5" />,
        label: "My Students",
        path: "/dashboard/my-students",
    },
    {
        icon: <HiBookOpen className="w-5 h-5" />,
        activeIcon: <HiBookOpen className="w-5 h-5" />,
        label: "My Courses",
        path: "/dashboard/my-courses",
    },
    {
        icon: <HiAcademicCap className="w-5 h-5" />,
        activeIcon: <HiAcademicCap className="w-5 h-5" />,
        label: "My Class",
        path: "/dashboard/my-class",
    },
    {
        icon: <HiCalendar className="w-5 h-5" />,
        activeIcon: <HiCalendar className="w-5 h-5" />,
        label: "Schedule",
        path: "/dashboard/schedule",
    },
    {
        icon: <HiCreditCard className="w-5 h-5" />,
        activeIcon: <HiCreditCard className="w-5 h-5" />,
        label: "Payouts",
        path: "/dashboard/payouts",
    },
    {
        icon: <HiTag className="w-5 h-5" />,
        activeIcon: <HiTag className="w-5 h-5" />,
        label: "Deals & Coupons",
        path: "/dashboard/deals-coupons",
    },
    {
        icon: <HiQuestionMarkCircle className="w-5 h-5" />,
        activeIcon: <HiQuestionMarkCircle className="w-5 h-5" />,
        label: "My Quizzes",
        path: "/dashboard/quizzes",
    },
    {
        icon: <HiBell className="w-5 h-5" />,
        activeIcon: <HiBell className="w-5 h-5" />,
        label: "Requests",
        path: "/dashboard/requests",
        count: 0,
    },
    {
        icon: <HiChat className="w-5 h-5" />,
        activeIcon: <HiChatAlt2 className="w-5 h-5" />,
        label: "Inbox",
        path: "/dashboard/inbox",
    },
    {
        icon: <HiCog className="w-5 h-5" />,
        activeIcon: <HiCog className="w-5 h-5" />,
        label: "Profile Settings",
        path: "/dashboard/profile-settings/personal-details",
    },
    {
        icon: <HiCode className="w-5 h-5" />,
        activeIcon: <HiCode className="w-5 h-5" />,
        label: "API",
        path: "/dashboard/api",
    },
];

// Student sidebar options
export const STUDENT_SIDEBAR_OPTIONS: SidebarOption[] = [
    {
        icon: <HiHome className="w-5 h-5" />,
        activeIcon: <HiHome className="w-5 h-5" />,
        label: "Dashboard",
        path: "/dashboard",
    },
    {
        icon: <HiBookOpen className="w-5 h-5" />,
        activeIcon: <HiBookOpen className="w-5 h-5" />,
        label: "My Courses",
        path: "/dashboard/my-courses",
    },
    {
        icon: <HiShoppingBag className="w-5 h-5" />,
        activeIcon: <HiShoppingBag className="w-5 h-5" />,
        label: "My Purchases",
        path: "/dashboard/purchases",
    },
    {
        icon: <HiCalendar className="w-5 h-5" />,
        activeIcon: <HiCalendar className="w-5 h-5" />,
        label: "My Schedule",
        path: "/dashboard/schedule",
    },
    {
        icon: <HiDocumentText className="w-5 h-5" />,
        activeIcon: <HiDocumentText className="w-5 h-5" />,
        label: "Certificates",
        path: "/dashboard/certificates",
    },
    {
        icon: <HiChat className="w-5 h-5" />,
        activeIcon: <HiChatAlt2 className="w-5 h-5" />,
        label: "Messages",
        path: "/dashboard/messages",
    },
    {
        icon: <HiCog className="w-5 h-5" />,
        activeIcon: <HiCog className="w-5 h-5" />,
        label: "Profile Settings",
        path: "/dashboard/profile-settings/personal-details",
    },
];
