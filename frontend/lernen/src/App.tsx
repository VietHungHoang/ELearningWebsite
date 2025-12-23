import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./components/providers/AuthProvider";
import { CurrencyProvider } from "./context/CurrencyContext";
import { ChatProvider } from "./context/ChatContext";
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
                <ChatProvider>
                    <RouterProvider router={router} />
                    <ConditionalChatWidget />
                </ChatProvider>
            </AuthProvider>
        </CurrencyProvider>
    );
};

export default App;
