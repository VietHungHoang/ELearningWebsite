/**
 * Quiz Feature Types
 * TypeScript interfaces matching Backend DTOs
 */

// ============ ENUMS ============

export type QuizStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
export type StudentQuizStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
export type AttemptStatus = 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED' | 'ABANDONED';
export type QuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';

// ============ QUESTION TYPES ============

export interface QuestionOption {
    id: string;
    optionText: string;
    orderIndex: number;
    isCorrect?: boolean; // Only for tutor view
}

export interface Question {
    id: string;
    questionText: string;
    type: QuestionType;
    orderIndex: number;
    explanation?: string;
    options: QuestionOption[];
    createdAt: string;
    updatedAt: string;
}

// ============ QUIZ SUMMARY (TUTOR VIEW) ============

export interface QuizSummary {
    id: string;
    classId: string;
    creatorId: string;
    title: string;
    description?: string;
    timeLimitMinutes: number;
    totalQuestions: number;
    status: QuizStatus;
    publishedAt?: string;
    dueDate?: string;
    passingScore: number;
    maxAttempts: number;
    totalAttempts: number;
    averagePercentage?: number;
    creatorName?: string;
    creatorAvatar?: string;
    highestScore?: number;
    createdAt: string;
    updatedAt: string;
}

// ============ QUIZ DETAIL ============

export interface QuizDetail {
    id: string;
    classId: string;
    creatorId: string;
    title: string;
    description?: string;
    timeLimitMinutes: number;
    totalQuestions: number;
    status: QuizStatus;
    publishedAt?: string;
    dueDate?: string;
    passingScore: number;
    shuffleQuestions: boolean;
    showCorrectAnswers: boolean;
    maxAttempts: number;
    questions: Question[];
    createdAt: string;
    updatedAt: string;
}

// ============ STUDENT QUIZ SUMMARY ============

export interface StudentQuizSummary {
    id: string;
    title: string;
    description?: string;
    totalQuestions: number;
    timeLimitMinutes: number;
    passingScore: number;
    dueDate?: string;
    studentStatus: StudentQuizStatus;
    tutorName?: string;
    tutorAvatar?: string;
    currentAttemptId?: string;
    questionsAnswered?: number;
    timeRemainingSeconds?: number;
    score?: number;
    maxScore?: number;
    percentage?: number;
    passed?: boolean;
    completedAt?: string;
    assignedAt?: string;
    createdAt: string;
}

// ============ QUIZ ATTEMPT ============

export interface QuizAttempt {
    id: string;
    quizId: string;
    studentId: string;
    attemptNumber: number;
    status: AttemptStatus;
    startedAt?: string;
    submittedAt?: string;
    correctAnswers: number;
    totalQuestions: number;
    percentage?: number;
    passed: boolean;
    createdAt: string;
}

// ============ QUIZ RESULT ============

export interface OptionResult {
    optionId: string;
    optionText: string;
    isCorrect: boolean;
    isSelected: boolean;
}

export interface QuestionResult {
    questionId: string;
    questionText: string;
    isCorrect: boolean;
    options: OptionResult[];
    explanation?: string;
}

export interface QuizResult {
    attemptId: string;
    quizId: string;
    quizTitle: string;
    correctAnswers: number;
    totalQuestions: number;
    percentage: number;
    passed: boolean;
    questions: QuestionResult[];
}

// ============ QUIZ STATISTICS ============

export interface OptionStatistics {
    optionId: string;
    optionText: string;
    isCorrect: boolean;
    selectedCount: number;
    selectedRate: number;
}

export interface QuestionStatistics {
    questionId: string;
    questionText: string;
    orderIndex: number;
    totalAnswers: number;
    correctAnswers: number;
    correctRate: number;
    averageTimeSeconds?: number;
    optionStatistics: OptionStatistics[];
}

export interface StudentPerformance {
    studentId: string;
    studentName: string;
    studentAvatar?: string;
    score: number;
    completionTimeMinutes: number;
    attemptDate: string;
    passed: boolean;
}

export interface QuizStatistics {
    quizId: string;
    quizTitle: string;
    totalAttempts: number;
    completedAttempts: number;
    averagePercentage?: number;
    passRate?: number;
    averageTimeSpentMinutes?: number;
    highestPercentage?: number;
    lowestPercentage?: number;
    completionRate?: number;
    questionStatistics: QuestionStatistics[];
    studentPerformances: StudentPerformance[];
}

// ============ REQUEST TYPES ============

export interface CreateQuestionRequest {
    questionText: string;
    type: QuestionType;
    orderIndex: number;
    explanation?: string;
    options: {
        optionText: string;
        isCorrect: boolean;
        orderIndex: number;
    }[];
}

export interface CreateQuizRequest {
    classId: string;
    title: string;
    description?: string;
    timeLimitMinutes: number;
    dueDate?: string;
    passingScore?: number;
    shuffleQuestions?: boolean;
    showCorrectAnswers?: boolean;
    maxAttempts?: number;
    questions: CreateQuestionRequest[];
}

export interface UpdateQuizRequest {
    title: string;
    description?: string;
    timeLimitMinutes: number;
    dueDate?: string;
    passingScore?: number;
    shuffleQuestions?: boolean;
    showCorrectAnswers?: boolean;
    maxAttempts?: number;
}

export interface SubmitAnswerRequest {
    questionId: string;
    selectedOptionIds: string[];
}

export interface SubmitQuizRequest {
    answers: SubmitAnswerRequest[];
}
