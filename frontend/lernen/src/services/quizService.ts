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
    const response = await apiService.get<StudentQuizSummary[]>('/v1/student/quizzes', params);
    return response.data;
};

/**
 * Get quiz for taking (without correct answers)
 */
export const getQuizForStudent = async (quizId: string): Promise<QuizDetail> => {
    const response = await apiService.get<QuizDetail>(`/api/student/quizzes/${quizId}`);
    return response.data;
};

/**
 * Start a quiz attempt
 */
export const startQuizAttempt = async (quizId: string): Promise<QuizAttempt> => {
    const response = await apiService.post<QuizAttempt>(`/api/student/quizzes/${quizId}/start`);
    return response.data;
};

/**
 * Get current in-progress attempt
 */
export const getCurrentAttempt = async (quizId: string): Promise<QuizAttempt | null> => {
    try {
        const response = await apiService.get<QuizAttempt>(`/api/student/quizzes/${quizId}/current-attempt`);
        return response.data;
    } catch {
        return null;
    }
};

/**
 * Save an answer during quiz taking
 */
export const saveAnswer = async (attemptId: string, request: SubmitAnswerRequest): Promise<void> => {
    await apiService.post(`/api/student/attempts/${attemptId}/answers`, request);
};

/**
 * Submit quiz attempt
 */
export const submitQuizAttempt = async (attemptId: string, request: SubmitQuizRequest): Promise<QuizResult> => {
    const response = await apiService.post<QuizResult>(`/api/student/attempts/${attemptId}/submit`, request);
    return response.data;
};

/**
 * Get quiz result
 */
export const getQuizResult = async (attemptId: string): Promise<QuizResult> => {
    const response = await apiService.get<QuizResult>(`/api/student/attempts/${attemptId}/result`);
    return response.data;
};

/**
 * Get student's attempt history for a quiz
 */
export const getAttemptHistory = async (quizId: string): Promise<QuizAttempt[]> => {
    const response = await apiService.get<QuizAttempt[]>(`/api/student/quizzes/${quizId}/attempts`);
    return response.data;
};

/**
 * Get all student's quiz attempts
 */
export const getAllStudentAttempts = async (): Promise<QuizAttempt[]> => {
    const response = await apiService.get<QuizAttempt[]>('/api/student/attempts');
    return response.data;
};

/**
 * Check if student can attempt quiz
 */
export const canAttemptQuiz = async (quizId: string): Promise<boolean> => {
    const response = await apiService.get<boolean>(`/api/student/quizzes/${quizId}/can-attempt`);
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
};

export default quizService;
