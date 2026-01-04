import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiPlus, HiSave, HiCheckCircle, HiArrowLeft } from 'react-icons/hi';
import QuizCard from './QuizCard';
import CustomDropdown2 from '../../../../components/ui/CustomDropdown2';
import ConfirmModal from '../../../../components/ui/ConfirmModal';
import Toast from '../../../../components/ui/Toast';
import BirdLoading from '../../../../components/ui/BirdLoading';
import AIGenerateQuestionsModal from './components/AIGenerateQuestionsModal';
import { useTranslation } from 'react-i18next';
import quizService from '../../../../services/quizService';
import { classService } from '../../../../services/classService';
import type { CreateQuizRequest, CreateQuestionRequest, UpdateQuizRequest } from '../../../../types/quiz';
import type { ClassTable } from '../../../../types/class';

interface QuizQuestion {
    id: string;
    question: string;
    multipleChoiceOptions?: string[];
    isMultipleSelection: boolean;
    selectedOptions: number[];
}

const CreateQuizPage: React.FC = () => {
    const navigate = useNavigate();
    const { quizId } = useParams<{ quizId: string }>();
    const { t } = useTranslation();
    const isEditMode = Boolean(quizId);

    const [quizTitle, setQuizTitle] = useState('');
    const [quizDescription, setQuizDescription] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [showConfirmBack, setShowConfirmBack] = useState(false);
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
    const [, setIsScrolled] = useState(false);
    const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [classes, setClasses] = useState<ClassTable[]>([]);
    const [isLoadingClasses, setIsLoadingClasses] = useState(false);
    const lastQuestionRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    // Quiz settings
    const [dueDate, setDueDate] = useState<string>('');
    const [timeLimit, setTimeLimit] = useState<number>(60);
    const [passingScore, setPassingScore] = useState<number>(70);
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

    // Load classes for dropdown
    useEffect(() => {
        const fetchClasses = async () => {
            setIsLoadingClasses(true);
            try {
                const response = await classService.getClassesForTutor({
                    page: 0,
                    size: 100 // Get all classes, adjust if needed
                });
                
                if (response.success && response.data) {
                    setClasses(response.data.content || []);
                } else {
                    console.error('Failed to fetch classes:', response.message);
                }
            } catch (error) {
                console.error('Error fetching classes:', error);
            } finally {
                setIsLoadingClasses(false);
            }
        };

        fetchClasses();
    }, []);

    // Load quiz data when in edit mode
    useEffect(() => {
        if (isEditMode && quizId) {
            setIsLoadingQuiz(true);
            quizService.getQuizDetail(quizId, true)
                .then((quizDetail) => {
                    setQuizTitle(quizDetail.title);
                    setQuizDescription(quizDetail.description || '');
                    setSelectedClass(quizDetail.classId);
                    setTimeLimit(quizDetail.timeLimitMinutes);
                    setPassingScore(quizDetail.passingScore);
                    setShuffleQuestions(quizDetail.shuffleQuestions);
                    setShowCorrectAnswers(quizDetail.showCorrectAnswers);
                    if (quizDetail.maxAttempts >= 999) {
                        setIsUnlimitedAttempts(true);
                    } else {
                        setMaxAttempts(quizDetail.maxAttempts);
                    }
                    if (quizDetail.dueDate) {
                        setDueDate(quizDetail.dueDate.split('T')[0]);
                    }
                    // Map questions
                    const mappedQuestions: QuizQuestion[] = quizDetail.questions.map((q) => ({
                        id: q.id,
                        question: q.questionText,
                        multipleChoiceOptions: q.options.map(opt => opt.optionText),
                        isMultipleSelection: q.type === 'MULTIPLE_CHOICE',
                        selectedOptions: q.options
                            .map((opt, idx) => opt.isCorrect ? idx : -1)
                            .filter(idx => idx !== -1),
                    }));
                    setQuestions(mappedQuestions.length > 0 ? mappedQuestions : [{
                        id: '1',
                        question: '',
                        multipleChoiceOptions: ['', '', '', ''],
                        isMultipleSelection: false,
                        selectedOptions: []
                    }]);
                })
                .catch((err) => {
                    console.error('Error loading quiz:', err);
                    setError(t('quiz.create.validation.loadFailed') || 'Failed to load quiz');
                })
                .finally(() => {
                    setIsLoadingQuiz(false);
                });
        }
    }, [isEditMode, quizId, t]);

    useEffect(() => {
        if (shouldScrollToBottom && lastQuestionRef.current) {
            lastQuestionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setShouldScrollToBottom(false);
        }
    }, [shouldScrollToBottom]);

    // Scroll detection - listens to parent scroll container
    useEffect(() => {
        const header = headerRef.current;
        if (!header) return;
        const container = header.closest('.overflow-y-auto') as HTMLElement;
        if (!container) return;
        const onScroll = () => setIsScrolled(container.scrollTop > 10);
        container.addEventListener('scroll', onScroll);
        return () => container.removeEventListener('scroll', onScroll);
    }, []);

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

    const handleAIGenerate = async (prompt: string) => {
        setIsGeneratingAI(true);
        try {
            // TODO: Call AI API to generate questions
            // For now, this is a placeholder - will be implemented when API is ready
            console.log('Generating questions with prompt:', prompt);
            
            // Simulate API call - replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Example: Add generated questions (this will be replaced with actual AI response)
            // const generatedQuestions = await quizService.generateQuestionsWithAI(prompt);
            // setQuestions([...questions, ...generatedQuestions]);
            
            setIsAIModalOpen(false);
            setSuccessMessage(t('quiz.create.aiGenerate.success') || 'Câu hỏi đã được tạo thành công!');
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            console.error('Failed to generate questions:', error);
            setError(t('quiz.create.aiGenerate.error') || 'Không thể tạo câu hỏi. Vui lòng thử lại.');
        } finally {
            setIsGeneratingAI(false);
        }
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

    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Build CreateQuizRequest from form data
    const buildQuizRequest = (): CreateQuizRequest => {
        // selectedClass is now the class ID directly
        const classId = selectedClass;

        const quizQuestions: CreateQuestionRequest[] = questions.map((q) => ({
            questionText: q.question,
            type: q.isMultipleSelection ? 'MULTIPLE_CHOICE' : 'SINGLE_CHOICE',
            options: (q.multipleChoiceOptions || []).map((optText, optIndex) => ({
                optionText: optText,
                isCorrect: q.selectedOptions.includes(optIndex),
            })),
        }));

        return {
            classId,
            title: quizTitle,
            description: quizDescription || undefined,
            timeLimitMinutes: timeLimit,
            dueDate: dueDate || undefined,
            passingScore,
            shuffleQuestions,
            showCorrectAnswers,
            maxAttempts: isUnlimitedAttempts ? 999 : maxAttempts,
            questions: quizQuestions,
        };
    };

    // Validate form before submit
    const validateForm = (): string | null => {
        if (!quizTitle.trim()) return t('quiz.create.validation.titleRequired');
        if (!selectedClass) return t('quiz.create.validation.classRequired');
        if (questions.length === 0) return t('quiz.create.validation.atLeastOneQuestion');

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.question.trim()) return t('quiz.create.validation.questionTextRequired', { number: i + 1 });
            if (!q.multipleChoiceOptions || q.multipleChoiceOptions.filter(o => o.trim()).length < 2) {
                return t('quiz.create.validation.atLeastTwoOptions', { number: i + 1 });
            }
            if (q.selectedOptions.length === 0) {
                return t('quiz.create.validation.correctAnswerRequired', { number: i + 1 });
            }
        }
        return null;
    };

    // Build UpdateQuizRequest from form data (for edit mode)
    const buildUpdateRequest = (): UpdateQuizRequest => {
        return {
            title: quizTitle,
            description: quizDescription || undefined,
            timeLimitMinutes: timeLimit,
            dueDate: dueDate || undefined,
            passingScore,
            shuffleQuestions,
            showCorrectAnswers,
            maxAttempts: isUnlimitedAttempts ? 999 : maxAttempts,
        };
    };

    const handleSaveDraft = async () => {
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            if (isEditMode && quizId) {
                // Update existing quiz
                const request = buildUpdateRequest();
                await quizService.updateQuiz(quizId, request);
            } else {
                // Create new quiz
                const request = buildQuizRequest();
                await quizService.createQuiz(request);
            }
            navigate('/dashboard/quizzes');
        } catch (err) {
            console.error('Error saving draft:', err);
            setError(t('quiz.create.validation.saveFailed'));
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublish = async () => {
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsPublishing(true);
        setError(null);

        try {
            if (isEditMode && quizId) {
                // Update existing quiz then publish
                const request = buildUpdateRequest();
                await quizService.updateQuiz(quizId, request);
                await quizService.publishQuiz(quizId);
            } else {
                // Create new quiz then publish
                const request = buildQuizRequest();
                const createdQuiz = await quizService.createQuiz(request);
                await quizService.publishQuiz(createdQuiz.id);
            }
            navigate('/dashboard/quizzes');
        } catch (err) {
            console.error('Error publishing quiz:', err);
            setError(t('quiz.create.validation.publishFailed'));
        } finally {
            setIsPublishing(false);
        }
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

    // Show loading when loading quiz data in edit mode
    if (isLoadingQuiz) {
        return (
            <div className="flex items-center justify-center min-h-[600px]">
                <BirdLoading
                    title={t('common.loading')}
                    description=""
                    size="md"
                />
            </div>
        );
    }

    return (
        <div>
            {/* Sticky Header */}
            <div
                ref={headerRef}
                // ${isScrolled ? 'border-b border-gray-300' : ''
                className={`sticky top-0 z-50 flex items-center justify-between p-4 bg-white`}
            >
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBackClick}
                        className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <HiArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">
                        {isEditMode ? t('quiz.create.editTitle') : t('quiz.create.title')}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSaveDraft}
                        disabled={isSaving || isPublishing}
                        className={`flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm ${(isSaving || isPublishing) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSaving ? (
                            <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full" />
                        ) : (
                            <HiSave className="w-4 h-4" />
                        )}
                        {isSaving ? 'Saving...' : t('quiz.create.saveDraft')}
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={isSaving || isPublishing}
                        className={`flex items-center gap-2 px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#094d44] transition-colors font-medium text-sm shadow-sm ${(isSaving || isPublishing) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isPublishing ? (
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                            <HiCheckCircle className="w-4 h-4" />
                        )}
                        {isPublishing ? 'Publishing...' : t('quiz.create.publish')}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="px-4">
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
                                    options={isLoadingClasses ? [] : classes.map(cls => cls.title)}
                                    selectedValue={classes.find(cls => cls.id === selectedClass)?.title || selectedClass}
                                    placeholder={isLoadingClasses ? t('common.loading', { defaultValue: 'Đang tải...' }) : t('quiz.create.classPlaceholder')}
                                    onSelect={(value: string) => {
                                        // Find class by title and set its ID
                                        const selectedClassObj = classes.find(cls => cls.title === value);
                                        if (selectedClassObj) {
                                            setSelectedClass(selectedClassObj.id);
                                        } else {
                                            setSelectedClass(value);
                                        }
                                    }}
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
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">
                            {t('quiz.create.questionsTitle', { count: questions.length })}
                        </h2>
                        <button
                            onClick={() => setIsAIModalOpen(true)}
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-sm"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            {t('quiz.create.aiGenerate.button')}
                        </button>
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

                {/* AI Generate Questions Modal */}
                <AIGenerateQuestionsModal
                    isOpen={isAIModalOpen}
                    onClose={() => setIsAIModalOpen(false)}
                    onSubmit={handleAIGenerate}
                    isGenerating={isGeneratingAI}
                />

                {/* Error Toast */}
                {error && (
                    <Toast
                        message={error}
                        type="error"
                        onClose={() => setError(null)}
                    />
                )}

                {/* Success Toast */}
                {successMessage && (
                    <Toast
                        message={successMessage}
                        type="success"
                        onClose={() => setSuccessMessage(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default CreateQuizPage;
