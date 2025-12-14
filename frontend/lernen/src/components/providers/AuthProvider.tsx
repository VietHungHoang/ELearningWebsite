import React, { useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import type { LoginRequest, LoginResponse, UserRole } from "../../types/api";
import { decodeJwt, extractUserRole } from "../../lib/jwt";
import authService from "../../services/authService";
import AuthContext from "../../context/AuthContext";

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
