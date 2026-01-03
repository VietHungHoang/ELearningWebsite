import React from 'react';
import ModalLayout from '../../../../components/ui/ModalLayout';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../../../context/CurrencyContext';
import { formatCurrency, convertFromVND } from '../../../../utils/currencyHelper';
import type { GroupClass } from '../../../../types/tutor';

interface PaymentPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedClass: GroupClass | null;
    onPayNow: () => void;
    onPayLater: () => void;
}

const PaymentPromptModal: React.FC<PaymentPromptModalProps> = ({
    isOpen,
    onClose,
    selectedClass,
    onPayNow,
    onPayLater,
}) => {
    const { t } = useTranslation();
    const { selectedCurrency } = useCurrency();

    if (!selectedClass) return null;

    // Calculate price (assuming pricePerHour is in VND)
    const convertedPrice = convertFromVND(selectedClass.pricePerHour, selectedCurrency);
    const formattedPrice = formatCurrency(convertedPrice, selectedCurrency);

    return (
        <ModalLayout
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="md"
        >
            <div>
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-100 text-center">
                    <div className="mx-auto w-16 h-16 bg-[#0b6459]/10 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-[#0b6459]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {t('tutorDetail.groupClass.paymentPrompt.title')}
                    </h3>
                    <p className="text-sm text-gray-600">
                        {t('tutorDetail.groupClass.paymentPrompt.description')}
                    </p>
                </div>

                <div className="px-6 py-5 space-y-4">
                    {/* Class Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-600">
                                {t('tutorDetail.groupClass.paymentPrompt.className')}
                            </p>
                            <p className="text-sm font-bold text-gray-900">{selectedClass.title}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-600">
                                {t('tutorDetail.groupClass.paymentPrompt.price')}
                            </p>
                            <p className="text-lg font-bold text-[#0b6459]">
                                {formattedPrice}
                                <span className="text-sm text-gray-600 font-medium ml-1">
                                    {t('tutorDetail.groupClass.perHour')}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm font-semibold text-blue-900 mb-2">
                            {t('tutorDetail.groupClass.paymentPrompt.benefitsTitle')}
                        </p>
                        <ul className="space-y-2 text-sm text-blue-800">
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>{t('tutorDetail.groupClass.paymentPrompt.benefit1')}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>{t('tutorDetail.groupClass.paymentPrompt.benefit2')}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>{t('tutorDetail.groupClass.paymentPrompt.benefit3')}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Actions */}
                <div className="px-6 pb-6 flex gap-3">
                    <button
                        onClick={onPayLater}
                        className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-semibold transition-colors"
                    >
                        {t('tutorDetail.groupClass.paymentPrompt.payLater')}
                    </button>
                    <button
                        onClick={onPayNow}
                        className="flex-1 px-4 py-2.5 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] text-sm font-semibold transition-colors"
                    >
                        {t('tutorDetail.groupClass.paymentPrompt.payNow')}
                    </button>
                </div>
            </div>
        </ModalLayout>
    );
};

export default PaymentPromptModal;

