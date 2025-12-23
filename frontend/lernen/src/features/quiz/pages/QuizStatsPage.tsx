import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    HiArrowLeft,
    HiUsers,
    HiCheckCircle,
    HiChartBar,
    HiClock
} from 'react-icons/hi';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

// Mock data types
interface QuizStats {
    quizId: string;
    quizTitle: string;
    totalAttempts: number;
    averageScore: number;
    completionRate: number;
    averageTimeMinutes: number;
    highestScore: number;
    lowestScore: number;
}

interface QuestionStats {
    questionNumber: number;
    question: string;
    correctRate: number;
    totalAttempts: number;
    averageTime: number;
}

interface StudentPerformance {
    studentId: string;
    studentName: string;
    score: number;
    completionTime: number;
    attemptDate: string;
    status: 'passed' | 'failed';
}

interface ScoreDistribution {
    range: string;
    count: number;
}

// Mock data
const mockQuizStats: QuizStats = {
    quizId: '1',
    quizTitle: 'Chapter 1 - Introduction to Physics',
    totalAttempts: 45,
    averageScore: 82.5,
    completionRate: 91.5,
    averageTimeMinutes: 22,
    highestScore: 100,
    lowestScore: 45
};

const mockQuestionStats: QuestionStats[] = [
    {
        questionNumber: 1,
        question: 'What is the SI unit of force?',
        correctRate: 95.5,
        totalAttempts: 45,
        averageTime: 1.2
    },
    {
        questionNumber: 2,
        question: 'Which of the following are forms of energy?',
        correctRate: 68.9,
        totalAttempts: 45,
        averageTime: 2.5
    },
    {
        questionNumber: 3,
        question: 'What is Newton\'s First Law of Motion?',
        correctRate: 88.2,
        totalAttempts: 45,
        averageTime: 1.8
    }
];

const mockScoreDistribution: ScoreDistribution[] = [
    { range: '0-20', count: 1 },
    { range: '21-40', count: 2 },
    { range: '41-60', count: 5 },
    { range: '61-80', count: 15 },
    { range: '81-100', count: 22 }
];

const mockStudentPerformance: StudentPerformance[] = [
    {
        studentId: '1',
        studentName: 'Alice Johnson',
        score: 95,
        completionTime: 18,
        attemptDate: '2025-12-18T10:30:00Z',
        status: 'passed'
    },
    {
        studentId: '2',
        studentName: 'Bob Smith',
        score: 88,
        completionTime: 25,
        attemptDate: '2025-12-18T11:00:00Z',
        status: 'passed'
    },
    {
        studentId: '3',
        studentName: 'Charlie Brown',
        score: 72,
        completionTime: 28,
        attemptDate: '2025-12-18T14:00:00Z',
        status: 'passed'
    },
    {
        studentId: '4',
        studentName: 'Diana Prince',
        score: 58,
        completionTime: 30,
        attemptDate: '2025-12-19T09:00:00Z',
        status: 'failed'
    }
];

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#0b6459'];

const QuizStatsPage: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [selectedTab, setSelectedTab] = useState<'overview' | 'questions' | 'students'>('overview');

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const StatCard: React.FC<{
        icon: React.ReactNode;
        title: string;
        value: string | number;
        subtitle?: string;
        borderColor: string;
        iconBg: string;
    }> = ({ icon, title, value, subtitle, borderColor, iconBg }) => (
        <div className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${borderColor}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">{value}</h3>
                    <p className="text-sm font-medium text-gray-500 mt-1">{title}</p>
                    {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
                </div>
                <div className={`p-3 rounded-lg ${iconBg}`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-4">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-4 mb-2">
                    <button
                        onClick={() => navigate('/dashboard/quizzes')}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <HiArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">{mockQuizStats.quizTitle}</h1>
                        <p className="text-sm text-gray-500">{t('quiz.stats.subtitle')}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mt-4">
                    <button
                        onClick={() => setSelectedTab('overview')}
                        className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${selectedTab === 'overview'
                                ? 'bg-white text-gray-800 shadow-md'
                                : 'bg-transparent text-gray-500 hover:bg-white/50'
                            }`}
                    >
                        {t('quiz.stats.tabs.overview')}
                    </button>
                    <button
                        onClick={() => setSelectedTab('questions')}
                        className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${selectedTab === 'questions'
                                ? 'bg-white text-gray-800 shadow-md'
                                : 'bg-transparent text-gray-500 hover:bg-white/50'
                            }`}
                    >
                        {t('quiz.stats.tabs.questions')}
                    </button>
                    <button
                        onClick={() => setSelectedTab('students')}
                        className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${selectedTab === 'students'
                                ? 'bg-white text-gray-800 shadow-md'
                                : 'bg-transparent text-gray-500 hover:bg-white/50'
                            }`}
                    >
                        {t('quiz.stats.tabs.students')}
                    </button>
                </div>
            </div>

            {/* Overview Tab */}
            {selectedTab === 'overview' && (
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            icon={<HiUsers className="w-5 h-5 text-blue-600" />}
                            title={t('quiz.stats.overview.totalAttempts')}
                            value={mockQuizStats.totalAttempts}
                            borderColor="border-l-blue-600"
                            iconBg="bg-blue-100"
                        />
                        <StatCard
                            icon={<HiChartBar className="w-5 h-5 text-[#0b6459]" />}
                            title={t('quiz.stats.overview.averageScore')}
                            value={`${mockQuizStats.averageScore}%`}
                            borderColor="border-l-[#0b6459]"
                            iconBg="bg-[#0b6459]/10"
                        />
                        <StatCard
                            icon={<HiCheckCircle className="w-5 h-5 text-green-600" />}
                            title={t('quiz.stats.overview.completionRate')}
                            value={`${mockQuizStats.completionRate}%`}
                            borderColor="border-l-green-600"
                            iconBg="bg-green-100"
                        />
                        <StatCard
                            icon={<HiClock className="w-5 h-5 text-purple-600" />}
                            title={t('quiz.stats.overview.avgTime')}
                            value={`${mockQuizStats.averageTimeMinutes} min`}
                            borderColor="border-l-purple-600"
                            iconBg="bg-purple-100"
                        />
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Score Distribution */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">{t('quiz.stats.overview.scoreDistribution')}</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={mockScoreDistribution}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="range" stroke="#6b7280" fontSize={12} />
                                    <YAxis stroke="#6b7280" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                        {mockScoreDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Pass/Fail Distribution */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">{t('quiz.stats.overview.passFailRate')}</h3>
                            <div className="flex items-center justify-center">
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: t('quiz.stats.overview.passed'), value: 85 },
                                                { name: t('quiz.stats.overview.failed'), value: 15 }
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            <Cell fill="#0b6459" />
                                            <Cell fill="#ef4444" />
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Questions Tab */}
            {selectedTab === 'questions' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">{t('quiz.stats.questions.title')}</h3>
                        <div className="space-y-4">
                            {mockQuestionStats.map((question) => (
                                <div
                                    key={question.questionNumber}
                                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-start gap-3 flex-1">
                                            <span className="bg-[#0b6459] text-white font-bold px-3 py-1 rounded-lg text-sm">
                                                {question.questionNumber}
                                            </span>
                                            <p className="text-gray-800 font-medium">{question.question}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 ml-12">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">{t('quiz.stats.questions.correctRate')}</p>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${question.correctRate >= 80
                                                            ? 'bg-green-500'
                                                            : question.correctRate >= 60
                                                                ? 'bg-yellow-500'
                                                                : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${question.correctRate}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-semibold text-gray-800 min-w-[45px]">
                                                    {question.correctRate}%
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">{t('quiz.stats.questions.attempts')}</p>
                                            <p className="text-sm font-semibold text-gray-800">{question.totalAttempts}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">{t('quiz.stats.questions.avgTime')}</p>
                                            <p className="text-sm font-semibold text-gray-800">{question.averageTime} min</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Students Tab */}
            {selectedTab === 'students' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">{t('quiz.stats.students.title')}</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">{t('quiz.stats.students.tableHeaders.student')}</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">{t('quiz.stats.students.tableHeaders.score')}</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">{t('quiz.stats.students.tableHeaders.time')}</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">{t('quiz.stats.students.tableHeaders.date')}</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">{t('quiz.stats.students.tableHeaders.status')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockStudentPerformance.map((student) => (
                                        <tr key={student.studentId} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <p className="font-medium text-gray-800">{student.studentName}</p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${student.score >= 80
                                                    ? 'bg-green-100 text-green-700'
                                                    : student.score >= 60
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {student.score}%
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-600">{student.completionTime} min</td>
                                            <td className="py-3 px-4 text-gray-600 text-sm">{formatDate(student.attemptDate)}</td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${student.status === 'passed'
                                                    ? 'bg-teal-100 text-teal-700'
                                                    : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {student.status === 'passed' ? t('quiz.stats.students.status.passed') : t('quiz.stats.students.status.failed')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizStatsPage;
