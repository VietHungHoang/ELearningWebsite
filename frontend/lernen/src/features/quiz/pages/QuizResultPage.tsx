import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    IoTimeOutline,
    IoFilterOutline
} from 'react-icons/io5';
import { HiChevronDown } from 'react-icons/hi';
import { useBreadcrumbOptional } from '../../dashboard/context/BreadcrumbContext';
import { useAuth } from '../../../context/AuthContext';
import { useTranslation } from 'react-i18next';

// Mock Data
const quizResult = {
    quizTitle: 'Chapter 1 - Introduction to Physics',
    courseTitle: 'Physics 101',
    score: 18,
    totalQuestions: 20,
    passingScore: 70,
    status: 'Passed',
    dateCompleted: 'Oct 22, 2025',
    timeTaken: '15:32',
    questions: [
        {
            id: 1,
            text: 'What is the primary benefit of using the Eisenhower Matrix for task prioritization?',
            options: [
                'It helps in delegating tasks to others.',
                'It categorizes tasks based on urgency and importance.',
                'It focuses only on long-term goals.',
                'It ensures all tasks are completed in chronological order.',
            ],
            correctAnswer: 'It categorizes tasks based on urgency and importance.',
            userAnswer: 'It categorizes tasks based on urgency and importance.',
            explanation: 'The Eisenhower Matrix, also known as the Urgent-Important Matrix, helps prioritize tasks by dividing them into four quadrants based on urgency and importance. This allows you to focus on what truly matters while delegating or eliminating less critical tasks.',
        },
        {
            id: 2,
            text: 'Which of the following is a key principle of the Pomodoro Technique?',
            options: [
                'Working on multiple tasks simultaneously.',
                'Taking long, infrequent breaks.',
                'Working in short, focused intervals with planned breaks.',
                'Completing the easiest tasks first.',
            ],
            correctAnswer: 'Working in short, focused intervals with planned breaks.',
            userAnswer: 'Working on multiple tasks simultaneously.',
            explanation: 'The Pomodoro Technique involves working in 25-minute focused intervals (called "pomodoros") followed by 5-minute breaks. After four pomodoros, take a longer 15-30 minute break. This helps maintain focus and prevents burnout.',
        },
        {
            id: 3,
            text: 'What does the "Two-Minute Rule" suggest in time management?',
            options: [
                'Spend only two minutes planning your day.',
                'If a task takes less than two minutes, do it immediately.',
                'Take a two-minute break every hour.',
                'Limit meetings to two minutes.',
            ],
            correctAnswer: 'If a task takes less than two minutes, do it immediately.',
            userAnswer: 'If a task takes less than two minutes, do it immediately.',
            explanation: 'The Two-Minute Rule, popularized by David Allen in "Getting Things Done," states that if a task takes less than two minutes to complete, you should do it right away rather than adding it to your to-do list. This prevents small tasks from piling up.',
        },
        {
            id: 4,
            text: 'Which technique involves batching similar tasks together?',
            options: [
                'Time blocking',
                'Task batching',
                'Pomodoro Technique',
                'Eisenhower Matrix',
            ],
            correctAnswer: 'Task batching',
            userAnswer: 'Task batching',
            explanation: 'Task batching is the practice of grouping similar tasks together and completing them in one dedicated time block. This reduces context switching, increases efficiency, and helps maintain focus by keeping your brain in one "mode" for longer periods.',
        },
    ]
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
    question: typeof quizResult.questions[0]; 
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
    const isCorrect = question.userAnswer === question.correctAnswer;
    const [showExplanation, setShowExplanation] = useState(false);

    return (
        <div className={`bg-white rounded-xl border-2 overflow-hidden transition-all ${
            isCorrect ? 'border-[#065A46]/30' : 'border-[#b91c1c]/30'
        }`}>
            <button
                onClick={onToggle}
                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
            >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isCorrect ? 'bg-[#065A46]/10' : 'bg-[#b91c1c]/10'
                }`}>
                    {isCorrect ? (
                        <IoCheckmarkCircle className="w-5 h-5 text-[#065A46]" />
                    ) : (
                        <IoCloseCircle className="w-5 h-5 text-[#b91c1c]" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500">Q{index + 1}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                            isCorrect ? 'bg-[#065A46]/10 text-[#065A46]' : 'bg-[#b91c1c]/10 text-[#b91c1c]'
                        }`}>
                            {isCorrect ? translations.correct : translations.incorrect}
                        </span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 line-clamp-1 mt-0.5">{question.text}</p>
                </div>
                <div className="flex-shrink-0 w-6 h-6 rounded bg-gray-100 flex items-center justify-center">
                    {isExpanded ? (
                        <IoChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                        <IoChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                </div>
            </button>

            <div className={`overflow-hidden transition-all duration-200 ${
                isExpanded ? 'max-h-[600px]' : 'max-h-0'
            }`}>
                <div className="px-4 pb-4 space-y-2 border-t border-gray-100 pt-3">
                    {question.options.map((option, optionIndex) => {
                        const isCorrectOption = option === question.correctAnswer;
                        const isUserOption = option === question.userAnswer;
                        const isIncorrectUserOption = isUserOption && !isCorrectOption;

                        let optionStyles = 'bg-gray-50 border-gray-200 text-gray-600';
                        let iconElement = <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />;

                        if (isCorrectOption) {
                            optionStyles = 'bg-[#065A46]/5 border-[#065A46]/30 text-[#065A46]';
                            iconElement = (
                                <div className="w-4 h-4 rounded-full bg-[#065A46] flex items-center justify-center flex-shrink-0">
                                    <IoCheckmarkOutline className="w-2.5 h-2.5 text-white" />
                                </div>
                            );
                        }

                        if (isIncorrectUserOption) {
                            optionStyles = 'bg-[#b91c1c]/5 border-[#b91c1c]/30 text-[#b91c1c]';
                            iconElement = (
                                <div className="w-4 h-4 rounded-full bg-[#b91c1c] flex items-center justify-center flex-shrink-0">
                                    <IoCloseOutline className="w-2.5 h-2.5 text-white" />
                                </div>
                            );
                        }

                        return (
                            <div key={optionIndex} className={`flex items-center gap-2.5 px-3 py-2.5 border rounded-lg text-sm ${optionStyles}`}>
                                {iconElement}
                                <span className="flex-1 text-sm">{option}</span>
                                {isCorrectOption && (
                                    <span className="text-[10px] font-medium text-white bg-[#065A46] px-1.5 py-0.5 rounded">
                                        {translations.correctAnswer}
                                    </span>
                                )}
                                {isIncorrectUserOption && (
                                    <span className="text-[10px] font-medium text-white bg-[#b91c1c] px-1.5 py-0.5 rounded">
                                        {translations.yourAnswer}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                    
                    {/* Explanation Dropdown */}
                    {question.explanation && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowExplanation(!showExplanation);
                                }}
                                className="text-sm text-[#065A46] font-medium hover:underline flex items-center gap-1"
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
                                    className={`w-4 h-4 transition-transform ${
                                        showExplanation ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>
                            
                            {showExplanation && (
                                <div className="mt-3 bg-gray-50 p-3 rounded-lg">
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
    const breadcrumbContext = useBreadcrumbOptional();
    const { state } = useAuth();
    const { t } = useTranslation();
    const percentage = Math.round((quizResult.score / quizResult.totalQuestions) * 100);
    const isPassed = percentage >= quizResult.passingScore;
    const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
    const [filter, setFilter] = useState<FilterType>('all');
    const [showConfetti, setShowConfetti] = useState(false);

    const isTutor = state.user?.role === 'tutor';
    const quizzesPath = isTutor ? '/dashboard/quizzes' : '/dashboard/my-quizzes';

    useEffect(() => {
        breadcrumbContext?.setBreadcrumb([
            { label: t('dashboard.header.breadcrumb.dashboard'), path: '/dashboard' },
            { label: isTutor ? t('dashboard.tutor.myQuizzes.title') : t('dashboard.student.myQuizzes.title'), path: quizzesPath },
            { label: 'Quiz Result' }
        ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTutor]);

    useEffect(() => {
        document.title = 'Quiz Result - ELearning';
    }, []);

    useEffect(() => {
        if (isPassed) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [isPassed]);

    const toggleQuestion = (questionId: number) => {
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

    const correctCount = quizResult.questions.filter(q => q.userAnswer === q.correctAnswer).length;
    const incorrectCount = quizResult.questions.length - correctCount;

    const filteredQuestions = quizResult.questions.filter(q => {
        const isCorrect = q.userAnswer === q.correctAnswer;
        if (filter === 'correct') return isCorrect;
        if (filter === 'incorrect') return !isCorrect;
        return true;
    });

    return (
        <div className="h-[calc(100vh-120px)] flex">
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
            <div className="w-64 flex-shrink-0 border-r border-gray-100 bg-gray-50/50 p-4 hidden lg:flex flex-col">
                {/* Score Card */}
                <div className={`rounded-2xl p-4 mb-4 text-center ${
                    isPassed ? 'bg-[#065A46]' : 'bg-red-600'
                }`}>
                    <div className="flex items-center justify-center gap-2 mb-3">
                        {isPassed && <IoTrophyOutline className="w-5 h-5 text-yellow-300" />}
                        <span className={`text-sm font-semibold ${isPassed ? 'text-yellow-300' : 'text-white/90'}`}>
                            {isPassed ? t('quizResult.passed') : t('quizResult.notPassed')}
                        </span>
                    </div>
                    <div className="bg-white rounded-xl p-3">
                        <CircularProgress percentage={percentage} isPassed={isPassed} label={t('quizResult.score')} />
                    </div>
                    <p className="text-white/90 text-sm mt-3">
                        {quizResult.score}/{quizResult.totalQuestions} {t('quizResult.correct').toLowerCase()}
                    </p>
                </div>

                {/* Quiz Info */}
                <div className="bg-white rounded-xl p-3 border border-gray-100 mb-4">
                    <h2 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">{quizResult.quizTitle}</h2>
                    <p className="text-xs text-gray-500">{quizResult.courseTitle}</p>
                </div>

                {/* Stats */}
                <div className="bg-white rounded-xl p-3 border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#065A46]"></div>
                            <span className="text-gray-600">{t('quizResult.correct')}</span>
                        </div>
                        <span className="font-semibold text-[#065A46]">{correctCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#b91c1c]"></div>
                            <span className="text-gray-600">{t('quizResult.incorrect')}</span>
                        </div>
                        <span className="font-semibold text-[#b91c1c]">{incorrectCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <IoTimeOutline className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{t('quizResult.time')}</span>
                        </div>
                        <span className="font-semibold text-gray-700">{quizResult.timeTaken}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{t('quizResult.passScore')}</span>
                        <span className="font-semibold text-gray-700">{quizResult.passingScore}%</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto space-y-2">
                    <button 
                        onClick={() => navigate(isTutor ? '/dashboard/quizzes/take' : '/dashboard/my-quizzes/take')}
                        className="w-full px-4 py-2.5 bg-[#065A46] text-white text-sm font-semibold rounded-xl hover:bg-[#054d3b] transition-all flex items-center justify-center gap-2"
                    >
                        <IoRefreshOutline className="w-4 h-4" />
                        {t('quizResult.retakeQuiz')}
                    </button>
                    <button 
                        onClick={() => navigate(quizzesPath)} 
                        className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                        <IoArrowBack className="w-4 h-4" />
                        {t('quizResult.backToQuizzes')}
                    </button>
                </div>
            </div>

            {/* Main Content - Question Review */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between gap-4 px-6 py-3 border-b border-gray-100">
                    <div>
                        <h1 className="text-lg font-bold text-gray-800">{t('quizResult.reviewAnswers')}</h1>
                        <p className="text-xs text-gray-500">{quizResult.dateCompleted}</p>
                    </div>
                    
                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                                filter === 'all' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            {t('quizResult.filter.all')} ({quizResult.questions.length})
                        </button>
                        <button
                            onClick={() => setFilter('correct')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                                filter === 'correct' ? 'bg-white text-[#065A46] shadow-sm' : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            ✓ {t('quizResult.filter.correct')} ({correctCount})
                        </button>
                        <button
                            onClick={() => setFilter('incorrect')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                                filter === 'incorrect' ? 'bg-white text-[#b91c1c] shadow-sm' : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            ✗ {t('quizResult.filter.incorrect')} ({incorrectCount})
                        </button>
                    </div>
                </div>

                {/* Mobile Stats Bar */}
                <div className={`lg:hidden flex-shrink-0 flex items-center justify-between px-4 py-2 ${isPassed ? 'bg-[#065A46]' : 'bg-red-600'}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                            <span className={`text-lg font-bold ${isPassed ? 'text-[#065A46]' : 'text-[#b91c1c]'}`}>{percentage}%</span>
                        </div>
                        <div className="text-white">
                            <p className="text-sm font-semibold">{isPassed ? t('quizResult.passed') : t('quizResult.notPassed')}</p>
                            <p className="text-xs text-white/70">{quizResult.score}/{quizResult.totalQuestions} {t('quizResult.correct').toLowerCase()}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => navigate(isTutor ? '/dashboard/quizzes/take' : '/dashboard/my-quizzes/take')}
                            className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30"
                        >
                            <IoRefreshOutline className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Questions List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {filteredQuestions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <IoFilterOutline className="w-12 h-12 mb-2 text-gray-300" />
                            <p className="text-sm">{t('quizResult.noQuestionsMatch')}</p>
                        </div>
                    ) : (
                        filteredQuestions.map((question) => (
                            <QuestionCard
                                key={question.id}
                                question={question}
                                index={quizResult.questions.findIndex(q => q.id === question.id)}
                                isExpanded={expandedQuestions.has(question.id)}
                                onToggle={() => toggleQuestion(question.id)}
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
        </div>
    );
};

export default QuizResultPage;
