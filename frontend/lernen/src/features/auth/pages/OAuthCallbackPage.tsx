import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import authService from "../../../services/authService";
import BirdLoading from "../../../components/ui/BirdLoading";

/**
 * OAuth Callback Page - Dedicated page for handling OAuth redirects
 * Shows loading spinner while exchanging code for tokens
 */
const OAuthCallbackPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const hasProcessed = useRef(false);

    useEffect(() => {
        const code = searchParams.get("code");

        if (!code) {
            console.error("No code found in URL");
            navigate("/login");
            return;
        }

        if (hasProcessed.current) return;
        hasProcessed.current = true;

        const processOAuthCallback = async () => {
            try {
                const tokens = await authService.googleLogin({
                    code,
                    redirectUri: window.location.origin + "/oauth/callback",
                });

                // Store tokens
                localStorage.setItem("accessToken", tokens.accessToken);
                localStorage.setItem("refreshToken", tokens.refreshToken);

                // Add small delay to show loading animation
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Navigate to home
                navigate("/", { replace: true });
            } catch (error) {
                console.error("OAuth callback failed:", error);
                hasProcessed.current = false;
                navigate("/login", { replace: true });
            }
        };

        processOAuthCallback();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
            <BirdLoading
                title="Signing you in..."
                description="Please wait while we complete your sign in"
            />
        </div>
    );
};

export default OAuthCallbackPage;

