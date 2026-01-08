import React, { useState, useEffect } from 'react';
import type { Coupon, CouponDiscountType } from '../DealsAndCouponsPage';
import CustomDropdownDashboard from '../../../../../components/ui/CustomDropdownDashboard';
import ModalLayout from '../../../../../components/ui/ModalLayout';
import { classService } from '../../../../../services/classService';

interface ClassOption {
    id: string;
    title: string;
}

interface CreateCouponModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (couponData: Omit<Coupon, 'id' | 'timesUsed'>) => void;
    existingCoupon: Coupon | null;
}

const CreateCouponModal: React.FC<CreateCouponModalProps> = ({ isOpen, onClose, onSave, existingCoupon }) => {
    // Form state
    const [code, setCode] = useState('');
    const [discountType, setDiscountType] = useState<CouponDiscountType>('Percentage');
    const [discountValue, setDiscountValue] = useState<number | ''>('');
    const [applicableClasses, setApplicableClasses] = useState<string[]>(['All']);
    const [usageLimit, setUsageLimit] = useState<number | ''>('');
    const [unlimitedUsage, setUnlimitedUsage] = useState(true);
    const [expiryDate, setExpiryDate] = useState('');
    const [isActive, setIsActive] = useState(true);

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [classList, setClassList] = useState<ClassOption[]>([]);
    const [isLoadingClasses, setIsLoadingClasses] = useState(false);

    // Fetch classes when modal opens
    useEffect(() => {
        const fetchClasses = async () => {
            if (!isOpen) return;

            setIsLoadingClasses(true);
            try {
                const response = await classService.getClassesForTutor({ size: 100 });
                if (response.success && response.data?.content) {
                    setClassList(response.data.content
                        .filter(c => c.title)
                        .map(c => ({
                            id: c.id,
                            title: c.title!
                        })));
                }
            } catch (error) {
                console.error('Failed to fetch classes:', error);
            } finally {
                setIsLoadingClasses(false);
            }
        };

        fetchClasses();
    }, [isOpen]);

    const resetForm = () => {
        setCode('');
        setDiscountType('Percentage');
        setDiscountValue('');
        setApplicableClasses(['All']);
        setUsageLimit('');
        setUnlimitedUsage(true);
        setExpiryDate('');
        setIsActive(true);
    };

    // Set form data when existingCoupon changes (not when isOpen changes)
    // This prevents re-render during animation
    useEffect(() => {
        if (existingCoupon) {
            setCode(existingCoupon.code);
            setDiscountType(existingCoupon.discountType);
            setDiscountValue(existingCoupon.discountValue);
            setApplicableClasses(existingCoupon.applicableCourses);
            setUsageLimit(existingCoupon.usageLimit ?? '');
            setUnlimitedUsage(existingCoupon.usageLimit === null);
            setExpiryDate(existingCoupon.expiryDate);
            setIsActive(existingCoupon.isActive);
        } else {
            // Reset form for new coupon
            resetForm();
        }
    }, [existingCoupon]);

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSave = () => {
        onSave({
            code,
            discountType,
            discountValue: Number(discountValue),
            applicableCourses: applicableClasses,
            usageLimit: unlimitedUsage ? null : Number(usageLimit),
            expiryDate,
            isActive,
        });
        resetForm();
    };

    const handleClassToggle = (classTitle: string) => {
        setApplicableClasses(prev => {
            if (prev.includes(classTitle)) {
                const newClasses = prev.filter(c => c !== classTitle);
                return newClasses.length === 0 ? ['All'] : newClasses;
            } else {
                return [...prev.filter(c => c !== 'All'), classTitle];
            }
        });
    };

    const inputStyles = "w-full px-3 py-2 bg-white border border-transparent rounded-lg focus:outline-none focus:border-[#0b6459] focus:bg-white hover:border-gray-300 hover:bg-white transition-all duration-300 ease-in-out placeholder:text-gray-300 text-sm text-gray-800";

    return (
        <ModalLayout
            isOpen={isOpen}
            onClose={handleClose}
            maxWidth="2xl"
            showCloseButton={true}
        >
            <div className="flex flex-col h-full max-h-[80vh] overflow-hidden relative z-10">
                <div className="p-6 flex-1 overflow-y-auto relative z-20">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">{existingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h2>

                    <div className="space-y-4">
                        {/* Coupon Code */}
                        <div>
                            <label htmlFor="coupon-code" className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                            <input
                                id="coupon-code"
                                type="text"
                                value={code}
                                onChange={e => setCode(e.target.value.toUpperCase())}
                                placeholder="e.g. SUMMER25"
                                className={inputStyles}
                            />
                        </div>

                        {/* Discount Type & Value */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                                <CustomDropdownDashboard
                                    options={['Percentage', 'Fixed']}
                                    selectedValue={discountType}
                                    placeholder="Select type"
                                    onSelect={(val) => setDiscountType(val as CouponDiscountType)}
                                    dropdownId="discount-type"
                                    openDropdown={openDropdown}
                                    setOpenDropdown={setOpenDropdown}
                                />
                            </div>
                            <div>
                                <label htmlFor="discount-value" className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{discountType === 'Fixed' ? '$' : '%'}</span>
                                    <input
                                        id="discount-value"
                                        type="number"
                                        value={discountValue}
                                        onChange={e => setDiscountValue(Number(e.target.value))}
                                        className={`${inputStyles} pl-7`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Applicable Classes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Áp dụng cho lớp</label>
                            <CustomDropdownDashboard
                                options={isLoadingClasses ? ['Đang tải...'] : ['All', ...classList.map(c => c.title)]}
                                selectedValue={applicableClasses.length === 1 && applicableClasses[0] === 'All' ? 'Tất cả các lớp' : `${applicableClasses.length} lớp đã chọn`}
                                placeholder="Chọn lớp"
                                onSelect={handleClassToggle}
                                dropdownId="classes-select"
                                openDropdown={openDropdown}
                                setOpenDropdown={setOpenDropdown}
                            />
                            <p className="text-xs text-gray-500 mt-1">Chọn 'All' hoặc các lớp cụ thể.</p>
                        </div>

                        {/* Usage Limit */}
                        <div>
                            <label htmlFor="usage-limit" className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                            <input
                                id="usage-limit"
                                type="number"
                                value={usageLimit}
                                onChange={e => setUsageLimit(Number(e.target.value))}
                                disabled={unlimitedUsage}
                                className={`${inputStyles} ${unlimitedUsage ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            />
                            <label className="flex items-center gap-2 mt-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={unlimitedUsage}
                                    onChange={e => setUnlimitedUsage(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-[#0b6459] focus:ring-[#0b6459]"
                                />
                                Unlimited usage
                            </label>
                        </div>

                        {/* Expiry Date */}
                        <div>
                            <label htmlFor="expiry-date" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                            <input
                                id="expiry-date"
                                type="date"
                                value={expiryDate}
                                onChange={e => setExpiryDate(e.target.value)}
                                className={inputStyles}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-white">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-semibold bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] transition-colors"
                    >
                        Save Coupon
                    </button>
                </div>
            </div>
        </ModalLayout>
    );
};

export default CreateCouponModal;
