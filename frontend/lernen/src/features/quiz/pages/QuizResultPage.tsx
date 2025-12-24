import React from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../dashboard/components/Breadcrumb';

// Mock Data
const quizResult = {
    quizTitle: 'Final Exam: Time Management Mastery',
    courseTitle: 'Time Management Mastery',
    score: 18,
    totalQuestions: 20,
    status: 'Passed',
    dateCompleted: 'October 22, 2025',
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
        },
    ]
};

const QuizResultPage: React.FC = () => {
    const navigate = useNavigate();
    const percentage = Math.round((quizResult.score / quizResult.totalQuestions) * 100);

    const StatCard: React.FC<{ label: string; value: string | number; }> = ({ label, value }) => (
        <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto">
            <Breadcrumb
                items={[
                    { label: 'Dashboard', onClick: () => navigate('/dashboard') },
                    { label: 'My Quizzes', onClick: () => navigate('/dashboard/my-quizzes') },
                    { label: 'Quiz Result', isActive: true }
                ]}
                className="mb-6"
            />

            <div className="mt-6">
                <h1 className="text-3xl font-bold text-gray-800">Quiz Result: {quizResult.quizTitle}</h1>
                <p className="text-gray-600 mt-1">Course: {quizResult.courseTitle}</p>
            </div>

            {/* Summary Section */}
            <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="flex flex-col items-center justify-center text-center">
                         <p className="text-6xl font-bold text-green-600">{percentage}%</p>
                         <p className="text-lg font-semibold text-gray-700 mt-2">Score: {quizResult.score}/{quizResult.totalQuestions}</p>
                         <span className={`mt-2 px-4 py-1.5 text-sm font-bold rounded-full ${quizResult.status === 'Passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {quizResult.status}
                        </span>
                    </div>
                    <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <StatCard label="Date Completed" value={quizResult.dateCompleted} />
                        <StatCard label="Total Questions" value={quizResult.totalQuestions} />
                        <StatCard label="Correct Answers" value={quizResult.score} />
                        <StatCard label="Incorrect Answers" value={quizResult.totalQuestions - quizResult.score} />
                    </div>
                </div>
            </div>

            {/* Question Review Section */}
            <div className="mt-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Review Answers</h2>
                <div className="space-y-6">
                    {quizResult.questions.map((q, index) => (
                        <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm">
                            <p className="font-semibold text-gray-800">{index + 1}. {q.text}</p>
                            <div className="mt-4 space-y-3">
                                {q.options.map((option, optionIndex) => {
                                    const isCorrect = option === q.correctAnswer;
                                    const isUserAnswer = option === q.userAnswer;
                                    const isIncorrectUserAnswer = isUserAnswer && !isCorrect;

                                    let optionClass = 'border-gray-200';
                                    if (isCorrect) {
                                        optionClass = 'bg-green-50 border-green-400 text-green-800';
                                    }
                                    if (isIncorrectUserAnswer) {
                                        optionClass = 'bg-red-50 border-red-400 text-red-800';
                                    }

                                    return (
                                        <div key={optionIndex} className={`flex items-center gap-3 p-3 border rounded-lg text-sm ${optionClass}`}>
                                            {isCorrect && (
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                            {isIncorrectUserAnswer && (
                                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            )}
                                            {!isCorrect && !isIncorrectUserAnswer && (
                                                <div className={`w-5 h-5 flex-shrink-0 rounded-full border-2 ${isUserAnswer ? 'border-gray-700' : 'border-gray-300'}`}></div>
                                            )}
                                            <span className="flex-1">{option}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                <button className="w-full sm:w-auto px-8 py-3 bg-[#0b6459] text-white font-semibold rounded-lg hover:bg-[#084c43] transition-colors">
                    Retake Quiz
                </button>
                <button onClick={() => navigate('/dashboard/my-quizzes')} className="w-full sm:w-auto px-8 py-3 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                    Back to My Quizzes
                </button>
            </div>
        </div>
    );
};

export default QuizResultPage;