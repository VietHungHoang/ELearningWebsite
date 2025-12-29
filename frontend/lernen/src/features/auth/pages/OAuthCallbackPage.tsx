import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import authService from "../../../services/authService";

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
            <div className="text-center">
                <div className="loader mx-auto mb-6"></div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Signing you in...</h2>
                <p className="text-gray-500">Please wait while we complete your sign in</p>
            </div>
            <style>{`
                .loader {
                    width: 20px;
                    height: 80px;
                    background: #935936;
                    position: relative;
                }
                .loader:before {
                    content: "";
                    position: absolute;
                    top: 10px;
                    left: -22px;
                    width: 25px;
                    height: 60px;
                    background: 
                        radial-gradient(farthest-side,#fff 92%,#0000) 60% 6px/4px 4px,
                        radial-gradient(50% 60%,#0b6459 92%,#0000) center/70% 55%,
                        radial-gradient(farthest-side,#0b6459 92%,#0000) 50% 3px/14px 14px,
                        radial-gradient(142% 100% at bottom right,#0000 64%,#0b6459 65%) bottom/57% 40%,
                        conic-gradient(from -120deg at right,#0b6459 36deg,#0000 0)100% 3px/51% 12px,
                        conic-gradient(from 120deg at top left,#0000 ,#ef524a 2deg 40deg,#0000 43deg) top/100% 10px;
                    background-repeat: no-repeat;    
                    transform: rotate(-26deg);
                    transform-origin: 100% 80%;
                    animation: l16 .25s infinite linear alternate;
                }
                .loader:after {    
                    content: "";
                    position: absolute;
                    width: 6px;
                    height: 12px;
                    left: -6px;
                    bottom: 15px;
                    border-radius: 100px 0 0 100px;
                    background: #0b6459;
                }
                @keyframes l16 {
                    100% {transform: rotate(0)}
                }
            `}</style>
        </div>
    );
};

export default OAuthCallbackPage;
