import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch, HiPlus, HiPencil, HiEye, HiChartBar } from 'react-icons/hi';
import { IoHelpCircleOutline, IoTimeOutline, IoPeopleOutline, IoCalendarOutline, IoEllipsisVertical } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { useBreadcrumb } from '../dashboard/context/BreadcrumbContext';

// Types
interface Quiz {
    id: string;
    title: string;
    courseTitle: string;
    courseId: string;
    totalQuestions: number;
    timeLimitMinutes: number;
    createdAt: string;
    lastModified: string;
    attempts: number;
    averageScore?: number;
    highestScore?: number;
    status: 'active' | 'draft' | 'archived';
}

// Mock data
const mockQuizzes: Quiz[] = [
    {
        id: '1',
        title: 'Final Exam: Advanced Calculus Calculus Calculus',
        courseTitle: 'Advanced Calculus II s',
        courseId: 'course-1',
        totalQuestions: 25,
        timeLimitMinutes: 60,
        createdAt: '2025-10-01T10:00:00Z',
        lastModified: '2025-10-15T14:30:00Z',
        attempts: 45,
        averageScore: 88,
        highestScore: 100,
        status: 'active',
    },
    {
        id: '2',
        title: 'Mid-term: Physics Fundamentals',
        courseTitle: 'Physics 101',
        courseId: 'course-2',
        totalQuestions: 20,
        timeLimitMinutes: 45,
        createdAt: '2025-09-15T09:00:00Z',
        lastModified: '2025-09-20T11:15:00Z',
        attempts: 32,
        averageScore: 82,
        highestScore: 98,
        status: 'active',
    },
    {
        id: '3',
        title: 'Weekly Quiz: Literature Analysis Analysis',
        courseTitle: 'English Literature',
        courseId: 'course-3',
        totalQuestions: 15,
        timeLimitMinutes: 30,
        createdAt: '2025-11-01T08:30:00Z',
        lastModified: '2025-11-01T08:30:00Z',
        attempts: 0,
        status: 'draft',
    },
    {
        id: '4',
        title: 'Practice Quiz: Basic Algebra',
        courseTitle: 'Mathematics Fundamentals',
        courseId: 'course-4',
        totalQuestions: 10,
        timeLimitMinutes: 20,
        createdAt: '2025-08-20T12:00:00Z',
        lastModified: '2025-08-25T16:45:00Z',
        attempts: 67,
        averageScore: 91,
        highestScore: 100,
        status: 'active',
    },
    {
        id: '5',
        title: 'Final Assessment: Chemistry Lab',
        courseTitle: 'Chemistry 10 sv svsv dvsv s s1',
        courseId: 'course-5',
        totalQuestions: 30,
        timeLimitMinutes: 90,
        createdAt: '2025-07-10T14:00:00Z',
        lastModified: '2025-07-15T10:30:00Z',
        attempts: 28,
        averageScore: 85,
        highestScore: 97,
        status: 'archived',
    },
];

type FilterTab = 'all' | 'active' | 'draft';

