import { type ReactNode } from "react";
import {
    FiHome,
    FiUsers,
    FiUser,
    FiCalendar,
    FiCreditCard,
    FiMessageSquare,
    FiSettings,
    FiTag,
    FiHelpCircle,
    FiBell,
    FiShoppingBag,
    FiFileText,
    FiCode,
    FiStar,
} from "react-icons/fi";
import { PiChalkboardTeacher } from "react-icons/pi";

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
        icon: <FiHome className="w-4 h-4" />,
        activeIcon: <FiHome className="w-4 h-4" />,
        labelKey: "dashboard.sidebar.tutor.dashboard",
        path: "/dashboard",
    },
    {
        icon: <FiUsers className="w-4 h-4" />,
        activeIcon: <FiUsers className="w-4 h-4" />,
        labelKey: "dashboard.sidebar.tutor.myStudents",
        path: "/dashboard/my-students",
    },
    {
        icon: <FiUser className="w-4 h-4" />,
        activeIcon: <FiUser className="w-4 h-4" />,
        labelKey: "dashboard.sidebar.tutor.myClass",
        path: "/dashboard/my-class",
    },
    {
        icon: <FiCalendar className="w-4 h-4" />,
        activeIcon: <FiCalendar className="w-4 h-4" />,
        labelKey: "dashboard.sidebar.tutor.schedule",
        path: "/dashboard/schedule",
    },
    {
        icon: <FiCreditCard className="w-4 h-4" />,
        activeIcon: <FiCreditCard className="w-4 h-4" />,
        labelKey: "dashboard.sidebar.tutor.payouts",
        path: "/dashboard/payouts",
    },
    {
        icon: <FiTag className="w-4 h-4" />,
        activeIcon: <FiTag className="w-4 h-4" />,
        labelKey: "dashboard.sidebar.tutor.dealsCoupons",
        path: "/dashboard/deals-coupons",
    },
    {
        icon: <FiHelpCircle className="w-4 h-4" />,
        activeIcon: <FiHelpCircle className="w-4 h-4" />,
        labelKey: "dashboard.sidebar.tutor.myQuizzes",
        path: "/dashboard/quizzes",
    },
    {
        icon: <FiBell className="w-4 h-4" />,
        activeIcon: <FiBell className="w-4 h-4" />,
        labelKey: "dashboard.sidebar.tutor.requests",
        path: "/dashboard/requests",
        count: 0,
    },
    {
        icon: <FiMessageSquare className="w-4 h-4" />,
        activeIcon: <FiMessageSquare className="w-4 h-4" />,
        labelKey: "dashboard.sidebar.tutor.inbox",
        path: "/dashboard/inbox",
    },
    {
        icon: <FiStar className="w-4 h-4" />,
        activeIcon: <FiStar className="w-4 h-4" />,
        labelKey: "dashboard.sidebar.tutor.reviews",
        path: "/dashboard/reviews",
    },
    {
        icon: <FiSettings className="w-4 h-4" />,
        activeIcon: <FiSettings className="w-4 h-4" />,
        labelKey: "dashboard.sidebar.tutor.profileSettings",
        path: "/dashboard/profile-settings/personal-details",
    },
    {
        icon: <FiCode className="w-4 h-4" />,
        activeIcon: <FiCode className="w-4 h-4" />,
        labelKey: "dashboard.sidebar.tutor.api",
        path: "/dashboard/api",
    },
    {
        icon: <PiChalkboardTeacher className="w-4 h-4" />,
        activeIcon: <PiChalkboardTeacher className="w-4 h-4" />,
        labelKey: "dashboard.sidebar.tutor.whiteboard",
        path: "/dashboard/whiteboard",
    },
];

// Student sidebar options
export const STUDENT_SIDEBAR_OPTIONS: SidebarOption[] = [
    {
        icon: <FiCalendar className="w-4 h-4" />,
        activeIcon: <FiCalendar className="w-4 h-4" />,
        labelKey: "dashboard.sidebar.student.myBookings",
        path: "/dashboard/my-bookings",
    },
    {
        icon: <FiUser className="w-4 h-4" />,
        activeIcon: <FiUser className="w-4 h-4" />,
        labelKey: "dashboard.sidebar.student.myClass",
        path: "/dashboard/my-class",
    },
    {
        icon: <FiHelpCircle className="w-4 h-4" />,
        activeIcon: <FiHelpCircle className="w-4 h-4" />,
        labelKey: "dashboard.sidebar.student.myQuizzes",
        path: "/dashboard/my-quizzes",
    },
    {
        icon: <FiShoppingBag className="w-4 h-4" />,
        activeIcon: <FiShoppingBag className="w-4 h-4" />,
        labelKey: "dashboard.sidebar.student.myPurchases",
        path: "/dashboard/purchases",
    },
    {
        icon: <FiFileText className="w-4 h-4" />,
        activeIcon: <FiFileText className="w-4 h-4" />,
        labelKey: "dashboard.sidebar.student.certificates",
        path: "/dashboard/certificates",
    },
    {
        icon: <FiMessageSquare className="w-4 h-4" />,
        activeIcon: <FiMessageSquare className="w-4 h-4" />,
        labelKey: "dashboard.sidebar.student.messages",
        path: "/dashboard/messages",
    },
    {
        icon: <FiSettings className="w-4 h-4" />,
        activeIcon: <FiSettings className="w-4 h-4" />,
        labelKey: "dashboard.sidebar.student.profileSettings",
        path: "/dashboard/profile-settings/personal-details",
    },
    {
        icon: <PiChalkboardTeacher className="w-4 h-4" />,
        activeIcon: <PiChalkboardTeacher className="w-4 h-4" />,
        labelKey: "dashboard.sidebar.student.whiteboard",
        path: "/dashboard/whiteboard",
    },
];
