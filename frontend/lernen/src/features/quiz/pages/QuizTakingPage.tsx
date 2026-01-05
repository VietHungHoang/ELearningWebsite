import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    IoCheckmarkCircle,
    IoChevronBack,
    IoChevronForward,
    IoFlagOutline,
    IoFlag,
    IoWarningOutline,
    IoCheckmarkOutline,
    IoSendOutline,
    IoExitOutline
} from 'react-icons/io5';
import { useAuth } from '../../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import QuizLayout from '../components/QuizLayout';
import quizService from '../../../services/quizService';
import type { QuizDetail, QuizAttempt, SubmitAnswerRequest } from '../../../types/quiz';
import Toast from '../../../components/ui/Toast';

// Remove all mock quiz data interfaces and constants

// Skeleton Loading Component
const QuizSkeleton: React.FC = () => {
    return (
        <div className="h-full flex items-center justify-center bg-gray-100 p-6">
            <div className="w-full max-w-[1600px] h-full max-h-[900px] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header Skeleton */}
                <div className="flex-shrink-0 flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="h-7 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="h-6 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="h-8 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                </div>

                {/* Question Header Skeleton */}
                <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 bg-gradient-to-r from-gray-200 to-gray-300">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/50 rounded-lg animate-pulse"></div>
                        <div className="h-5 w-40 bg-white/50 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-5 w-24 bg-white/50 rounded-lg animate-pulse"></div>
                        <div className="h-8 w-8 bg-white/50 rounded-lg animate-pulse"></div>
                    </div>
                </div>

                {/* Question Content Skeleton */}
                <div className="flex-1 flex flex-col overflow-y-auto bg-white">
                    <div className="flex-1 flex flex-col w-full px-6 py-6">
                        <div className="h-8 w-full bg-gray-200 rounded-lg animate-pulse mb-6"></div>
                        <div className="h-8 w-3/4 bg-gray-200 rounded-lg animate-pulse mb-8"></div>

                        {/* Answer Options Skeleton */}
                        <div className="flex-1 flex flex-col gap-4 min-h-0">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="min-h-[80px] px-6 py-4 rounded-xl border-2 border-gray-200 flex items-center"
                                >
                                    <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse mr-4"></div>
                                    <div className="flex-1 h-6 bg-gray-200 rounded-lg animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Navigation Footer Skeleton */}
                <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-200 to-gray-300">
                    <div className="h-10 w-24 bg-white/50 rounded-xl animate-pulse"></div>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="w-2.5 h-2.5 bg-white/50 rounded-full animate-pulse"></div>
                        ))}
                    </div>
                    <div className="h-10 w-24 bg-white/50 rounded-xl animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};


// Modal Component
const Modal: React.FC<{
    isOpen: boolean;
    title: string;
    icon: React.ReactNode;
    iconBg: string;
    children: React.ReactNode;
    actions: React.ReactNode;
}> = ({ isOpen, title, icon, iconBg, children, actions }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform transition-all duration-300 animate-modal-enter"
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 text-center mb-2">{title}</h3>
                <div className="text-gray-600 text-center text-sm mb-6">{children}</div>
                <div className="flex gap-2">{actions}</div>
            </div>

            <style>{`
                @keyframes modal-enter {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-modal-enter { animation: modal-enter 0.2s ease-out; }
            `}</style>
        </div>
    );
};

