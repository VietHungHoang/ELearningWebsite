import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    HiClock,
    HiCheckCircle,
    HiChevronLeft,
    HiChevronRight,
    HiFlag,
    HiX
} from 'react-icons/hi';

// Mock quiz data structure based on CreateQuizPage
interface QuizQuestion {
    id: string;
    question: string;
    multipleChoiceOptions: string[];
    isMultipleSelection: boolean;
    correctOptions: number[]; // Indices of correct answers
}

interface Quiz {
    id: string;
    title: string;
    description: string;
    timeLimitMinutes: number;
    questions: QuizQuestion[];
}

// Mock data
const mockQuiz: Quiz = {
    id: '1',
    title: 'Chapter 1 - Introduction to Physics',
    description: 'Test your knowledge on basic physics concepts including motion, force, and energy.',
    timeLimitMinutes: 30,
    questions: [
        {
            id: 'q1',
            question: 'What is the SI unit of force?',
            multipleChoiceOptions: ['Joule', 'Newton', 'Watt', 'Pascal'],
            isMultipleSelection: false,
            correctOptions: [1]
        },
        {
            id: 'q2',
            question: 'Which of the following are forms of energy? (Select all that apply)',
            multipleChoiceOptions: ['Kinetic', 'Thermal', 'Chemical', 'All of the above'],
            isMultipleSelection: true,
            correctOptions: [0, 1, 2]
        },
        {
            id: 'q3',
            question: 'What is Newton\'s First Law of Motion?',
            multipleChoiceOptions: [
                'Force equals mass times acceleration',
                'An object at rest stays at rest unless acted upon by a force',
                'For every action, there is an equal and opposite reaction',
                'Energy cannot be created or destroyed'
            ],
            isMultipleSelection: false,
            correctOptions: [1]
        }
    ]
};

const QuizTakingPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Map<string, number[]>>(new Map());
    const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
    const [timeRemaining, setTimeRemaining] = useState(mockQuiz.timeLimitMinutes * 60); // in seconds
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);

    const currentQuestion = mockQuiz.questions[currentQuestionIndex];
    const currentAnswers = selectedAnswers.get(currentQuestion.id) || [];

    // Timer countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerSelect = (optionIndex: number) => {
        const newAnswers = new Map(selectedAnswers);
        const current = currentAnswers;

        if (currentQuestion.isMultipleSelection) {
            // Toggle for multiple selection
            const isSelected = current.includes(optionIndex);
            const updated = isSelected
                ? current.filter(idx => idx !== optionIndex)
                : [...current, optionIndex];
            newAnswers.set(currentQuestion.id, updated);
        } else {
            // Single selection
            newAnswers.set(currentQuestion.id, [optionIndex]);
        }

        setSelectedAnswers(newAnswers);
    };

    const toggleFlag = () => {
        const newFlagged = new Set(flaggedQuestions);
        if (newFlagged.has(currentQuestion.id)) {
            newFlagged.delete(currentQuestion.id);
        } else {
            newFlagged.add(currentQuestion.id);
        }
        setFlaggedQuestions(newFlagged);
    };

    const goToQuestion = (index: number) => {
        setCurrentQuestionIndex(index);
    };

    const goToPrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const goToNext = () => {
        if (currentQuestionIndex < mockQuiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const getAnsweredCount = () => {
        return selectedAnswers.size;
    };

    const handleSubmit = () => {
        setShowSubmitModal(true);
    };

    const confirmSubmit = () => {
        // TODO: Submit quiz and navigate to results
        console.log('Submitting quiz...', {
            quizId: mockQuiz.id,
            answers: Object.fromEntries(selectedAnswers),
            flaggedQuestions: Array.from(flaggedQuestions)
        });
        navigate('/quiz/result', {
            state: {
                quizId: mockQuiz.id,
                answers: Object.fromEntries(selectedAnswers)
            }
        });
    };

    const handleAutoSubmit = () => {
        confirmSubmit();
    };

    const handleExit = () => {
        setShowExitModal(true);
    };

    const confirmExit = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Quiz Title */}
                        <div className="flex-1">
                            <h1 className="text-lg font-bold text-gray-800">{mockQuiz.title}</h1>
                            <p className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {mockQuiz.questions.length}</p>
                        </div>

                        {/* Timer */}
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${timeRemaining < 300 ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                            }`}>
                            <HiClock className="w-5 h-5" />
                            <span>{formatTime(timeRemaining)}</span>
                        </div>

                        {/* Exit Button */}
                        <button
                            onClick={handleExit}
                            className="ml-4 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Exit quiz"
                        >
                            <HiX className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-[#0b6459] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${((currentQuestionIndex + 1) / mockQuiz.questions.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Question Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                            {/* Question Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-start gap-4 flex-1">
                                    <span className="bg-[#0b6459] text-white font-bold px-4 py-2 rounded-lg text-lg">
                                        {currentQuestionIndex + 1}
                                    </span>
                                    <div className="flex-1">
                                        <p className="text-lg font-semibold text-gray-800 leading-relaxed">
                                            {currentQuestion.question}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            {currentQuestion.isMultipleSelection
                                                ? 'Select all that apply'
                                                : 'Select one answer'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleFlag}
                                    className={`p-2 rounded-lg transition-colors ${flaggedQuestions.has(currentQuestion.id)
                                        ? 'bg-yellow-100 text-yellow-600'
                                        : 'text-gray-400 hover:bg-gray-100'
                                        }`}
                                    title="Flag for review"
                                >
                                    <HiFlag className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Answer Options */}
                            <div className="space-y-3">
                                {currentQuestion.multipleChoiceOptions.map((option, index) => {
                                    const isSelected = currentAnswers.includes(index);
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleAnswerSelect(index)}
                                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${isSelected
                                                ? 'border-[#0b6459] bg-teal-50'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`font-bold px-3 py-1 rounded text-sm ${isSelected
                                                    ? 'bg-[#0b6459] text-white'
                                                    : 'bg-gray-200 text-gray-700'
                                                    } ${currentQuestion.isMultipleSelection ? 'rounded' : 'rounded-full'}`}>
                                                    {String.fromCharCode(65 + index)}
                                                </span>
                                                <span className={`flex-1 ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                                                    {option}
                                                </span>
                                                {isSelected && (
                                                    <HiCheckCircle className="w-5 h-5 text-[#0b6459]" />
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                                <button
                                    onClick={goToPrevious}
                                    disabled={currentQuestionIndex === 0}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${currentQuestionIndex === 0
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <HiChevronLeft className="w-5 h-5" />
                                    Previous
                                </button>

                                {currentQuestionIndex === mockQuiz.questions.length - 1 ? (
                                    <button
                                        onClick={handleSubmit}
                                        className="flex items-center gap-2 px-6 py-2 bg-[#0b6459] text-white rounded-lg font-semibold hover:bg-[#094d44] transition-colors shadow-sm"
                                    >
                                        <HiCheckCircle className="w-5 h-5" />
                                        Submit Quiz
                                    </button>
                                ) : (
                                    <button
                                        onClick={goToNext}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        Next
                                        <HiChevronRight className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Question Navigator Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sticky top-24">
                            <h3 className="font-bold text-gray-800 mb-3">Questions</h3>
                            <div className="grid grid-cols-4 lg:grid-cols-3 gap-2">
                                {mockQuiz.questions.map((q, index) => {
                                    const isAnswered = selectedAnswers.has(q.id);
                                    const isFlagged = flaggedQuestions.has(q.id);
                                    const isCurrent = index === currentQuestionIndex;

                                    return (
                                        <button
                                            key={q.id}
                                            onClick={() => goToQuestion(index)}
                                            className={`relative aspect-square rounded-lg font-semibold text-sm transition-all ${isCurrent
                                                ? 'bg-[#0b6459] text-white'
                                                : isAnswered
                                                    ? 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {index + 1}
                                            {isFlagged && (
                                                <span className="absolute -top-1 -right-1">
                                                    <HiFlag className="w-3 h-3 text-yellow-500" />
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                                <div className="flex justify-between mb-1">
                                    <span>Answered:</span>
                                    <span className="font-semibold">{getAnsweredCount()}/{mockQuiz.questions.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Flagged:</span>
                                    <span className="font-semibold">{flaggedQuestions.size}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Confirmation Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Submit Quiz?</h3>
                        <p className="text-gray-600 mb-6">
                            You have answered {getAnsweredCount()} out of {mockQuiz.questions.length} questions.
                            {getAnsweredCount() < mockQuiz.questions.length && ' Some questions are unanswered.'}
                            {flaggedQuestions.size > 0 && ` You have ${flaggedQuestions.size} flagged question(s).`}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSubmitModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                            >
                                Review
                            </button>
                            <button
                                onClick={confirmSubmit}
                                className="flex-1 px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#094d44] font-semibold"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Exit Confirmation Modal */}
            {showExitModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Exit Quiz?</h3>
                        <p className="text-gray-600 mb-6">
                            Your progress will not be saved. Are you sure you want to exit?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowExitModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmExit}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                            >
                                Exit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizTakingPage;