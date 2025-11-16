import apiService from "./apiService";
import type {
    LoginRequest,
    LoginResponse,
    SignUpRequest,
    SignUpResponse,
    StartSignUpRequest,
} from "../types/api";

const login = async (request: LoginRequest): Promise<LoginResponse> => {
    const response = await apiService.post<LoginResponse>("/auth/login", request);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};

const signup = async (request: SignUpRequest): Promise<SignUpResponse> => {
    const response = await apiService.post<SignUpResponse>("/v1/auth/register", request);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};

const startSignUp = async (request: StartSignUpRequest): Promise<void> => {
    const response = await apiService.post("v1/auth/registration/start", request);
    if (!response.success) {
        throw new Error(response.message);
    }
};

const verifyOtp = async (request: { email: string; otp: string }): Promise<void> => {
    const response = await apiService.post('v1/auth/registration/verify-otp', request);
    if (!response.success) {
        throw new Error(response.message);
    }
};

const createAccount = async (request: { email: string; password: string; role: string }): Promise<void> => {
    const response = await apiService.post('v1/auth/registration/create-account', request);
    if (!response.success) {
        throw new Error(response.message);
    }
};

const getGoogleAuthUrl = async (redirectUri: string): Promise<string> => {
    const response = await apiService.get(`v1/auth/google/auth-url?redirectUri=${encodeURIComponent(redirectUri)}`);
    if (!response.success) {
        throw new Error(response.message);
    }
    return (response.data as { authUrl: string }).authUrl;
};

const googleLogin = async (request: { code: string; redirectUri: string }): Promise<{ accessToken: string; refreshToken: string; tokenType: string; expiresIn: number; scope: string }> => {
    const response = await apiService.post('/v1/auth/google/callback', request);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data as { accessToken: string; refreshToken: string; tokenType: string; expiresIn: number; scope: string };
};

export default { login, signup, signUpInitiate: startSignUp, verifyOtp, createAccount, getGoogleAuthUrl, googleLogin };
