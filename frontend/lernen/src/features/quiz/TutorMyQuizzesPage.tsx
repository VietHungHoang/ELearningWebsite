import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch, HiPlus, HiPencil, HiEye, HiChartBar, HiPlay } from 'react-icons/hi';
import { IoHelpCircleOutline, IoTimeOutline, IoPeopleOutline, IoCalendarOutline, IoEllipsisVertical, IoCheckmarkCircleOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { useBreadcrumb } from '../dashboard/context/BreadcrumbContext';
import { useAuth } from '../../context/AuthContext';
import quizService from '../../services/quizService';
import type { QuizSummary, StudentQuizSummary } from '../../types/quiz';

// Unified Quiz type for display (maps both tutor and student responses)
interface Quiz {
    id: string;
    title: string;
    classTitle: string; // Will be empty for now until class integration
    courseId: string;
    totalQuestions: number;
    timeLimitMinutes: number;
    createdAt: string;
    lastModified: string;
    // Tutor-specific fields
    attempts?: number;
    averageScore?: number;
    highestScore?: number;
    status: 'active' | 'draft' | 'archived' | 'completed' | 'in_progress' | 'not_started';
    // Student-specific fields
    tutorName?: string;
    tutorAvatar?: string;
    score?: number;
    maxScore?: number;
    completedAt?: string;
    assignedAt?: string;
    questionsAnswered?: number;
    timeRemaining?: number;
    currentAttemptId?: string;
}

// Map backend QuizSummary to display Quiz type (Tutor)
const mapTutorQuiz = (q: QuizSummary): Quiz => ({
    id: q.id,
    title: q.title,
    classTitle: '', // TODO: integrate with class service
    courseId: q.classId,
    totalQuestions: q.totalQuestions,
    timeLimitMinutes: q.timeLimitMinutes,
    createdAt: q.createdAt,
    lastModified: q.updatedAt,
    attempts: q.totalAttempts,
    averageScore: q.averagePercentage,
    highestScore: q.highestScore,
    status: q.status.toLowerCase() as 'active' | 'draft' | 'archived',
});

// Map backend StudentQuizSummary to display Quiz type (Student)
const mapStudentQuiz = (q: StudentQuizSummary): Quiz => ({
    id: q.id,
    title: q.title,
    classTitle: '', // TODO: integrate with class service
    courseId: '',
    totalQuestions: q.totalQuestions,
    timeLimitMinutes: q.timeLimitMinutes,
    createdAt: q.createdAt,
    lastModified: q.createdAt,
    status: q.studentStatus.toLowerCase().replace('_', '_') as 'completed' | 'in_progress' | 'not_started',
    tutorName: q.tutorName,
    tutorAvatar: q.tutorAvatar,
    score: q.score,
    maxScore: q.maxScore,
    completedAt: q.completedAt,
    assignedAt: q.assignedAt,
    questionsAnswered: q.questionsAnswered,
    timeRemaining: q.timeRemainingSeconds ? Math.floor(q.timeRemainingSeconds / 60) : undefined,
    currentAttemptId: q.currentAttemptId,
});

type TutorFilterTab = 'all' | 'active' | 'draft';
type StudentFilterTab = 'all' | 'completed' | 'in_progress' | 'not_started';

const MyQuizzesPage: React.FC = () => {
    const { state } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { setBreadcrumb } = useBreadcrumb();
    const [searchTerm, setSearchTerm] = useState('');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    // Determine role
    const isTutor = state.user?.role === 'tutor';
    const isStudent = state.user?.role === 'student';

    // State based on role
    const [tutorActiveTab, setTutorActiveTab] = useState<TutorFilterTab>('all');
    const [studentActiveTab, setStudentActiveTab] = useState<StudentFilterTab>('all');

    // API data state
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch quizzes based on role
    const fetchQuizzes = useCallback(async () => {
        if (!state.user?.id) return;

        setLoading(true);
        setError(null);

        try {
            if (isTutor) {
                const data = await quizService.getQuizzesByCreator(state.user.id);
                setQuizzes(data.map(mapTutorQuiz));
            } else if (isStudent) {
                const data = await quizService.getStudentQuizzes();
                setQuizzes(data.map(mapStudentQuiz));
            }
        } catch (err) {
            console.error('Failed to fetch quizzes:', err);
            setError('Failed to load quizzes. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [state.user?.id, isTutor, isStudent]);

    useEffect(() => {
        fetchQuizzes();
    }, [fetchQuizzes]);

    useEffect(() => {
        setBreadcrumb([
            { label: t('dashboard.header.breadcrumb.dashboard'), path: '/dashboard' },
            { label: isTutor ? t('dashboard.tutor.myQuizzes.title') : t('dashboard.student.myQuizzes.title') }
        ]);
    }, [setBreadcrumb, t, isTutor]);

    useEffect(() => {
        document.title = 'My Quizzes - ELearning';
    }, []);

    // Filter logic based on role
    const filteredQuizzes = useMemo(() => {
        let filtered = quizzes;

        if (isTutor) {
            // Tutor filter by status
            if (tutorActiveTab !== 'all') {
                filtered = filtered.filter(quiz => quiz.status === tutorActiveTab);
            }
        } else {
            // Student filter by status
            if (studentActiveTab !== 'all') {
                filtered = filtered.filter(quiz => quiz.status === studentActiveTab);
            }
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(quiz =>
                quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                quiz.classTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (quiz.tutorName && quiz.tutorName.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        return filtered;
    }, [quizzes, tutorActiveTab, studentActiveTab, searchTerm, isTutor]);

    const getStatusColor = (status: Quiz['status']) => {
        switch (status) {
            case 'active':
            case 'completed':
                return 'bg-[#065A46]'; // Primary color - success state
            case 'draft':
            case 'in_progress':
                return 'bg-[#a16207]'; // Warm amber - working/pending state
            case 'archived':
            case 'not_started':
                return 'bg-[#475569]'; // Dark slate - inactive state
            default:
                return 'bg-[#64748b]';
        }
    };

    const getStatusText = (status: Quiz['status']) => {
        switch (status) {
            case 'active':
                return t('dashboard.tutor.myQuizzes.status.active');
            case 'draft':
                return t('dashboard.tutor.myQuizzes.status.draft');
            case 'archived':
                return t('dashboard.tutor.myQuizzes.status.archived');
            case 'completed':
                return t('dashboard.student.myQuizzes.status.completed');
            case 'in_progress':
                return t('dashboard.student.myQuizzes.status.inProgress');
            case 'not_started':
                return t('dashboard.student.myQuizzes.status.notStarted');
            default:
                return status;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Tutor Tab Button
    const TutorTabButton: React.FC<{ tab: TutorFilterTab }> = ({ tab }) => {
        const tabLabels = {
            all: t('dashboard.tutor.myQuizzes.tabs.all'),
            active: t('dashboard.tutor.myQuizzes.tabs.active'),
            draft: t('dashboard.tutor.myQuizzes.tabs.draft'),
        };

        return (
            <button
                onClick={() => setTutorActiveTab(tab)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${tutorActiveTab === tab
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-500 hover:bg-white/50'
                    }`}
            >
                {tabLabels[tab]}
            </button>
        );
    };

    // Student Tab Button
    const StudentTabButton: React.FC<{ tab: StudentFilterTab; label: string }> = ({ tab, label }) => (
        <button
            onClick={() => setStudentActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${studentActiveTab === tab
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500 hover:bg-white/50'
                }`}
        >
            {label}
        </button>
    );

    // Quiz Card Component
    const QuizCard: React.FC<{ quiz: Quiz }> = ({ quiz }) => {
        const isMenuOpen = openMenuId === quiz.id;
        const menuRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                    if (isMenuOpen) {
                        setOpenMenuId(null);
                    }
                }
            };
            if (isMenuOpen) {
                document.addEventListener('mousedown', handleClickOutside);
            }
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [isMenuOpen]);

        // Tutor menu items
        const renderTutorMenu = () => (
            <div className="absolute top-10 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px] z-40">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate('/quiz/take');
                        setOpenMenuId(null);
                    }}
                    className="w-full px-3 py-2 text-sm text-left hover:bg-[#065A46]/5 active:bg-[#065A46]/10 flex items-center gap-2 text-gray-700 transition-colors duration-150"
                >
                    <HiEye className="w-4 h-4 text-[#065A46] flex-shrink-0" />
                    <span>{t('dashboard.tutor.myQuizzes.card.takeQuiz')}</span>
                </button>
                <div className="h-px bg-gray-100 my-0.5"></div>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboard/quizzes/${quiz.id}/stats`);
                        setOpenMenuId(null);
                    }}
                    className="w-full px-3 py-2 text-sm text-left hover:bg-[#64748b]/5 active:bg-[#64748b]/10 flex items-center gap-2 text-gray-700 transition-colors duration-150"
                >
                    <HiChartBar className="w-4 h-4 text-[#64748b] flex-shrink-0" />
                    <span>{t('dashboard.tutor.myQuizzes.card.stats')}</span>
                </button>
                <div className="h-px bg-gray-100 my-0.5"></div>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate('/dashboard/quizzes/create');
                        setOpenMenuId(null);
                    }}
                    className="w-full px-3 py-2 text-sm text-left hover:bg-[#0b6459]/5 active:bg-[#0b6459]/10 flex items-center gap-2 text-gray-700 transition-colors duration-150"
                >
                    <HiPencil className="w-4 h-4 text-[#0b6459] flex-shrink-0" />
                    <span>{t('dashboard.tutor.myQuizzes.card.edit')}</span>
                </button>
            </div>
        );

        // Student menu items
        const renderStudentMenu = () => (
            <div className="absolute top-10 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px] z-40">
                {quiz.status === 'not_started' && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate('/quiz/take');
                            setOpenMenuId(null);
                        }}
                        className="w-full px-3 py-2 text-sm text-left hover:bg-[#475569]/5 active:bg-[#475569]/10 flex items-center gap-2 text-gray-700 transition-colors duration-150"
                    >
                        <HiPlay className="w-4 h-4 text-[#475569] flex-shrink-0" />
                        <span>{t('dashboard.student.myQuizzes.actions.startQuiz')}</span>
                    </button>
                )}
                {quiz.status === 'in_progress' && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate('/quiz/take');
                            setOpenMenuId(null);
                        }}
                        className="w-full px-3 py-2 text-sm text-left hover:bg-[#a16207]/5 active:bg-[#a16207]/10 flex items-center gap-2 text-gray-700 transition-colors duration-150 whitespace-nowrap"
                    >
                        <HiPlay className="w-4 h-4 text-[#a16207] flex-shrink-0" />
                        <span>{t('dashboard.student.myQuizzes.actions.continueQuiz')}</span>
                    </button>
                )}
                {quiz.status === 'completed' && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate('/quiz/take');
                            setOpenMenuId(null);
                        }}
                        className="w-full px-3 py-2 text-sm text-left hover:bg-[#065A46]/5 active:bg-[#065A46]/10 flex items-center gap-2 text-gray-700 transition-colors duration-150"
                    >
                        <HiPlay className="w-4 h-4 text-[#065A46] flex-shrink-0" />
                        <span>{t('dashboard.student.myQuizzes.actions.retake')}</span>
                    </button>
                )}
            </div>
        );

        return (
            <div className="bg-white rounded-xl border border-[#eaeaea] px-3 pt-3 pb-2 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] transition-shadow relative overflow-hidden flex flex-col h-full">
                {/* Status badge - Top left corner */}
                <div className="absolute top-0 left-0 z-10">
                    <div className={`${getStatusColor(quiz.status)} text-white text-[10px] font-semibold px-2.5 py-1 rounded-br-lg flex items-center gap-1 shadow-sm`}>
                        <div className="w-1 h-1 rounded-full bg-white/80"></div>
                        <span className="uppercase tracking-wide">{getStatusText(quiz.status)}</span>
                    </div>
                </div>


                {/* Header */}
                <div className="mb-2 pt-5">
                    {/* Title row with three dots menu */}
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                        <h3 className="font-bold text-base text-gray-800 truncate flex-1 pr-2">
                            {quiz.title}
                        </h3>
                        {/* Three dots menu button - only show for tutor OR student with completed quiz */}
                        {(isTutor || (isStudent && quiz.status === 'completed')) && (
                            <div className="relative flex-shrink-0 -mr-2.5" ref={menuRef}>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuId(isMenuOpen ? null : quiz.id);
                                    }}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors text-gray-600 hover:text-gray-800 outline-none focus:outline-none focus-visible:outline-none"
                                    aria-label="Menu options"
                                    onMouseDown={(e) => e.preventDefault()}
                                >
                                    <IoEllipsisVertical className="w-4 h-4 flex-shrink-0" />
                                </button>

                                {/* Dropdown menu based on role */}
                                {isMenuOpen && (isTutor ? renderTutorMenu() : renderStudentMenu())}
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{quiz.classTitle}</p>
                </div>

                {/* Quiz Details */}
                <div className="space-y-2 mb-2 flex-1">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-600 flex items-center gap-1">
                            <IoHelpCircleOutline className="w-4 h-4" />
                            {isTutor ? t('dashboard.tutor.myQuizzes.card.totalQuestions') : t('dashboard.student.myQuizzes.card.questions')}
                        </span>
                        <span className="text-gray-600 font-medium">{quiz.totalQuestions}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-600 flex items-center gap-1">
                            <IoTimeOutline className="w-4 h-4" />
                            {isTutor ? t('dashboard.tutor.myQuizzes.card.timeLimit') : t('dashboard.student.myQuizzes.card.timeLimit')}
                        </span>
                        <span className="text-gray-600 font-medium">{quiz.timeLimitMinutes} min</span>
                    </div>

                    {/* Tutor-specific details */}
                    {isTutor && (
                        <>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-600 flex items-center gap-1">
                                    <IoPeopleOutline className="w-4 h-4" />
                                    {t('dashboard.tutor.myQuizzes.card.attempts')}
                                </span>
                                <span className="text-gray-600 font-medium">{quiz.attempts}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-600 flex items-center gap-1">
                                    <IoCalendarOutline className="w-4 h-4" />
                                    {t('dashboard.tutor.myQuizzes.card.createdAt')}
                                </span>
                                <span className="text-gray-600 font-medium">{formatDate(quiz.createdAt)}</span>
                            </div>
                        </>
                    )}

                    {/* Student-specific details */}
                    {isStudent && (
                        <>
                            {quiz.questionsAnswered !== undefined && quiz.status === 'in_progress' && (
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-600 flex items-center gap-1">
                                        <IoCheckmarkCircleOutline className="w-4 h-4" />
                                        {t('dashboard.student.myQuizzes.card.progress')}
                                    </span>
                                    <span className="text-gray-600 font-medium">{quiz.questionsAnswered}/{quiz.totalQuestions} {t('dashboard.student.myQuizzes.card.answered')}</span>
                                </div>
                            )}
                            {quiz.status === 'completed' && quiz.score !== undefined && quiz.maxScore && (
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-600 flex items-center gap-1">
                                        <IoCheckmarkCircleOutline className="w-4 h-4" />
                                        {t('dashboard.student.myQuizzes.card.score')}
                                    </span>
                                    <span className="text-[#065A46] font-semibold">{quiz.score}/{quiz.maxScore}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-600 flex items-center gap-1">
                                    <IoCalendarOutline className="w-4 h-4" />
                                    {quiz.completedAt ? t('dashboard.student.myQuizzes.card.completed') : t('dashboard.student.myQuizzes.card.assigned')}
                                </span>
                                <span className="text-gray-600 font-medium">
                                    {formatDate(quiz.completedAt || quiz.assignedAt || quiz.createdAt)}
                                </span>
                            </div>
                        </>
                    )}
                </div>

                {/* Student action button */}
                {isStudent && (
                    <button
                        onClick={() => {
                            if (quiz.status === 'not_started' || quiz.status === 'in_progress') {
                                navigate('/quiz/take');
                            } else if (quiz.status === 'completed') {
                                navigate('/quiz/result');
                            }
                        }}
                        className={`w-full mt-auto pt-2 py-2 rounded-lg text-xs font-semibold transition-colors ${quiz.status === 'completed'
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-[#065A46] text-white hover:bg-[#054d3b]'
                            }`}
                    >
                        {quiz.status === 'completed' ? t('dashboard.student.myQuizzes.actions.viewResults') :
                            quiz.status === 'in_progress' ? t('dashboard.student.myQuizzes.actions.continueQuiz') :
                                t('dashboard.student.myQuizzes.actions.startQuiz')}
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="p-4">
            {/* Page Header */}
            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            {isTutor ? t('dashboard.tutor.myQuizzes.title') : t('dashboard.student.myQuizzes.title')}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            {isTutor ? t('dashboard.tutor.myQuizzes.subtitle') : t('dashboard.student.myQuizzes.subtitle')}
                        </p>
                    </div>
                    {/* Only show Create Quiz button for Tutors */}
                    {isTutor && (
                        <button
                            onClick={() => navigate('/dashboard/quizzes/create')}
                            className="bg-[#0b6459] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#084c43] transition-colors flex items-center gap-2"
                        >
                            <HiPlus className="w-4 h-4" />
                            {t('dashboard.tutor.myQuizzes.createButton')}
                        </button>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <HiSearch className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder={isTutor ? t('dashboard.tutor.myQuizzes.searchPlaceholder') : t('dashboard.student.myQuizzes.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white rounded-lg pl-10 pr-4 py-2.5 text-sm border border-gray-200 hover:shadow-sm focus:outline-none focus:border-[#0b6459] transition-colors duration-300 w-82 placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Tutor Tabs */}
                {isTutor && (
                    <div className="bg-gray-100 p-1 rounded-xl inline-flex items-center">
                        <TutorTabButton tab="all" />
                        <TutorTabButton tab="active" />
                        <TutorTabButton tab="draft" />
                    </div>
                )}

                {/* Student Tabs */}
                {isStudent && (
                    <div className="bg-gray-100 p-1 rounded-xl inline-flex items-center">
                        <StudentTabButton tab="all" label={t('dashboard.student.myQuizzes.tabs.all')} />
                        <StudentTabButton tab="completed" label={t('dashboard.student.myQuizzes.tabs.completed')} />
                        <StudentTabButton tab="in_progress" label={t('dashboard.student.myQuizzes.tabs.inProgress')} />
                        <StudentTabButton tab="not_started" label={t('dashboard.student.myQuizzes.tabs.notStarted')} />
                    </div>
                )}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0b6459]"></div>
                    <span className="ml-3 text-gray-500">Loading quizzes...</span>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="text-center py-20">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={fetchQuizzes}
                        className="text-[#0b6459] hover:underline"
                    >
                        Try again
                    </button>
                </div>
            )}

            {/* Quiz Grid */}
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredQuizzes.map((quiz) => (
                        <QuizCard key={quiz.id} quiz={quiz} />
                    ))}
                </div>
            )}

            {!loading && !error && filteredQuizzes.length === 0 && (
                <div className="text-center py-20">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                        {isTutor ? t('dashboard.tutor.myQuizzes.empty.title') : t('dashboard.student.myQuizzes.empty.title')}
                    </h3>
                    <p className="text-gray-500">
                        {searchTerm
                            ? (isTutor ? t('dashboard.tutor.myQuizzes.empty.descriptionSearch') : t('dashboard.student.myQuizzes.empty.descriptionSearch'))
                            : (isTutor ? t('dashboard.tutor.myQuizzes.empty.description') : t('dashboard.student.myQuizzes.empty.description'))
                        }
                    </p>
                    {isTutor && !searchTerm && (
                        <button
                            onClick={() => navigate('/dashboard/quizzes/create')}
                            className="mt-4 bg-[#0b6459] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#084c43] transition-colors"
                        >
                            {t('dashboard.tutor.myQuizzes.empty.createFirst')}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyQuizzesPage;
