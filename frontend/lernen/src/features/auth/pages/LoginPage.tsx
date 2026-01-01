import React from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import LoginForm from "../components/LoginForm.tsx";
import AuthLayout from "../components/AuthLayout.tsx";
import IntroducePanelLogin from "../../../components/auth/IntroducePanelLogin.tsx";
import { useAuth } from "../../../context/AuthContext.tsx";
import authService from "../../../services/authService";
import { useEffect, useRef } from "react";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { login, state } = useAuth();
    const hasCalledCallback = useRef(false);

    // Get role from query param, default to 'student' if not provided or invalid
    const roleParam = searchParams.get('role');
    const role: 'student' | 'tutor' = roleParam === 'tutor' ? 'tutor' : 'student';

    useEffect(() => {
        const code = searchParams.get("code");
        if (code && !hasCalledCallback.current) {
            hasCalledCallback.current = true;
            // Handle Google OAuth callback with role
            const handleGoogleCallback = async () => {
                try {
                    const tokens = await authService.googleLogin({
                        code,
                        redirectUri: window.location.origin + location.pathname,
                        role: role, // Pass role detected from URL
                    });
                    // Store tokens
                    localStorage.setItem("accessToken", tokens.accessToken);
                    localStorage.setItem("refreshToken", tokens.refreshToken);

                    // Navigate based on role
                    if (role === 'tutor') {
                        // For tutors, check onboarding status
                        try {
                            const user = await login({ email: "", password: "" }); // Get user from token
                            if (!user?.role) {
                                const tutorOnboarding = await authService.getOnboardingData(user!.id);
                                if (tutorOnboarding.currentStep < 7) {
                                    navigate(`/onboarding/tutor?step=${tutorOnboarding.currentStep}`);
                                } else {
                                    navigate("/onboarding-completion");
                                }
                            } else {
                                navigate("/dashboard");
                            }
                        } catch {
                            // If can't get user info, default to dashboard
                            navigate("/dashboard");
                        }
                    } else {
                        // Students go to home
                        navigate("/");
                    }
                } catch (error) {
                    console.error("Google login failed:", error);
                    hasCalledCallback.current = false;
                    // Handle error
                }
            };
            handleGoogleCallback();
        }
    }, [searchParams, navigate, location.pathname, role, login]);

    const handleLogin = async (email: string, password: string) => {
        try {
            const user = await login({ email, password });
            if (!user?.role) {
                const tutorOnboarding = await authService.getOnboardingData(user!.id);
                if (tutorOnboarding.currentStep < 7) {
                    navigate(`/onboarding/tutor?step=${tutorOnboarding.currentStep}`);
                } else {
                    navigate("/onboarding-completion");
                }
            } else if (user.role === "tutor") {
                navigate("/dashboard");
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    return (
        <AuthLayout>
            <main className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden">
                <IntroducePanelLogin />
                <LoginForm
                    handleLogin={handleLogin}
                    isLoading={state.status === "loading"}
                    role={role}
                />
            </main>
        </AuthLayout>
    );
};

export default LoginPage;
