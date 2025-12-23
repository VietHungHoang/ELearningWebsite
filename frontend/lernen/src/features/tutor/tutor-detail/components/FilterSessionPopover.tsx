import React, { useState } from 'react';
import CustomDropdown from '../../../../components/ui/CustomDropdown';
import { useTranslation } from 'react-i18next';

interface FilterSessionPopoverProps {
  onClose: () => void;
}

const FilterSessionPopover: React.FC<FilterSessionPopoverProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const sessionTypePlaceholder = t('tutorDetail.filterSessionPopover.showAllType');
    const subjectPlaceholder = t('tutorDetail.filterSessionPopover.selectSubject');

    const [selectedSessionType, setSelectedSessionType] = useState(sessionTypePlaceholder);
    const [selectedSubject, setSelectedSubject] = useState(subjectPlaceholder);

    const sessionTypeOptions = [
        t('tutorDetail.filterSessionPopover.showAllType'),
        t('tutorDetail.filterSessionPopover.privateSession'),
        t('tutorDetail.filterSessionPopover.groupSession')
    ];
    const subjectOptions = [
        t('tutorDetail.filterSessionPopover.selectSubject'),
        t('tutorDetail.filterSessionPopover.mathematics'),
        t('tutorDetail.filterSessionPopover.science'),
        t('tutorDetail.filterSessionPopover.english'),
        t('tutorDetail.filterSessionPopover.history'),
        t('tutorDetail.filterSessionPopover.art')
    ];

    const handleApply = () => {
        // In a real app, this would trigger a filter function
        console.log('Applying filters:', {
            sessionType: selectedSessionType,
            subject: selectedSubject,
        });
        onClose();
    };

    return (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl z-50 p-6 border border-gray-100">
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-bold text-gray-800 block mb-2">{t('tutorDetail.filterSessionPopover.selectSessionType')}</label>
                    <CustomDropdown
                        options={sessionTypeOptions}
                        selectedValue={selectedSessionType}
                        placeholder={sessionTypePlaceholder}
                        onSelect={setSelectedSessionType}
                        dropdownId="sessionType"
                        openDropdown={openDropdown}
                        setOpenDropdown={setOpenDropdown}
                    />
                </div>
                <div>
                    <label className="text-sm font-bold text-gray-800 block mb-2">{t('tutorDetail.filterSessionPopover.selectSubject')}</label>
                     <CustomDropdown
                        options={subjectOptions}
                        selectedValue={selectedSubject}
                        placeholder={subjectPlaceholder}
                        onSelect={setSelectedSubject}
                        dropdownId="subject"
                        openDropdown={openDropdown}
                        setOpenDropdown={setOpenDropdown}
                    />
                </div>
            </div>
            <button
                onClick={handleApply}
                className="w-full mt-6 bg-[#0b6459] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#084c43] transition-colors"
            >
                {t('tutorDetail.filterSessionPopover.applyFilter')}
            </button>
        </div>
    );
};

export default FilterSessionPopover;
