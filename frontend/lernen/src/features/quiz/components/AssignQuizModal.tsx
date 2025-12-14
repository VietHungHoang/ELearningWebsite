import React, { useState, useEffect } from 'react';

interface AssignQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (quizTitle: string) => void;
}

const MOCK_QUIZZES = [
    'Mid-term Review Quiz',
    'Chapter 5: Derivatives',
    'Week 3 Assessment',
    'Practice Quiz: Integration'
];

const AssignQuizModal: React.FC<AssignQuizModalProps> = ({ isOpen, onClose, onAssign }) => {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [selectedQuiz, setSelectedQuiz] = useState<string>('');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setSelectedQuiz('');
            setDueDate('');
        } else {
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleAssign = () => {
        if (selectedQuiz && dueDate) {
            onAssign(selectedQuiz);
        } else {
            alert('Please select a quiz and a due date.');
        }
    };

    if (!shouldRender) return null;

    return (
        <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'bg-black/30 opacity-100' : 'opacity-0'}`} onClick={onClose}>
            <div className={`bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-lg font-bold text-gray-800">Assign Quiz</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Quiz</label>
                        <select
                            value={selectedQuiz}
                            onChange={(e) => setSelectedQuiz(e.target.value)}
                            className="w-full bg-gray-100 border border-transparent rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0b6459]"
                        >
                            <option value="">Choose a quiz...</option>
                            {MOCK_QUIZZES.map(quiz => (
                                <option key={quiz} value={quiz}>{quiz}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full bg-gray-100 border border-transparent rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0b6459]"
                        />
                    </div>
                </div>

                <div className="flex justify-end items-center gap-3 mt-8">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                    <button
                        onClick={handleAssign}
                        disabled={!selectedQuiz || !dueDate}
                        className="px-5 py-2.5 text-sm font-semibold bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Assign
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignQuizModal;