
import React, { useState } from 'react';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';
import CreateCouponModal from '../components/CreateCouponModal';
import ConfirmationModal from '../components/ConfirmationModal';
import CouponStatusBadge from '../components/CouponStatusBadge';
import ToggleSwitch from '../components/ToggleSwitch';
import { useTranslation } from 'react-i18next';

export type CouponStatus = 'Active' | 'Expired' | 'Inactive';
export type CouponDiscountType = 'Percentage' | 'Fixed';

export interface Coupon {
    id: number;
    code: string;
    discountType: CouponDiscountType;
    discountValue: number;
    // Fix: Removed a stray 'g' character that was causing a syntax error.
    applicableCourses: string[]; // Array of course titles, or ['All']
    usageLimit: number | null; // null for unlimited
    timesUsed: number;
    expiryDate: string;
    isActive: boolean;
}

const mockCoupons: Coupon[] = [
    { id: 1, code: 'SUMMER25', discountType: 'Percentage', discountValue: 25, applicableCourses: ['All'], usageLimit: 100, timesUsed: 42, expiryDate: '2025-08-31', isActive: true },
    { id: 2, code: 'WELCOME10', discountType: 'Fixed', discountValue: 10, applicableCourses: ['Time Management Mastery: Boost Your Productivity'], usageLimit: 50, timesUsed: 50, expiryDate: '2025-12-31', isActive: false },
    { id: 3, code: 'EARLYBIRD', discountType: 'Percentage', discountValue: 15, applicableCourses: ['All'], usageLimit: null, timesUsed: 112, expiryDate: '2024-01-01', isActive: false },
    { id: 4, code: 'PYTHON50', discountType: 'Fixed', discountValue: 50, applicableCourses: ["Beginner's Guide to Python Programming"], usageLimit: 20, timesUsed: 5, expiryDate: '2025-11-30', isActive: true },
];


const DealsAndCouponsContent: React.FC = () => {
    const { t } = useTranslation();
    const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
    const [itemToDelete, setItemToDelete] = useState<Coupon | null>(null);

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

    const handleSaveCoupon = (couponData: Omit<Coupon, 'id' | 'timesUsed'>) => {
        if (editingCoupon) {
            // Update existing coupon
            setCoupons(prev => prev.map(c => c.id === editingCoupon.id ? { ...editingCoupon, ...couponData } : c));
        } else {
            // Add new coupon
            const newCoupon: Coupon = {
                id: Date.now(),
                timesUsed: 0,
                ...couponData,
            };
            setCoupons(prev => [newCoupon, ...prev]);
        }
        setIsModalOpen(false);
        setEditingCoupon(null);
    };
    
    const handleDelete = (coupon: Coupon) => {
        setCoupons(prev => prev.filter(c => c.id !== coupon.id));
        setItemToDelete(null);
    };
    
    const handleToggleActive = (couponId: number, isActive: boolean) => {
        setCoupons(prev => prev.map(c => c.id === couponId ? {...c, isActive} : c));
    };

    return (
        <div className="max-w-7xl mx-auto">
             <CreateCouponModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingCoupon(null); }}
                onSave={handleSaveCoupon}
                existingCoupon={editingCoupon}
            />
            <ConfirmationModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={() => itemToDelete && handleDelete(itemToDelete)}
                title={t('dashboard.tutor.dealsCoupons.deleteTitle')}
                message={t('dashboard.tutor.dealsCoupons.deleteMessage', { code: itemToDelete?.code ?? '' })}
                confirmButtonText={t('dashboard.tutor.dealsCoupons.deleteConfirm')}
            />

            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{t('dashboard.tutor.dealsCoupons.title')}</h1>
                    <p className="text-gray-600 mt-1">{t('dashboard.tutor.dealsCoupons.subtitle')}</p>
                </div>
                <button 
                    onClick={() => handleOpenModal(null)}
                    className="flex items-center gap-2 bg-[#0b6459] text-white font-semibold py-2.5 px-5 rounded-lg hover:bg-[#084c43] transition-colors"
                >
                    <HiPlus className="w-4 h-4" />
                    <span>{t('dashboard.tutor.dealsCoupons.createButton')}</span>
                </button>
            </div>

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
                            {coupons.map(coupon => (
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
                                        <ToggleSwitch enabled={coupon.isActive} onChange={(checked) => handleToggleActive(coupon.id, checked)} />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => handleOpenModal(coupon)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-md" title={t('dashboard.tutor.dealsCoupons.actions.edit')}><HiPencil className="w-4 h-4" /></button>
                                            <button onClick={() => setItemToDelete(coupon)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-md" title={t('dashboard.tutor.dealsCoupons.actions.delete')}><HiTrash className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DealsAndCouponsContent;
