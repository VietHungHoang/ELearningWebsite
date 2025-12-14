import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch, HiFilter } from 'react-icons/hi';
import Breadcrumb from '../../components/Breadcrumb';
import { useAuth } from '../../../../context/AuthContext';

// Types
interface QuizAttempt {
    id: string;
    quizTitle: string;
    courseTitle: string;
    tutorName: string;
    tutorAvatar: string;
    totalQuestions: number;
    timeLimitMinutes: number;
    status: 'completed' | 'in_progress' | 'not_started';
    score?: number;
    maxScore?: number;
    completedAt?: string;
    assignedAt: string; // Date when quiz was assigned
    timeRemaining?: number; // minutes
    questionsAnswered?: number;
}

// Mock data
const mockQuizAttempts: QuizAttempt[] = [
    {
        id: '1',
        quizTitle: 'Final Exam: Advanced Calculus',
        courseTitle: 'Advanced Calculus II',
        tutorName: 'Dr. Sarah Johnson',
        tutorAvatar: 'https://picsum.photos/seed/sarah/48/48',
        totalQuestions: 25,
        timeLimitMinutes: 60,
        status: 'completed',
        score: 22,
        maxScore: 25,
        completedAt: '2025-11-15T14:30:00Z',
        assignedAt: '2025-11-01T09:00:00Z',
    },
    {
        id: '2',
        quizTitle: 'Mid-term: Physics Fundamentals',
        courseTitle: 'Physics 101',
        tutorName: 'Prof. Michael Chen',
        tutorAvatar: 'https://picsum.photos/seed/michael/48/48',
        totalQuestions: 20,
        timeLimitMinutes: 45,
        status: 'completed',
        score: 18,
        maxScore: 20,
        completedAt: '2025-10-28T10:15:00Z',
        assignedAt: '2025-10-15T09:00:00Z',
    },
    {
        id: '3',
        quizTitle: 'Weekly Quiz: Literature Analysis',
        courseTitle: 'English Literature',
        tutorName: 'Ms. Emily Davis',
        tutorAvatar: 'https://picsum.photos/seed/emily/48/48',
        totalQuestions: 15,
        timeLimitMinutes: 30,
        status: 'in_progress',
        questionsAnswered: 8,
        timeRemaining: 15,
        assignedAt: '2025-11-20T09:00:00Z',
    },
    {
        id: '4',
        quizTitle: 'Practice Quiz: Basic Algebra',
        courseTitle: 'Mathematics Fundamentals',
        tutorName: 'Mr. David Wilson',
        tutorAvatar: 'https://picsum.photos/seed/david/48/48',
        totalQuestions: 10,
        timeLimitMinutes: 20,
        status: 'not_started',
        assignedAt: '2025-11-25T10:00:00Z',
    },
    {
        id: '5',
        quizTitle: 'Final Assessment: Chemistry Lab',
        courseTitle: 'Chemistry 101',
        tutorName: 'Dr. Lisa Brown',
        tutorAvatar: 'https://picsum.photos/seed/lisa/48/48',
        totalQuestions: 30,
        timeLimitMinutes: 90,
        status: 'completed',
        score: 27,
        maxScore: 30,
        completedAt: '2025-11-01T16:45:00Z',
        assignedAt: '2025-10-20T09:00:00Z',
    },
];

type FilterTab = 'All Quizzes' | 'Completed' | 'In Progress' | 'Not Started';

const MyQuizzesPage: React.FC = () => {
    const { state } = useAuth();
    const navigate = useNavigate();
    const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(mockQuizAttempts);
    const [activeTab, setActiveTab] = useState<FilterTab>('All Quizzes');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredQuizzes = useMemo(() => {
        let filtered = quizAttempts;

        // Filter by status
        if (activeTab !== 'All Quizzes') {
            const statusMap = {
                'Completed': 'completed',
                'In Progress': 'in_progress',
                'Not Started': 'not_started',
            } as const;
            filtered = filtered.filter(quiz => quiz.status === statusMap[activeTab]);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(quiz =>
                quiz.quizTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                quiz.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                quiz.tutorName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    }, [quizAttempts, activeTab, searchTerm]);

    const getStatusColor = (status: QuizAttempt['status']) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800';
            case 'not_started':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: QuizAttempt['status']) => {
        switch (status) {
            case 'completed':
                return 'Completed';
            case 'in_progress':
                return 'In Progress';
            case 'not_started':
                return 'Not Started';
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

    const TabButton: React.FC<{ label: FilterTab }> = ({ label }) => (
        <button
            onClick={() => setActiveTab(label)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                activeTab === label
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-500 hover:bg-white/50'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="max-w-7xl mx-auto">
            <Breadcrumb
                items={[
                    { label: 'Dashboard', onClick: () => navigate('/dashboard') },
                    { label: 'My Quizzes', isActive: true }
                ]}
                className="mb-6"
            />

            <div className="flex justify-between items-center mb-6">
                <div className="bg-gray-100 p-1 rounded-xl inline-flex items-center">
                    <TabButton label="All Quizzes" />
                    <TabButton label="Completed" />
                    <TabButton label="In Progress" />
                    <TabButton label="Not Started" />
                </div>

                <div className="relative w-full max-w-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiSearch className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search quizzes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white rounded-lg pl-10 pr-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0b6459]"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuizzes.map((quiz) => (
                    <div key={quiz.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1 mr-3">
                                <div className="relative group">
                                    <h3 className="font-bold text-lg text-gray-800 line-clamp-1 mb-1 cursor-pointer">
                                        {quiz.quizTitle}
                                    </h3>
                                    <div className="absolute left-0 top-full mt-1 px-3 py-2 bg-black/80 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-10 pointer-events-none">
                                        {quiz.quizTitle}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600">{quiz.courseTitle}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${getStatusColor(quiz.status)}`}>
                                    {getStatusText(quiz.status)}
                                </span>
                                {quiz.status === 'completed' && quiz.score !== undefined && quiz.maxScore && (
                                    <span className="text-sm font-semibold text-green-600 whitespace-nowrap">
                                        Score: {quiz.score}/{quiz.maxScore}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Tutor Info */}
                        <div className="flex items-center gap-3 mb-4">
                            <div>
                                <p className="text-sm font-medium text-gray-800">{quiz.tutorName}</p>
                            </div>
                        </div>

                        {/* Quiz Details */}
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Questions: {quiz.totalQuestions}</span>
                                <span className="text-gray-600">Time Limit: {quiz.timeLimitMinutes} min</span>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={() => {
                                if (quiz.status === 'not_started') {
                                    // Start quiz
                                    alert('Starting quiz...');
                                } else if (quiz.status === 'in_progress') {
                                    // Continue quiz
                                    alert('Continuing quiz...');
                                } else {
                                    // View results
                                    alert('Viewing results...');
                                }
                            }}
                            className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                                quiz.status === 'completed'
                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    : 'bg-[#0b6459] text-white hover:bg-[#084c43]'
                            }`}
                        >
                            {quiz.status === 'completed' ? 'View Results' :
                             quiz.status === 'in_progress' ? 'Continue Quiz' :
                             'Start Quiz'}
                        </button>

                        {quiz.completedAt ? (
                            <p className="text-xs text-gray-500 text-center mt-2">
                                Assigned: {formatDate(quiz.assignedAt)} • Completed: {formatDate(quiz.completedAt)}
                            </p>
                        ) : (
                            <p className="text-xs text-gray-500 text-center mt-2">
                                Assigned: {formatDate(quiz.assignedAt)}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {filteredQuizzes.length === 0 && (
                <div className="text-center py-20">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">No quizzes found</h3>
                    <p className="text-gray-500">
                        {searchTerm ? 'Try adjusting your search terms.' : 'You haven\'t taken any quizzes yet.'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default MyQuizzesPage;