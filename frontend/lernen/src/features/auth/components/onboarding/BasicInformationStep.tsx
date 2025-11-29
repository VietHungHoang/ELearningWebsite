import React, { useState, useEffect, useMemo } from 'react';
import CustomDropdown from '../../../../components/ui/CustomDropdown';
import { useCommon } from '../../../../context/CommonContext';
import type { Language as ApiLanguage } from '../../../../types/api';

interface BasicInformationData {
    fullName: string;
    email: string;
    gender: string;
    country: string;
    timezone: string;
    nativeLanguage: ApiLanguage | null;
    languages: ApiLanguage[];
}

interface BasicInformationStepProps {
    data: BasicInformationData;
    onChange: (data: Partial<BasicInformationData>) => void;
}

const GenderButton: React.FC<{
    label: string;
    selected: string;
    setSelected: (value: string) => void;
}> = ({ label, selected, setSelected }) => (
    <button
        type="button"
        onClick={() => setSelected(label)}
        className={`flex-1 px-2 py-2 text-sm font-medium transition-colors duration-200 rounded-lg focus:outline-none ${selected === label ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600 hover:bg-white/60'
            }`}
    >
        {label}
    </button>
);

const BasicInformationStep: React.FC<BasicInformationStepProps> = ({ data, onChange }) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const { countries, languages } = useCommon();

    const timezones = Intl.supportedValuesOf('timeZone');

    // Auto-select Male as default gender
    useEffect(() => {
        if (!data.gender) {
            onChange({ gender: 'Male' });
        }
    }, []);

    const availableLanguages = useMemo(
        () => languages.filter((l: any) => !data.languages.some(lang => lang.id === l.id)),
        [languages, data.languages]
    );

    const handleAddLanguage = (lang: any) => {
        if (!data.languages.some(l => l.id === lang.id)) {
            onChange({ languages: [...data.languages, lang] });
        }
    };

    const inputStyles =
        'w-full bg-gray-100 border border-transparent rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-0 focus:border-[#0b6459] transition';
    const disabledInputStyles =
        'w-full bg-gray-100/60 border-transparent rounded-lg px-4 py-2.5 text-gray-500 cursor-not-allowed';

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-gray-800">Basic Information</h3>
                <p className="text-sm text-gray-500 mt-1">
                    Tell us about yourself to get started
                </p>
            </div>

            {/* Full Name and Gender in 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.fullName}
                        onChange={(e) => onChange({ fullName: e.target.value })}
                        className={inputStyles}
                        placeholder="Your full name"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender <span className="text-red-500">*</span>
                    </label>
                    <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1">
                        <GenderButton
                            label="Male"
                            selected={data.gender}
                            setSelected={(value) => onChange({ gender: value })}
                        />
                        <GenderButton
                            label="Female"
                            selected={data.gender}
                            setSelected={(value) => onChange({ gender: value })}
                        />
                        <GenderButton
                            label="Not specified"
                            selected={data.gender}
                            setSelected={(value) => onChange({ gender: value })}
                        />
                    </div>
                </div>
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    value={data.email}
                    disabled
                    className={disabledInputStyles}
                />
            </div>

            {/* Address */}
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Address <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-xs text-gray-500 block mb-1.5 ml-1">
                            Country
                        </label>
                        <CustomDropdown
                            options={countries.map((c: any) => c.name)}
                            selectedValue={data.country || 'Select country'}
                            placeholder="Select country"
                            onSelect={(value) => onChange({ country: value })}
                            dropdownId="country"
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                            hasSearch={true}
                            searchPlaceholder="Search country..."
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 block mb-1.5 ml-1">
                            Timezone
                        </label>
                        <CustomDropdown
                            options={timezones}
                            selectedValue={data.timezone || 'Select timezone'}
                            placeholder="Select timezone"
                            onSelect={(value) => onChange({ timezone: value })}
                            dropdownId="timezone"
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                            hasSearch={true}
                            searchPlaceholder="Search timezone..."
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 block mb-1.5 ml-1">
                            Native Language
                        </label>
                        <CustomDropdown
                            options={languages.map((l: any) => l.name)}
                            selectedValue={data.nativeLanguage?.name || 'Select language'}
                            placeholder="Select language"
                            onSelect={(value) => {
                                const lang = languages.find((l: any) => l.name === value);
                                if (lang) {
                                    onChange({ nativeLanguage: lang });
                                }
                            }}
                            dropdownId="native-language"
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                            hasSearch={true}
                            searchPlaceholder="Search language..."
                        />
                    </div>
                </div>
            </div>

            {/* Languages I know */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Languages I know <span className="text-red-500">*</span>
                </label>
                <div className="p-2 bg-gray-100 border border-transparent rounded-lg flex flex-wrap gap-2 items-center focus-within:border-[#0b6459] transition-colors">
                    {data.languages.map((lang) => (
                        <span
                            key={lang.id}
                            className="bg-white px-3 py-1 rounded-md text-sm font-medium flex items-center gap-2 border border-gray-200"
                        >
                            {lang.name}
                            <button
                                type="button"
                                onClick={() =>
                                    onChange({
                                        languages: data.languages.filter((l) => l.id !== lang.id)
                                    })
                                }
                                className="text-gray-400 hover:text-gray-600"
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                    <div className="flex-grow min-w-[150px]">
                        <CustomDropdown
                            options={availableLanguages.map(l => l.name)}
                            selectedValue="Add a language..."
                            placeholder="Add a language..."
                            onSelect={(value) => {
                                const lang = availableLanguages.find(l => l.name === value);
                                if (lang) handleAddLanguage(lang);
                            }}
                            dropdownId="languages"
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                            hasSearch={true}
                            searchPlaceholder="Search language..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BasicInformationStep;
