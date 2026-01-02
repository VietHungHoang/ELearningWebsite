import React, { useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import type { LoginRequest, LoginResponse, UserRole } from "../../types/api";
import { decodeJwt, extractUserRole } from "../../lib/jwt";
import authService from "../../services/authService";
import AuthContext from "../../context/AuthContext";

/**
 * Base64 URL encode helper
 */
const base64UrlEncode = (str: string): string => {
    return btoa(str)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
};

/**
 * Generate a fake JWT token for bypass authentication
 * Format: header.payload.signature (fake signature)
 */
const generateFakeJWT = (userId: string, email: string, name: string, role: UserRole): string => {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + (24 * 60 * 60); // 24 hours from now

    const header = {
        alg: "HS256",
        typ: "JWT"
    };

    const payload = {
        sub: userId,
        email: email,
        email_verified: true,
        name: name,
        preferred_username: email,
        given_name: name,
        exp: exp,
        iat: now,
        iss: "http://localhost:8080/realms/lernen",
        aud: "account",
        realm_access: {
            roles: role === "tutor" ? ["tutor", "default-roles-lernen"] : ["student", "default-roles-lernen"]
        },
        resource_access: {},
        scope: "openid profile email"
    };

    // Base64 URL encode header and payload
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));

    // Fake signature (just for frontend bypass) - base64 encoded
    const fakeSignature = base64UrlEncode("fake_signature_for_bypass");

    return `${encodedHeader}.${encodedPayload}.${fakeSignature}`;
};

/**
 * Check if login request is for bypass (fake user)
 * Format: email = "fake@student.local" or "fake@tutor.local"
 */
const isBypassLogin = (email: string): { isBypass: boolean; role?: UserRole } => {
    if (email === "fake@student.local") {
        return { isBypass: true, role: "student" };
    }
    if (email === "fake@tutor.local") {
        return { isBypass: true, role: "tutor" };
    }
    return { isBypass: false };
};

export interface AuthContextType {
    state: AuthState;
    login: (request: LoginRequest) => Promise<AuthUser | null>;
    logout: () => void;
    isInitialized: boolean;
}

export interface AuthUser {
    id: string;
    role: UserRole;
    name: string;
    email: string;
    avatarUrl?: string;
}

type AuthStatus = "idle" | "loading" | "failed";

export interface AuthState {
    isAuthenticated: boolean;
    user: AuthUser | null;
    status: AuthStatus;
}

type AuthAction =
    | { type: "LOGIN_START" }
    | { type: "LOGIN_SUCCESS"; payload: LoginResponse }
    | { type: "LOGIN_FAILURE" }
    | { type: "LOGOUT" };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case "LOGIN_START":
            return { ...state, status: "loading" };
        case "LOGIN_SUCCESS":
            const decodedUser = decodeJwt(action.payload.accessToken);
            const user = decodedUser
                ? {
                    id: decodedUser.sub,
                    name: decodedUser.name,
                    email: decodedUser.email,
                    role: extractUserRole(decodedUser),
                    avatarUrl: decodedUser.picture,
                }
                : null;
            localStorage.setItem("accessToken", action.payload.accessToken);
            localStorage.setItem("refreshToken", action.payload.refreshToken);
            try {
                localStorage.setItem("accessTokenExpiresIn", String(action.payload.expiresIn));
                localStorage.setItem(
                    "refreshTokenExpiresIn",
                    String(action.payload.refreshExpiresIn)
                );
            } catch (e) {
                // ignore localStorage errors
            }
            return {
                isAuthenticated: true,
                user,
                status: "idle",
            };
        case "LOGIN_FAILURE":
            return { ...state, status: "failed" };
        case "LOGOUT":
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            return {
                isAuthenticated: false,
                user: null,
                status: "idle",
            };
        default:
            return state;
    }
};

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    status: "idle",
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const [isInitialized, setIsInitialized] = React.useState(false);
    const login = async (request: LoginRequest): Promise<AuthUser | null> => {
        dispatch({ type: "LOGIN_START" });
        try {
            // Check for bypass login
            const bypassCheck = isBypassLogin(request.email);
            if (bypassCheck.isBypass && bypassCheck.role) {
                // Generate fake JWT token
                const fakeToken = generateFakeJWT(
                    `fake-user-${bypassCheck.role}-${Date.now()}`,
                    request.email,
                    bypassCheck.role === "tutor" ? "Fake Tutor User" : "Fake Student User",
                    bypassCheck.role
                );

                const fakeResponse: LoginResponse = {
                    accessToken: fakeToken,
                    refreshToken: `fake-refresh-token-${Date.now()}`,
                    expiresIn: 86400, // 24 hours
                    refreshExpiresIn: 604800, // 7 days
                };

                dispatch({ type: "LOGIN_SUCCESS", payload: fakeResponse });

                return {
                    id: `fake-user-${bypassCheck.role}-${Date.now()}`,
                    name: bypassCheck.role === "tutor" ? "Fake Tutor User" : "Fake Student User",
                    email: request.email,
                    role: bypassCheck.role,
                };
            }

            // Normal login flow
            const response = await authService.login(request);
            dispatch({ type: "LOGIN_SUCCESS", payload: response });

            // Decode and return user info immediately
            const decodedUser = decodeJwt(response.accessToken);
            if (decodedUser) {
                return {
                    id: decodedUser.sub,
                    name: decodedUser.name,
                    email: decodedUser.email,
                    role: extractUserRole(decodedUser),
                    avatarUrl: decodedUser.picture,
                };
            }
            return null;
        } catch (error) {
            dispatch({ type: "LOGIN_FAILURE" });
            throw error;
        }
    };

    const logout = () => {
        dispatch({ type: "LOGOUT" });
    };

    useEffect(() => {
        // Check for existing token on mount
        const token = localStorage.getItem("accessToken");
        if (token) {
            const decodedUser = decodeJwt(token);
            if (decodedUser) {
                dispatch({
                    type: "LOGIN_SUCCESS",
                    payload: {
                        accessToken: token,
                        refreshToken: localStorage.getItem("refreshToken") || "",
                        expiresIn: parseInt(localStorage.getItem("accessTokenExpiresIn") || "0"),
                        refreshExpiresIn: parseInt(
                            localStorage.getItem("refreshTokenExpiresIn") || "0"
                        ),
                    },
                });
            }
        }
        setIsInitialized(true);
    }, []);

    return <AuthContext.Provider value={{ state, login, logout, isInitialized }}>{children}</AuthContext.Provider>;
};