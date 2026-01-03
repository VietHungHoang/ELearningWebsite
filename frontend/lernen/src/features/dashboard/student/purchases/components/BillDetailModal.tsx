import React from 'react';
import ModalLayout from '../../../../../components/ui/ModalLayout';
import { useTranslation } from 'react-i18next';
import type { PurchaseData } from '../PurchasesPage';

interface BillDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchase: PurchaseData | null;
  onPay?: (purchaseId: string) => void;
}

const BillDetailModal: React.FC<BillDetailModalProps> = ({
  isOpen,
  onClose,
  purchase,
  onPay
}) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';

  if (!purchase) return null;

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: PurchaseData['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'REFUNDED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Calculate amounts
  const subtotal = purchase.subtotal || (purchase.sessionsPurchased && purchase.pricePerSession 
    ? purchase.sessionsPurchased * purchase.pricePerSession 
    : purchase.amount);
  const discountAmount = purchase.discountAmount || (purchase.discount && subtotal 
    ? (subtotal * purchase.discount / 100) 
    : 0);
  const tax = purchase.tax || 0;
  const totalAmount = purchase.totalAmount || purchase.amount;

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} maxWidth="4xl" showCloseButton={true}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-800">
            {t('dashboard.student.purchases.billDetail.title')}
          </h2>
        </div>

        {/* Invoice Number and Transaction ID */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-5 grid grid-cols-2 gap-4">
          {purchase.invoiceNumber && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                {t('dashboard.student.purchases.billDetail.invoiceNumber')}:
              </span>
              <span className="text-sm font-bold text-gray-800">{purchase.invoiceNumber}</span>
            </div>
          )}
          {purchase.transactionId && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                {t('dashboard.student.purchases.billDetail.transactionId')}:
              </span>
              <span className="text-sm font-semibold text-gray-800">{purchase.transactionId}</span>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-5 mb-5">
          {/* Left Column */}
          <div className="space-y-5">
            {/* Course Information */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-800 mb-4">
                {t('dashboard.student.purchases.billDetail.courseInformation')}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {t('dashboard.student.purchases.billDetail.courseTitle')}:
                  </span>
                  <span className="text-sm font-semibold text-gray-800 text-right max-w-[60%]">{purchase.courseTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {t('dashboard.student.purchases.billDetail.classType')}:
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {purchase.type === 'ON_ONE_ONE'
                      ? t('dashboard.student.purchases.classTypes.oneOnOne')
                      : t('dashboard.student.purchases.classTypes.group')}
                  </span>
                </div>
                {purchase.sessionsPurchased && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {t('dashboard.student.purchases.billDetail.sessionsPurchased')}:
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {purchase.sessionsPurchased} {t('dashboard.student.purchases.billDetail.sessions')}
                    </span>
                  </div>
                )}
                {purchase.pricePerSession && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {t('dashboard.student.purchases.billDetail.pricePerSession')}:
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {formatCurrency(purchase.pricePerSession)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-800 mb-4">
                {t('dashboard.student.purchases.billDetail.paymentInformation')}
              </h3>
              <div className="space-y-3">
                {purchase.paymentMethod && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {t('dashboard.student.purchases.billDetail.paymentMethod')}:
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {purchase.paymentMethod}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {t('dashboard.student.purchases.billDetail.purchaseDate')}:
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {formatDate(purchase.purchaseDate)}
                  </span>
                </div>
                {purchase.paymentDate && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {t('dashboard.student.purchases.billDetail.paymentDate')}:
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {formatDate(purchase.paymentDate)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {t('dashboard.student.purchases.billDetail.status')}:
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                      purchase.status
                    )}`}
                  >
                    {purchase.status === 'COMPLETED'
                      ? t('dashboard.student.purchases.statusLabels.completed')
                      : purchase.status === 'PENDING'
                      ? t('dashboard.student.purchases.statusLabels.pending')
                      : purchase.status === 'CANCELLED'
                      ? t('dashboard.student.purchases.statusLabels.cancelled')
                      : t('dashboard.student.purchases.statusLabels.refunded')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            {/* Payment Breakdown */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-800 mb-4">
                {t('dashboard.student.purchases.billDetail.paymentBreakdown')}
              </h3>
              <div className="space-y-3">
                {purchase.sessionsPurchased && purchase.pricePerSession && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {t('dashboard.student.purchases.billDetail.subtotal')}:
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {t('dashboard.student.purchases.billDetail.discount')} 
                      {purchase.discount ? ` (${purchase.discount}%)` : ''}:
                    </span>
                    <span className="text-sm font-semibold text-red-600">
                      -{formatCurrency(discountAmount)}
                    </span>
                  </div>
                )}
                {tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {t('dashboard.student.purchases.billDetail.tax')}:
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {formatCurrency(tax)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-gray-200 mt-3">
                  <span className="text-base font-bold text-gray-800">
                    {t('dashboard.student.purchases.billDetail.totalAmount')}:
                  </span>
                  <span className="text-xl font-bold text-[#0b6459]">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {purchase.notes && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-base font-semibold text-gray-800 mb-3">
                  {t('dashboard.student.purchases.billDetail.notes')}
                </h3>
                <p className="text-sm text-gray-700">{purchase.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          {purchase.status === 'PENDING' && onPay && (
            <button
              onClick={() => {
                if (onPay) {
                  onPay(purchase.id);
                }
              }}
              className="px-6 py-2.5 bg-[#0b6459] text-white text-sm font-semibold rounded-lg hover:bg-[#084c43] transition-colors"
            >
              {t('dashboard.student.purchases.billDetail.payNow')}
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-700 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            {t('dashboard.student.purchases.billDetail.close')}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default BillDetailModal;

