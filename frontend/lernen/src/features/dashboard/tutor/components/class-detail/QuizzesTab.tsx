import React from 'react';
import { FiFileText, FiPlus } from 'react-icons/fi';
import type { ClassData } from '../../pages/MyClassPage';

interface QuizzesTabProps {
    classData: ClassData;
    onAssignQuiz: () => void;
    onViewQuizResult: (quizId: number) => void;
}

const QuizzesTab: React.FC<QuizzesTabProps> = ({ classData, onAssignQuiz, onViewQuizResult }) => {
    return (
        <div className="bg-gray-50 rounded-xl overflow-hidden">
             <div className="p-5 border-b border-gray-200 bg-white flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Assignments & Quizzes</h3>
                <button
                    onClick={onAssignQuiz}
                    className="flex items-center gap-2 text-sm font-semibold bg-[#0b6459] text-white px-4 py-2 rounded-lg hover:bg-[#084c43] transition-colors"
                >
                    <FiPlus /> Assign Quiz
                </button>
            </div>
            <div className="divide-y divide-gray-200">
                {classData.quizzes.length > 0 ? classData.quizzes.map(quiz => (
                    <div key={quiz.id} className="p-5 hover:bg-gray-100 transition-colors bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border ${
                                    quiz.status === 'Completed' ? 'bg-green-50 border-green-200 text-green-600' : 'bg-yellow-50 border-yellow-200 text-yellow-600'
                                }`}>
                                    <FiFileText />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 truncate">{quiz.title}</p>
                                    <p className="text-xs text-gray-500">Due: Nov 20, 2025</p>
                                </div>
                            </div>

                            <div className="hidden md:block">
                                 <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                    quiz.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {quiz.status}
                                </span>
                            </div>

                            <div className="hidden md:block text-sm text-gray-500">
                                {quiz.status === 'Completed' ? `${classData.students.length}/${classData.students.length}` : `0/${classData.students.length}`} Submitted
                            </div>

                            <div className="text-right">
                                {quiz.status === 'Completed' ? (
                                    <button
                                        onClick={() => onViewQuizResult(quiz.id)}
                                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        View Results
                                    </button>
                                ) : (
                                    <button disabled className="px-4 py-2 bg-gray-100 text-gray-400 text-sm font-semibold rounded-lg cursor-not-allowed">
                                        Pending
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="p-12 text-center bg-white">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400 mb-4">
                            <FiFileText />
                        </div>
                        <h4 className="text-gray-800 font-bold">No quizzes assigned</h4>
                        <p className="text-gray-500 text-sm mt-1">Assign a quiz to track student progress.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizzesTab;