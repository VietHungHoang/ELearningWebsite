/**
 * Quiz Service
 * API service for Quiz feature operations
 */

import apiService from './apiService';
import type {
    QuizSummary,
    QuizDetail,
    StudentQuizSummary,
    StudentQuizStatus,
    QuizAttempt,
    QuizResult,
    QuizStatistics,
    CreateQuizRequest,
    UpdateQuizRequest,
    SubmitAnswerRequest,
    SubmitQuizRequest,
} from '../types/quiz';
import type { PaginatedResponse } from '../types/api';

// ============ TUTOR ENDPOINTS ============

/**
 * Get all quizzes created by a tutor
 */
export const getQuizzesByCreator = async (creatorId: string): Promise<QuizSummary[]> => {
    const response = await apiService.get<QuizSummary[]>(`/v1/quizzes/creator/${creatorId}`);
    return response.data;
};

/**
 * Get all quizzes for a class
 */
export const getQuizzesByClass = async (classId: string): Promise<QuizSummary[]> => {
    const response = await apiService.get<QuizSummary[]>(`/v1/quizzes/class/${classId}`);
    return response.data;
};

/**
 * Search quizzes in a class
 */
export const searchQuizzes = async (classId: string, query: string): Promise<QuizSummary[]> => {
    const response = await apiService.get<QuizSummary[]>(`/v1/quizzes/class/${classId}/search`, { q: query });
    return response.data;
};

/**
 * Get quiz details (for tutor, includes correct answers)
 */
export const getQuizDetail = async (quizId: string, includeAnswers = true): Promise<QuizDetail> => {
    const response = await apiService.get<QuizDetail>(`/v1/quizzes/${quizId}`, { includeAnswers });
    return response.data;
};

/**
 * Create a new quiz
 */
export const createQuiz = async (request: CreateQuizRequest): Promise<QuizDetail> => {
    const response = await apiService.post<QuizDetail>('/v1/quizzes', request);
    return response.data;
};

/**
 * Update a quiz
 */
export const updateQuiz = async (quizId: string, request: UpdateQuizRequest): Promise<QuizDetail> => {
    const response = await apiService.put<QuizDetail>(`/v1/quizzes/${quizId}`, request);
    return response.data;
};

/**
 * Delete a quiz (soft delete)
 */
export const deleteQuiz = async (quizId: string): Promise<void> => {
    await apiService.delete(`/v1/quizzes/${quizId}`);
};

/**
 * Publish a quiz
 */
export const publishQuiz = async (quizId: string): Promise<QuizDetail> => {
    const response = await apiService.post<QuizDetail>(`/v1/quizzes/${quizId}/publish`);
    return response.data;
};

/**
 * Archive a quiz
 */
export const archiveQuiz = async (quizId: string): Promise<void> => {
    await apiService.post(`/v1/quizzes/${quizId}/archive`);
};

/**
 * Get quiz statistics
 */
export const getQuizStatistics = async (quizId: string): Promise<QuizStatistics> => {
    const response = await apiService.get<QuizStatistics>(`/v1/quizzes/${quizId}/statistics`);
    return response.data;
};

// ============ STUDENT ENDPOINTS ============

/**
 * Get all quizzes for student with their status
 */
export const getStudentQuizzes = async (status?: StudentQuizStatus): Promise<StudentQuizSummary[]> => {
    const params = status ? { status } : undefined;
    const response = await apiService.get<PaginatedResponse<StudentQuizSummary>>('/v1/quizzes/student', params);
    // Handle paginated response - extract content array
    if (response.data && 'content' in response.data) {
        return response.data.content;
    }
    // Fallback for non-paginated response (backward compatibility)
    return Array.isArray(response.data) ? response.data : [];
};

/**
 * Get quiz for taking (without correct answers)
 */
export const getQuizForStudent = async (quizId: string): Promise<QuizDetail> => {
    const response = await apiService.get<QuizDetail>(`/v1/quizzes/student/${quizId}`);
    
    // Check if response is successful
    if (!response.success) {
        throw new Error(response.message || 'Failed to load quiz');
    }
    
    // Ensure timeLimitMinutes is a number (convert if needed)
    if (response.data) {
        const timeLimit = response.data.timeLimitMinutes;
        if (timeLimit !== undefined && timeLimit !== null) {
            const numValue = Number(timeLimit);
            if (!isNaN(numValue)) {
                response.data.timeLimitMinutes = numValue;
            } else {
                console.warn('timeLimitMinutes cannot be converted to number:', timeLimit);
            }
        }
    }
    
    return response.data;
};

/**
 * Check if error message indicates max attempts reached
 */
const isMaxAttemptsError = (message: string | undefined): boolean => {
    if (!message) return false;
    const lowerMessage = message.toLowerCase();
    // Only match specific patterns that clearly indicate max attempts
    return (
        lowerMessage.includes('hết lượt') ||
        lowerMessage.includes('max attempt') ||
        lowerMessage.includes('maximum attempt') ||
        lowerMessage.includes('exceeded') ||
        lowerMessage.includes('attempt limit') ||
        lowerMessage.includes('no more attempts')
    );
};

