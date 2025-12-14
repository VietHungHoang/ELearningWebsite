import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./components/providers/AuthProvider";
import { CurrencyProvider } from "./context/CurrencyContext";
import ChatWidget from "./components/chat/ChatWidget";
import router from "./routes";

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
                <RouterProvider router={router} />
                <ChatWidget />
            </AuthProvider>
        </CurrencyProvider>
    );
};

export default App;
