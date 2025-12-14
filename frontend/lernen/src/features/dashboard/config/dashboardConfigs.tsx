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
    labelKey: string;
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
        labelKey: "dashboard.sidebar.tutor.dashboard",
        path: "/dashboard",
    },
    {
        icon: <HiUserGroup className="w-5 h-5" />,
        activeIcon: <HiUserGroup className="w-5 h-5" />,
        labelKey: "dashboard.sidebar.tutor.myStudents",
        path: "/dashboard/my-students",
    },
    {
        icon: <HiBookOpen className="w-5 h-5" />,
        activeIcon: <HiBookOpen className="w-5 h-5" />,
        labelKey: "dashboard.sidebar.tutor.myCourses",
        path: "/dashboard/my-courses",
    },
    {
        icon: <HiAcademicCap className="w-5 h-5" />,
        activeIcon: <HiAcademicCap className="w-5 h-5" />,
        labelKey: "dashboard.sidebar.tutor.myClass",
        path: "/dashboard/my-class",
    },
    {
        icon: <HiCalendar className="w-5 h-5" />,
        activeIcon: <HiCalendar className="w-5 h-5" />,
        labelKey: "dashboard.sidebar.tutor.schedule",
        path: "/dashboard/schedule",
    },
    {
        icon: <HiCreditCard className="w-5 h-5" />,
        activeIcon: <HiCreditCard className="w-5 h-5" />,
        labelKey: "dashboard.sidebar.tutor.payouts",
        path: "/dashboard/payouts",
    },
    {
        icon: <HiTag className="w-5 h-5" />,
        activeIcon: <HiTag className="w-5 h-5" />,
        labelKey: "dashboard.sidebar.tutor.dealsCoupons",
        path: "/dashboard/deals-coupons",
    },
    {
        icon: <HiQuestionMarkCircle className="w-5 h-5" />,
        activeIcon: <HiQuestionMarkCircle className="w-5 h-5" />,
        labelKey: "dashboard.sidebar.tutor.myQuizzes",
        path: "/dashboard/quizzes",
    },
    {
        icon: <HiBell className="w-5 h-5" />,
        activeIcon: <HiBell className="w-5 h-5" />,
        labelKey: "dashboard.sidebar.tutor.requests",
        path: "/dashboard/requests",
        count: 0,
    },
    {
        icon: <HiChat className="w-5 h-5" />,
        activeIcon: <HiChatAlt2 className="w-5 h-5" />,
        labelKey: "dashboard.sidebar.tutor.inbox",
        path: "/dashboard/inbox",
    },
    {
        icon: <HiCog className="w-5 h-5" />,
        activeIcon: <HiCog className="w-5 h-5" />,
        labelKey: "dashboard.sidebar.tutor.profileSettings",
        path: "/dashboard/profile-settings/personal-details",
    },
    {
        icon: <HiCode className="w-5 h-5" />,
        activeIcon: <HiCode className="w-5 h-5" />,
        labelKey: "dashboard.sidebar.tutor.api",
        path: "/dashboard/api",
    },
];

// Student sidebar options
export const STUDENT_SIDEBAR_OPTIONS: SidebarOption[] = [
    {
        icon: <HiCalendar className="w-5 h-5" />,
        activeIcon: <HiCalendar className="w-5 h-5" />,
        labelKey: "dashboard.sidebar.student.myBookings",
        path: "/dashboard/my-bookings",
    },
    {
        icon: <HiAcademicCap className="w-5 h-5" />,
        activeIcon: <HiAcademicCap className="w-5 h-5" />,
        labelKey: "dashboard.sidebar.student.myClass",
        path: "/dashboard/my-class",
    },
    {
        icon: <HiQuestionMarkCircle className="w-5 h-5" />,
        activeIcon: <HiQuestionMarkCircle className="w-5 h-5" />,
        labelKey: "dashboard.sidebar.student.myQuizzes",
        path: "/dashboard/my-quizzes",
    },
    {
        icon: <HiBookOpen className="w-5 h-5" />,
        activeIcon: <HiBookOpen className="w-5 h-5" />,
        labelKey: "dashboard.sidebar.student.myCourses",
        path: "/dashboard/my-courses",
    },
    {
        icon: <HiShoppingBag className="w-5 h-5" />,
        activeIcon: <HiShoppingBag className="w-5 h-5" />,
        labelKey: "dashboard.sidebar.student.myPurchases",
        path: "/dashboard/purchases",
    },
    {
        icon: <HiDocumentText className="w-5 h-5" />,
        activeIcon: <HiDocumentText className="w-5 h-5" />,
        labelKey: "dashboard.sidebar.student.certificates",
        path: "/dashboard/certificates",
    },
    {
        icon: <HiChat className="w-5 h-5" />,
        activeIcon: <HiChatAlt2 className="w-5 h-5" />,
        labelKey: "dashboard.sidebar.student.messages",
        path: "/dashboard/messages",
    },
    {
        icon: <HiCog className="w-5 h-5" />,
        activeIcon: <HiCog className="w-5 h-5" />,
        labelKey: "dashboard.sidebar.student.profileSettings",
        path: "/dashboard/profile-settings/personal-details",
    },
];
