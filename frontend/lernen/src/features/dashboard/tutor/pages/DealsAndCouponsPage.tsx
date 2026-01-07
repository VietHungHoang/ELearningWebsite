import React, { useState, useEffect, useCallback } from 'react';
import { HiPlus, HiOutlineTicket } from 'react-icons/hi';
import { FiEdit, FiTrash } from 'react-icons/fi';
import CreateCouponModal from '../components/CreateCouponModal';
import ConfirmModal from '../../../../components/ui/ConfirmModal';
import CouponStatusBadge from '../components/CouponStatusBadge';
import ToggleSwitch from '../components/ToggleSwitch';
import BirdLoading from '../../../../components/ui/BirdLoading';
import Toast from '../../../../components/ui/Toast';
import { useTranslation } from 'react-i18next';
import discountService, { type Discount, type CreateDiscountRequest, type DiscountApplyTo } from '../../../../services/discountService';

export type CouponStatus = 'Active' | 'Expired' | 'Inactive';
export type CouponDiscountType = 'Percentage' | 'Fixed';

// Legacy interface for modal compatibility
export interface Coupon {
    id: string;
    code: string;
    discountType: CouponDiscountType;
    discountValue: number;
    applicableCourses: string[];
    usageLimit: number | null;
    timesUsed: number;
    expiryDate: string;
    isActive: boolean;
    // New fields from API
    startDate?: string;
    maxDiscount?: number;
    minOrderValue?: number;
    applyTo?: DiscountApplyTo;
}

// Convert API Discount to Coupon for UI
const discountToCoupon = (discount: Discount): Coupon => ({
    id: discount.id,
    code: discount.code,
    discountType: discount.type === 'PERCENTAGE' ? 'Percentage' : 'Fixed',
    discountValue: discount.discountValue,
    applicableCourses: discount.applicableClasses || ['All'],
    usageLimit: discount.maxUses ?? null,
    timesUsed: discount.currentUses,
    expiryDate: discount.endDate.split('T')[0],
    isActive: discount.isActive,
    startDate: discount.startDate,
    maxDiscount: discount.maxDiscount,
    minOrderValue: discount.minOrderValue,
    applyTo: discount.applyTo,
});

// Convert Coupon to API request
const couponToCreateRequest = (coupon: Omit<Coupon, 'id' | 'timesUsed'>): CreateDiscountRequest => ({
    code: coupon.code,
    type: coupon.discountType === 'Percentage' ? 'PERCENTAGE' : 'FIXED_AMOUNT',
    discountValue: coupon.discountValue,
    maxUses: coupon.usageLimit ?? undefined,
    maxUsesPerUser: 1,
    applyTo: coupon.applyTo || 'BOTH',
    startDate: coupon.startDate || new Date().toISOString(),
    endDate: `${coupon.expiryDate}T23:59:59`,
    applicableClasses: coupon.applicableCourses,
});

