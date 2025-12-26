import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface Quiz {
    id: number;
    title: string;
    courseTitle: string;
    tutor: { name: string; avatar: string };
    totalQuestions: number;
    timeLimitMinutes: number;
    status: 'not_started' | 'in_progress' | 'completed';
    questionsAnswered?: number; // for in_progress
    score?: number; // for completed
}

interface QuizCardProps {
    quiz: Quiz;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
    const navigate = useNavigate();

    const progress = (quiz.status === 'in_progress' && quiz.questionsAnswered)
        ? Math.round((quiz.questionsAnswered / quiz.totalQuestions) * 100)
        : (quiz.status === 'completed' ? 100 : 0);

    const getStatusInfo = () => {
        switch (quiz.status) {
            case 'completed':
                return (
                    <div className="text-center">
                        <p className="text-xs text-gray-500">Score</p>
                        <p className="text-lg font-bold text-green-600">{quiz.score}/{quiz.totalQuestions} Correct</p>
                        <button onClick={() => navigate('/dashboard/my-quizzes/result')} className="mt-3 w-full text-sm font-semibold text-white bg-[#0b6459] rounded-lg px-5 py-2.5 hover:bg-[#084c43] transition-colors">
                            View Result
                        </button>
                    </div>
                );
            case 'in_progress':
                return (
                    <div>
                        <div className="flex justify-between items-center text-xs font-medium text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{progress}% Complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-[#0b6459] h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                        <button onClick={() => navigate('/dashboard/my-quizzes/take')} className="mt-3 w-full text-sm font-semibold text-white bg-[#0b6459] rounded-lg px-5 py-2.5 hover:bg-[#084c43] transition-colors">
                            Continue Quiz
                        </button>
                    </div>
                );
            case 'not_started':
            default:
                return (
                     <button onClick={() => navigate('/dashboard/my-quizzes/take')} className="w-full text-sm font-semibold text-white bg-[#0b6459] rounded-lg px-5 py-2.5 hover:bg-[#084c43] transition-colors">
                        Start Quiz
                    </button>
                );
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col h-full">
            <div className="flex items-center gap-3">
                <img src={quiz.tutor.avatar} alt={quiz.tutor.name} className="w-10 h-10 rounded-full" />
                <div>
                    <p className="text-sm font-semibold text-gray-800">{quiz.tutor.name}</p>
                    <p className="text-xs text-gray-500">{quiz.courseTitle}</p>
                </div>
            </div>

            <h3 className="font-bold text-gray-800 my-4 flex-grow line-clamp-2">
                {quiz.title}
            </h3>

            <div className="flex items-center justify-between text-sm text-gray-600 border-y border-gray-100 py-3 mb-4">
                <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {quiz.totalQuestions} Questions
                </span>
                <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {quiz.timeLimitMinutes} Mins
                </span>
            </div>

            <div className="mt-auto">
                {getStatusInfo()}
            </div>
        </div>
    );
};

export default QuizCard;