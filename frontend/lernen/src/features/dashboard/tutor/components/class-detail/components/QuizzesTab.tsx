import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFileText, FiPlus, FiEye, FiTrash2 } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../../../context/AuthContext';

interface QuizzesTabProps {
    onViewQuizResult: (quizId: number) => void;
}

const QuizzesTab: React.FC<QuizzesTabProps> = ({ onViewQuizResult }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { state } = useAuth();
    const isStudent = state.user?.role === 'student';

    // Mock data for testing
    const mockQuizzes = [
        {
            id: 1,
            title: 'Mathematics Fundamentals Quiz',
            status: 'Completed',
            createdAt: 'Dec 15, 2025',
            submittedCount: 25,
            totalStudents: 30,
            questions: 15,
            timeLimit: 45,
            averageScore: 87
        },
        {
            id: 2,
            title: 'Physics Chapter 3 Assessment',
            status: 'Completed',
            createdAt: 'Dec 10, 2025',
            submittedCount: 28,
            totalStudents: 30,
            questions: 20,
            timeLimit: 60,
            averageScore: 82
        },
        {
            id: 3,
            title: 'Chemistry Lab Safety Quiz',
            status: 'Pending',
            createdAt: 'Dec 20, 2025',
            submittedCount: 0,
            totalStudents: 30,
            questions: 12,
            timeLimit: 30,
            averageScore: null
        },
        {
            id: 4,
            title: 'English Literature Analysis',
            status: 'Pending',
            createdAt: 'Dec 18, 2025',
            submittedCount: 0,
            totalStudents: 30,
            questions: 18,
            timeLimit: 50,
            averageScore: null
        },
        {
            id: 5,
            title: 'History World War II Review',
            status: 'Completed',
            createdAt: 'Dec 12, 2025',
            submittedCount: 22,
            totalStudents: 30,
            questions: 25,
            timeLimit: 75,
            averageScore: 91
        }
    ];

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {t(`dashboard.tutor.myClass.detail.quizzesTab.${isStudent ? 'student' : 'tutor'}.title`, { count: mockQuizzes.length })}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        {t(`dashboard.tutor.myClass.detail.quizzesTab.${isStudent ? 'student' : 'tutor'}.description`)}
                    </p>
                </div>
                {!isStudent && (
                    <button
                        onClick={() => navigate('/dashboard/quizzes/create')}
                        className="flex items-center gap-2 px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#094d44] transition-colors text-sm font-semibold"
                    >
                        <FiPlus className="w-4 h-4" />
                        {t('dashboard.tutor.myClass.detail.quizzesTab.tutor.newQuiz')}
                    </button>
                )}
            </div>

            {/* Quizzes List */}
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                {mockQuizzes.map((quiz) => (
                    <div key={quiz.id} className="p-5 hover:bg-gray-50 transition-colors bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-4 items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border bg-indigo-50 border-indigo-200 text-indigo-600">
                                    <FiFileText />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 truncate">{quiz.title}</p>
                                    <p className="text-xs text-gray-500">
                                        {t('dashboard.tutor.myClass.detail.quizzesTab.questions', { count: quiz.questions })} • {t('dashboard.tutor.myClass.detail.quizzesTab.timeLimit', { count: quiz.timeLimit })} • {t('dashboard.tutor.myClass.detail.quizzesTab.createdAt', { date: quiz.createdAt })}
                                    </p>
                                </div>
                            </div>

                            <div className="hidden md:block text-sm text-gray-500">
                                {t('dashboard.tutor.myClass.detail.quizzesTab.submitted', { submittedCount: quiz.submittedCount, totalStudents: quiz.totalStudents })}
                            </div>

                            <div className="flex items-center gap-2 justify-end">
                                <button
                                    onClick={() => onViewQuizResult(quiz.id)}
                                    className="p-2 text-gray-500 hover:text-[#0b6459] hover:bg-gray-100 rounded-lg transition-colors"
                                    title={t('dashboard.tutor.myClass.detail.quizzesTab.viewResults')}
                                >
                                    <FiEye />
                                </button>
                                {!isStudent && (
                                    <button
                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title={t('dashboard.tutor.myClass.detail.quizzesTab.deleteQuiz')}
                                    >
                                        <FiTrash2 />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Simple Empty State */}
            {mockQuizzes.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-gray-900 font-medium mb-2">{t(`dashboard.tutor.myClass.detail.quizzesTab.${isStudent ? 'student' : 'tutor'}.noQuizzes`)}</h4>
                    <p className="text-gray-600 text-sm">{t(`dashboard.tutor.myClass.detail.quizzesTab.${isStudent ? 'student' : 'tutor'}.noQuizzesDescription`)}</p>
                </div>
            )}
        </div>
    );
};

export default QuizzesTab;