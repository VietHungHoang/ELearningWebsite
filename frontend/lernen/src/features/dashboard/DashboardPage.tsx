import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "./components/DashboardLayout";
import {
    TUTOR_SIDEBAR_OPTIONS,
    STUDENT_SIDEBAR_OPTIONS,
    type UserInfo,
    type SidebarOption,
} from "./config/dashboardConfigs";

const DashboardPage = () => {
    const { state } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect if not authenticated
    if (!state.isAuthenticated || !state.user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-600">Please log in to access the dashboard.</p>
            </div>
        );
    }

    const { role, name, email } = state.user;

    // Redirect students from /dashboard to /dashboard/my-bookings
    if (role === "student" && location.pathname === "/dashboard") {
        navigate("/dashboard/my-bookings", { replace: true });
        return null;
    }

    // Determine sidebar options based on role
    let sidebarOptions: SidebarOption[] = [];
    let userRole: "tutor" | "student" = "student";

    switch (role) {
        case "tutor":
            sidebarOptions = TUTOR_SIDEBAR_OPTIONS;
            userRole = "tutor";
            break;
        case "student":
            sidebarOptions = STUDENT_SIDEBAR_OPTIONS;
            userRole = "student";
            break;
        default:
            return (
                <div className="flex items-center justify-center h-screen">
                    <p className="text-red-600">Invalid user role.</p>
                </div>
            );
    }

    // User info for header
    const userInfo: UserInfo = {
        name,
        email,
        role: userRole,
        balance: userRole === "tutor" ? 0 : undefined, // Only tutors have balance
    };

    return (
        <DashboardLayout
            sidebarOptions={sidebarOptions}
            headerProps={{
                userInfo,
            }}
        >
            {/* Render nested routes or default content */}
            <Outlet />
        </DashboardLayout>
    );
};

export default DashboardPage;
