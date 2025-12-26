import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    IoTimeOutline,
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
import { useBreadcrumbOptional } from '../../dashboard/context/BreadcrumbContext';
import { useAuth } from '../../../context/AuthContext';
import { useTranslation } from 'react-i18next';

// Mock quiz data
interface QuizQuestion {
    id: string;
    question: string;
    multipleChoiceOptions: string[];
    isMultipleSelection: boolean;
    correctOptions: number[];
}

interface Quiz {
    id: string;
    title: string;
    courseTitle: string;
    description: string;
    timeLimitMinutes: number;
    questions: QuizQuestion[];
}

const mockQuiz: Quiz = {
    id: '1',
    title: 'Chapter 1 - Introduction to Physics',
    courseTitle: 'Physics 101',
    description: 'Test your knowledge on basic physics concepts including motion, force, and energy.',
    timeLimitMinutes: 30,
    questions: [
        {
            id: 'q1',
            question: 'What is the SI unit of force?',
            multipleChoiceOptions: ['Joule', 'Newton', 'Watt', 'Pascal'],
            isMultipleSelection: false,
            correctOptions: [1]
        },
        {
            id: 'q2',
            question: 'Which of the following are forms of energy? (Select all that apply)',
            multipleChoiceOptions: ['Kinetic', 'Thermal', 'Chemical', 'All of the above'],
            isMultipleSelection: true,
            correctOptions: [0, 1, 2]
        },
        {
            id: 'q3',
            question: 'What is Newton\'s First Law of Motion?',
            multipleChoiceOptions: [
                'Force equals mass times acceleration',
                'An object at rest stays at rest unless acted upon by a force',
                'For every action, there is an equal and opposite reaction',
                'Energy cannot be created or destroyed'
            ],
            isMultipleSelection: false,
            correctOptions: [1]
        },
        {
            id: 'q4',
            question: 'What is the acceleration due to gravity on Earth\'s surface?',
            multipleChoiceOptions: ['8.9 m/s²', '9.8 m/s²', '10.8 m/s²', '11.8 m/s²'],
            isMultipleSelection: false,
            correctOptions: [1]
        },
        {
            id: 'q5',
            question: 'Which equation represents the relationship between force, mass, and acceleration?',
            multipleChoiceOptions: ['F = m/a', 'F = ma', 'F = m + a', 'F = a/m'],
            isMultipleSelection: false,
            correctOptions: [1]
        }
    ]
};

