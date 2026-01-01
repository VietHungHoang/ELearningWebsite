import apiService from "./apiService";
import type {
    LoginRequest,
    LoginResponse,
    SignUpRequest,
    SignUpResponse,
    StartSignUpRequest,
    AccountCreatedResponse,
} from "../types/api";
import type { TutorOnboarding } from "../types/tutor";

const login = async (request: LoginRequest): Promise<LoginResponse> => {
    const response = await apiService.post<LoginResponse>("v1/auth/login", request);
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

const createAccount = async (request: { email: string; password: string; role: string }): Promise<AccountCreatedResponse> => {
    const response = await apiService.post('v1/auth/registration/create-account', request);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data as AccountCreatedResponse;
};

const getGoogleAuthUrl = async (redirectUri: string): Promise<string> => {
    const response = await apiService.get(`v1/auth/google/auth-url?redirectUri=${encodeURIComponent(redirectUri)}`);
    if (!response.success) {
        throw new Error(response.message);
    }
    return (response.data as { authUrl: string }).authUrl;
};

const googleLogin = async (request: { code: string; redirectUri: string; role?: string }): Promise<{ accessToken: string; refreshToken: string; tokenType: string; expiresIn: number; scope: string }> => {
    const response = await apiService.post('/v1/auth/google/callback', request);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data as { accessToken: string; refreshToken: string; tokenType: string; expiresIn: number; scope: string };
};

const getOnboardingLatestStep = async (): Promise<{ step: number }> => {
    const response = await apiService.get('/v1/public/tutors/${tutorId}/onboarding/step');
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data as { step: number };
};

const getOnboardingData = async (tutorId: string): Promise<TutorOnboarding> => {
    const response = await apiService.get(`/v1/tutors/${tutorId}/onboarding`);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data as TutorOnboarding;
};

const saveOnboardingStep = async (tutorId: string, step: number, data: string): Promise<void> => {
    const payload = {
        step: step,
        data: data // data đã là string JSON từ frontend
    };
    const response = await apiService.put(`/v1/tutors/${tutorId}/onboarding`, payload);
    if (!response.success) {
        throw new Error(response.message);
    }
};

const skipOnboardingStep = async (tutorId: string, step: number): Promise<void> => {
    const response = await apiService.post(`/v1/tutors/${tutorId}/onboarding/skip`, { step });
    if (!response.success) {
        throw new Error(response.message);
    }
};

const generateIntroductionWithAI = async (tutorId: string, prompt: string): Promise<string> => {
    const response = await apiService.post<{ introduction: string }>(`v1/tutors/${tutorId}/onboarding/generate-introduction`, { prompt });
    if (!response.success) {
        throw new Error(response.message || "Failed to generate introduction");
    }
    return response.data.introduction;
};

export default { 
    login, 
    signup, 
    signUpInitiate: startSignUp, 
    verifyOtp, 
    createAccount, 
    getGoogleAuthUrl, 
    googleLogin, 
    getOnboardingLatestStep, 
    getOnboardingData, 
    saveOnboardingStep,
    skipOnboardingStep,
    generateIntroductionWithAI
};