const QuizTakingPage: React.FC = () => {
    const navigate = useNavigate();
    const { quizId } = useParams<{ quizId: string }>();
    const { state } = useAuth();
    const { t } = useTranslation();

    // State for quiz data
    const [quiz, setQuiz] = useState<QuizDetail | null>(null);
    const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
    const [loading, setLoading] = useState(true);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Map<string, number[]>>(new Map());
    const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

    const isTutor = state.user?.role === 'tutor';
    const quizzesPath = isTutor ? '/dashboard/quizzes' : '/dashboard/my-quizzes';
    
    // Ref to track if component is mounted and prevent duplicate API calls
    const isMountedRef = useRef(true);
    const hasLoadedRef = useRef(false);

    // Load quiz and attempt data
    useEffect(() => {
        // Reset mounted flag when component mounts
        isMountedRef.current = true;
        hasLoadedRef.current = false;
        
        const loadQuizData = async () => {
            // Prevent duplicate calls
            if (hasLoadedRef.current || !isMountedRef.current) {
                return;
            }
            
            hasLoadedRef.current = true;
            
            if (!quizId) {
                if (!isMountedRef.current) return;
                setToast({ message: t('quizTaking.errors.quizIdMissing'), type: 'error' });
                setLoading(false);
                return;
            }

            try {
                if (!isMountedRef.current) return;
                setLoading(true);
                
                // Fetch quiz data
                const quizData = await quizService.getQuizForStudent(quizId);
                if (!isMountedRef.current) return;
                setQuiz(quizData);

                // Check for existing attempt or start new one
                let currentAttempt = await quizService.getCurrentAttempt(quizId);
                if (!isMountedRef.current) return;
                
                if (!currentAttempt) {
                    try {
                        // Start new attempt
                        currentAttempt = await quizService.startQuizAttempt(quizId);
                        if (!isMountedRef.current) return;
                    } catch (startError: any) {
                        if (!isMountedRef.current) return;
                        // Only show max attempts error if explicitly marked as such
                        if (startError.isMaxAttemptsReached) {
                            setToast({ message: t('quizTaking.errors.maxAttemptsReached'), type: 'error' });
                        } else {
                            // Show generic error for other failures
                            setToast({ message: startError.message || t('quizTaking.errors.failedToStart'), type: 'error' });
                        }
                        setLoading(false);
                        return;
                    }
                }
                
                if (!isMountedRef.current) return;
                setAttempt(currentAttempt);

                // Restore saved answers from attempt
                if (currentAttempt.answers && currentAttempt.answers.length > 0 && quizData.questions) {
                    const restoredAnswers = new Map<string, number[]>();
                    
                    currentAttempt.answers.forEach((answer) => {
                        const question = quizData.questions.find(q => q.id === answer.questionId);
                        if (question) {
                            // Map selectedOptionIds to option indexes
                            const optionIndexes = answer.selectedOptions
                                .map(optionId => {
                                    const index = question.options.findIndex(opt => opt.id === optionId);
                                    return index >= 0 ? index : null;
                                })
                                .filter((idx): idx is number => idx !== null);
                            
                            if (optionIndexes.length > 0) {
                                restoredAnswers.set(answer.questionId, optionIndexes);
                            }
                        }
                    });
                    
                    setSelectedAnswers(restoredAnswers);
                }

                if (isMountedRef.current) {
                    setLoading(false);
                }
            } catch (err: any) {
                if (!isMountedRef.current) return;
                console.error('Failed to load quiz:', err);
                
                // Only show max attempts error if explicitly marked as such
                if (err.isMaxAttemptsReached) {
                    setToast({ message: t('quizTaking.errors.maxAttemptsReached'), type: 'error' });
                } else {
                    // Show generic error message for other failures
                    const errorMessage = err.message || err.response?.data?.message;
                    setToast({ message: errorMessage || t('quizTaking.errors.failedToLoad'), type: 'error' });
                }
                setLoading(false);
            }
        };

        loadQuizData();
        
        // Cleanup function
        return () => {
            isMountedRef.current = false;
            hasLoadedRef.current = false;
        };
    }, [quizId, t]);

    useEffect(() => {
        if (quiz) {
            document.title = `${quiz.title} - Quiz`;
        }
    }, [quiz]);

    const currentQuestion = quiz?.questions[currentQuestionIndex];
    const currentAnswers = currentQuestion ? (selectedAnswers.get(currentQuestion.id) || []) : [];

    // Define confirmSubmit first (will be defined later, but we reference it here)
    const confirmSubmitRef = useRef<(() => Promise<void>) | null>(null);

    const handleAnswerSelect = async (optionIndex: number) => {
        if (!currentQuestion || !attempt) return;

        const newAnswers = new Map(selectedAnswers);
        const current = currentAnswers;
        const option = currentQuestion.options[optionIndex];

        if (currentQuestion.type === 'MULTIPLE_CHOICE') {
            const isSelected = current.includes(optionIndex);
            const updated = isSelected
                ? current.filter(idx => idx !== optionIndex)
                : [...current, optionIndex];
            newAnswers.set(currentQuestion.id, updated);
        } else {
            newAnswers.set(currentQuestion.id, [optionIndex]);
        }

        setSelectedAnswers(newAnswers);

        // Save answer to backend
        try {
            const selectedOptionIds = currentQuestion.type === 'MULTIPLE_CHOICE'
                ? (newAnswers.get(currentQuestion.id) || []).map(idx => currentQuestion.options[idx].id)
                : [option.id];

            await quizService.saveAnswer(attempt.id, {
                questionId: currentQuestion.id,
                selectedOptionIds
            });
        } catch (error) {
            console.error('Failed to save answer:', error);
            setToast({ message: t('quizTaking.errors.failedToSaveAnswer'), type: 'error' });
        }
    };

    const toggleFlag = () => {
        if (!currentQuestion) return;

        const newFlagged = new Set(flaggedQuestions);
        if (newFlagged.has(currentQuestion.id)) {
            newFlagged.delete(currentQuestion.id);
        } else {
            newFlagged.add(currentQuestion.id);
        }
        setFlaggedQuestions(newFlagged);
    };

    const goToQuestion = (index: number) => {
        setCurrentQuestionIndex(index);
    };

    const goToPrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const goToNext = () => {
        if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const getAnsweredCount = () => selectedAnswers.size;
    const getUnansweredCount = () => (quiz?.questions.length || 0) - selectedAnswers.size;

    const handleSubmit = () => {
        setShowSubmitModal(true);
    };

    const confirmSubmit = useCallback(async () => {
        // Prevent multiple submissions
        if (!attempt || !quiz || isSubmitting || hasSubmitted) {
            return;
        }

        setIsSubmitting(true);
        try {
            // Prepare answers for submission
            const answers: SubmitAnswerRequest[] = Array.from(selectedAnswers.entries()).map(([questionId, optionIndexes]) => {
                const question = quiz.questions.find(q => q.id === questionId);
                if (!question) return null;

                const selectedOptionIds = optionIndexes.map(idx => question.options[idx]?.id).filter(Boolean);
                return {
                    questionId,
                    selectedOptionIds
                };
            }).filter(Boolean) as SubmitAnswerRequest[];

            // Submit quiz
            await quizService.submitQuizAttempt(attempt.id, { answers });
            
            // Mark as submitted to prevent duplicate submissions
            setHasSubmitted(true);
            
            // Show success toast
            setToast({ message: t('quizTaking.success.quizSubmitted'), type: 'success' });
            
            // Navigate to result page
            navigate(`/quiz/result/${attempt.id}`);
        } catch (error) {
            console.error('Failed to submit quiz:', error);
            setIsSubmitting(false);
            // Only show toast if we actually attempted to submit and not already submitted
            if (!hasSubmitted) {
                setToast({ message: t('quizTaking.errors.failedToSubmit'), type: 'error' });
            }
        }
    }, [attempt, quiz, selectedAnswers, navigate, isSubmitting, hasSubmitted]);

    // Store confirmSubmit in ref
    useEffect(() => {
        confirmSubmitRef.current = confirmSubmit;
    }, [confirmSubmit]);

    const handleExit = () => {
        setShowExitModal(true);
    };

    const confirmExit = () => {
        navigate(quizzesPath);
    };

    return (
        <QuizLayout showBackButton={false} fullscreen={true}>
            {loading ? (
                <QuizSkeleton />
            ) : !quiz || !currentQuestion ? (
                <div className="h-full flex items-center justify-center bg-gray-100">
                    <p className="text-gray-600">No quiz data available</p>
                </div>
            ) : (
            <div className="h-full flex items-center justify-center bg-gray-100 p-6">
                {/* Quiz Container Box */}
                <div className="w-full max-w-[1600px] h-full max-h-[900px] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Main Quiz Area */}
                    <div className="flex-1 flex min-w-0 overflow-hidden">
                        {/* Left Content Area */}
                        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                            {/* Top Header */}
                            <div className="flex-shrink-0 flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-200 bg-white">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <span className="px-3 py-1.5 bg-[#065A46]/10 text-[#065A46] text-xs font-semibold rounded-lg whitespace-nowrap">
                                        {quiz.classId}
                                    </span>
                                    <h1 className="text-base font-semibold text-gray-800 truncate">{quiz.title}</h1>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <button
                                        onClick={handleExit}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title={t('quizTaking.exitQuiz')}
                                    >
                                        <IoExitOutline className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Question Header Bar */}
                            <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 bg-gradient-to-r from-[#065A46] to-[#0b6459]">
                                <div className="flex items-center gap-3">
                                    <span className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                        {currentQuestionIndex + 1}
                                    </span>
                                    <span className="text-white/95 text-sm font-medium">
                                        {t('quizTaking.of')} {quiz.questions.length} • {currentQuestion.type === 'MULTIPLE_CHOICE' ? t('quizTaking.multipleChoice') : t('quizTaking.singleChoice')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-white/90 text-sm font-medium">
                                        {getAnsweredCount()}/{quiz.questions.length} {t('quizTaking.answered')}
                                    </span>
                                    <button
                                        onClick={toggleFlag}
                                        className={`p-2 rounded-lg transition-all ${flaggedQuestions.has(currentQuestion.id)
                                                ? 'bg-amber-400 text-white shadow-sm'
                                                : 'bg-white/10 text-white/90 hover:bg-white/20'
                                            }`}
                                        title={flaggedQuestions.has(currentQuestion.id) ? t('quizTaking.removeFlag') : t('quizTaking.flagForReview')}
                                    >
                                        {flaggedQuestions.has(currentQuestion.id) ? (
                                            <IoFlag className="w-4 h-4" />
                                        ) : (
                                            <IoFlagOutline className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Question Content */}
                            <div className="flex-1 flex flex-col overflow-y-auto bg-white">
                                <div className="flex-1 flex flex-col w-full px-6 py-6">
                                    <h2 className="text-xl font-semibold text-gray-900 leading-relaxed mb-6">
                                        {currentQuestion.questionText}
                                    </h2>

                                    {/* Answer Options - Evenly distributed */}
                                    <div className="flex-1 flex flex-col gap-4 min-h-0">
                                        {currentQuestion.options.map((option, index) => {
                                            const isSelected = currentAnswers.includes(index);
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => handleAnswerSelect(index)}
                                                    className={`min-h-[80px] text-left px-6 py-4 rounded-xl border-2 transition-all duration-200 flex items-center ${isSelected
                                                            ? 'border-[#065A46] bg-[#065A46]/5 shadow-md'
                                                            : 'border-gray-200 hover:border-[#065A46]/50 hover:bg-gray-50 hover:shadow-sm'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-4 w-full">
                                                        <span className={`w-10 h-10 flex-shrink-0 flex items-center justify-center font-bold text-base transition-all ${isSelected
                                                                ? 'bg-[#065A46] text-white shadow-sm'
                                                                : 'bg-gray-100 text-gray-600'
                                                            } ${currentQuestion.type === 'MULTIPLE_CHOICE' ? 'rounded-lg' : 'rounded-full'}`}>
                                                            {String.fromCharCode(65 + index)}
                                                        </span>
                                                        <span className={`flex-1 text-base ${isSelected ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                                                            {option.optionText}
                                                        </span>
                                                        {isSelected && (
                                                            <div className="w-8 h-8 bg-[#065A46] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                                                                <IoCheckmarkOutline className="w-5 h-5 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Footer */}
                            <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#065A46] to-[#0b6459] border-t border-[#065A46]/20">
                                <button
                                    onClick={goToPrevious}
                                    disabled={currentQuestionIndex === 0}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${currentQuestionIndex === 0
                                            ? 'text-white/30 cursor-not-allowed bg-white/5'
                                            : 'text-white hover:bg-white/20 bg-white/10'
                                        }`}
                                >
                                    <IoChevronBack className="w-4 h-4" />
                                    {t('quizTaking.prev')}
                                </button>

                                {/* Progress dots */}
                                <div className="flex items-center gap-2">
                                    {quiz.questions.map((q, index) => {
                                        const isAnswered = selectedAnswers.has(q.id);
                                        const isCurrent = index === currentQuestionIndex;
                                        const isFlagged = flaggedQuestions.has(q.id);
                                        return (
                                            <button
                                                key={q.id}
                                                onClick={() => goToQuestion(index)}
                                                className={`relative transition-all ${isCurrent
                                                        ? 'w-10 h-2.5 bg-white rounded-full shadow-sm'
                                                        : isAnswered
                                                            ? 'w-2.5 h-2.5 bg-white/60 rounded-full hover:bg-white/80'
                                                            : 'w-2.5 h-2.5 bg-white/30 rounded-full hover:bg-white/50'
                                                    }`}
                                            >
                                                {isFlagged && !isCurrent && (
                                                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {currentQuestionIndex === quiz.questions.length - 1 ? (
                                    <button
                                        onClick={handleSubmit}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-white text-[#065A46] rounded-xl text-sm font-semibold hover:bg-white/90 transition-all shadow-lg"
                                    >
                                        <IoSendOutline className="w-4 h-4" />
                                        {t('quizTaking.submit')}
                                    </button>
                                ) : (
                                    <button
                                        onClick={goToNext}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#065A46] rounded-xl text-sm font-semibold hover:bg-white/90 transition-all shadow-lg"
                                    >
                                        {t('quizTaking.next')}
                                        <IoChevronForward className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Right Sidebar - Question Navigator */}
                        <div className="w-56 flex-shrink-0 border-l border-gray-200 bg-gray-50/30 p-4 hidden lg:flex flex-col">
                            <h3 className="text-xs font-semibold text-gray-600 uppercase mb-3 tracking-wide">{t('quizTaking.questions')}</h3>
                            <div className="grid grid-cols-5 gap-2 mb-4">
                                {quiz.questions.map((q, index) => {
                                    const isAnswered = selectedAnswers.has(q.id);
                                    const isFlagged = flaggedQuestions.has(q.id);
                                    const isCurrent = index === currentQuestionIndex;

                                    return (
                                        <button
                                            key={q.id}
                                            onClick={() => goToQuestion(index)}
                                            className={`relative aspect-square rounded-lg text-xs font-semibold transition-all ${isCurrent
                                                    ? 'bg-[#065A46] text-white shadow-md scale-105'
                                                    : isAnswered
                                                        ? 'bg-[#065A46]/20 text-[#065A46] hover:bg-[#065A46]/30 border border-[#065A46]/30'
                                                        : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                                                }`}
                                        >
                                            {index + 1}
                                            {isFlagged && (
                                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Stats + Legend */}
                            <div className="mt-auto p-3 bg-white rounded-lg border border-gray-200 space-y-2 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-sm bg-[#065A46]"></span>
                                        <span className="text-xs text-gray-600">{t('quizTaking.answered')}</span>
                                    </div>
                                    <span className="font-semibold text-sm text-[#065A46]">{getAnsweredCount()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-sm bg-gray-300"></span>
                                        <span className="text-xs text-gray-600">{t('quizTaking.remaining')}</span>
                                    </div>
                                    <span className="font-semibold text-sm text-gray-600">{getUnansweredCount()}</span>
                                </div>
                                {flaggedQuestions.size > 0 && (
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400"></span>
                                            <span className="text-xs text-gray-600">{t('quizTaking.flagged')}</span>
                                        </div>
                                        <span className="font-semibold text-sm text-amber-600">{flaggedQuestions.size}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Modal */}
                    <Modal
                        isOpen={showSubmitModal}
                        title={t('quizTaking.submitModal.title')}
                        icon={<IoCheckmarkCircle className="w-6 h-6 text-[#065A46]" />}
                        iconBg="bg-[#065A46]/10"
                        actions={
                            <>
                                <button
                                    onClick={() => setShowSubmitModal(false)}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-medium transition-all disabled:opacity-50"
                                >
                                    {t('quizTaking.submitModal.review')}
                                </button>
                                <button
                                    onClick={confirmSubmit}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2.5 bg-[#065A46] text-white rounded-xl hover:bg-[#054d3b] text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            {t('quizTaking.submitModal.submitting')}
                                        </>
                                    ) : (
                                        t('quizTaking.submitModal.submit')
                                    )}
                                </button>
                            </>
                        }
                    >
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-2.5 bg-green-50 rounded-lg text-sm">
                                <span className="text-green-700">{t('quizTaking.answered')}</span>
                                <span className="font-bold text-green-700">{getAnsweredCount()}/{quiz.questions.length}</span>
                            </div>
                            {getUnansweredCount() > 0 && (
                                <div className="flex items-center justify-between p-2.5 bg-amber-50 rounded-lg text-sm">
                                    <span className="text-amber-700">{t('quizTaking.submitModal.unanswered')}</span>
                                    <span className="font-bold text-amber-700">{getUnansweredCount()}</span>
                                </div>
                            )}
                            {flaggedQuestions.size > 0 && (
                                <div className="flex items-center justify-between p-2.5 bg-orange-50 rounded-lg text-sm">
                                    <span className="text-orange-700">{t('quizTaking.flagged')}</span>
                                    <span className="font-bold text-orange-700">{flaggedQuestions.size}</span>
                                </div>
                            )}
                        </div>
                    </Modal>

                    {/* Exit Modal */}
                    <Modal
                        isOpen={showExitModal}
                        title={t('quizTaking.exitModal.title')}
                        icon={<IoWarningOutline className="w-6 h-6 text-red-600" />}
                        iconBg="bg-red-100"
                        actions={
                            <>
                                <button
                                    onClick={() => setShowExitModal(false)}
                                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-medium transition-all"
                                >
                                    {t('quizTaking.exitModal.continue')}
                                </button>
                                <button
                                    onClick={confirmExit}
                                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-semibold transition-all"
                                >
                                    {t('quizTaking.exitModal.exit')}
                                </button>
                            </>
                        }
                    >
                        <p>{t('quizTaking.exitModal.warning')}</p>
                    </Modal>

                    {/* Toast Notification */}
                    {toast && (
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => setToast(null)}
                        />
                    )}
                </div>
            </div>
            )}
        </QuizLayout>
    );
};

export default QuizTakingPage;
