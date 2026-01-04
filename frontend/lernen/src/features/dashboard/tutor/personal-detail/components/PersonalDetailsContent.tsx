import React, { useState, useEffect, useMemo } from 'react';
import {
    HiSparkles,
    HiChevronDown,
    HiCloudUpload,
    HiTrash,
    HiX,
    HiGlobe,
    HiVideoCamera,
    HiCheckCircle,
    HiExclamationCircle,
} from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import FileUpload from '../../components/FileUpload';
import WriteWithAIModal from '../../pages/components/WriteWithAIModal';
import { useTutorProfile } from '../../../../../hooks/useTutorProfile';
import { useAuth } from '../../../../../context/AuthContext';
import type { Country, Language, Subject } from '../../../../../types/common';
import type { Tutor, TutorSocial } from '../../../../../types/tutor';
import CustomDropdownDashboard from '../../../../../components/ui/CustomDropdownDashboard';
import ResumeHighlightsContent from './ResumeHighlightsContent';
import AccountSettingsContent from './AccountSettingsContent';
import IdentityVerificationContent from './IdentityVerificationContent';
import commonUtils from '../../../../../utils/commonUtils';

interface PersonalDetailsContentProps {
    tutor: Tutor | null;
}

interface ApiLanguage extends Language {
    isNative?: boolean;
}

interface SocialLink extends TutorSocial {
    id: string;
}

