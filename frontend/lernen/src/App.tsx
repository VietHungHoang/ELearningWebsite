import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./components/providers/AuthProvider";
import { NotificationProvider } from "./context/NotificationContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { ChatProvider } from "./context/ChatContext";
import { FullscreenProvider } from "./context/FullscreenContext";
import { SidebarProvider } from "./context/SidebarContext";
import ChatWidget from "./components/chat/ChatWidget";
import router from "./routes";

const ConditionalChatWidget: React.FC = () => {
    const isDashboardRoute = window.location.pathname.startsWith('/dashboard');

    if (isDashboardRoute) {
        return null;
    }

    return <ChatWidget />;
};

export type AuthPage = "login" | "signup" | "forgotPassword" | "otpVerification" | "createNewPassword";
export type AppPage =
    | "home"
    | "findTutors"
    | "tutorDetail"
    | "findCourses"
    | "courseDetail"
    | "profileSettings"
    | "favorites"
    | "quizResult"
    | "quizTaking"
    | "inbox"
    | "tutorDashboard"
    | "courseTaking";
export type UserRole = "Student" | "Tutor" | "Admin";

const App: React.FC = () => {
    return (
        <CurrencyProvider>
            <AuthProvider>
                <NotificationProvider>
                    <ChatProvider>
                        <SidebarProvider>
                            <FullscreenProvider>
                                <RouterProvider router={router} />
                                <ConditionalChatWidget />
                            </FullscreenProvider>
                        </SidebarProvider>
                    </ChatProvider>
                </NotificationProvider>
            </AuthProvider>
        </CurrencyProvider>
    );
};

export default App;