/**
 * Start a quiz attempt
 */
export const startQuizAttempt = async (quizId: string): Promise<QuizAttempt> => {
    try {
        const response = await apiService.post<QuizAttempt>(`/v1/quizzes/student/${quizId}/start`);
        
        // Check if response is successful
        if (!response.success) {
            const error = new Error(response.message || 'Failed to start quiz attempt');
            // Only mark as max attempts error if success = false AND message indicates max attempts
            (error as any).isMaxAttemptsReached = isMaxAttemptsError(response.message);
            (error as any).isApiError = true; // Mark as API error (success = false)
            throw error;
        }
        
        return response.data;
    } catch (err: any) {
        // Handle axios errors that might contain ApiResponse in response.data
        if (err.response?.data) {
            const apiResponse = err.response.data;
            if (apiResponse.success === false) {
                const error = new Error(apiResponse.message || 'Failed to start quiz attempt');
                // Only mark as max attempts error if success = false AND message indicates max attempts
                (error as any).isMaxAttemptsReached = isMaxAttemptsError(apiResponse.message);
                (error as any).isApiError = true; // Mark as API error (success = false)
                throw error;
            }
        }
        // For network errors or other errors, don't mark as max attempts
        throw err;
    }
};

/**
 * Get current in-progress attempt
 */
export const getCurrentAttempt = async (quizId: string): Promise<QuizAttempt | null> => {
    try {
        const response = await apiService.get<QuizAttempt>(`/v1/quizzes/student/${quizId}/current-attempt`);
        
        // Check if response is successful
        if (!response.success) {
            // If not successful, return null (no current attempt)
            return null;
        }
        
        return response.data;
    } catch (err: any) {
        // Handle axios errors - if it's a 404 or success=false, return null
        if (err.response?.status === 404 || err.response?.data?.success === false) {
            return null;
        }
        // For other errors, rethrow
        throw err;
    }
};

/**
 * Save an answer during quiz taking
 */
export const saveAnswer = async (attemptId: string, request: SubmitAnswerRequest): Promise<void> => {
    await apiService.post(`/v1/quizzes/student/attempts/${attemptId}/answers`, request);
};

/**
 * Submit quiz attempt
 */
export const submitQuizAttempt = async (attemptId: string, request: SubmitQuizRequest): Promise<QuizResult> => {
    try {
        const response = await apiService.post<QuizResult>(`/v1/quizzes/student/attempts/${attemptId}/submit`, request);
        
        // Check if response is successful
        if (!response.success) {
            const error = new Error(response.message || 'Failed to submit quiz attempt');
            throw error;
        }
        
        return response.data;
    } catch (err: any) {
        // Handle axios errors that might contain ApiResponse in response.data
        if (err.response?.data) {
            const apiResponse = err.response.data;
            if (apiResponse.success === false) {
                throw new Error(apiResponse.message || 'Failed to submit quiz attempt');
            }
        }
        throw err;
    }
};

/**
 * Get quiz result
 */
export const getQuizResult = async (attemptId: string): Promise<QuizResult> => {
    const response = await apiService.get<QuizResult>(`/v1/quizzes/student/attempts/${attemptId}/result`);
    return response.data;
};

/**
 * Get student's attempt history for a quiz
 */
export const getAttemptHistory = async (quizId: string): Promise<QuizAttempt[]> => {
    const response = await apiService.get<QuizAttempt[]>(`/v1/quizzes/student/${quizId}/attempts`);
    return response.data;
};

/**
 * Get latest completed attempt ID for a quiz
 */
export const getLatestCompletedAttemptId = async (quizId: string): Promise<string | null> => {
    try {
        const attempts = await getAttemptHistory(quizId);
        // Find the latest submitted/graded attempt
        const completedAttempt = attempts
            .filter(attempt => attempt.status === 'SUBMITTED' || attempt.status === 'GRADED')
            .sort((a, b) => {
                const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
                const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
                return dateB - dateA; // Latest first
            })[0];
        
        return completedAttempt?.id || null;
    } catch {
        return null;
    }
};

/**
 * Get all student's quiz attempts
 */
export const getAllStudentAttempts = async (): Promise<QuizAttempt[]> => {
    const response = await apiService.get<QuizAttempt[]>('/v1/quizzes/student/attempts');
    return response.data;
};

/**
 * Check if student can attempt quiz
 */
export const canAttemptQuiz = async (quizId: string): Promise<boolean> => {
    const response = await apiService.get<boolean>(`/v1/quizzes/student/${quizId}/can-attempt`);
    return response.data;
};

// Export as default object for convenience
const quizService = {
    // Tutor
    getQuizzesByCreator,
    getQuizzesByClass,
    searchQuizzes,
    getQuizDetail,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    publishQuiz,
    archiveQuiz,
    getQuizStatistics,
    // Student
    getStudentQuizzes,
    getQuizForStudent,
    startQuizAttempt,
    getCurrentAttempt,
    saveAnswer,
    submitQuizAttempt,
    getQuizResult,
    getAttemptHistory,
    getAllStudentAttempts,
    canAttemptQuiz,
    getLatestCompletedAttemptId,
};

export default quizService;
