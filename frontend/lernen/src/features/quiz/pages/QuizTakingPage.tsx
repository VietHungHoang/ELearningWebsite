import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../dashboard/components/Breadcrumb';

const mockQuizData = {
    title: 'Final Exam: Time Management Mastery',
    timeLimitMinutes: 30,
    questions: Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        text: `Question ${i + 1}: What is the most effective strategy for dealing with procrastination?`,
        options: [
            'Breaking tasks into smaller, manageable steps.',
            'Waiting for a burst of motivation.',
            'Multitasking to feel more productive.',
            'Starting with the least important tasks first.',
        ],
        correctAnswer: 'Breaking tasks into smaller, manageable steps.',
    })),
};

const QuizTakingPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [timeLeft, setTimeLeft] = useState(mockQuizData.timeLimitMinutes * 60);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    handleFinishQuiz();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleAnswerSelect = (option: string) => {
        setAnswers(prev => ({ ...prev, [currentQuestionIndex]: option }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < mockQuizData.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            handleFinishQuiz();
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handlePaletteClick = (index: number) => {
        setCurrentQuestionIndex(index);
    };

    const handleFinishQuiz = () => {
        // Here you would normally submit answers and calculate score
        navigate('/quiz/result');
    };

    const currentQuestion = mockQuizData.questions[currentQuestionIndex];
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="max-w-7xl mx-auto">
            <Breadcrumb
                items={[
                    { label: 'Dashboard', onClick: () => navigate('/dashboard') },
                    { label: 'My Quizzes', onClick: () => navigate('/dashboard/my-quizzes') },
                    { label: mockQuizData.title, isActive: true }
                ]}
                className="mb-6"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm">
                    <h1 className="text-xl font-bold text-gray-800">{mockQuizData.title}</h1>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-4">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span>Question {currentQuestionIndex + 1} of {mockQuizData.questions.length}</span>
                    </div>

                    <div className="mt-8">
                        <p className="text-lg font-semibold text-gray-800">{currentQuestion.text}</p>
                        <div className="mt-6 space-y-4">
                            {currentQuestion.options.map((option, index) => (
                                <label key={index} className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${answers[currentQuestionIndex] === option ? 'bg-green-50 border-green-400' : 'border-gray-200 hover:border-gray-400'}`}>
                                    <input
                                        type="radio"
                                        name={`question-${currentQuestion.id}`}
                                        value={option}
                                        checked={answers[currentQuestionIndex] === option}
                                        onChange={() => handleAnswerSelect(option)}
                                        className="h-5 w-5 text-[#0b6459] focus:ring-[#0b6459] border-gray-300"
                                    />
                                    <span className="text-gray-700">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mt-10 flex justify-between items-center border-t border-gray-100 pt-6">
                        <button
                            onClick={handlePrev}
                            disabled={currentQuestionIndex === 0}
                            className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous Question
                        </button>
                        <button
                            onClick={handleNext}
                            className="px-6 py-2.5 text-sm font-semibold text-white bg-[#0b6459] rounded-lg hover:bg-[#084c43]"
                        >
                            {currentQuestionIndex === mockQuizData.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                        </button>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
                            <p className="font-semibold text-gray-700">Time Remaining</p>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-3xl font-bold text-gray-800">{`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-4">Question Palette</h3>
                            <div className="grid grid-cols-5 gap-3">
                                {mockQuizData.questions.map((_, index) => {
                                    const isCurrent = index === currentQuestionIndex;
                                    const isAnswered = answers[index] !== undefined;
                                    let buttonClass = 'bg-gray-200 text-gray-700 hover:bg-gray-300';
                                    if (isAnswered) {
                                        buttonClass = 'bg-blue-100 text-blue-700 hover:bg-blue-200';
                                    }
                                    if (isCurrent) {
                                        buttonClass = 'bg-[#0b6459] text-white border-2 border-white ring-2 ring-[#0b6459]';
                                    }

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handlePaletteClick(index)}
                                            className={`w-10 h-10 rounded-lg font-semibold flex items-center justify-center transition-all duration-200 ${buttonClass}`}
                                        >
                                            {index + 1}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => setIsConfirmModalOpen(true)}
                                className="mt-6 w-full py-3 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors"
                            >
                                End Quiz
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* End Quiz Confirmation Modal */}
            {isConfirmModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">End Quiz</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to end this quiz? Your progress will be saved.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsConfirmModalOpen(false)}
                                className="flex-1 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFinishQuiz}
                                className="flex-1 py-2.5 text-white bg-red-600 rounded-lg hover:bg-red-700"
                            >
                                End Quiz
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizTakingPage;