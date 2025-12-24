import React, { useState, useEffect, useMemo } from 'react';
import type { Coupon, CouponDiscountType } from '../pages/DealsAndCouponsPage';
import CustomDropdown from '../../../../components/ui/CustomDropdown';
import ModalLayout from '../../../../components/ui/ModalLayout';
import { useTranslation } from 'react-i18next';

const mockCourseList = [
    'Time Management Mastery: Boost Your Productivity',
    'Decision-Making Mastery: Make Better Choices',
    "Beginner's Guide to Python Programming",
    'Advanced Productivity Hacks for Creatives',
];

interface CreateCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (couponData: Omit<Coupon, 'id' | 'timesUsed'>) => void;
  existingCoupon: Coupon | null;
}

const CreateCouponModal: React.FC<CreateCouponModalProps> = ({ isOpen, onClose, onSave, existingCoupon }) => {
    const { t } = useTranslation();
    const [shouldRender, setShouldRender] = useState(isOpen);
    
    // Form state
    const [code, setCode] = useState('');
    const [discountType, setDiscountType] = useState<CouponDiscountType>('Percentage');
    const [discountValue, setDiscountValue] = useState<number | ''>('');
    const [applicableCourses, setApplicableCourses] = useState<string[]>(['All']);
    const [usageLimit, setUsageLimit] = useState<number | ''>('');
    const [unlimitedUsage, setUnlimitedUsage] = useState(true);
    const [expiryDate, setExpiryDate] = useState('');
    const [isActive, setIsActive] = useState(true);

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            if (existingCoupon) {
                setCode(existingCoupon.code);
                setDiscountType(existingCoupon.discountType);
                setDiscountValue(existingCoupon.discountValue);
                setApplicableCourses(existingCoupon.applicableCourses);
                setUsageLimit(existingCoupon.usageLimit ?? '');
                setUnlimitedUsage(existingCoupon.usageLimit === null);
                setExpiryDate(existingCoupon.expiryDate);
                setIsActive(existingCoupon.isActive);
            } else {
                // Reset form for new coupon
                setCode('');
                setDiscountType('Percentage');
                setDiscountValue('');
                setApplicableCourses(['All']);
                setUsageLimit('');
                setUnlimitedUsage(true);
                setExpiryDate('');
                setIsActive(true);
            }
        } else {
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen, existingCoupon]);

    const handleSave = () => {
        // Add validation here in a real app
        onSave({
            code,
            discountType,
            discountValue: Number(discountValue),
            applicableCourses,
            usageLimit: unlimitedUsage ? null : Number(usageLimit),
            expiryDate,
            isActive,
        });
    };
    
    const handleCourseToggle = (course: string) => {
        setApplicableCourses(prev => {
            if (prev.includes(course)) {
                const newCourses = prev.filter(c => c !== course);
                return newCourses.length === 0 ? ['All'] : newCourses;
            } else {
                return [...prev.filter(c => c !== 'All'), course];
            }
        });
    };

    const discountTypeOptions = useMemo(() => ([
        { value: 'Percentage' as CouponDiscountType, label: t('dashboard.tutor.dealsCoupons.modal.discountType.percentage') },
        { value: 'Fixed' as CouponDiscountType, label: t('dashboard.tutor.dealsCoupons.modal.discountType.fixed') },
    ]), [t]);

    const courseOptions = useMemo(() => ([
        { value: 'All', label: t('dashboard.tutor.dealsCoupons.modal.courses.all') },
        ...mockCourseList.map(course => ({ value: course, label: course }))
    ]), [t]);

    if (!shouldRender) return null;

    const inputStyles = "w-full px-3 py-2 bg-[#f7f7f8] border border-transparent rounded-lg focus:outline-none focus:border-[#0b6459] focus:bg-white hover:border-gray-300 hover:bg-white transition-all duration-300 ease-in-out placeholder:text-gray-300 text-sm text-gray-800";

    return (
        <ModalLayout
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="2xl"
            showCloseButton={true}
        >
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <h2 className="font-bold text-lg text-gray-800">{existingCoupon ? t('dashboard.tutor.dealsCoupons.modal.editTitle') : t('dashboard.tutor.dealsCoupons.modal.createTitle')}</h2>
                </div>
                
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Coupon Code */}
                    <div>
                        <label htmlFor="coupon-code" className="block text-sm font-medium text-gray-700 mb-1">{t('dashboard.tutor.dealsCoupons.modal.code.label')}</label>
                        <input id="coupon-code" type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder={t('dashboard.tutor.dealsCoupons.modal.code.placeholder')} className={inputStyles} />
                    </div>
                    
                    {/* Discount Type & Value */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">{t('dashboard.tutor.dealsCoupons.modal.discountType.label')}</label>
                           <CustomDropdown
                                options={discountTypeOptions.map(opt => opt.label)}
                                selectedValue={discountTypeOptions.find(opt => opt.value === discountType)?.label ?? ''}
                                placeholder={t('dashboard.tutor.dealsCoupons.modal.discountType.placeholder')}
                                onSelect={(val) => {
                                    const matched = discountTypeOptions.find(opt => opt.label === val);
                                    if (matched) setDiscountType(matched.value);
                                }}
                                dropdownId="discount-type"
                                openDropdown={openDropdown}
                                setOpenDropdown={setOpenDropdown}
                           />
                        </div>
                         <div>
                            <label htmlFor="discount-value" className="block text-sm font-medium text-gray-700 mb-1">{t('dashboard.tutor.dealsCoupons.modal.value.label')}</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{discountType === 'Fixed' ? t('dashboard.tutor.dealsCoupons.currencySymbol') : '%'}</span>
                                <input id="discount-value" type="number" value={discountValue} onChange={e => setDiscountValue(Number(e.target.value))} className={`${inputStyles} pl-7`} />
                            </div>
                        </div>
                    </div>

                    {/* Applicable Courses */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('dashboard.tutor.dealsCoupons.modal.courses.label')}</label>
                        <CustomDropdown 
                            options={courseOptions.map(opt => opt.label)}
                            selectedValue={applicableCourses.length === 1 && applicableCourses[0] === 'All' ? t('dashboard.tutor.dealsCoupons.modal.courses.allCoursesLabel') : t('dashboard.tutor.dealsCoupons.modal.courses.selectedCount', { count: applicableCourses.length })}
                            placeholder={t('dashboard.tutor.dealsCoupons.modal.courses.placeholder')}
                            onSelect={(label: string) => {
                                const matched = courseOptions.find(opt => opt.label === label);
                                if (matched) handleCourseToggle(matched.value);
                            }} // This is simplified. A real multi-select would be better.
                            dropdownId="courses-select"
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                        />
                         <p className="text-xs text-gray-500 mt-1">{t('dashboard.tutor.dealsCoupons.modal.courses.helper')}</p>
                    </div>

                    {/* Usage Limit */}
                     <div>
                        <label htmlFor="usage-limit" className="block text-sm font-medium text-gray-700 mb-1">{t('dashboard.tutor.dealsCoupons.modal.usageLimit.label')}</label>
                        <input id="usage-limit" type="number" value={usageLimit} onChange={e => setUsageLimit(Number(e.target.value))} disabled={unlimitedUsage} className={`${inputStyles} ${unlimitedUsage ? 'bg-[#f7f7f8] opacity-50 cursor-not-allowed' : ''}`} />
                        <label className="flex items-center gap-2 mt-2 text-sm">
                            <input type="checkbox" checked={unlimitedUsage} onChange={e => setUnlimitedUsage(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-[#0b6459] focus:ring-[#0b6459]"/>
                            {t('dashboard.tutor.dealsCoupons.modal.usageLimit.unlimited')}
                        </label>
                    </div>

                    {/* Expiry Date */}
                    <div>
                        <label htmlFor="expiry-date" className="block text-sm font-medium text-gray-700 mb-1">{t('dashboard.tutor.dealsCoupons.modal.expiryDate.label')}</label>
                        <input id="expiry-date" type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className={inputStyles} />
                    </div>
                </div>

                <div className="flex justify-end items-center gap-3 p-4 bg-gray-50 border-t border-gray-100">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">{t('common.cancel')}</button>
                    <button onClick={handleSave} className="px-5 py-2.5 text-sm font-semibold bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43]">{t('dashboard.tutor.dealsCoupons.modal.saveButton')}</button>
                </div>
            </div>
        </ModalLayout>
    );
};

export default CreateCouponModal;
