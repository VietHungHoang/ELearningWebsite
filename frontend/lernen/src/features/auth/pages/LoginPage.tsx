import React, { useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import LoginForm from "../components/LoginForm.tsx";
import AuthLayout from "../components/AuthLayout.tsx";
import IntroducePanelLogin from "../../../components/auth/IntroducePanelLogin.tsx";
import { useAuth } from "../../../context/AuthContext.tsx";
import authService from "../../../services/authService";
import { useEffect, useRef } from "react";
import Toast from "../../../components/ui/Toast.tsx";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { login, state } = useAuth();
    const hasCalledCallback = useRef(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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

    const formatLoginError = (error: any): string => {
        const errorMessage = error?.message || error?.response?.data?.message || '';
        
        // Check for 401 Unauthorized (wrong credentials)
        if (errorMessage.includes('401') || 
            errorMessage.includes('Unauthorized') ||
            errorMessage.includes('Invalid credentials') ||
            errorMessage.toLowerCase().includes('invalid username or password')) {
            return 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.';
        }
        
        // Check for Keycloak connection errors
        if (errorMessage.includes('Keycloak') || errorMessage.includes('keycloak')) {
            if (errorMessage.includes('401')) {
                return 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.';
            }
            return 'Không thể kết nối đến hệ thống xác thực. Vui lòng thử lại sau.';
        }
        
        // Check for network errors
        if (errorMessage.includes('Network Error') || errorMessage.includes('timeout')) {
            return 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet và thử lại.';
        }
        
        // Check for server errors
        if (errorMessage.includes('500') || errorMessage.includes('Internal Server Error')) {
            return 'Lỗi hệ thống. Vui lòng thử lại sau.';
        }
        
        // If error message is too technical, show user-friendly message
        if (errorMessage.includes('RuntimeException') || 
            errorMessage.includes('java.lang') ||
            errorMessage.includes('POST request for') ||
            errorMessage.length > 100) {
            return 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.';
        }
        
        // Return original message if it's user-friendly
        return errorMessage || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.';
    };

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
        } catch (error: any) {
            console.error("Login failed:", error);
            const errorMessage = formatLoginError(error);
            setToast({
                message: errorMessage,
                type: 'error'
            });
        }
    };

    return (
        <AuthLayout>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
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
