import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiPlus, HiSave, HiCheckCircle, HiArrowLeft } from 'react-icons/hi';
import QuizCard from './QuizCard';
import CustomDropdown2 from '../../../../components/ui/CustomDropdown2';
import ConfirmModal from '../../../../components/ui/ConfirmModal';

interface QuizQuestion {
    id: string;
    question: string;
    multipleChoiceOptions?: string[];
    isMultipleSelection: boolean;
    selectedOptions: number[];
}

const CreateQuizPage: React.FC = () => {
    const navigate = useNavigate();
    const [quizTitle, setQuizTitle] = useState('');
    const [quizDescription, setQuizDescription] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [showConfirmBack, setShowConfirmBack] = useState(false);
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
    const lastQuestionRef = useRef<HTMLDivElement>(null);

    const [questions, setQuestions] = useState<QuizQuestion[]>([
        {
            id: '1',
            question: '',
            multipleChoiceOptions: ['', '', '', ''],
            isMultipleSelection: false,
            selectedOptions: []
        }
    ]);

    useEffect(() => {
        if (shouldScrollToBottom && lastQuestionRef.current) {
            lastQuestionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setShouldScrollToBottom(false); // Reset after scrolling
        }
    }, [shouldScrollToBottom]);

    const addNewCard = () => {
        const newQuestion: QuizQuestion = {
            id: Date.now().toString(),
            question: '',
            multipleChoiceOptions: ['', '', '', ''],
            isMultipleSelection: false,
            selectedOptions: []
        };
        setQuestions([...questions, newQuestion]);
        setShouldScrollToBottom(true);
    };

    const deleteCard = (id: string) => {
        if (questions.length > 1) {
            setQuestions(questions.filter(q => q.id !== id));
        }
    };

    const updateQuestion = (id: string, field: keyof QuizQuestion, value: any) => {
        setQuestions(questions.map(q =>
            q.id === id ? { ...q, [field]: value } : q
        ));
    };

    const handleToggleMultipleSelection = (id: string) => {
        setQuestions(questions.map(q =>
            q.id === id ? { ...q, isMultipleSelection: !q.isMultipleSelection } : q
        ));
    };

    const handleOptionSelect = (questionId: string, optionIndex: number) => {
        setQuestions(prevQuestions =>
            prevQuestions.map(q => {
                if (q.id === questionId) {
                    const isSelected = q.selectedOptions.includes(optionIndex);
                    let newSelectedOptions: number[];

                    if (q.isMultipleSelection) {
                        // Multiple selection: toggle the option
                        newSelectedOptions = isSelected
                            ? q.selectedOptions.filter(idx => idx !== optionIndex)
                            : [...q.selectedOptions, optionIndex];
                    } else {
                        // Single selection: select only this option
                        newSelectedOptions = isSelected ? [] : [optionIndex];
                    }

                    return { ...q, selectedOptions: newSelectedOptions };
                }
                return q;
            })
        );
    };

    const handleSaveDraft = () => {
        // TODO: Implement save draft logic
        console.log('Saving draft...', { quizTitle, quizDescription, selectedClass, questions });
    };

    const handlePublish = () => {
        // TODO: Implement publish logic
        console.log('Publishing quiz...', { quizTitle, quizDescription, selectedClass, questions });
    };

    // Check if any form data has been entered
    const hasFormData = () => {
        return (
            quizTitle.trim() !== '' ||
            quizDescription.trim() !== '' ||
            selectedClass !== '' ||
            questions.some(q =>
                q.question.trim() !== '' ||
                (q.multipleChoiceOptions && q.multipleChoiceOptions.some(option => option.trim() !== '')) ||
                q.selectedOptions.length > 0
            )
        );
    };

    const handleBackClick = () => {
        if (hasFormData()) {
            setShowConfirmBack(true);
        } else {
            navigate('/dashboard/quizzes');
        }
    };

    const confirmBack = () => {
        setShowConfirmBack(false);
        navigate('/dashboard/quizzes');
    };

    const cancelBack = () => {
        setShowConfirmBack(false);
    };

    return (
        <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBackClick}
                        className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <HiArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Create New Quiz</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSaveDraft}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                    >
                        <HiSave className="w-4 h-4" />
                        Save Draft
                    </button>
                    <button
                        onClick={handlePublish}
                        className="flex items-center gap-2 px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#094d44] transition-colors font-medium text-sm shadow-sm"
                    >
                        <HiCheckCircle className="w-4 h-4" />
                        Publish Quiz
                    </button>
                </div>
            </div>

            {/* Quiz Metadata */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Quiz Information</h2>

                <div className="space-y-4">
                    {/* Quiz Title and Class Selection Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Quiz Title */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quiz Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={quizTitle}
                                onChange={(e) => setQuizTitle(e.target.value)}
                                placeholder="e.g., Chapter 1 - Introduction to Physics"
                                className="w-full px-3 py-2 bg-[#f7f7f8] border border-transparent rounded-lg focus:outline-none focus:border-[#0b6459] focus:bg-white hover:border-gray-300 hover:bg-white transition-all duration-300 ease-in-out placeholder:text-gray-300"
                            />
                        </div>

                        {/* Class Selection */}
                        <div>
                            <CustomDropdown2
                                label={<>Assign to Class <span className="text-red-500">*</span></>}
                                options={["Physics 101", "Advanced Mathematics", "Chemistry Basics"]}
                                selectedValue={selectedClass}
                                placeholder="Select a class..."
                                onSelect={(value: string) => setSelectedClass(value)}
                                dropdownId="class-dropdown"
                                openDropdown={openDropdown}
                                setOpenDropdown={setOpenDropdown}
                                hasSearch={true}
                                searchPlaceholder="Search classes..."
                            />
                        </div>
                    </div>

                    {/* Quiz Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={quizDescription}
                            onChange={(e) => setQuizDescription(e.target.value)}
                            placeholder="Brief description of the quiz content and objectives..."
                            className="w-full px-3 py-2 bg-[#f7f7f8] border border-transparent rounded-lg focus:outline-none focus:border-[#0b6459] focus:bg-white hover:border-gray-300 hover:bg-white transition-all duration-300 ease-in-out resize-none placeholder:text-gray-300"
                            rows={3}
                        />
                    </div>
                </div>
            </div>

            {/* Questions Section */}
            <div className="mb-6">
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                        Questions ({questions.length})
                    </h2>
                </div>

                {/* Quiz Cards */}
                <div className="space-y-4">
                    {questions.map((q, index) => (
                        <div key={q.id} ref={index === questions.length - 1 ? lastQuestionRef : null}>
                            <QuizCard
                                cardNumber={index + 1}
                                question={q.question}
                                multipleChoiceOptions={q.multipleChoiceOptions}
                                onQuestionChange={(value) => updateQuestion(q.id, 'question', value)}
                                onMultipleChoiceChange={(options) =>
                                    updateQuestion(q.id, 'multipleChoiceOptions', options)
                                }
                                isMultipleSelection={q.isMultipleSelection}
                                onToggleMultipleSelection={() => handleToggleMultipleSelection(q.id)}
                                onDelete={() => deleteCard(q.id)}
                                selectedOptions={q.selectedOptions}
                                onOptionSelect={(optionIndex) => handleOptionSelect(q.id, optionIndex)}
                            />
                        </div>
                    ))}
                </div>

                {/* Add Question Button */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={addNewCard}
                        className="flex items-center gap-2 bg-[#0b6459] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#094d44] transition-colors shadow-sm"
                    >
                        <HiPlus className="w-5 h-5" />
                        Add Question
                    </button>
                </div>
            </div>

            <ConfirmModal
                isOpen={showConfirmBack}
                title="Discard Changes?"
                message="You have unsaved changes. Are you sure you want to leave without saving?"
                confirmText="Leave"
                onConfirm={confirmBack}
                onCancel={cancelBack}
                confirmButtonColor="red"
            />
        </div>
    );
};

export default CreateQuizPage;