// Compact Timer Component
const CompactTimer: React.FC<{ timeRemaining: number; totalTime: number }> = ({ timeRemaining, totalTime }) => {
    const percentage = (timeRemaining / totalTime) * 100;
    const isWarning = timeRemaining < 300;
    const isDanger = timeRemaining < 60;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold ${
            isDanger ? 'bg-red-100 text-red-700' : isWarning ? 'bg-amber-100 text-amber-700' : 'bg-[#065A46]/10 text-[#065A46]'
        }`}>
            <IoTimeOutline className="w-4 h-4" />
            <span className={isDanger ? 'animate-pulse' : ''}>{formatTime(timeRemaining)}</span>
            <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                        isDanger ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-[#065A46]'
                    }`}
                    style={{ width: `${percentage}%` }}
                />
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
    const breadcrumbContext = useBreadcrumbOptional();
    const { state } = useAuth();
    const { t } = useTranslation();
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Map<string, number[]>>(new Map());
    const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
    const [timeRemaining, setTimeRemaining] = useState(mockQuiz.timeLimitMinutes * 60);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isTutor = state.user?.role === 'tutor';
    const quizzesPath = isTutor ? '/dashboard/quizzes' : '/dashboard/my-quizzes';
    const resultPath = isTutor ? '/dashboard/quizzes/result' : '/dashboard/my-quizzes/result';

    const currentQuestion = mockQuiz.questions[currentQuestionIndex];
    const currentAnswers = selectedAnswers.get(currentQuestion.id) || [];
    const totalTime = mockQuiz.timeLimitMinutes * 60;

    // Set breadcrumb
    useEffect(() => {
        breadcrumbContext?.setBreadcrumb([
            { label: t('dashboard.header.breadcrumb.dashboard'), path: '/dashboard' },
            { label: isTutor ? t('dashboard.tutor.myQuizzes.title') : t('dashboard.student.myQuizzes.title'), path: quizzesPath },
            { label: mockQuiz.title }
        ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTutor]);

    useEffect(() => {
        document.title = `${mockQuiz.title} - Quiz`;
    }, []);

    // Timer countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAnswerSelect = (optionIndex: number) => {
        const newAnswers = new Map(selectedAnswers);
        const current = currentAnswers;

        if (currentQuestion.isMultipleSelection) {
            const isSelected = current.includes(optionIndex);
            const updated = isSelected
                ? current.filter(idx => idx !== optionIndex)
                : [...current, optionIndex];
            newAnswers.set(currentQuestion.id, updated);
        } else {
            newAnswers.set(currentQuestion.id, [optionIndex]);
        }

        setSelectedAnswers(newAnswers);
    };

    const toggleFlag = () => {
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
        if (currentQuestionIndex < mockQuiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const getAnsweredCount = () => selectedAnswers.size;
    const getUnansweredCount = () => mockQuiz.questions.length - selectedAnswers.size;

    const handleSubmit = () => {
        setShowSubmitModal(true);
    };

    const confirmSubmit = useCallback(() => {
        setIsSubmitting(true);
        setTimeout(() => {
            navigate(resultPath, {
                state: {
                    quizId: mockQuiz.id,
                    answers: Object.fromEntries(selectedAnswers)
                }
            });
        }, 1000);
    }, [navigate, resultPath, selectedAnswers]);

    const handleAutoSubmit = () => {
        confirmSubmit();
    };

    const handleExit = () => {
        setShowExitModal(true);
    };

    const confirmExit = () => {
        navigate(quizzesPath);
    };

    return (
        <div className="h-[calc(100vh-120px)] flex">
            {/* Main Quiz Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between gap-4 px-6 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3 min-w-0">
                        <span className="px-2.5 py-1 bg-[#065A46]/10 text-[#065A46] text-xs font-semibold rounded-lg">
                            {mockQuiz.courseTitle}
                        </span>
                        <h1 className="text-sm font-semibold text-gray-800 truncate">{mockQuiz.title}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <CompactTimer timeRemaining={timeRemaining} totalTime={totalTime} />
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
                <div className="flex-shrink-0 flex items-center justify-between px-6 py-2.5 bg-gradient-to-r from-[#065A46] to-[#0b6459]">
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {currentQuestionIndex + 1}
                        </span>
                        <span className="text-white/90 text-sm">
                            {t('quizTaking.of')} {mockQuiz.questions.length} • {currentQuestion.isMultipleSelection ? t('quizTaking.multipleChoice') : t('quizTaking.singleChoice')}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-white/70 text-xs">
                            {getAnsweredCount()}/{mockQuiz.questions.length} {t('quizTaking.answered')}
                        </span>
                        <button
                            onClick={toggleFlag}
                            className={`p-2 rounded-lg transition-all ${
                                flaggedQuestions.has(currentQuestion.id)
                                    ? 'bg-amber-400 text-white'
                                    : 'bg-white/10 text-white/80 hover:bg-white/20'
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
                <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                    <h2 className="text-lg font-semibold text-gray-800 leading-relaxed mb-6">
                        {currentQuestion.question}
                    </h2>

                    {/* Answer Options - Full height distribution */}
                    <div className="flex-1 flex flex-col gap-3 min-h-0">
                        {currentQuestion.multipleChoiceOptions.map((option, index) => {
                            const isSelected = currentAnswers.includes(index);
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerSelect(index)}
                                    className={`flex-1 min-h-[60px] text-left px-5 rounded-xl border-2 transition-all duration-150 flex items-center ${
                                        isSelected
                                            ? 'border-[#065A46] bg-[#065A46]/5 shadow-sm'
                                            : 'border-gray-200 hover:border-[#065A46]/40 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-4 w-full">
                                        <span className={`w-9 h-9 flex-shrink-0 flex items-center justify-center font-bold text-sm transition-all ${
                                            isSelected
                                                ? 'bg-[#065A46] text-white'
                                                : 'bg-gray-100 text-gray-600'
                                        } ${currentQuestion.isMultipleSelection ? 'rounded-lg' : 'rounded-full'}`}>
                                            {String.fromCharCode(65 + index)}
                                        </span>
                                        <span className={`flex-1 ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                                            {option}
                                        </span>
                                        {isSelected && (
                                            <div className="w-7 h-7 bg-[#065A46] rounded-full flex items-center justify-center flex-shrink-0">
                                                <IoCheckmarkOutline className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Navigation Footer */}
                <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-100">
                    <button
                        onClick={goToPrevious}
                        disabled={currentQuestionIndex === 0}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            currentQuestionIndex === 0
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <IoChevronBack className="w-4 h-4" />
                        {t('quizTaking.prev')}
                    </button>

                    {/* Progress dots */}
                    <div className="flex items-center gap-1.5">
                        {mockQuiz.questions.map((q, index) => {
                            const isAnswered = selectedAnswers.has(q.id);
                            const isCurrent = index === currentQuestionIndex;
                            const isFlagged = flaggedQuestions.has(q.id);
                            return (
                                <button
                                    key={q.id}
                                    onClick={() => goToQuestion(index)}
                                    className={`relative transition-all ${
                                        isCurrent
                                            ? 'w-8 h-2.5 bg-[#065A46] rounded-full'
                                            : isAnswered
                                                ? 'w-2.5 h-2.5 bg-[#065A46]/60 rounded-full hover:bg-[#065A46]'
                                                : 'w-2.5 h-2.5 bg-gray-300 rounded-full hover:bg-gray-400'
                                    }`}
                                >
                                    {isFlagged && !isCurrent && (
                                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {currentQuestionIndex === mockQuiz.questions.length - 1 ? (
                        <button
                            onClick={handleSubmit}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#065A46] text-white rounded-xl text-sm font-semibold hover:bg-[#054d3b] transition-all shadow-sm"
                        >
                            <IoSendOutline className="w-4 h-4" />
                            {t('quizTaking.submit')}
                        </button>
                    ) : (
                        <button
                            onClick={goToNext}
                            className="flex items-center gap-2 px-4 py-2.5 bg-[#065A46] text-white rounded-xl text-sm font-medium hover:bg-[#054d3b] transition-all"
                        >
                            {t('quizTaking.next')}
                            <IoChevronForward className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Right Sidebar - Question Navigator */}
            <div className="w-48 flex-shrink-0 border-l border-gray-100 bg-gray-50/50 p-3 pb-16 hidden lg:block">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">{t('quizTaking.questions')}</h3>
                <div className="grid grid-cols-5 gap-1.5 mb-3">
                    {mockQuiz.questions.map((q, index) => {
                        const isAnswered = selectedAnswers.has(q.id);
                        const isFlagged = flaggedQuestions.has(q.id);
                        const isCurrent = index === currentQuestionIndex;

                        return (
                            <button
                                key={q.id}
                                onClick={() => goToQuestion(index)}
                                className={`relative aspect-square rounded text-xs font-semibold transition-all ${
                                    isCurrent
                                        ? 'bg-[#065A46] text-white shadow-sm'
                                        : isAnswered
                                            ? 'bg-[#065A46]/15 text-[#065A46] hover:bg-[#065A46]/25'
                                            : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                                }`}
                            >
                                {index + 1}
                                {isFlagged && (
                                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Stats + Legend compact */}
                <div className="p-2.5 bg-white rounded-lg border border-gray-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-sm bg-[#065A46]"></span>
                            <span className="text-gray-500">{t('quizTaking.answered')}</span>
                        </div>
                        <span className="font-semibold text-[#065A46]">{getAnsweredCount()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-sm bg-gray-300"></span>
                            <span className="text-gray-500">{t('quizTaking.remaining')}</span>
                        </div>
                        <span className="font-semibold text-gray-600">{getUnansweredCount()}</span>
                    </div>
                    {flaggedQuestions.size > 0 && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-sm bg-amber-400"></span>
                                <span className="text-gray-500">{t('quizTaking.flagged')}</span>
                            </div>
                            <span className="font-semibold text-amber-600">{flaggedQuestions.size}</span>
                        </div>
                    )}
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
                        <span className="font-bold text-green-700">{getAnsweredCount()}/{mockQuiz.questions.length}</span>
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
        </div>
    );
};

export default QuizTakingPage;
