import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiPlus, HiSave, HiCheckCircle, HiArrowLeft } from 'react-icons/hi';
import QuizCard from './QuizCard';
import CustomDropdown2 from '../../../../components/ui/CustomDropdown2';
import ConfirmModal from '../../../../components/ui/ConfirmModal';
import { useTranslation } from 'react-i18next';

interface QuizQuestion {
    id: string;
    question: string;
    multipleChoiceOptions?: string[];
    isMultipleSelection: boolean;
    selectedOptions: number[];
}

const CreateQuizPage: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [quizTitle, setQuizTitle] = useState('');
    const [quizDescription, setQuizDescription] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [showConfirmBack, setShowConfirmBack] = useState(false);
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
    const lastQuestionRef = useRef<HTMLDivElement>(null);
    
    // Quiz settings
    const [dueDate, setDueDate] = useState<string>('');
    const [timeLimit, setTimeLimit] = useState<number>(60); // in minutes
    const [passingScore, setPassingScore] = useState<number>(70); // percentage
    const [shuffleQuestions, setShuffleQuestions] = useState(false);
    const [showCorrectAnswers, setShowCorrectAnswers] = useState(true);
    const [maxAttempts, setMaxAttempts] = useState<number>(3);
    const [isUnlimitedAttempts, setIsUnlimitedAttempts] = useState(false);

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
        console.log('Saving draft...', { 
            quizTitle, 
            quizDescription, 
            selectedClass,
            dueDate,
            questions,
            settings: {
                timeLimit,
                passingScore,
                shuffleQuestions,
                showCorrectAnswers,
                maxAttempts: isUnlimitedAttempts ? -1 : maxAttempts,
                isUnlimitedAttempts
            }
        });
    };

    const handlePublish = () => {
        // TODO: Implement publish logic
        console.log('Publishing quiz...', { 
            quizTitle, 
            quizDescription, 
            selectedClass,
            dueDate,
            questions,
            settings: {
                timeLimit,
                passingScore,
                shuffleQuestions,
                showCorrectAnswers,
                maxAttempts: isUnlimitedAttempts ? -1 : maxAttempts,
                isUnlimitedAttempts
            }
        });
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
                    <h1 className="text-xl font-bold text-gray-800">{t('quiz.create.title')}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSaveDraft}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                    >
                        <HiSave className="w-4 h-4" />
                        {t('quiz.create.saveDraft')}
                    </button>
                    <button
                        onClick={handlePublish}
                        className="flex items-center gap-2 px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#094d44] transition-colors font-medium text-sm shadow-sm"
                    >
                        <HiCheckCircle className="w-4 h-4" />
                        {t('quiz.create.publish')}
                    </button>
                </div>
            </div>

            {/* Quiz Metadata */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{t('quiz.create.infoTitle')}</h2>

                <div className="space-y-4">
                    {/* Quiz Title and Class Selection Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Quiz Title */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('quiz.create.quizTitle')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={quizTitle}
                                onChange={(e) => setQuizTitle(e.target.value)}
                                placeholder={t('quiz.create.quizTitlePlaceholder')}
                                className="w-full px-3 py-2 bg-[#f7f7f8] border border-transparent rounded-lg focus:outline-none focus:border-[#0b6459] focus:bg-white hover:border-gray-300 hover:bg-white transition-all duration-300 ease-in-out placeholder:text-gray-300"
                            />
                        </div>

                        {/* Class Selection */}
                        <div>
                            <CustomDropdown2
                                label={<>{t('quiz.create.assignClass')} <span className="text-red-500">*</span></>}
                                options={["Physics 101", "Advanced Mathematics", "Chemistry Basics"]}
                                selectedValue={selectedClass}
                                placeholder={t('quiz.create.classPlaceholder')}
                                onSelect={(value: string) => setSelectedClass(value)}
                                dropdownId="class-dropdown"
                                openDropdown={openDropdown}
                                setOpenDropdown={setOpenDropdown}
                                hasSearch={true}
                                searchPlaceholder={t('quiz.create.searchClassPlaceholder')}
                            />
                        </div>
                    </div>

                    {/* Quiz Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('quiz.create.description')}
                        </label>
                        <textarea
                            value={quizDescription}
                            onChange={(e) => setQuizDescription(e.target.value)}
                            placeholder={t('quiz.create.descriptionPlaceholder')}
                            className="w-full px-3 py-2 bg-[#f7f7f8] border border-transparent rounded-lg focus:outline-none focus:border-[#0b6459] focus:bg-white hover:border-gray-300 hover:bg-white transition-all duration-300 ease-in-out resize-none placeholder:text-gray-300"
                            rows={3}
                        />
                    </div>

                    {/* Due Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('quiz.create.dueDate')}
                            </label>
                            <input
                                type="datetime-local"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full px-3 py-2 bg-[#f7f7f8] border border-transparent rounded-lg focus:outline-none focus:border-[#0b6459] focus:bg-white hover:border-gray-300 hover:bg-white transition-all duration-300 ease-in-out"
                            />
                        </div>
                    </div>

                    {/* Quiz Settings */}
                    <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('quiz.create.settings')}</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Time Limit */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('quiz.create.timeLimit')} ({t('quiz.create.minutes')})
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={timeLimit}
                                    onChange={(e) => setTimeLimit(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-full px-3 py-2 bg-[#f7f7f8] border border-transparent rounded-lg focus:outline-none focus:border-[#0b6459] focus:bg-white hover:border-gray-300 hover:bg-white transition-all duration-300 ease-in-out"
                                />
                            </div>

                            {/* Passing Score */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('quiz.create.passingScore')} (%)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={passingScore}
                                    onChange={(e) => setPassingScore(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                                    className="w-full px-3 py-2 bg-[#f7f7f8] border border-transparent rounded-lg focus:outline-none focus:border-[#0b6459] focus:bg-white hover:border-gray-300 hover:bg-white transition-all duration-300 ease-in-out"
                                />
                            </div>

                            {/* Max Attempts */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('quiz.create.maxAttempts')}
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        min="1"
                                        value={maxAttempts}
                                        onChange={(e) => setMaxAttempts(Math.max(1, parseInt(e.target.value) || 1))}
                                        disabled={isUnlimitedAttempts}
                                        className={`flex-1 px-3 py-2 bg-[#f7f7f8] border border-transparent rounded-lg focus:outline-none focus:border-[#0b6459] focus:bg-white hover:border-gray-300 hover:bg-white transition-all duration-300 ease-in-out ${isUnlimitedAttempts ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isUnlimitedAttempts}
                                            onChange={(e) => setIsUnlimitedAttempts(e.target.checked)}
                                            className="w-4 h-4 text-[#0b6459] border-gray-300 rounded focus:ring-[#0b6459] cursor-pointer"
                                        />
                                        <span className="text-sm text-gray-700">{t('quiz.create.unlimited')}</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Checkboxes */}
                        <div className="mt-4 space-y-3">
                            {/* Shuffle Questions */}
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={shuffleQuestions}
                                    onChange={(e) => setShuffleQuestions(e.target.checked)}
                                    className="w-4 h-4 text-[#0b6459] border-gray-300 rounded focus:ring-[#0b6459] cursor-pointer"
                                />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                    {t('quiz.create.shuffleQuestions')}
                                </span>
                            </label>

                            {/* Show Correct Answers */}
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={showCorrectAnswers}
                                    onChange={(e) => setShowCorrectAnswers(e.target.checked)}
                                    className="w-4 h-4 text-[#0b6459] border-gray-300 rounded focus:ring-[#0b6459] cursor-pointer"
                                />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                    {t('quiz.create.showCorrectAnswers')}
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Questions Section */}
            <div className="mb-6">
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                        {t('quiz.create.questionsTitle', { count: questions.length })}
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
                        {t('quiz.create.addQuestion')}
                    </button>
                </div>
            </div>

            <ConfirmModal
                isOpen={showConfirmBack}
                title={t('quiz.create.confirmLeave.title')}
                message={t('quiz.create.confirmLeave.message')}
                confirmText={t('quiz.create.confirmLeave.confirm')}
                onConfirm={confirmBack}
                onCancel={cancelBack}
                confirmButtonColor="red"
            />
        </div>
    );
};

export default CreateQuizPage;
