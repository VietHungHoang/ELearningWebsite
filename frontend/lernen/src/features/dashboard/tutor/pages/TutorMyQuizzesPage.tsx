import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch, HiPlus, HiPencil, HiEye, HiChartBar } from 'react-icons/hi';
import Breadcrumb from '../../components/Breadcrumb';

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
        title: 'Final Exam: Advanced Calculus',
        courseTitle: 'Advanced Calculus II',
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
        title: 'Weekly Quiz: Literature Analysis',
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
        courseTitle: 'Chemistry 101',
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

type FilterTab = 'All Quizzes' | 'Active' | 'Draft' | 'Archived';

const TutorMyQuizzesPage: React.FC = () => {
    const navigate = useNavigate();
    const [quizzes] = useState<Quiz[]>(mockQuizzes);
    const [activeTab, setActiveTab] = useState<FilterTab>('All Quizzes');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredQuizzes = useMemo(() => {
        let filtered = quizzes;

        // Filter by status
        if (activeTab !== 'All Quizzes') {
            const statusMap = {
                'Active': 'active',
                'Draft': 'draft',
                'Archived': 'archived',
            } as const;
            filtered = filtered.filter(quiz => quiz.status === statusMap[activeTab]);
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
                return 'bg-green-100 text-green-800';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800';
            case 'archived':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: Quiz['status']) => {
        switch (status) {
            case 'active':
                return 'Active';
            case 'draft':
                return 'Draft';
            case 'archived':
                return 'Archived';
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
                    <TabButton label="Active" />
                    <TabButton label="Draft" />
                    <TabButton label="Archived" />
                </div>

                <div className="flex gap-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <HiSearch className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search quizzes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white rounded-lg pl-10 pr-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0b6459] w-64"
                        />
                    </div>

                    <button
                        onClick={() => navigate('/quiz/create')}
                        className="bg-[#0b6459] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#084c43] transition-colors flex items-center gap-2"
                    >
                        <HiPlus className="w-4 h-4" />
                        Create Quiz
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuizzes.map((quiz) => (
                    <div key={quiz.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-gray-800 line-clamp-2 mb-1">
                                    {quiz.title}
                                </h3>
                                <p className="text-sm text-gray-600">{quiz.courseTitle}</p>
                            </div>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusColor(quiz.status)}`}>
                                {getStatusText(quiz.status)}
                            </span>
                        </div>

                        {/* Quiz Details */}
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Questions:</span>
                                <span className="font-medium">{quiz.totalQuestions}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Time Limit:</span>
                                <span className="font-medium">{quiz.timeLimitMinutes} min</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Attempts:</span>
                                <span className="font-medium">{quiz.attempts}</span>
                            </div>

                            {quiz.attempts > 0 && quiz.averageScore && (
                                <div className="pt-2 border-t border-gray-100">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Avg Score:</span>
                                        <span className="font-medium">{quiz.averageScore}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-[#0b6459] h-2 rounded-full"
                                            style={{ width: `${quiz.averageScore}%` }}
                                        ></div>
                                    </div>
                                    {quiz.highestScore && (
                                        <p className="text-xs text-gray-500 mt-1 text-center">
                                            Highest: {quiz.highestScore}%
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => alert('Viewing quiz details...')}
                                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                            >
                                <HiEye className="w-4 h-4" />
                                View
                            </button>
                            <button
                                onClick={() => alert('Viewing statistics...')}
                                className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors flex items-center justify-center gap-1"
                            >
                                <HiChartBar className="w-4 h-4" />
                                Stats
                            </button>
                            <button
                                onClick={() => navigate('/quiz/create')}
                                className="flex-1 bg-[#0b6459] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#084c43] transition-colors flex items-center justify-center gap-1"
                            >
                                <HiPencil className="w-4 h-4" />
                                Edit
                            </button>
                        </div>

                        <div className="text-xs text-gray-500 text-center mt-3">
                            Modified {formatDate(quiz.lastModified)}
                        </div>
                    </div>
                ))}
            </div>

            {filteredQuizzes.length === 0 && (
                <div className="text-center py-20">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">No quizzes found</h3>
                    <p className="text-gray-500">
                        {searchTerm ? 'Try adjusting your search terms.' : 'You haven\'t created any quizzes yet.'}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={() => navigate('/quiz/create')}
                            className="mt-4 bg-[#0b6459] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#084c43] transition-colors"
                        >
                            Create Your First Quiz
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default TutorMyQuizzesPage;