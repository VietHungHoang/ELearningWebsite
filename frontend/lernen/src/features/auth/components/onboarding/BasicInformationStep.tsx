import React, { useState, useEffect, useMemo } from "react";
import CustomDropdown from "../../../../components/ui/CustomDropdown";
import commonUtils from "../../../../utils/commonUtils.ts";
import type { Gender, Language, Tutor } from "../../../../types/api.ts";

interface BasicInformationStepProps {
    data: Partial<Tutor>;
    onChange: (data: Partial<Tutor>) => void;
}

const BasicInformationStep: React.FC<BasicInformationStepProps> = ({ data, onChange }) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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
                const newLang: Language = {
                    code: lang.code,
                    name: lang.name,
                    isNative: true,
                };
                onChange({ languages: [...(data.languages || []), newLang] });
            }
        }
    }, [data.gender, data.timezone, data.countryCode, data.languages, allLanguages, onChange]);

    const availableLanguages = useMemo(
        () => allLanguages.filter((l) => !data.languages?.some((lang) => lang.code === l.code)),
        [allLanguages, data.languages]
    );

    const handleAddLanguage = (langName: string) => {
        const lang = allLanguages.find((l) => l.name === langName);
        if (lang && !data.languages?.some((l) => l.code === lang.code)) {
            const newLang: Language = {
                code: lang.code,
                name: lang.name,
                isNative: false,
            };
            onChange({ languages: [...(data.languages || []), newLang] });
        }
    };

    const handleToggleNative = (langCode: string) => {
        if (!data.languages) return;

        const updatedLanguages = data.languages.map((lang) => ({
            ...lang,
            isNative: lang.code === langCode ? !lang.isNative : false,
        }));

        onChange({ languages: updatedLanguages });
    };

    const handleRemoveLanguage = (langCode: string) => {
        if (!data.languages) return;
        onChange({
            languages: data.languages.filter((l) => l.code !== langCode),
        });
    };

    const inputStyles =
        "w-full bg-gray-100 border border-transparent rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-0 focus:border-[#0b6459] transition";
    const disabledInputStyles =
        "w-full bg-gray-100/60 border-transparent rounded-lg px-4 py-2.5 text-gray-500 cursor-not-allowed";

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-gray-800">Basic Information</h3>
                <p className="text-sm text-gray-500 mt-1">Tell us about yourself to get started</p>
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
                            setSelected={(value: Gender) => onChange({ gender: value })}
                        />
                        <GenderButton
                            label="Female"
                            selected={data.gender}
                            setSelected={(value: Gender) => onChange({ gender: value })}
                        />
                        <GenderButton
                            label="Not specified"
                            selected={data.gender}
                            setSelected={(value: Gender) => onChange({ gender: value })}
                        />
                    </div>
                </div>
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                </label>
                <input type="email" value={data.email} disabled className={disabledInputStyles} />
            </div>

            {/* Address */}
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Address <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-xs text-gray-500 block mb-1.5 ml-1">Country</label>
                        <CustomDropdown
                            options={countries.map((c) => c.name)}
                            selectedValue={countries.find((c) => c.code === data.countryCode)?.name || "Select country"}
                            placeholder="Select country"
                            onSelect={(value) => {
                                const country = countries.find((c) => c.name === value);
                                if (country) {
                                    onChange({ countryCode: country.code });
                                }
                            }}
                            dropdownId="country"
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                            hasSearch={true}
                            searchPlaceholder="Search country..."
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 block mb-1.5 ml-1">Timezone</label>
                        <CustomDropdown
                            options={timezones}
                            selectedValue={data.timezone || "Select timezone"}
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
                        <label className="text-xs text-gray-500 block mb-1.5 ml-1">Native Language</label>
                        <CustomDropdown
                            options={allLanguages.map((l) => l.name)}
                            selectedValue={data.languages?.find((l) => l.isNative)?.name || "Select language"}
                            placeholder="Select language"
                            onSelect={(value) => {
                                const lang = allLanguages.find((l) => l.name === value);
                                if (lang) {
                                    // Remove isNative from all languages and add the new one as native
                                    const updatedLanguages = (data.languages || [])
                                        .filter((l) => l.code !== lang.code)
                                        .map((l) => ({ ...l, isNative: false }));

                                    updatedLanguages.push({
                                        code: lang.code,
                                        name: lang.name,
                                        isNative: true,
                                    });

                                    onChange({ languages: updatedLanguages });
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
                    {(data.languages || []).map((lang) => (
                        <span
                            key={lang.code}
                            className="bg-white px-3 py-1 rounded-md text-sm font-medium flex items-center gap-2 border border-gray-200"
                        >
                            <button
                                type="button"
                                onClick={() => handleToggleNative(lang.code)}
                                className={`text-xs px-1.5 py-0.5 rounded ${
                                    lang.isNative
                                        ? "bg-[#0b6459] text-white"
                                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                }`}
                                title={lang.isNative ? "Native language" : "Mark as native"}
                            >
                                N
                            </button>
                            {lang.name}
                            <button
                                type="button"
                                onClick={() => handleRemoveLanguage(lang.code)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                    <div className="flex-grow min-w-[150px]">
                        <CustomDropdown
                            options={availableLanguages.map((l) => l.name)}
                            selectedValue="Add a language..."
                            placeholder="Add a language..."
                            onSelect={(value) => {
                                handleAddLanguage(value);
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

const GenderButton: React.FC<{
    label: Gender;
    selected: string | undefined;
    setSelected: (value: Gender) => void;
}> = ({ label, selected, setSelected }) => (
    <button
        type="button"
        onClick={() => setSelected(label)}
        className={`flex-1 px-2 py-2 text-sm font-medium transition-colors duration-200 rounded-lg focus:outline-none ${
            selected === label ? "bg-white text-gray-800 shadow-sm" : "text-gray-600 hover:bg-white/60"
        }`}
    >
        {label}
    </button>
);

export default BasicInformationStep;
