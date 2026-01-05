import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
    IoCheckmarkCircle,
    IoCloseCircle,
    IoCheckmarkOutline,
    IoCloseOutline,
    IoChevronDown,
    IoChevronUp,
    IoTrophyOutline,
    IoRefreshOutline,
    IoArrowBack,
    IoFilterOutline,
    IoWarningOutline
} from 'react-icons/io5';
import { HiChevronDown } from 'react-icons/hi';
import { useAuth } from '../../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import QuizLayout from '../components/QuizLayout';
import quizService from '../../../services/quizService';
import type { QuizResult as QuizResultType } from '../../../types/quiz';
import Toast from '../../../components/ui/Toast';


// Skeleton Loading Component for Quiz Result
const QuizResultSkeleton: React.FC = () => {
    return (
        <QuizLayout showBackButton={true} title="Quiz Result">
            <div className="h-[calc(100vh-140px)] flex overflow-hidden bg-gray-50">
                {/* Left Sidebar Skeleton */}
                <div className="w-72 flex-shrink-0 border-r border-gray-200 bg-white p-5 hidden lg:flex flex-col">
                    {/* Score Card Skeleton */}
                    <div className="rounded-2xl p-5 mb-5 text-center shadow-lg bg-gradient-to-br from-gray-200 to-gray-300">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="w-6 h-6 bg-white/50 rounded animate-pulse"></div>
                            <div className="h-5 w-24 bg-white/50 rounded animate-pulse"></div>
                        </div>
                        <div className="bg-white rounded-xl p-4 mb-3 shadow-md">
                            <div className="w-32 h-32 mx-auto">
                                <div className="w-full h-full rounded-full border-8 border-gray-200 animate-pulse"></div>
                            </div>
                        </div>
                        <div className="h-5 w-32 bg-white/50 rounded animate-pulse mx-auto"></div>
                    </div>

                    {/* Quiz Info Skeleton */}
                    <div className="bg-white rounded-xl p-4 border border-gray-200 mb-5 shadow-sm">
                        <div className="h-5 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                    </div>

                    {/* Stats Skeleton */}
                    <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-3 shadow-sm">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-3 h-3 rounded-full bg-gray-200 animate-pulse"></div>
                                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                                <div className="h-5 w-8 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons Skeleton */}
                    <div className="mt-auto space-y-3 pt-4">
                        <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse"></div>
                        <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse"></div>
                    </div>
                </div>

                {/* Main Content Skeleton */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
                    {/* Header Skeleton */}
                    <div className="flex-shrink-0 flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-200 bg-white">
                        <div>
                            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                        </div>

                        {/* Filter Tabs Skeleton */}
                        <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg p-1">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-8 w-20 bg-white rounded-md animate-pulse"></div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Stats Bar Skeleton */}
                    <div className="lg:hidden flex-shrink-0 flex items-center justify-between px-5 py-3 bg-gradient-to-r from-gray-200 to-gray-300">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-lg animate-pulse"></div>
                            <div>
                                <div className="h-4 w-20 bg-white/50 rounded animate-pulse mb-1"></div>
                                <div className="h-3 w-24 bg-white/50 rounded animate-pulse"></div>
                            </div>
                        </div>
                        <div className="w-10 h-10 bg-white/50 rounded-lg animate-pulse"></div>
                    </div>

                    {/* Questions List Skeleton */}
                    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm">
                                <div className="px-5 py-4 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                                    <div className="flex-1">
                                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                                        <div className="h-5 w-full bg-gray-200 rounded animate-pulse mb-1"></div>
                                        <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                    <div className="w-8 h-8 bg-gray-100 rounded-lg animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </QuizLayout>
    );
};

