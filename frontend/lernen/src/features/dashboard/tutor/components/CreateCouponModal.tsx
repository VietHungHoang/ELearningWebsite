import React, { useState, useEffect } from 'react';
import { HiX } from 'react-icons/hi';
import type { Coupon, CouponDiscountType } from '../pages/DealsAndCouponsPage';
import CustomDropdown from '../../../../components/ui/CustomDropdown';

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

    if (!shouldRender) return null;

    const inputStyles = "w-full bg-gray-100 border border-transparent rounded-lg px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-0 focus:border-[#0b6459] transition";

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'bg-black/50 opacity-100' : 'opacity-0'}`}>
            <div className={`bg-white rounded-2xl shadow-xl w-full max-w-2xl transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <h2 className="font-bold text-lg text-gray-800">{existingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"><HiX className="w-5 h-5" /></button>
                </div>
                
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Coupon Code */}
                    <div>
                        <label htmlFor="coupon-code" className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                        <input id="coupon-code" type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="e.g. SUMMER25" className={inputStyles} />
                    </div>
                    
                    {/* Discount Type & Value */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                           <CustomDropdown
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
                                <input id="discount-value" type="number" value={discountValue} onChange={e => setDiscountValue(Number(e.target.value))} className={`${inputStyles} pl-7`} />
                            </div>
                        </div>
                    </div>

                    {/* Applicable Courses */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Applicable Courses</label>
                        <CustomDropdown 
                            options={['All', ...mockCourseList]}
                            selectedValue={applicableCourses.length === 1 && applicableCourses[0] === 'All' ? 'All Courses' : `${applicableCourses.length} course(s) selected`}
                            placeholder="Select courses"
                            onSelect={handleCourseToggle} // This is simplified. A real multi-select would be better.
                            dropdownId="courses-select"
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                        />
                         <p className="text-xs text-gray-500 mt-1">Select 'All' or choose specific courses.</p>
                    </div>

                    {/* Usage Limit */}
                     <div>
                        <label htmlFor="usage-limit" className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                        <input id="usage-limit" type="number" value={usageLimit} onChange={e => setUsageLimit(Number(e.target.value))} disabled={unlimitedUsage} className={`${inputStyles} ${unlimitedUsage ? 'bg-gray-200 cursor-not-allowed' : ''}`} />
                        <label className="flex items-center gap-2 mt-2 text-sm">
                            <input type="checkbox" checked={unlimitedUsage} onChange={e => setUnlimitedUsage(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-[#0b6459] focus:ring-[#0b6459]"/>
                            Unlimited usage
                        </label>
                    </div>

                    {/* Expiry Date */}
                    <div>
                        <label htmlFor="expiry-date" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <input id="expiry-date" type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className={inputStyles} />
                    </div>
                </div>

                <div className="flex justify-end items-center gap-3 p-4 bg-gray-50 border-t border-gray-100">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">Cancel</button>
                    <button onClick={handleSave} className="px-5 py-2.5 text-sm font-semibold bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43]">Save Coupon</button>
                </div>
            </div>
        </div>
    );
};

export default CreateCouponModal;
