import React, { useState, useEffect, useMemo } from "react";
import CustomDropdown from "../../../../components/ui/CustomDropdown";
import commonUtils from "../../../../utils/commonUtils";
import type { TutorOnboardingData, Gender } from '../../../../types/tutor';
import { useTranslation } from "react-i18next";

interface BasicInformationStepProps {
    data: Partial<TutorOnboardingData>;
    onChange: (data: Partial<TutorOnboardingData>) => void;
}

const BasicInformationStep: React.FC<BasicInformationStepProps> = ({ data, onChange }) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const { t } = useTranslation();

    const countries = useMemo(() => commonUtils.getAllCountries(), []);
    const allLanguages = useMemo(() => commonUtils.getAllLanguages(), [])
    const timezones = Intl.supportedValuesOf("timeZone");

    useEffect(() => {
        if (!data.gender) {
            onChange({ gender: "Male" });
        }
        if (!data.timezone) {
            const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            onChange({ timezone: currentTimezone });
        }
        if (!data.countryCode) {
            const currentCountryCode = navigator.language.split("-")[1]?.toUpperCase() || "VN";
            onChange({ countryCode: currentCountryCode });
        }
        if (!data.languages || !data.languages.some((lang) => lang.isNative)) {
            const currentLangCode = navigator.language.split("-")[0];
            const lang = allLanguages.find((l) => l.code === currentLangCode);
            if (lang) {
                const newLang = {
                    language: lang,
                    isNative: true,
                };
                onChange({ languages: [...(data.languages || []), newLang] });
            }
        }
    }, [data.gender, data.timezone, data.countryCode, data.languages, allLanguages, onChange]);

    const availableLanguages = useMemo(
        () => allLanguages.filter((l) => !data.languages?.some((lang) => lang.language?.code === l.code)),
        [allLanguages, data.languages]
    );

    const handleAddLanguage = (langName: string) => {
        const lang = allLanguages.find((l) => l.name === langName);
        if (lang && !data.languages?.some((l) => l.language?.code === lang.code)) {
            const newLang = {
                language: lang,
                isNative: false,
            };
            onChange({ languages: [...(data.languages || []), newLang] });
        }
    };


    const handleRemoveLanguage = (langCode: string) => {
        if (!data.languages) return;
        onChange({
            languages: data.languages.filter((l) => l.language?.code !== langCode),
        });
    };

    const inputStyles =
        "w-full bg-gray-100 border border-transparent rounded-lg px-4 py-2.5 text-gray-800 placeholder:text-gray-400 placeholder:font-thin hover:bg-white hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-0 focus:border-[#0b6459] transition-all duration-500 ease-in-out";
    const disabledInputStyles =
        "w-full bg-gray-100/60 border-transparent rounded-lg px-4 py-2.5 text-gray-500 placeholder:text-gray-400 placeholder:font-thin cursor-not-allowed hover:bg-gray-100/60 hover:border-gray-200 transition-all duration-500 ease-in-out";

    return (
        <div className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('onboarding.basicInfo.fullName')} <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.fullName}
                        onChange={(e) => onChange({ fullName: e.target.value })}
                        className={inputStyles}
                        placeholder={t('onboarding.basicInfo.yourFullName')}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('onboarding.basicInfo.gender')} <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center justify-start gap-18 mt-4">
                        <GenderRadioOption
                            label="Male"
                            selected={data.gender}
                            setSelected={(value: Gender) => onChange({ gender: value })}
                        />
                        <GenderRadioOption
                            label="Female"
                            selected={data.gender}
                            setSelected={(value: Gender) => onChange({ gender: value })}
                        />
                    </div>
                </div>
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('onboarding.basicInfo.email')} <span className="text-red-500">*</span>
                </label>
                <input type="email" value={data.email} disabled className={disabledInputStyles} />
            </div>

            {/* Location and Languages I know - Same Row (4 columns) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Country */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {t('onboarding.basicInfo.country')} <span className="text-red-500">*</span>
                    </label>
                    <CustomDropdown
                        options={countries.map((c) => c.name)}
                        selectedValue={countries.find((c) => c.code === data.countryCode)?.name || t('onboarding.basicInfo.selectCountry')}
                        placeholder={t('onboarding.basicInfo.selectCountry')}
                        onSelect={(value) => {
                            const country = countries.find((c) => c.name === value);
                            if (country) {
                                onChange({ countryCode: country.code });
                                // Force re-render
                                setOpenDropdown(null);
                            }
                        }}
                        dropdownId="country"
                        openDropdown={openDropdown}
                        setOpenDropdown={setOpenDropdown}
                        hasSearch={true}
                        searchPlaceholder={t('onboarding.basicInfo.searchCountry')}
                        position="top"
                    />
                </div>
                {/* Timezone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {t('onboarding.basicInfo.timezone')} <span className="text-red-500">*</span>
                    </label>
                    <CustomDropdown
                        options={timezones}
                        selectedValue={data.timezone || t('onboarding.basicInfo.selectTimezone')}
                        placeholder={t('onboarding.basicInfo.selectTimezone')}
                        onSelect={(value) => onChange({ timezone: value })}
                        dropdownId="timezone"
                        openDropdown={openDropdown}
                        setOpenDropdown={setOpenDropdown}
                        hasSearch={true}
                        searchPlaceholder={t('onboarding.basicInfo.searchTimezone')}
                        position="top"
                    />
                </div>
                {/* Native Language */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {t('onboarding.basicInfo.nativeLanguage')} <span className="text-red-500">*</span>
                    </label>
                    <CustomDropdown
                        options={allLanguages.map((l) => l.name)}
                        selectedValue={data.languages?.find((l) => l.isNative)?.language.name || t('onboarding.basicInfo.selectLanguage')}
                        placeholder={t('onboarding.basicInfo.selectLanguage')}
                        onSelect={(value) => {
                            const lang = allLanguages.find((l) => l.name === value);
                            if (lang) {
                                // Remove isNative from all languages and add the new one as native
                                const updatedLanguages = (data.languages || [])
                                    .filter((l) => l.language?.code !== lang.code)
                                    .map((l) => ({ ...l, isNative: false }));

                                updatedLanguages.push({
                                    language: lang,
                                    isNative: true,
                                });

                                onChange({ languages: updatedLanguages });
                            }
                        }}
                        dropdownId="native-language"
                        openDropdown={openDropdown}
                        setOpenDropdown={setOpenDropdown}
                        hasSearch={true}
                        searchPlaceholder={t('onboarding.basicInfo.searchLanguage')}
                        position="top"
                    />
                </div>
                {/* Languages I know Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {t('onboarding.basicInfo.languagesIKnow')} <span className="text-red-500">*</span>
                    </label>
                    {/* Add Language Dropdown - On Top */}
                    <div className="mb-2">
                        <CustomDropdown
                            options={availableLanguages.map((l) => l.name)}
                            selectedValue={t('onboarding.basicInfo.addLanguage')}
                            placeholder={t('onboarding.basicInfo.addLanguage')}
                            onSelect={(value) => {
                                handleAddLanguage(value);
                            }}
                            dropdownId="languages"
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                            hasSearch={true}
                            searchPlaceholder={t('onboarding.basicInfo.searchLanguage')}
                            position="top"
                        />
                    </div>
                    {/* Selected Languages Tags - Below Dropdown */}
                    {(data.languages || []).filter((lang) => lang.language?.code).length > 0 && (
                        <div className="flex flex-wrap gap-2 items-center min-h-[40px]">
                            {(data.languages || []).filter((lang) => lang.language?.code).map((lang) => (
                                <span
                                    key={lang.language?.code}
                                    className="text-xs text-gray-700 flex items-center gap-1.5 px-2 py-1 border border-gray-300 rounded"
                                >
                                    <span>{lang.language?.name || lang.language?.code}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveLanguage(lang.language!.code)}
                                        className="text-gray-400 hover:text-gray-600 text-sm leading-none"
                                    >
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const GenderRadioOption: React.FC<{
    label: Gender;
    selected: string | undefined;
    setSelected: (value: Gender) => void;
}> = ({ label, selected, setSelected }) => {
    const { t } = useTranslation();
    const getLabel = () => {
        if (label === 'Male') return t('onboarding.basicInfo.male');
        if (label === 'Female') return t('onboarding.basicInfo.female');
        return t('onboarding.basicInfo.notSpecified');
    };
    
    const isSelected = selected === label;
    
    return (
        <label className="flex items-center gap-2 cursor-pointer">
            <div className="relative">
                <input
                    type="radio"
                    name="gender"
                    checked={isSelected}
                    onChange={() => setSelected(label)}
                    className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                    isSelected 
                        ? 'border-[#0b6459] bg-[#0b6459]' 
                        : 'border-gray-300 bg-white hover:border-gray-400'
                }`}>
                    {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                    )}
                </div>
            </div>
            <span className={`text-sm font-medium transition-colors ${
                isSelected ? 'text-gray-800' : 'text-gray-600'
            }`}>
                {getLabel()}
            </span>
        </label>
    );
};

export default BasicInformationStep;