const TutorMyQuizzesPage: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { setBreadcrumb } = useBreadcrumb();
    const [quizzes] = useState<Quiz[]>(mockQuizzes);
    const [activeTab, setActiveTab] = useState<FilterTab>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    useEffect(() => {
        setBreadcrumb([
            { label: t('dashboard.header.breadcrumb.dashboard'), path: '/dashboard' },
            { label: t('dashboard.tutor.myQuizzes.title') }
        ]);
    }, [setBreadcrumb, t]);

    useEffect(() => {
        document.title = 'My Quizzes - ELearning';
    }, []);

    const filteredQuizzes = useMemo(() => {
        let filtered = quizzes;

        // Filter by status
        if (activeTab !== 'all') {
            filtered = filtered.filter(quiz => quiz.status === activeTab);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(quiz =>
                quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                quiz.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    }, [quizzes, activeTab, searchTerm]);

    const getStatusColor = (status: Quiz['status']) => {
        switch (status) {
            case 'active':
                return 'bg-[#065A46]';
            case 'draft':
                return 'bg-amber-600';
            default:
                return 'bg-gray-600';
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

    const TabButton: React.FC<{ tab: FilterTab }> = ({ tab }) => {
        const tabLabels = {
            all: t('dashboard.tutor.myQuizzes.tabs.all'),
            active: t('dashboard.tutor.myQuizzes.tabs.active'),
            draft: t('dashboard.tutor.myQuizzes.tabs.draft'),
        };
        
        return (
            <button
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === tab
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-500 hover:bg-white/50'
                    }`}
            >
                {tabLabels[tab]}
            </button>
        );
    };

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
        }, [isMenuOpen, setOpenMenuId]);

        return (
            <div className="bg-white rounded-xl border border-[#eaeaea] px-3 pt-3 pb-2 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] transition-shadow relative overflow-hidden">
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
                        {/* Three dots menu button */}
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
                            
                            {/* Dropdown menu */}
                            {isMenuOpen && (
                                <div className="absolute top-10 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[140px] z-40">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate('/quiz/take');
                                            setOpenMenuId(null);
                                        }}
                                        className="w-full px-3 py-2 text-sm text-left hover:bg-teal-50 active:bg-teal-100 flex items-center gap-2 text-gray-700 transition-colors duration-150"
                                    >
                                        <HiEye className="w-4 h-4 text-teal-600 flex-shrink-0" />
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
                                        className="w-full px-3 py-2 text-sm text-left hover:bg-blue-50 active:bg-blue-100 flex items-center gap-2 text-gray-700 transition-colors duration-150"
                                    >
                                        <HiChartBar className="w-4 h-4 text-blue-600 flex-shrink-0" />
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
                            )}
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{quiz.courseTitle}</p>
                </div>

                {/* Quiz Details */}
                <div className="space-y-2 mb-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-600 flex items-center gap-1">
                            <IoHelpCircleOutline className="w-4 h-4" />
                            {t('dashboard.tutor.myQuizzes.card.totalQuestions')}
                        </span>
                        <span className="text-gray-600 font-medium">{quiz.totalQuestions}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-600 flex items-center gap-1">
                            <IoTimeOutline className="w-4 h-4" />
                            {t('dashboard.tutor.myQuizzes.card.timeLimit')}
                        </span>
                        <span className="text-gray-600 font-medium">{quiz.timeLimitMinutes} min</span>
                    </div>
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
                </div>
            </div>
        );
    };

    return (
        <div className="p-4">
            {/* Page Header */}
            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">{t('dashboard.tutor.myQuizzes.title')}</h1>
                        <p className="text-gray-500 mt-1">{t('dashboard.tutor.myQuizzes.subtitle')}</p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard/quizzes/create')}
                        className="bg-[#0b6459] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#084c43] transition-colors flex items-center gap-2"
                    >
                        <HiPlus className="w-4 h-4" />
                        {t('dashboard.tutor.myQuizzes.createButton')}
                    </button>
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
                            placeholder={t('dashboard.tutor.myQuizzes.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white rounded-lg pl-10 pr-4 py-2.5 text-sm border border-gray-200 hover:shadow-sm focus:outline-none focus:border-[#0b6459] transition-colors duration-300 w-82 placeholder:text-gray-400"
                        />
                    </div>
                </div>

                <div className="bg-gray-100 p-1 rounded-xl inline-flex items-center">
                    <TabButton tab="all" />
                    <TabButton tab="active" />
                    <TabButton tab="draft" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredQuizzes.map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} />
                ))}
            </div>

            {filteredQuizzes.length === 0 && (
                <div className="text-center py-20">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{t('dashboard.tutor.myQuizzes.empty.title')}</h3>
                    <p className="text-gray-500">
                        {searchTerm ? t('dashboard.tutor.myQuizzes.empty.descriptionSearch') : t('dashboard.tutor.myQuizzes.empty.description')}
                    </p>
                    {!searchTerm && (
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

export default TutorMyQuizzesPage;