const DealsAndCouponsContent: React.FC = () => {
    const { t } = useTranslation();
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
    const [itemToDelete, setItemToDelete] = useState<Coupon | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const fetchDiscounts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await discountService.getTutorDiscounts(0, 50);
            // Handle empty content array (no coupons yet)
            if (response.content && Array.isArray(response.content)) {
                setCoupons(response.content.map(discountToCoupon));
            } else {
                setCoupons([]);
            }
        } catch (error) {
            console.error('Failed to fetch discounts:', error);
            setToast({ message: t('dashboard.tutor.dealsCoupons.errors.fetchFailed'), type: 'error' });
            setCoupons([]);
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchDiscounts();
    }, [fetchDiscounts]);

    const getCouponStatus = (coupon: Coupon): CouponStatus => {
        if (new Date(coupon.expiryDate) < new Date() && coupon.isActive) {
            return 'Expired';
        }
        return coupon.isActive ? 'Active' : 'Inactive';
    };

    const handleOpenModal = (coupon: Coupon | null) => {
        setEditingCoupon(coupon);
        setIsModalOpen(true);
    };

    const handleSaveCoupon = async (couponData: Omit<Coupon, 'id' | 'timesUsed'>) => {
        try {
            if (editingCoupon) {
                await discountService.updateDiscount(editingCoupon.id, {
                    code: couponData.code,
                    type: couponData.discountType === 'Percentage' ? 'PERCENTAGE' : 'FIXED_AMOUNT',
                    discountValue: couponData.discountValue,
                    maxUses: couponData.usageLimit ?? undefined,
                    endDate: `${couponData.expiryDate}T23:59:59`,
                    isActive: couponData.isActive,
                });
                setToast({ message: t('dashboard.tutor.dealsCoupons.success.updated'), type: 'success' });
            } else {
                await discountService.createDiscount(couponToCreateRequest(couponData));
                setToast({ message: t('dashboard.tutor.dealsCoupons.success.created'), type: 'success' });
            }
            fetchDiscounts();
        } catch (error) {
            console.error('Failed to save discount:', error);
            setToast({ message: t('dashboard.tutor.dealsCoupons.errors.saveFailed'), type: 'error' });
        }
        setIsModalOpen(false);
        setEditingCoupon(null);
    };

    const handleDelete = async (coupon: Coupon) => {
        try {
            await discountService.deleteDiscount(coupon.id);
            setToast({ message: t('dashboard.tutor.dealsCoupons.success.deleted'), type: 'success' });
            fetchDiscounts();
        } catch (error) {
            console.error('Failed to delete discount:', error);
            setToast({ message: t('dashboard.tutor.dealsCoupons.errors.deleteFailed'), type: 'error' });
        }
        setItemToDelete(null);
    };

    const handleToggleActive = async (couponId: string) => {
        try {
            await discountService.toggleDiscount(couponId);
            fetchDiscounts();
        } catch (error) {
            console.error('Failed to toggle discount:', error);
            setToast({ message: t('dashboard.tutor.dealsCoupons.errors.toggleFailed'), type: 'error' });
        }
    };

    return (
        <div className="p-6">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <CreateCouponModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingCoupon(null); }}
                onSave={handleSaveCoupon}
                existingCoupon={editingCoupon}
            />
            <ConfirmModal
                isOpen={!!itemToDelete}
                onCancel={() => setItemToDelete(null)}
                onConfirm={() => itemToDelete && handleDelete(itemToDelete)}
                title={t('dashboard.tutor.dealsCoupons.deleteTitle')}
                message={t('dashboard.tutor.dealsCoupons.deleteMessage', { code: itemToDelete?.code ?? '' })}
                confirmText={t('dashboard.tutor.dealsCoupons.deleteConfirm')}
                cancelText={t('common.cancel')}
                confirmButtonColor="red"
            />

            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">{t('dashboard.tutor.dealsCoupons.title')}</h1>
                    <p className="text-gray-600 mt-1">{t('dashboard.tutor.dealsCoupons.subtitle')}</p>
                </div>
                <button
                    onClick={() => handleOpenModal(null)}
                    className="px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] transition-colors font-medium text-sm flex items-center gap-2"
                >
                    <HiPlus className="w-4 h-4" />
                    <span>{t('dashboard.tutor.dealsCoupons.createButton')}</span>
                </button>
            </div>

            {loading ? (
                <div className="mt-8 bg-white rounded-2xl shadow-sm p-16 flex justify-center items-center">
                    <BirdLoading title={t('common.loading')} size="sm" />
                </div>
            ) : (
                <div className="mt-8 bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 font-semibold">
                                <tr>
                                    <th className="p-4">{t('dashboard.tutor.dealsCoupons.tableHeaders.code')}</th>
                                    <th className="p-4">{t('dashboard.tutor.dealsCoupons.tableHeaders.discount')}</th>
                                    <th className="p-4">{t('dashboard.tutor.dealsCoupons.tableHeaders.appliesTo')}</th>
                                    <th className="p-4">{t('dashboard.tutor.dealsCoupons.tableHeaders.usage')}</th>
                                    <th className="p-4">{t('dashboard.tutor.dealsCoupons.tableHeaders.expiryDate')}</th>
                                    <th className="p-4">{t('dashboard.tutor.dealsCoupons.tableHeaders.status')}</th>
                                    <th className="p-4 text-center">{t('dashboard.tutor.dealsCoupons.tableHeaders.active')}</th>
                                    <th className="p-4 text-center">{t('dashboard.tutor.dealsCoupons.tableHeaders.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {coupons.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="p-16">
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                    <HiOutlineTicket className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <p className="text-gray-500 font-medium">{t('dashboard.tutor.dealsCoupons.noCoupons')}</p>
                                                <p className="text-gray-400 text-sm mt-1">{t('dashboard.tutor.dealsCoupons.noCouponsHint')}</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    coupons.map(coupon => (
                                        <tr key={coupon.id} className="hover:bg-gray-50">
                                            <td className="p-4 font-bold text-gray-800">{coupon.code}</td>
                                            <td className="p-4 text-gray-700 font-semibold">
                                                {coupon.discountValue}{coupon.discountType === 'Percentage' ? '%' : t('dashboard.tutor.dealsCoupons.currencySymbol')}
                                            </td>
                                            <td className="p-4 text-gray-600">{coupon.applicableCourses.includes('All') ? t('dashboard.tutor.dealsCoupons.allCourses') : coupon.applicableCourses.join(', ')}</td>
                                            <td className="p-4 text-gray-600">{coupon.timesUsed} / {coupon.usageLimit ?? '∞'}</td>
                                            <td className="p-4 text-gray-600">{coupon.expiryDate}</td>
                                            <td className="p-4"><CouponStatusBadge status={getCouponStatus(coupon)} /></td>
                                            <td className="p-4 text-center">
                                                <ToggleSwitch enabled={coupon.isActive} onChange={() => handleToggleActive(coupon.id)} />
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-0.5">
                                                    <button onClick={() => handleOpenModal(coupon)} className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors" title={t('dashboard.tutor.dealsCoupons.actions.edit')}><FiEdit className="w-3.5 h-3.5" /></button>
                                                    <button onClick={() => setItemToDelete(coupon)} className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors" title={t('dashboard.tutor.dealsCoupons.actions.delete')}><FiTrash className="w-3.5 h-3.5" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DealsAndCouponsContent;
