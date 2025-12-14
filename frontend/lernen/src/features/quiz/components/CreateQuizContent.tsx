import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Question {
    id: number;
    text: string;
    options: { id: number, text: string }[];
    correctOptionId: number | null;
}

const CreateQuizContent: React.FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [timeLimit, setTimeLimit] = useState<number | ''>('');
    const [questions, setQuestions] = useState<Question[]>([]);

    const mockCourses = ['Time Management Mastery', 'Decision-Making Mastery', "Beginner's Guide to Python"];

    const handleAddQuestion = () => {
        const now = Date.now();
        const newQuestion: Question = {
            id: now,
            text: '',
            options: [
                { id: now + 1, text: '' },
                { id: now + 2, text: '' },
                { id: now + 3, text: '' },
                { id: now + 4, text: '' },
            ],
            correctOptionId: null,
        };
        setQuestions(prev => [...prev, newQuestion]);
    };

    const handleQuestionChange = (qId: number, newText: string) => {
        setQuestions(prev => prev.map(q => q.id === qId ? { ...q, text: newText } : q));
    };

    const handleOptionChange = (qId: number, oId: number, newText: string) => {
        setQuestions(prev => prev.map(q => q.id === qId ? { ...q, options: q.options.map(o => o.id === oId ? {...o, text: newText} : o) } : q));
    };

    const handleSetCorrectOption = (qId: number, oId: number) => {
        setQuestions(prev => prev.map(q => q.id === qId ? { ...q, correctOptionId: oId } : q));
    };

    const handleDeleteQuestion = (qId: number) => {
        setQuestions(prev => prev.filter(q => q.id !== qId));
    };

    const handleAddOption = (qId: number) => {
        setQuestions(prev => prev.map(q => {
            if (q.id === qId) {
                return { ...q, options: [...q.options, { id: Date.now(), text: '' }] };
            }
            return q;
        }));
    };

    const handleDeleteOption = (qId: number, oId: number) => {
        setQuestions(prev => prev.map(q => {
            if (q.id === qId) {
                const newOptions = q.options.filter(o => o.id !== oId);
                const newCorrectOptionId = q.correctOptionId === oId ? null : q.correctOptionId;
                return { ...q, options: newOptions, correctOptionId: newCorrectOptionId };
            }
            return q;
        }));
    };

    const inputStyles = "w-full bg-gray-100 border border-transparent rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-0 focus:border-[#0b6459] transition";

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/dashboard/quizzes')} className="p-2 bg-white rounded-md shadow-sm border border-gray-200 hover:bg-gray-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Create New Quiz</h1>
                    <p className="text-gray-600 mt-1">Build a quiz by adding questions and setting a time limit.</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm space-y-6">
                {/* Basic Info */}
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Basic Information</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Final Exam" className={inputStyles} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link to Course</label>
                                <select
                                    value={selectedCourse}
                                    onChange={e => setSelectedCourse(e.target.value)}
                                    className={inputStyles}
                                >
                                    <option value="">Select a course</option>
                                    {mockCourses.map(course => (
                                        <option key={course} value={course}>{course}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
                                <input type="number" value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))} placeholder="e.g., 30" className={inputStyles} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Questions Builder */}
                <div className="border-t border-gray-100 pt-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Questions</h2>
                    <div className="space-y-6">
                        {questions.map((q, qIndex) => (
                            <div
                                key={q.id}
                                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-gray-400 pt-2 text-sm font-bold">{qIndex + 1}.</span>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <textarea
                                                value={q.text}
                                                onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                                                placeholder={`Question ${qIndex + 1}`}
                                                className={`${inputStyles} font-semibold`}
                                                rows={2}
                                            />
                                            <button onClick={() => handleDeleteQuestion(q.id)} className="ml-2 p-2 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="mt-3 space-y-2">
                                            {q.options.map(o => (
                                                <div key={o.id} className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name={`correct-answer-${q.id}`}
                                                        checked={q.correctOptionId === o.id}
                                                        onChange={() => handleSetCorrectOption(q.id, o.id)}
                                                        className="h-4 w-4 text-[#0b6459] focus:ring-[#0b6459] border-gray-300"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={o.text}
                                                        onChange={(e) => handleOptionChange(q.id, o.id, e.target.value)}
                                                        placeholder="Option text"
                                                        className={inputStyles}
                                                    />
                                                     <button onClick={() => handleDeleteOption(q.id, o.id)} className="p-1 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                         <button onClick={() => handleAddOption(q.id)} className="mt-3 text-sm font-semibold text-[#0b6459] hover:text-[#084c43] flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Add Option
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleAddQuestion} className="mt-6 flex items-center gap-2 text-sm font-semibold text-white bg-[#0b6459] px-4 py-2.5 rounded-lg hover:bg-[#084c43] transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Question
                    </button>
                </div>
            </div>

             <div className="mt-8 flex justify-end items-center gap-4">
                <button onClick={() => navigate('/dashboard/quizzes')} className="bg-gray-100 text-gray-700 font-semibold py-2.5 px-5 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                    Cancel
                </button>
                <button className="bg-gray-200 text-gray-800 font-semibold py-2.5 px-5 rounded-lg text-sm hover:bg-gray-300 transition-colors">
                    Save as Draft
                </button>
                <button onClick={() => navigate('/dashboard/quizzes')} className="bg-[#0b6459] text-white font-semibold py-2.5 px-5 rounded-lg text-sm hover:bg-[#084c43] transition-colors">
                    Save & Publish
                </button>
            </div>
        </div>
    );
};

export default CreateQuizContent;