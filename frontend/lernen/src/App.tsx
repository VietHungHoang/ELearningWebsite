import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./components/providers/AuthProvider";
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
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
};

export default App;
