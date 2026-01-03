import React, { useState } from 'react';
import ModalLayout from '../../../../../components/ui/ModalLayout';
import { useTranslation } from 'react-i18next';

interface AIGenerateQuestionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (prompt: string) => void;
    isGenerating?: boolean;
}

const AIGenerateQuestionsModal: React.FC<AIGenerateQuestionsModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isGenerating = false
}) => {
    const { t } = useTranslation();
    const [prompt, setPrompt] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!prompt.trim()) {
            setError(t('quiz.create.aiGenerate.promptRequired') || 'Vui lòng nhập prompt');
            return;
        }

        onSubmit(prompt.trim());
    };

    const handleClose = () => {
        setPrompt('');
        setError(null);
        onClose();
    };

    return (
        <ModalLayout isOpen={isOpen} onClose={handleClose} maxWidth="2xl" showCloseButton={true}>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {t('quiz.create.aiGenerate.title')}
                    </h2>
                    <p className="text-gray-600 mt-2">
                        {t('quiz.create.aiGenerate.description')}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Prompt Input */}
                    <div>
                        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                            {t('quiz.create.aiGenerate.promptLabel')} <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="prompt"
                            value={prompt}
                            onChange={(e) => {
                                setPrompt(e.target.value);
                                if (error) setError(null);
                            }}
                            rows={6}
                            className={`w-full px-4 py-3 rounded-lg focus:outline-none transition-colors duration-200 box-border border placeholder:text-gray-400 ${
                                error
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border border-transparent hover:border-gray-300 focus:border-[#0b6459]'
                            }`}
                            placeholder={t('quiz.create.aiGenerate.promptPlaceholder')}
                            disabled={isGenerating}
                        />
                        {error && (
                            <p className="mt-1 text-sm text-red-500">{error}</p>
                        )}
                        <p className="mt-2 text-xs text-gray-500">
                            {t('quiz.create.aiGenerate.promptHint')}
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isGenerating}
                            className="px-6 py-2.5 text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t('common.cancel', { defaultValue: 'Huỷ' })}
                        </button>
                        <button
                            type="submit"
                            disabled={isGenerating || !prompt.trim()}
                            className="px-6 py-2.5 bg-[#0b6459] text-white font-semibold rounded-lg hover:bg-[#084c43] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isGenerating ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>{t('quiz.create.aiGenerate.generating')}</span>
                                </>
                            ) : (
                                t('quiz.create.aiGenerate.generateButton')
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </ModalLayout>
    );
};

export default AIGenerateQuestionsModal;