const PersonalDetailsContent: React.FC<PersonalDetailsContentProps> = ({ tutor }) => {
    const { t } = useTranslation();
    const { updateProfile } = useTutorProfile();
    const loading = !tutor;
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [selectedProfilePhoto, setSelectedProfilePhoto] = useState<File | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<File | null>(null);

    const [activeFormats, setActiveFormats] = useState({
        bold: false,
        italic: false,
        underline: false,
    });

    // Get countries, languages, and timezones data
    const countries = commonUtils.getAllCountries();
    const allLanguages = commonUtils.getAllLanguages();
    const allTimezones = commonUtils.getAllTimezones();

    // Local state for form inputs
    const [formData, setFormData] = useState({
        fullName: "",
        gender: "",
        country: { code: "", name: "", flag: "" },
        nativeLanguage: null as ApiLanguage | null,
        languages: [] as ApiLanguage[],
        timezone: null as { code: string; name: string; offset: string } | null,
        headline: "",
        subjects: [] as Subject[],
        introduction: "",
        socialLinks: [] as SocialLink[],
        profilePhoto: null as { name: string; url: string } | null,
        introVideo: null as File | null,
        videoUrl: "",
        currentSessionFee: 0,
    });

    const [originalData, setOriginalData] = useState<typeof formData | null>(null); 0

    // State for dropdown options from API
    const [countryOptions, setCountryOptions] = useState<Country[]>([]);
    const [languageOptions, setLanguageOptions] = useState<Language[]>([]);
    const [subjectOptions, setSubjectOptions] = useState<Subject[]>([]);

    // Fetch dropdown options from API
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                // TODO: Implement API calls for countries, languages, subjects
                const countries: Country[] = [
                    { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
                    { code: 'US', name: 'United States', flag: '🇺🇸' },
                    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
                ];
                const languages: Language[] = [
                    { code: 'en', name: 'English' },
                    { code: 'vi', name: 'Vietnamese' },
                    { code: 'ja', name: 'Japanese' },
                ];
                const subjects: Subject[] = [
                    { id: '1', name: 'Mathematics', categoryId: '1' },
                    { id: '2', name: 'Physics', categoryId: '1' },
                    { id: '3', name: 'English', categoryId: '2' },
                ];

                setCountryOptions(countries);
                setLanguageOptions(languages);
                setSubjectOptions(subjects);
            } catch (error) {
                console.error('Failed to fetch dropdown options:', error);
            }
        };
        fetchOptions();
    }, []);

    // Sync form data with tutor data when loaded
    useEffect(() => {
        if (tutor) {
            // Find full country info from country.code
            const countryCode = tutor.country?.code || "";
            const fullCountry = countryCode ? commonUtils.getCountryByCode(countryCode) : null;

            // Find full timezone info from timezone name
            const tutorTimezone = tutor.timezone || "";
            const fullTimezone = tutorTimezone ? commonUtils.getTimezoneByName(tutorTimezone) : null;

            const initialData = {
                fullName: tutor.fullName || "",
                gender: tutor.gender || "",
                country: fullCountry || { code: countryCode, name: "", flag: "" },
                nativeLanguage: tutor.languages?.find(lang => lang.isNative)?.language ? { code: tutor.languages.find(lang => lang.isNative)!.language.code, name: tutor.languages.find(lang => lang.isNative)!.language.name, isNative: true } : null,
                languages: tutor.languages?.map(lang => ({ code: lang.language.code, name: lang.language.name, isNative: lang.isNative })) || [],
                timezone: fullTimezone || null,
                headline: tutor.headline || "",
                subjects: tutor.subjects || [],
                introduction: tutor.introduction || "",
                socialLinks: tutor.socialLinks?.map((link, index) => ({ ...link, id: `social-${index}` })) || [],
                profilePhoto: tutor.avatarUrl ? { name: "Profile Photo", url: tutor.avatarUrl } : null,
                introVideo: null, // File objects can't be stored in API
                videoUrl: tutor.videoUrl || "",
                currentSessionFee: tutor.currentSessionFee || 0,
            };
            setFormData(initialData);
            setOriginalData(initialData);
        }
    }, [tutor]);

    const availableLanguages = useMemo(
        () => languageOptions.filter((l) => !formData.languages.some(lang => lang.code === l.code)),
        [languageOptions, formData.languages]
    );

    const availableSubjects = useMemo(
        () => subjectOptions.filter((s) => !formData.subjects.some(subj => subj.id === s.id)),
        [subjectOptions, formData.subjects]
    );

    const handleSocialLinkChange = (socialLinkId: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            socialLinks: prev.socialLinks.map(link =>
                link.id === socialLinkId ? { ...link, url: value } : link
            ),
        }));
    };

    const toggleFormat = (format: keyof typeof activeFormats) => {
        setActiveFormats((prev) => ({ ...prev, [format]: !prev[format] }));
    };

    const handleAddLanguage = (lang: Language) => {
        if (!formData.languages.some(l => l.code === lang.code)) {
            setFormData((prev) => ({
                ...prev,
                languages: [...prev.languages, { ...lang, isNative: false }],
            }));
        }
    };

    const handleAddSubject = (subject: Subject) => {
        if (!formData.subjects.some(s => s.id === subject.id)) {
            setFormData((prev) => ({
                ...prev,
                subjects: [...prev.subjects, subject],
            }));
        }
    };

    const handleProfilePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedProfilePhoto(file);
            // Create a preview URL
            const previewUrl = URL.createObjectURL(file);
            setFormData((prev) => ({
                ...prev,
                profilePhoto: { name: file.name, url: previewUrl },
            }));
        }
    };

    const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedVideo(file);
            setFormData((prev) => ({
                ...prev,
                videoUrl: URL.createObjectURL(file),
            }));
        }
    };

    // Check if form data has changed
    const hasChanges = useMemo(() => {
        if (!originalData) return false;
        return (
            formData.fullName !== originalData.fullName ||
            formData.gender !== originalData.gender ||
            formData.country.name !== originalData.country.name ||
            formData.nativeLanguage?.code !== originalData.nativeLanguage?.code ||
            JSON.stringify(formData.languages) !== JSON.stringify(originalData.languages) ||
            formData.headline !== originalData.headline ||
            JSON.stringify(formData.subjects) !== JSON.stringify(originalData.subjects) ||
            formData.introduction !== originalData.introduction ||
            JSON.stringify(formData.socialLinks) !== JSON.stringify(originalData.socialLinks) ||
            formData.introVideo !== originalData.introVideo ||
            formData.profilePhoto?.url !== originalData.profilePhoto?.url ||
            formData.videoUrl !== originalData.videoUrl ||
            formData.currentSessionFee !== originalData.currentSessionFee
        );
    }, [formData, originalData]);

    const handleSave = async () => {
        try {
            await updateProfile({
                fullName: formData.fullName,
                gender: formData.gender as "Male" | "Female" | "Not specified",
                country: formData.country.name,
                languages: formData.nativeLanguage ? [formData.nativeLanguage, ...formData.languages] : formData.languages,
                headline: formData.headline,
                subjects: formData.subjects,
                introduction: formData.introduction,
                socialLinks: formData.socialLinks,
            });

            // Update original data after successful save
            setOriginalData(formData);
        } catch (err) {
            console.error("Failed to save", err);
        }
    };

    const inputStyles =
        "w-full bg-gray-100 border border-transparent rounded-lg px-4 py-2 text-gray-800 placeholder:text-gray-400 placeholder:font-thin hover:bg-white hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-0 focus:border-[#0b6459] transition-all duration-500 ease-in-out";
    const disabledInputStyles =
        "w-full bg-gray-100/60 border-transparent rounded-lg px-4 py-2 text-gray-500 placeholder:text-gray-400 placeholder:font-thin cursor-not-allowed hover:bg-gray-100/60 hover:border-gray-200 transition-all duration-800 ease-in-out";

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div>
                    <div className="h-8 bg-gray-300 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
                <div className="flex gap-4">
                    <div className="h-10 bg-gray-300 rounded w-32"></div>
                    <div className="h-10 bg-gray-300 rounded w-32"></div>
                    <div className="h-10 bg-gray-300 rounded w-32"></div>
                    <div className="h-10 bg-gray-300 rounded w-32"></div>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="h-10 bg-gray-300 rounded"></div>
                        <div className="h-10 bg-gray-300 rounded"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="h-10 bg-gray-300 rounded"></div>
                        <div className="h-10 bg-gray-300 rounded"></div>
                    </div>
                    <div className="h-20 bg-gray-300 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Basic Information Title */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">{t('dashboard.tutor.personalDetails.title')}</h2>
                <p className="text-sm text-gray-600 mt-1">{t('dashboard.tutor.personalDetails.description')}</p>
            </div>

            <form className="space-y-0">
                {/* Full Name */}
                <div className="flex items-center py-8 border-b border-gray-200">
                    <div className="w-48 text-left">
                        <label className="text-sm font-medium text-gray-700">
                            {t('dashboard.tutor.personalDetails.fullName')} <span className="text-red-500">*</span>
                        </label>
                    </div>
                    <div className="flex-1 pl-4">
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    fullName: e.target.value,
                                }))
                            }
                            className={inputStyles}
                            placeholder={t('dashboard.tutor.personalDetails.fullNamePlaceholder')}
                        />
                    </div>
                </div>

                {/* Gender */}
                <div className="flex items-center py-8 border-b border-gray-200">
                    <div className="w-48 text-left">
                        <label className="text-sm font-medium text-gray-700">
                            {t('dashboard.tutor.personalDetails.gender')} <span className="text-red-500">*</span>
                        </label>
                    </div>
                    <div className="flex-1 pl-4">
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Male"
                                    checked={formData.gender === "Male"}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            gender: e.target.value as "Male" | "Female" | "Not specified",
                                        }))
                                    }
                                    className="sr-only"
                                />
                                <div className={`w-5 h-5 ${formData.gender === "Male" ? "border-4 border-[#0b6459]" : "border-2 border-gray-300"} rounded-full flex items-center justify-center transition-all`}>
                                    <div className={`w-3 h-3 bg-white rounded-full ${formData.gender === "Male" ? "block" : "hidden"}`}></div>
                                </div>
                                <span className="text-sm font-medium text-gray-700">{t('dashboard.tutor.personalDetails.male')}</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Female"
                                    checked={formData.gender === "Female"}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            gender: e.target.value as "Male" | "Female" | "Not specified",
                                        }))
                                    }
                                    className="sr-only"
                                />
                                <div className={`w-5 h-5 ${formData.gender === "Female" ? "border-4 border-[#0b6459]" : "border-2 border-gray-300"} rounded-full flex items-center justify-center transition-all`}>
                                    <div className={`w-3 h-3 bg-white rounded-full ${formData.gender === "Female" ? "block" : "hidden"}`}></div>
                                </div>
                                <span className="text-sm font-medium text-gray-700">{t('dashboard.tutor.personalDetails.female')}</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Headline */}
                <div className="flex items-center py-8 border-b border-gray-200">
                    <div className="w-48 text-left">
                        <label className="text-sm font-medium text-gray-700">{t('dashboard.tutor.personalDetails.headline')} <span className="text-red-500">*</span></label>
                    </div>
                    <div className="flex-1 pl-4">
                        <input
                            type="text"
                            value={formData.headline}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    headline: e.target.value,
                                }))
                            }
                            className={inputStyles}
                            placeholder={t('dashboard.tutor.personalDetails.headlinePlaceholder')}
                        />
                    </div>
                </div>

                {/* Introduction */}
                <div className="flex items-start py-8 border-b border-gray-200">
                    <div className="w-48 text-left pt-3">
                        <label className="text-sm font-medium text-gray-700">{t('dashboard.tutor.personalDetails.introduction')} <span className="text-red-500">*</span></label>
                    </div>
                    <div className="flex-1 pl-4">
                        <textarea
                            value={formData.introduction}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    introduction: e.target.value,
                                }))
                            }
                            rows={5}
                            className={`${inputStyles} resize-none`}
                            placeholder={t('dashboard.tutor.personalDetails.introductionPlaceholder')}
                        />
                    </div>
                </div>

                {/* Country */}
                <div className="flex items-center py-8 border-b border-gray-200">
                    <div className="w-48 text-left">
                        <label className="text-sm font-medium text-gray-700">{t('dashboard.tutor.personalDetails.country')} <span className="text-red-500">*</span></label>
                    </div>
                    <div className="flex-1 pl-4">
                        <CustomDropdownDashboard
                            options={countries.map(country => country.name)}
                            selectedValue={formData.country?.name || t('dashboard.tutor.personalDetails.countryPlaceholder')}
                            placeholder={t('dashboard.tutor.personalDetails.countryPlaceholder')}
                            onSelect={(value: string) => {
                                const selectedCountry = countries.find(c => c.name === value);
                                setFormData((prev) => ({
                                    ...prev,
                                    country: selectedCountry || { code: "", name: "", flag: "" },
                                }));
                            }}
                            dropdownId="country"
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                            hasSearch={true}
                        />
                    </div>
                </div>

                {/* Timezone */}
                <div className="flex items-center py-8 border-b border-gray-200">
                    <div className="w-48 text-left">
                        <label className="text-sm font-medium text-gray-700">{t('dashboard.tutor.personalDetails.timezone', 'Timezone')} <span className="text-red-500">*</span></label>
                    </div>
                    <div className="flex-1 pl-4">
                        <CustomDropdownDashboard
                            options={allTimezones.map(tz => `(GMT${tz.offset}) ${tz.name}`)}
                            selectedValue={formData.timezone ? `(GMT${formData.timezone.offset}) ${formData.timezone.name}` : t('dashboard.tutor.personalDetails.timezonePlaceholder', 'Select your timezone')}
                            placeholder={t('dashboard.tutor.personalDetails.timezonePlaceholder', 'Select your timezone')}
                            onSelect={(value: string) => {
                                // Extract timezone name from the formatted string
                                const match = value.match(/\(GMT[+-]\d{2}:\d{2}\)\s(.+)/);
                                if (match) {
                                    const tzName = match[1];
                                    const selectedTz = allTimezones.find(tz => tz.name === tzName);
                                    setFormData((prev) => ({
                                        ...prev,
                                        timezone: selectedTz || null,
                                    }));
                                }
                            }}
                            dropdownId="timezone"
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                            hasSearch={true}
                        />
                    </div>
                </div>

                {/* Native Language */}
                <div className="flex items-center py-8 border-b border-gray-200">
                    <div className="w-48 text-left">
                        <label className="text-sm font-medium text-gray-700">{t('dashboard.tutor.personalDetails.nativeLanguage')} <span className="text-red-500">*</span></label>
                    </div>
                    <div className="flex-1 pl-4">
                        <CustomDropdownDashboard
                            options={allLanguages.map(lang => lang.name)}
                            selectedValue={formData.nativeLanguage?.name || t('dashboard.tutor.personalDetails.nativeLanguagePlaceholder')}
                            placeholder={t('dashboard.tutor.personalDetails.nativeLanguagePlaceholder')}
                            onSelect={(value: string) => {
                                const selectedLang = allLanguages.find(l => l.name === value);
                                if (selectedLang) {
                                    setFormData((prev) => ({
                                        ...prev,
                                        nativeLanguage: { ...selectedLang, isNative: true },
                                        languages: prev.languages.filter(l => !l.isNative), // Remove old native language from languages array
                                    }));
                                }
                            }}
                            dropdownId="native-language"
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                            hasSearch={true}
                        />
                    </div>
                </div>

                {/* Languages I Know */}
                <div className="py-8 border-b border-gray-200">
                    <div className="flex items-center mb-3">
                        <div className="w-48 text-left">
                            <label className="text-sm font-medium text-gray-700">{t('dashboard.tutor.personalDetails.languagesKnown')} <span className="text-red-500">*</span></label>
                        </div>
                        <div className="flex-1 pl-4">
                            <CustomDropdownDashboard
                                options={allLanguages
                                    .filter(lang => lang.code !== formData.nativeLanguage?.code && !formData.languages.some(l => l.code === lang.code))
                                    .map(lang => lang.name)}
                                selectedValue={t('dashboard.tutor.personalDetails.addLanguage')}
                                placeholder={t('dashboard.tutor.personalDetails.addLanguage')}
                                onSelect={(value: string) => {
                                    const selectedLang = allLanguages.find(l => l.name === value);
                                    if (selectedLang && !formData.languages.some(l => l.code === selectedLang.code)) {
                                        setFormData((prev) => ({
                                            ...prev,
                                            languages: [...prev.languages, { ...selectedLang, isNative: false }],
                                        }));
                                    }
                                }}
                                dropdownId="languages"
                                openDropdown={openDropdown}
                                setOpenDropdown={setOpenDropdown}
                                hasSearch={true}
                            />
                        </div>
                    </div>
                    {/* Selected Languages List */}
                    {formData.languages.filter(lang => !lang.isNative).length > 0 && (
                        <div className="ml-[calc(12rem+1rem)]">
                            <div className="flex flex-wrap gap-2">
                                {formData.languages.filter(lang => !lang.isNative).map((lang, index) => (
                                    <div key={index} className="bg-white border border-gray-200 shadow-xs rounded-lg px-2 py-0.75 text-xs font-normal flex items-center gap-2">
                                        <span>{lang.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    languages: prev.languages.filter(l => l.code !== lang.code),
                                                }));
                                            }}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <HiX className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Photos and Videos */}
                <div className="py-8">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">{t('dashboard.tutor.personalDetails.photosAndVideos')}</h3>
                        <p className="text-sm text-gray-600 mt-1">{t('dashboard.tutor.personalDetails.photosAndVideosDescription')}</p>
                    </div>

                    {/* Profile Photo */}
                    <div className="flex items-center py-8 border-b border-gray-200">
                        <div className="w-48 text-left">
                            <label className="text-sm font-medium text-gray-700">{t('dashboard.tutor.personalDetails.profilePhoto')} <span className="text-red-500">*</span></label>
                        </div>
                        <div className="flex-1 pl-4">
                            <div className="w-full">
                                {formData.profilePhoto?.url ? (
                                    <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white">
                                        <div className="flex items-center">
                                            <img
                                                src={formData.profilePhoto.url}
                                                alt="Profile"
                                                className="w-12 h-12 rounded-lg object-cover mr-4"
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{selectedProfilePhoto?.name || 'Profile Photo'}</p>
                                                <p className="text-xs text-gray-500">{t('dashboard.tutor.personalDetails.clickToChange')}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedProfilePhoto(null);
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    profilePhoto: null,
                                                }));
                                            }}
                                            className="text-gray-400 hover:text-red-500 p-1"
                                        >
                                            <HiTrash className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#0b6459] transition-colors bg-gray-50 hover:bg-gray-100/50 cursor-pointer"
                                        onClick={() => document.getElementById('profile-photo-input')?.click()}
                                    >
                                        <div className="flex items-center">
                                            <HiCloudUpload className="w-8 h-8 text-gray-400 mr-4 flex-shrink-0" />
                                            <div className="text-left">
                                                <p className="text-sm text-gray-600 mb-1">
                                                    {t('dashboard.tutor.personalDetails.dropFileHere')}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {t('dashboard.tutor.personalDetails.imageFormats')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <input
                                    id="profile-photo-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfilePhotoSelect}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Introduction Video */}
                    <div className="flex items-center py-8 border-b border-gray-200">
                        <div className="w-48 text-left">
                            <label className="text-sm font-medium text-gray-700">{t('dashboard.tutor.personalDetails.introductionVideo')} <span className="text-red-500">*</span></label>
                        </div>
                        <div className="flex-1 pl-4">
                            <div className="w-full">
                                {selectedVideo ? (
                                    <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white">
                                        <div className="flex items-center">
                                            <HiVideoCamera className="w-12 h-12 text-gray-400 mr-4 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{selectedVideo.name}</p>
                                                <p className="text-xs text-gray-500">{t('dashboard.tutor.personalDetails.clickToChange')}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedVideo(null);
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    videoUrl: "",
                                                }));
                                            }}
                                            className="text-gray-400 hover:text-red-500 p-1"
                                        >
                                            <HiTrash className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#0b6459] transition-colors bg-gray-50 hover:bg-gray-100/50 cursor-pointer"
                                        onClick={() => document.getElementById('video-input')?.click()}
                                    >
                                        <div className="flex items-center">
                                            <HiVideoCamera className="w-8 h-8 text-gray-400 mr-4 flex-shrink-0" />
                                            <div className="text-left">
                                                <p className="text-sm text-gray-600 mb-1">
                                                    {t('dashboard.tutor.personalDetails.dropFileHere')}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {t('dashboard.tutor.personalDetails.videoFormats')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <input
                                    id="video-input"
                                    type="file"
                                    accept="video/*"
                                    onChange={handleVideoSelect}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="pb-8">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">{t('dashboard.tutor.personalDetails.socialLinks')}</h3>
                        <p className="text-sm text-gray-600 mt-1">{t('dashboard.tutor.personalDetails.socialLinksDescription')}</p>
                    </div>

                    {/* Facebook */}
                    <div className="flex items-center py-8 border-b border-gray-200">
                        <div className="w-48 text-left">
                            <label className="text-sm font-medium text-gray-700">{t('dashboard.tutor.personalDetails.facebookUrl')}</label>
                        </div>
                        <div className="flex-1 pl-4">
                            <input
                                type="url"
                                value={formData.socialLinks?.find(link => link.platform === 'facebook')?.url || ''}
                                onChange={(e) => {
                                    const url = e.target.value;
                                    setFormData((prev) => {
                                        const existingLinks = prev.socialLinks || [];
                                        const facebookIndex = existingLinks.findIndex(link => link.platform === 'facebook');

                                        if (facebookIndex >= 0) {
                                            // Update existing Facebook link
                                            const updatedLinks = [...existingLinks];
                                            updatedLinks[facebookIndex] = { ...updatedLinks[facebookIndex], url };
                                            return { ...prev, socialLinks: updatedLinks };
                                        } else if (url.trim()) {
                                            // Add new Facebook link
                                            return {
                                                ...prev,
                                                socialLinks: [...existingLinks, { platform: 'facebook', url, id: `facebook-${Date.now()}` }]
                                            };
                                        }
                                        return prev;
                                    });
                                }}
                                className={inputStyles}
                                placeholder={t('dashboard.tutor.personalDetails.facebookPlaceholder')}
                            />
                        </div>
                    </div>

                    {/* Instagram */}
                    <div className="flex items-center py-8 border-b border-gray-200">
                        <div className="w-48 text-left">
                            <label className="text-sm font-medium text-gray-700">{t('dashboard.tutor.personalDetails.instagramUrl')}</label>
                        </div>
                        <div className="flex-1 pl-4">
                            <input
                                type="url"
                                value={formData.socialLinks?.find(link => link.platform === 'instagram')?.url || ''}
                                onChange={(e) => {
                                    const url = e.target.value;
                                    setFormData((prev) => {
                                        const existingLinks = prev.socialLinks || [];
                                        const instagramIndex = existingLinks.findIndex(link => link.platform === 'instagram');

                                        if (instagramIndex >= 0) {
                                            // Update existing Instagram link
                                            const updatedLinks = [...existingLinks];
                                            updatedLinks[instagramIndex] = { ...updatedLinks[instagramIndex], url };
                                            return { ...prev, socialLinks: updatedLinks };
                                        } else if (url.trim()) {
                                            // Add new Instagram link
                                            return {
                                                ...prev,
                                                socialLinks: [...existingLinks, { platform: 'instagram', url, id: `instagram-${Date.now()}` }]
                                            };
                                        }
                                        return prev;
                                    });
                                }}
                                className={inputStyles}
                                placeholder={t('dashboard.tutor.personalDetails.instagramPlaceholder')}
                            />
                        </div>
                    </div>

                    {/* LinkedIn */}
                    <div className="flex items-center py-8 border-b border-gray-200">
                        <div className="w-48 text-left">
                            <label className="text-sm font-medium text-gray-700">{t('dashboard.tutor.personalDetails.linkedinUrl')}</label>
                        </div>
                        <div className="flex-1 pl-4">
                            <input
                                type="url"
                                value={formData.socialLinks?.find(link => link.platform === 'linkedin')?.url || ''}
                                onChange={(e) => {
                                    const url = e.target.value;
                                    setFormData((prev) => {
                                        const existingLinks = prev.socialLinks || [];
                                        const linkedinIndex = existingLinks.findIndex(link => link.platform === 'linkedin');

                                        if (linkedinIndex >= 0) {
                                            // Update existing LinkedIn link
                                            const updatedLinks = [...existingLinks];
                                            updatedLinks[linkedinIndex] = { ...updatedLinks[linkedinIndex], url };
                                            return { ...prev, socialLinks: updatedLinks };
                                        } else if (url.trim()) {
                                            // Add new LinkedIn link
                                            return {
                                                ...prev,
                                                socialLinks: [...existingLinks, { platform: 'linkedin', url, id: `linkedin-${Date.now()}` }]
                                            };
                                        }
                                        return prev;
                                    });
                                }}
                                className={inputStyles}
                                placeholder={t('dashboard.tutor.personalDetails.linkedinPlaceholder')}
                            />
                        </div>
                    </div>

                    {/* Twitter/X */}
                    <div className="flex items-center py-8 border-b border-gray-200">
                        <div className="w-48 text-left">
                            <label className="text-sm font-medium text-gray-700">{t('dashboard.tutor.personalDetails.twitterUrl')}</label>
                        </div>
                        <div className="flex-1 pl-4">
                            <input
                                type="url"
                                value={formData.socialLinks?.find(link => link.platform === 'twitter')?.url || ''}
                                onChange={(e) => {
                                    const url = e.target.value;
                                    setFormData((prev) => {
                                        const existingLinks = prev.socialLinks || [];
                                        const twitterIndex = existingLinks.findIndex(link => link.platform === 'twitter');

                                        if (twitterIndex >= 0) {
                                            // Update existing Twitter link
                                            const updatedLinks = [...existingLinks];
                                            updatedLinks[twitterIndex] = { ...updatedLinks[twitterIndex], url };
                                            return { ...prev, socialLinks: updatedLinks };
                                        } else if (url.trim()) {
                                            // Add new Twitter link
                                            return {
                                                ...prev,
                                                socialLinks: [...existingLinks, { platform: 'twitter', url, id: `twitter-${Date.now()}` }]
                                            };
                                        }
                                        return prev;
                                    });
                                }}
                                className={inputStyles}
                                placeholder={t('dashboard.tutor.personalDetails.twitterPlaceholder')}
                            />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end items-center gap-3">
                    <p className="text-sm text-gray-600 font-normal">{t('dashboard.tutor.personalDetails.saveDescription')}</p>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#0a5a50] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        {t('dashboard.tutor.personalDetails.saveAndUpdate')}
                    </button>
                </div>
            </form>

            {/* Modals */}
            <WriteWithAIModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
        </>
    );
};

export default PersonalDetailsContent;