// Compact Circular Progress
const CircularProgress: React.FC<{ percentage: number; isPassed: boolean; label: string }> = ({ percentage, isPassed, label }) => {
    const [animatedPercentage, setAnimatedPercentage] = useState(0);
    const radius = 54;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedPercentage(percentage), 100);
        return () => clearTimeout(timer);
    }, [percentage]);

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg className="transform -rotate-90" width="130" height="130">
                <circle cx="65" cy="65" r={radius} stroke="#e5e7eb" strokeWidth={strokeWidth} fill="none" />
                <circle
                    cx="65" cy="65" r={radius}
                    stroke={isPassed ? '#065A46' : '#b91c1c'}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${isPassed ? 'text-[#065A46]' : 'text-[#b91c1c]'}`}>
                    {animatedPercentage}%
                </span>
                <span className="text-xs text-gray-500">{label}</span>
            </div>
        </div>
    );
};

// Question Card Component - Compact
const QuestionCard: React.FC<{
    question: QuizResultType['questions'][0];
    index: number;
    isExpanded: boolean;
    onToggle: () => void;
    translations: {
        correct: string;
        incorrect: string;
        yourAnswer: string;
        correctAnswer: string;
        explanation: string;
        hideExplanation: string;
    };
}> = ({ question, index, isExpanded, onToggle, translations }) => {
    const isCorrect = question.isCorrect;
    const [showExplanation, setShowExplanation] = useState(false);

    return (
        <div className={`bg-white rounded-xl border-2 overflow-hidden transition-all shadow-sm hover:shadow-md ${isCorrect ? 'border-[#065A46]/40' : 'border-[#b91c1c]/40'
            }`}>
            <button
                onClick={onToggle}
                className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
            >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isCorrect ? 'bg-[#065A46]/10' : 'bg-[#b91c1c]/10'
                    }`}>
                    {isCorrect ? (
                        <IoCheckmarkCircle className="w-6 h-6 text-[#065A46]" />
                    ) : (
                        <IoCloseCircle className="w-6 h-6 text-[#b91c1c]" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                        <span className="text-xs font-semibold text-gray-500">Q{index + 1}</span>
                        <span className={`text-xs px-2 py-1 rounded-md font-semibold ${isCorrect ? 'bg-[#065A46]/10 text-[#065A46]' : 'bg-[#b91c1c]/10 text-[#b91c1c]'
                            }`}>
                            {isCorrect ? translations.correct : translations.incorrect}
                        </span>
                    </div>
                    <p className="text-base font-semibold text-gray-900 line-clamp-2">{question.questionText}</p>
                </div>
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                    {isExpanded ? (
                        <IoChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                        <IoChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                </div>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[700px]' : 'max-h-0'
                }`}>
                <div className="px-5 pb-5 space-y-3 border-t border-gray-200 pt-4">
                    {question.options.map((option, optionIndex) => {
                        const isCorrectOption = option.isCorrect;
                        const isSelectedOption = option.isSelected;
                        const isIncorrectSelected = isSelectedOption && !isCorrectOption;

                        let optionStyles = 'bg-gray-50 border-gray-200 text-gray-700';
                        let iconElement = <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />;

                        if (isCorrectOption) {
                            optionStyles = 'bg-[#065A46]/5 border-[#065A46]/40 text-[#065A46]';
                            iconElement = (
                                <div className="w-5 h-5 rounded-full bg-[#065A46] flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <IoCheckmarkOutline className="w-3 h-3 text-white" />
                                </div>
                            );
                        }

                        if (isIncorrectSelected) {
                            optionStyles = 'bg-[#b91c1c]/5 border-[#b91c1c]/40 text-[#b91c1c]';
                            iconElement = (
                                <div className="w-5 h-5 rounded-full bg-[#b91c1c] flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <IoCloseOutline className="w-3 h-3 text-white" />
                                </div>
                            );
                        }

                        return (
                            <div key={optionIndex} className={`flex items-center gap-3 px-4 py-3 border-2 rounded-lg text-sm font-medium ${optionStyles}`}>
                                {iconElement}
                                <span className="flex-1">{option.optionText}</span>
                                {isCorrectOption && (
                                    <span className="text-xs font-semibold text-white bg-[#065A46] px-2 py-1 rounded-md">
                                        {translations.correctAnswer}
                                    </span>
                                )}
                                {isIncorrectSelected && (
                                    <span className="text-xs font-semibold text-white bg-[#b91c1c] px-2 py-1 rounded-md">
                                        {translations.yourAnswer}
                                    </span>
                                )}
                            </div>
                        );
                    })}

                    {/* Explanation Dropdown */}
                    {question.explanation && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowExplanation(!showExplanation);
                                }}
                                className="text-sm text-[#065A46] font-semibold hover:text-[#054d3b] flex items-center gap-2 transition-colors"
                            >
                                {showExplanation ? (
                                    <>
                                        {translations.hideExplanation}
                                    </>
                                ) : (
                                    <>
                                        {translations.explanation}
                                    </>
                                )}
                                <HiChevronDown
                                    className={`w-4 h-4 transition-transform ${showExplanation ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {showExplanation && (
                                <div className="mt-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <p className="text-sm text-gray-700 leading-relaxed">{question.explanation}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

type FilterType = 'all' | 'correct' | 'incorrect';

const QuizResultPage: React.FC = () => {
    const navigate = useNavigate();
    const { attemptId } = useParams<{ attemptId: string }>();
    const location = useLocation();
    const { state: authState } = useAuth();
    const { t } = useTranslation();
    
    // State
    const [quizResult, setQuizResult] = useState<QuizResultType | null>(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
    const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
    const [filter, setFilter] = useState<FilterType>('all');
    const [showConfetti, setShowConfetti] = useState(false);
    
    // Ref to track if component is mounted and prevent duplicate API calls
    const isMountedRef = useRef(true);
    const hasLoadedRef = useRef(false);

    const isTutor = authState.user?.role === 'tutor';
    const quizzesPath = isTutor ? '/dashboard/quizzes' : '/dashboard/my-quizzes';

    // Load quiz result from API
    useEffect(() => {
        // Reset mounted flag when component mounts
        isMountedRef.current = true;
        hasLoadedRef.current = false;
        
        const loadQuizResult = async () => {
            // Prevent duplicate calls
            if (hasLoadedRef.current || !isMountedRef.current) {
                return;
            }
            
            hasLoadedRef.current = true;
            // Handle case where we need to fetch attemptId first
            if (attemptId === 'loading') {
                const quizId = (location.state as any)?.quizId;
                if (quizId) {
                    try {
                        if (!isMountedRef.current) return;
                        setLoading(true);
                        const fetchedAttemptId = await quizService.getLatestCompletedAttemptId(quizId);
                        if (!isMountedRef.current) return;
                        
                        if (fetchedAttemptId) {
                            // Navigate to correct URL with attemptId
                            navigate(`/quiz/result/${fetchedAttemptId}`, { replace: true });
                            return;
                        } else {
                            setToast({ message: t('quizResult.errors.noAttemptFound'), type: 'error' });
                            setLoading(false);
                            return;
                        }
                    } catch (err: any) {
                        if (!isMountedRef.current) return;
                        console.error('Failed to get attempt ID:', err);
                        setToast({ message: t('quizResult.errors.failedToLoad'), type: 'error' });
                        setLoading(false);
                        return;
                    }
                } else {
                    if (!isMountedRef.current) return;
                    setToast({ message: t('quizResult.errors.quizIdMissing'), type: 'error' });
                    setLoading(false);
                    return;
                }
            }

            if (!attemptId || attemptId === 'loading') {
                if (!isMountedRef.current) return;
                setToast({ message: t('quizResult.errors.attemptIdMissing'), type: 'error' });
                setLoading(false);
                return;
            }

            try {
                if (!isMountedRef.current) return;
                setLoading(true);
                const result = await quizService.getQuizResult(attemptId);
                if (!isMountedRef.current) return;
                
                setQuizResult(result);
                document.title = `${result.quizTitle} - Quiz Result`;
            } catch (err: any) {
                if (!isMountedRef.current) return;
                console.error('Failed to load quiz result:', err);
                setToast({ message: err.message || t('quizResult.errors.failedToLoad'), type: 'error' });
            } finally {
                if (isMountedRef.current) {
                    setLoading(false);
                }
            }
        };

        loadQuizResult();
        
        // Cleanup function
        return () => {
            isMountedRef.current = false;
            hasLoadedRef.current = false;
        };
    }, [attemptId, location.state, navigate, t]);

    // Calculate derived values
    const percentage = quizResult ? Math.round((quizResult.correctAnswers / quizResult.totalQuestions) * 100) : 0;
    const isPassed = quizResult ? quizResult.passed : false;
    const quizId = quizResult?.quizId || null;

    useEffect(() => {
        if (isPassed && quizResult) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [isPassed, quizResult]);

    const toggleQuestion = (questionId: string) => {
        setExpandedQuestions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(questionId)) {
                newSet.delete(questionId);
            } else {
                newSet.add(questionId);
            }
            return newSet;
        });
    };

    const correctCount = quizResult ? quizResult.questions.filter(q => q.isCorrect).length : 0;
    const incorrectCount = quizResult ? quizResult.questions.filter(q => !q.isCorrect).length : 0;

    const filteredQuestions = quizResult ? quizResult.questions.filter(q => {
        if (filter === 'correct') return q.isCorrect;
        if (filter === 'incorrect') return !q.isCorrect;
        return true;
    }) : [];

    // Loading state
    if (loading) {
        return <QuizResultSkeleton />;
    }

    // If no quiz result, show empty state
    if (!quizResult) {
        return (
            <QuizLayout showBackButton={true} title="Quiz Result">
                <div className="h-[calc(100vh-140px)] flex items-center justify-center bg-gray-50">
                    <div className="text-center px-6 max-w-md">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <IoWarningOutline className="w-8 h-8 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            {t('quizResult.errors.failedToLoad')}
                        </h2>
                        <button
                            onClick={() => navigate(quizzesPath)}
                            className="px-6 py-2.5 bg-[#065A46] text-white rounded-lg hover:bg-[#054d3b] transition-colors text-sm font-medium"
                        >
                            {t('quizResult.backToQuizzes')}
                        </button>
                    </div>
                </div>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </QuizLayout>
        );
    }

    return (
        <QuizLayout showBackButton={true} title="Quiz Result">
            <div className="h-[calc(100vh-140px)] flex overflow-hidden bg-gray-50">
                {/* Confetti Effect */}
                {showConfetti && (
                    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                        {[...Array(30)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute animate-confetti"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 2}s`,
                                    backgroundColor: ['#065A46', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'][Math.floor(Math.random() * 5)],
                                    width: `${Math.random() * 8 + 4}px`,
                                    height: `${Math.random() * 8 + 4}px`,
                                    borderRadius: Math.random() > 0.5 ? '50%' : '0',
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Left Sidebar - Score & Stats */}
                <div className="w-72 flex-shrink-0 border-r border-gray-200 bg-white p-5 hidden lg:flex flex-col">
                    {/* Score Card */}
                    <div className={`rounded-2xl p-5 mb-5 text-center shadow-lg ${isPassed ? 'bg-gradient-to-br from-[#065A46] to-[#0b6459]' : 'bg-gradient-to-br from-red-600 to-red-700'
                        }`}>
                        <div className="flex items-center justify-center gap-2 mb-4">
                            {isPassed && <IoTrophyOutline className="w-6 h-6 text-yellow-300" />}
                            <span className={`text-base font-bold ${isPassed ? 'text-yellow-300' : 'text-white'}`}>
                                {isPassed ? t('quizResult.passed') : t('quizResult.notPassed')}
                            </span>
                        </div>
                        <div className="bg-white rounded-xl p-4 mb-3 shadow-md">
                            <CircularProgress percentage={percentage} isPassed={isPassed} label={t('quizResult.score')} />
                        </div>
                        <p className="text-white text-sm font-medium">
                            {quizResult.correctAnswers}/{quizResult.totalQuestions} {t('quizResult.correct').toLowerCase()}
                        </p>
                    </div>

                    {/* Quiz Info */}
                    <div className="bg-white rounded-xl p-4 border border-gray-200 mb-5 shadow-sm">
                        <h2 className="font-semibold text-gray-900 text-base mb-1.5 line-clamp-2">{quizResult.quizTitle}</h2>
                    </div>

                    {/* Stats */}
                    <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-3 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-3 h-3 rounded-full bg-[#065A46]"></div>
                                <span className="text-sm text-gray-700 font-medium">{t('quizResult.correct')}</span>
                            </div>
                            <span className="font-bold text-base text-[#065A46]">{correctCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-3 h-3 rounded-full bg-[#b91c1c]"></div>
                                <span className="text-sm text-gray-700 font-medium">{t('quizResult.incorrect')}</span>
                            </div>
                            <span className="font-bold text-base text-[#b91c1c]">{incorrectCount}</span>
                        </div>
                        <div className="pt-3 border-t border-gray-200 space-y-2.5">
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-auto space-y-3 pt-4">
                        <button
                            onClick={() => {
                                if (quizId) {
                                    navigate(`/quiz/take/${quizId}`);
                                } else {
                                    // TODO: Load quizId from API when implementing real data
                                    console.warn('QuizId not available for retake');
                                }
                            }}
                            disabled={!quizId}
                            className="w-full px-4 py-3 bg-[#065A46] text-white text-sm font-semibold rounded-xl hover:bg-[#054d3b] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <IoRefreshOutline className="w-5 h-5" />
                            {t('quizResult.retakeQuiz')}
                        </button>
                        <button
                            onClick={() => navigate(quizzesPath)}
                            className="w-full px-4 py-3 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                        >
                            <IoArrowBack className="w-5 h-5" />
                            {t('quizResult.backToQuizzes')}
                        </button>
                    </div>
                </div>

                {/* Main Content - Question Review */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
                    {/* Header */}
                    <div className="flex-shrink-0 flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-200 bg-white">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">{t('quizResult.reviewAnswers')}</h1>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 text-xs font-semibold rounded-md transition-all ${filter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {t('quizResult.filter.all')} ({quizResult?.questions.length || 0})
                            </button>
                            <button
                                onClick={() => setFilter('correct')}
                                className={`px-4 py-2 text-xs font-semibold rounded-md transition-all ${filter === 'correct' ? 'bg-white text-[#065A46] shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                ✓ {t('quizResult.filter.correct')} ({correctCount})
                            </button>
                            <button
                                onClick={() => setFilter('incorrect')}
                                className={`px-4 py-2 text-xs font-semibold rounded-md transition-all ${filter === 'incorrect' ? 'bg-white text-[#b91c1c] shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                ✗ {t('quizResult.filter.incorrect')} ({incorrectCount})
                            </button>
                        </div>
                    </div>

                    {/* Mobile Stats Bar */}
                    <div className={`lg:hidden flex-shrink-0 flex items-center justify-between px-5 py-3 ${isPassed ? 'bg-gradient-to-r from-[#065A46] to-[#0b6459]' : 'bg-gradient-to-r from-red-600 to-red-700'}`}>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md">
                                <span className={`text-xl font-bold ${isPassed ? 'text-[#065A46]' : 'text-[#b91c1c]'}`}>{percentage}%</span>
                            </div>
                            <div className="text-white">
                                <p className="text-sm font-bold">{isPassed ? t('quizResult.passed') : t('quizResult.notPassed')}</p>
                                <p className="text-xs text-white/80">{quizResult.correctAnswers}/{quizResult.totalQuestions} {t('quizResult.correct').toLowerCase()}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    if (quizId) {
                                        navigate(`/quiz/take/${quizId}`);
                                    } else {
                                        // TODO: Load quizId from API when implementing real data
                                        console.warn('QuizId not available for retake');
                                    }
                                }}
                                disabled={!quizId}
                                className="p-2.5 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <IoRefreshOutline className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Questions List */}
                    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                        {filteredQuestions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <IoFilterOutline className="w-16 h-16 mb-3 text-gray-300" />
                                <p className="text-base font-medium">{t('quizResult.noQuestionsMatch')}</p>
                            </div>
                        ) : (
                            filteredQuestions.map((question) => (
                                <QuestionCard
                                    key={question.questionId}
                                    question={question}
                                    index={quizResult.questions.findIndex(q => q.questionId === question.questionId)}
                                    isExpanded={expandedQuestions.has(question.questionId)}
                                    onToggle={() => toggleQuestion(question.questionId)}
                                    translations={{
                                        correct: t('quizResult.correct'),
                                        incorrect: t('quizResult.incorrect'),
                                        yourAnswer: t('quizResult.yourAnswer'),
                                        correctAnswer: t('quizResult.correctAnswer'),
                                        explanation: t('quizResult.explanation'),
                                        hideExplanation: t('quizResult.hideExplanation')
                                    }}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Custom Styles */}
                <style>{`
                @keyframes confetti-fall {
                    0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
                .animate-confetti { animation: confetti-fall 3s ease-in-out forwards; }
            `}</style>

                {/* Toast Notification */}
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </div>
        </QuizLayout>
    );
};

export default QuizResultPage;
