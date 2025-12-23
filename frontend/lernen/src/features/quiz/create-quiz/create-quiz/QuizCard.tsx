import React from 'react';
import { HiTrash } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';

interface QuizCardProps {
    cardNumber: number;
    question: string;
    onQuestionChange: (value: string) => void;
    onDelete: () => void;
    multipleChoiceOptions?: string[];
    onMultipleChoiceChange?: (options: string[]) => void;
    isMultipleSelection?: boolean;
    onToggleMultipleSelection?: () => void;
    selectedOptions?: number[];
    onOptionSelect?: (optionIndex: number) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({
    cardNumber,
    question,
    onQuestionChange,
    onDelete,
    multipleChoiceOptions = ['', '', '', ''],
    onMultipleChoiceChange,
    isMultipleSelection = true,
    onToggleMultipleSelection,
    selectedOptions = [],
    onOptionSelect
}) => {
    const { t } = useTranslation();

    const handleOptionChange = (index: number, value: string) => {
        if (onMultipleChoiceChange) {
            const newOptions = [...multipleChoiceOptions];
            newOptions[index] = value;
            onMultipleChoiceChange(newOptions);
        }
    };

    const handleOptionClick = (index: number) => {
        if (onOptionSelect) {
            onOptionSelect(index);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
            {/* Card Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span className="bg-[#0b6459] text-white font-bold px-3 py-1 rounded-lg text-sm">
                        {cardNumber}
                    </span>
                    <button
                        onClick={onToggleMultipleSelection}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                            isMultipleSelection
                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {isMultipleSelection ? t('quiz.create.card.multipleSelection') : t('quiz.create.card.singleSelection')}
                    </button>
                </div>
                <button
                    onClick={onDelete}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title={t('quiz.create.card.deleteTooltip')}
                >
                    <HiTrash className="w-5 h-5" />
                </button>
            </div>

            {/* Main Content - 2 Columns */}
            <div className="flex flex-col md:flex-row gap-6">
                {/* Question Section */}
                <div className="flex-1 flex flex-col">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('quiz.create.card.questionLabel')}
                    </label>
                    <textarea
                        value={question}
                        onChange={(e) => onQuestionChange(e.target.value)}
                        placeholder={t('quiz.create.card.questionPlaceholder')}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0b6459] focus:ring-0 resize-none text-gray-800 min-h-0"
                        rows={2}
                    />
                </div>

                {/* Answer Section */}
                <div className="flex-1 flex flex-col">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('quiz.create.card.answerOptions')}
                    </label>

                    <div className="space-y-2 flex-1">
                        {multipleChoiceOptions.map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <span 
                                    className={`font-semibold px-2.5 py-1 text-sm cursor-pointer transition-colors ${
                                        selectedOptions.includes(index)
                                            ? 'bg-[#0b6459] text-white' 
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    } ${isMultipleSelection ? 'rounded' : 'rounded-full'}`}
                                    onClick={() => handleOptionClick(index)}
                                >
                                    {String.fromCharCode(65 + index)}
                                </span>
                                <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    placeholder={t('quiz.create.card.optionPlaceholder', { option: String.fromCharCode(65 + index) })}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0b6459] focus:ring-0 text-sm"
                                />
                            </div>
                        ))}
                        <p className="text-xs text-gray-500 mt-2">
                            {t('quiz.create.card.answerHint')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizCard;
