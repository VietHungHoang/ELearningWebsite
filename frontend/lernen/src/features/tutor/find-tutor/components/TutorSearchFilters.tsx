import React, { useState, useEffect, useRef, useCallback } from 'react';
import CustomDropdown from '../../../../components/ui/CustomDropdown';
import commonUtils from '../../../../utils/commonUtils';
import type { TutorSearchFilter } from '../../../../types/api';
import type { Category, Language, Subject, Timezone } from '../../../../types/common';
import { useTranslation } from 'react-i18next';
import { tutorService } from '../../../../services/tutorService';

// --- Type Definitions ---
interface TutorSearchFiltersProps {
  onFilterChange: (filters: TutorSearchFilter) => void;
  onSearch: (keyword: string) => void;
}

interface FuzzySearchSuggestion {
  id: string;
  text: string;
  type: 'tutor' | 'subject' | 'category';
}

interface MultiSelectDropdownProps {
    label: string;
    options: string[];
    selectedOptions: string[];
    placeholder: string;
    onToggleOption: (option: string) => void;
    dropdownId: string;
    openDropdown: string | null;
    setOpenDropdown: React.Dispatch<React.SetStateAction<string | null>>;
    loading?: boolean;
    loadingText?: string;
}

interface MultiSelectDropdownWithSearchProps {
    label: string;
    options: string[];
    selectedOptions: string[];
    placeholder: string;
    onToggleOption: (option: string) => void;
    dropdownId: string;
    openDropdown: string | null;
    setOpenDropdown: React.Dispatch<React.SetStateAction<string | null>>;
    searchPlaceholder?: string;
    loading?: boolean;
    loadingText?: string;
}

// --- Reusable Multi-Select Dropdown Component ---
const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ label, options, selectedOptions, placeholder, onToggleOption, dropdownId, openDropdown, setOpenDropdown, loading = false, loadingText = "Loading..." }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const tagsContainerRef = useRef<HTMLDivElement>(null);
    const isOpen = openDropdown === dropdownId;

    const handleToggle = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setOpenDropdown(isOpen ? null : dropdownId);
    };

    const handleRemoveOption = (option: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); // Ngăn dropdown mở/đóng khi xóa tag
        onToggleOption(option);
    };
    
    useEffect(() => {
        if (tagsContainerRef.current) {
            // Scroll to the end to show the latest added item
            tagsContainerRef.current.scrollLeft = tagsContainerRef.current.scrollWidth;
        }
    }, [selectedOptions]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                if(isOpen) {
                   setOpenDropdown(null);
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, setOpenDropdown]);

    return (
        <div className="relative" ref={dropdownRef}>
            <div onClick={handleToggle} className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-sm min-h-[70px] cursor-pointer flex flex-col justify-center">
                <label className="text-xs text-[#585858] block mb-1.5">{label}</label>
                <div className="flex items-center justify-between">
                    <div ref={tagsContainerRef} className="flex-1 min-w-0 flex flex-nowrap gap-1 items-center overflow-x-auto no-scrollbar">
                        {selectedOptions.length === 0 ? (
                            <span className="text-sm font-normal text-[rgba(88,88,88,0.4)]">{placeholder}</span>
                        ) : (
                            selectedOptions.map(option => (
                                <div key={option} className="flex-shrink-0 bg-gray-100 text-gray-800 text-xs font-semibold pl-2.5 pr-1 py-1 rounded-full flex items-center gap-1.5">
                                    <span>{option}</span>
                                    <button onClick={(e) => handleRemoveOption(option, e)} className="bg-gray-300 hover:bg-gray-400 text-gray-600 hover:text-black rounded-full h-4 w-4 flex items-center justify-center focus:outline-none transition-colors">
                                        <svg className="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M1 1l6 6m0 0l6 6M7 7L1 13m6-6l6-6"/></svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                    <svg className={`flex-shrink-0 ml-2 w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 10 13 14 9"></polyline></svg>
                </div>
            </div>
            {isOpen && (
                <div className="dropdown-modal absolute z-20 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-200/80 p-2">
                    <ul className="space-y-1 max-h-60 overflow-y-auto">
                        {loading ? (
                            <li className="p-2 text-sm text-gray-500 text-center">
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Loading...
                                </div>
                            </li>
                        ) : (
                            options.map((option, index) => {
                                const isSelected = selectedOptions.includes(option);
                                return (
                                    <li key={index} onClick={() => onToggleOption(option)} className={`dropdown-option p-2 text-sm font-medium rounded-lg cursor-pointer flex justify-between items-center ${isSelected ? 'bg-gray-100 font-semibold text-gray-900' : 'text-gray-800 hover:bg-gray-50'}`}>
                                        <span>{option}</span>
                                        {isSelected && (
                                            <svg className="w-4 h-4 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                        )}
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

// --- Reusable Multi-Select Dropdown with Search Component ---
const MultiSelectDropdownWithSearch: React.FC<MultiSelectDropdownWithSearchProps> = ({ label, options, selectedOptions, placeholder, onToggleOption, dropdownId, openDropdown, setOpenDropdown, searchPlaceholder = "Search...", loading = false, loadingText = "Loading..." }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const tagsContainerRef = useRef<HTMLDivElement>(null);
    const isOpen = openDropdown === dropdownId;
    const [searchTerm, setSearchTerm] = useState("");

    const handleToggle = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setOpenDropdown(isOpen ? null : dropdownId);
    };

    const handleRemoveOption = (option: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onToggleOption(option);
    };

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    useEffect(() => {
        if (tagsContainerRef.current) {
            tagsContainerRef.current.scrollLeft = tagsContainerRef.current.scrollWidth;
        }
    }, [selectedOptions]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                if (isOpen) {
                    setOpenDropdown(null);
                    setSearchTerm("");
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, setOpenDropdown]);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <div onClick={handleToggle} className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-sm min-h-[70px] cursor-pointer flex flex-col justify-center">
                <label className="text-xs text-[#585858] block mb-1.5">{label}</label>
                <div className="flex items-center justify-between">
                    <div ref={tagsContainerRef} className="flex-1 min-w-0 flex flex-nowrap gap-1 items-center overflow-x-auto no-scrollbar">
                        {selectedOptions.length === 0 ? (
                            <span className="text-sm font-normal text-[rgba(88,88,88,0.4)]">{placeholder}</span>
                        ) : (
                            selectedOptions.map(option => (
                                <div key={option} className="flex-shrink-0 bg-gray-100 text-gray-800 text-xs font-semibold pl-2.5 pr-1 py-1 rounded-full flex items-center gap-1.5">
                                    <span>{option}</span>
                                    <button onClick={(e) => handleRemoveOption(option, e)} className="bg-gray-300 hover:bg-gray-400 text-gray-600 hover:text-black rounded-full h-4 w-4 flex items-center justify-center focus:outline-none transition-colors">
                                        <svg className="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M1 1l6 6m0 0l6 6M7 7L1 13m6-6l6-6" /></svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                    <svg className={`flex-shrink-0 ml-2 w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 10 13 14 9"></polyline></svg>
                </div>
            </div>
            {isOpen && (
                <div className="dropdown-modal absolute z-20 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-200/80 p-2">
                    <div className="p-1 mb-1">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder={searchPlaceholder}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#065a46] text-[rgba(88,88,88,0.4)]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <ul className="space-y-1 max-h-60 overflow-y-auto">
                        {loading ? (
                            <li className="p-2 text-sm text-gray-500 text-center">
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Loading...
                                </div>
                            </li>
                        ) : (
                            filteredOptions.map((option, index) => {
                                const isSelected = selectedOptions.includes(option);
                                return (
                                    <li key={index} onClick={() => onToggleOption(option)} className={`dropdown-option p-2 text-sm font-medium rounded-lg cursor-pointer flex justify-between items-center ${isSelected ? 'bg-gray-100 font-semibold text-gray-900' : 'text-gray-800 hover:bg-gray-50'}`}>
                                        <span>{option}</span>
                                        {isSelected && (
                                            <svg className="w-4 h-4 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                        )}
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

interface TutorSearchFiltersProps {
    onSearch: (keyword: string) => void;
    onFilterChange: (filters: TutorSearchFilter) => void;
}


// --- Main Filters Component ---
export default function TutorSearchFilters({ onSearch, onFilterChange }: TutorSearchFiltersProps): React.ReactElement {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<string>(t('findTutors.filters.tabs.allSessions'));
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [feeRange, setFeeRange] = useState([0, 150]);
    const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
    const availabilityRef = useRef<HTMLDivElement>(null);
    const [keyword, setKeyword] = useState<string>('');
    const [fuzzySuggestions, setFuzzySuggestions] = useState<FuzzySearchSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const searchTimeoutRef = useRef<number | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Debounced fuzzy search function
    const debouncedFuzzySearch = useCallback((searchTerm: string) => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (!searchTerm.trim()) {
            setFuzzySuggestions([]);
            setShowSuggestions(false);
            return;
        }

        searchTimeoutRef.current = window.setTimeout(async () => {
            setIsSearching(true);
            try {
                const response = await tutorService.getFuzzySearchSuggestions(searchTerm);
                if (response.success) {
                    setFuzzySuggestions(response.data);
                    setShowSuggestions(response.data.length > 0);
                } else {
                    setFuzzySuggestions([]);
                    setShowSuggestions(false);
                }
            } catch (error) {
                console.error('Fuzzy search error:', error);
                // Fallback to mock data if API fails
                const mockSuggestions: FuzzySearchSuggestion[] = [
                    { id: '1', text: `${searchTerm} tutor`, type: 'tutor' as const },
                    { id: '2', text: `${searchTerm} subject`, type: 'subject' as const },
                    { id: '3', text: `Advanced ${searchTerm}`, type: 'category' as const },
                ].filter(suggestion => 
                    suggestion.text.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setFuzzySuggestions(mockSuggestions);
                setShowSuggestions(mockSuggestions.length > 0);
            } finally {
                setIsSearching(false);
            }
        }, 300); // 300ms debounce
    }, []);

    // Handle keyword input change
    const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setKeyword(value);
        debouncedFuzzySearch(value);
    };

    // Handle suggestion selection
    const handleSuggestionSelect = (suggestion: FuzzySearchSuggestion) => {
        setKeyword(suggestion.text);
        setShowSuggestions(false);
        setFuzzySuggestions([]);
        // Trigger full search
        onSearch(suggestion.text);
    };

    // Handle Enter key press
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setShowSuggestions(false);
            setFuzzySuggestions([]);
            // Trigger full search
            onSearch(keyword);
        }
    };

    // Handle input focus/blur
    const handleInputFocus = () => {
        if (fuzzySuggestions.length > 0) {
            setShowSuggestions(true);
        }
    };

    const handleInputBlur = () => {
        // Delay hiding suggestions to allow click on suggestions
        setTimeout(() => setShowSuggestions(false), 150);
    };


    const MIN_FEE = 0;
    const MAX_FEE = 200;
    const FEE_GAP = 10;

    // Category cache states with loading flags
    const [categories, setCategories] = useState<Category[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [timezones, setTimezones] = useState<Timezone[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    
    // Loading states for lazy loading
    const [loadingFilterData, setLoadingFilterData] = useState<boolean>(false);

    const placeholders = {
        category: t('findTutors.filters.placeholders.chooseCategory'),
        subject: t('findTutors.filters.placeholders.chooseSubject'),
        languages: t('findTutors.filters.placeholders.selectLanguages'),
        sortBy: t('findTutors.filters.placeholders.sortBy'),
        timezone: t('findTutors.filters.placeholders.selectTimezone'),
    };
    
    const [selectedValues, setSelectedValues] = useState({
        category: placeholders.category,
        subject: placeholders.subject,
        sortBy: placeholders.sortBy,
        timezone: placeholders.timezone,
    });
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    const tabs: string[] = [
        t('findTutors.filters.tabs.allSessions'),
        t('findTutors.filters.tabs.privateSessions'),
        t('findTutors.filters.tabs.groupSessions')
    ];
    const activeShadowClass = 'shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1),_0px_1px_2px_0px_rgba(16,24,40,0.06)]';

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // Lazy load filter data on mount with caching - load once and cache to avoid repeated API calls
    useEffect(() => {
        const fetchFilterData = async () => {
            // Fetch categories and subjects from commonUtils (with localStorage caching)
            if ((categories.length === 0 || subjects.length === 0) && !loadingFilterData) {
                setLoadingFilterData(true);
                try {
                    const [categoriesResponse, subjectsResponse] = await Promise.all([
                        commonUtils.getCategories(),
                        commonUtils.getSubjects()
                    ]);

                    setCategories(categoriesResponse || []);
                    setSubjects(subjectsResponse || []);

                    // Set static data for timezones and languages (no API call needed)
                    setTimezones(commonUtils.getAllTimezones());
                    setLanguages(commonUtils.getAllLanguages());

                } catch (error) {
                    console.error('Failed to fetch filter data:', error);
                    // Set empty arrays on error
                    setCategories([]);
                    setSubjects([]);
                    setTimezones([]);
                    setLanguages([]);
                } finally {
                    setLoadingFilterData(false);
                }
            }
        };

        fetchFilterData();
    }, []); // Empty dependency array - only run once on mount

    // Convert to string arrays for dropdowns
    const categoryOptions: string[] = categories.map(cat => cat.name);
    const subjectOptions: string[] = selectedCategoryId 
        ? subjects.filter(sub => sub.categoryId === selectedCategoryId).map(sub => sub.name)
        : subjects.map(sub => sub.name);
    const timezoneOptions: string[] = timezones.map(tz => tz.name);
    const sortByOptions: string[] = [
        t('findTutors.filters.sortOptions.relevance'),
        t('findTutors.filters.sortOptions.newestFirst'),
        t('findTutors.filters.sortOptions.oldestFirst')
    ];
    const languageOptions: string[] = languages.map(lang => lang.name);
    const availabilityDays = [
        t('findTutors.filters.availability.days.mon'),
        t('findTutors.filters.availability.days.tue'),
        t('findTutors.filters.availability.days.wed'),
        t('findTutors.filters.availability.days.thu'),
        t('findTutors.filters.availability.days.fri'),
        t('findTutors.filters.availability.days.sat'),
        t('findTutors.filters.availability.days.sun')
    ];
    const availabilityTimes = [
        t('findTutors.filters.availability.times.morning'),
        t('findTutors.filters.availability.times.afternoon'),
        t('findTutors.filters.availability.times.evening')
    ];


    const handleSelect = (dropdownId: keyof typeof selectedValues, value: string) => {
        setSelectedValues(prev => ({ ...prev, [dropdownId]: value }));
        
        // When category is selected, set the category ID for filtering subjects
        if (dropdownId === 'category') {
            if (value !== placeholders.category) {
                const selectedCategory = categories.find(cat => cat.name === value);
                setSelectedCategoryId(selectedCategory?.id || null);
            } else {
                setSelectedCategoryId(null); // Reset when no category selected
            }
        }
    };

    const handleLanguageToggle = (language: string) => {
        setSelectedLanguages(prev => prev.includes(language) ? prev.filter(l => l !== language) : [...prev, language]);
    };

    const handleAvailabilityToggle = (slot: string) => {
        setSelectedAvailability(prev => prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (availabilityRef.current && !availabilityRef.current.contains(event.target as Node)) {
                if(openDropdown === 'availability') {
                   setOpenDropdown(null);
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openDropdown, setOpenDropdown]);

    // Trigger filter change when any filter updates (debounced)
    useEffect(() => {
        const timer = setTimeout(() => {
            const filters: TutorSearchFilter = {
                category: selectedValues.category !== placeholders.category ? selectedValues.category : undefined,
                subject: selectedValues.subject !== placeholders.subject ? selectedValues.subject : undefined,
                languageCodes: selectedLanguages.length > 0 ? selectedLanguages.map(name => {
                    const lang = languages.find(l => l.name === name);
                    return lang ? lang.code : name;
                }) : undefined,
                timezone: selectedValues.timezone !== placeholders.timezone ? selectedValues.timezone : undefined,
                sortBy: selectedValues.sortBy !== placeholders.sortBy ? selectedValues.sortBy : undefined,
                sessionType: activeTab === 'Private Sessions' ? '1-on-1' : activeTab === 'Group Sessions' ? 'Group' : undefined,
                keyword: keyword.trim() || undefined,
                minFee: feeRange[0],
                maxFee: feeRange[1],
            };
            onFilterChange(filters);
        }, 300); // Debounce 300ms to avoid multiple API calls

        return () => clearTimeout(timer);
    }, [selectedValues, selectedLanguages, feeRange, activeTab, keyword]);

    return (
        <>
            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
            <div>
                <div>
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-[#FBF6EE] rounded-t-xl">
                        {tabs.map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`tab-button px-6 py-2 text-sm font-bold text-[#585858] rounded-[10px] transition-all duration-200 ${activeTab === tab ? `bg-white ${activeShadowClass}` : 'hover:bg-white/60'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="p-4 bg-[#FBF6EE] rounded-b-xl rounded-tr-xl">
                        <div className="grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <CustomDropdown 
                                label={t('findTutors.filters.labels.category')}
                                options={categoryOptions}
                                selectedValue={selectedValues.category}
                                placeholder={placeholders.category}
                                onSelect={(value) => handleSelect('category', value)}
                                dropdownId="category" openDropdown={openDropdown}
                                setOpenDropdown={setOpenDropdown}
                                hasSearch={true}
                                searchPlaceholder={t('findTutors.filters.placeholders.search')}
                                loading={loadingFilterData}
                            />
                            <CustomDropdown
                                label={t('findTutors.filters.labels.subject')}
                                options={subjectOptions}
                                selectedValue={selectedValues.subject}
                                placeholder={placeholders.subject}
                                onSelect={(value) => handleSelect('subject', value)}
                                dropdownId="subject"
                                openDropdown={openDropdown}
                                setOpenDropdown={setOpenDropdown}
                                hasSearch={true}
                                searchPlaceholder={t('findTutors.filters.placeholders.searchSubjects')}
                                loading={loadingFilterData}
                            />
                            <div className="bg-white pt-2.5 px-3 pb-2.5 rounded-xl border border-gray-200/80 shadow-sm min-h-[70px] flex flex-col justify-center">
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="text-xs text-[#585858]">{t('findTutors.filters.labels.feePerSession')}</label>
                                    <span className="text-sm font-semibold text-gray-800">${feeRange[0]} - ${feeRange[1]}</span>
                                </div>
                                <div className="relative h-5 flex items-center">
                                    <div className="relative w-full h-1 bg-gray-200 rounded-full">
                                        <div 
                                            className="absolute h-1 bg-[#0b6459] rounded-full z-0"
                                            style={{
                                                left: `${(feeRange[0] / MAX_FEE) * 100}%`,
                                                width: `${((feeRange[1] - feeRange[0]) / MAX_FEE) * 100}%`
                                            }}
                                        ></div>
                                    </div>
                                    <input
                                        type="range"
                                        min={MIN_FEE}
                                        max={MAX_FEE}
                                        value={feeRange[0]}
                                        onChange={(e) => {
                                            const value = Math.min(Number(e.target.value), feeRange[1] - FEE_GAP);
                                            setFeeRange([value, feeRange[1]]);
                                        }}
                                        className="range-input"
                                        style={{ zIndex: 3 }}
                                    />
                                    <input
                                        type="range"
                                        min={MIN_FEE}
                                        max={MAX_FEE}
                                        value={feeRange[1]}
                                        onChange={(e) => {
                                            const value = Math.max(Number(e.target.value), feeRange[0] + FEE_GAP);
                                            setFeeRange([feeRange[0], value]);
                                        }}
                                        className="range-input"
                                        style={{ zIndex: 4 }}
                                    />
                                </div>
                            </div>
                            <MultiSelectDropdownWithSearch 
                                label={t('findTutors.filters.labels.tutorLanguages')}
                                options={languageOptions}
                                selectedOptions={selectedLanguages}
                                onToggleOption={handleLanguageToggle}
                                placeholder={placeholders.languages}
                                dropdownId="languages"
                                openDropdown={openDropdown}
                                setOpenDropdown={setOpenDropdown}
                                searchPlaceholder={t('findTutors.filters.placeholders.searchByLanguage')}
                                loading={loadingFilterData}
                                loadingText={t('findTutors.filters.loading')}
                            />

                            {/* Availability Filter */}
                            <div className="relative" ref={availabilityRef}>
                                <div onClick={() => setOpenDropdown(openDropdown === 'availability' ? null : 'availability')} className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-sm min-h-[70px] cursor-pointer flex flex-col justify-center">
                                    <label className="text-xs text-[#585858] block mb-1.5">{t('findTutors.filters.labels.availability')}</label>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm font-normal  ${selectedAvailability.length === 0 ? 'text-[rgba(88,88,88,0.4)]' : 'text-gray-800'}`}>
                                            {selectedAvailability.length === 0 ? t('findTutors.filters.placeholders.anytime') : `${selectedAvailability.length} ${t('findTutors.filters.availability.slotsSelected')}`}
                                        </span>
                                        <svg className={`flex-shrink-0 ml-2 w-4 h-4 text-gray-500 transition-transform duration-200 ${openDropdown === 'availability' ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 10 13 14 9"></polyline></svg>
                                    </div>
                                </div>
                                {openDropdown === 'availability' && (
                                    <div className="absolute z-20 mt-1 w-full max-w-sm bg-white rounded-xl shadow-lg border border-gray-200/80 p-4">
                                        <p className="font-semibold text-sm mb-3">{t('findTutors.filters.availability.selectSlots')}</p>
                                        <div className="grid grid-cols-4 gap-2 text-center">
                                            <div></div>
                                            {availabilityTimes.map(time => <div key={time} className="text-xs font-bold text-gray-500">{time}</div>)}
                                            
                                            {availabilityDays.map(day => (
                                                <React.Fragment key={day}>
                                                    <div className="text-xs font-bold text-gray-500 flex items-center justify-start">{day}</div>
                                                    {availabilityTimes.map(time => {
                                                        const slot = `${day}-${time}`;
                                                        const isSelected = selectedAvailability.includes(slot);
                                                        return (
                                                            <button key={slot} onClick={() => handleAvailabilityToggle(slot)} className={`h-8 rounded-md transition-colors text-xs ${isSelected ? 'bg-[#0b6459] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                                            </button>
                                                        );
                                                    })}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center mt-4">
                                            <button onClick={() => setSelectedAvailability([])} className="text-xs font-semibold text-gray-600 hover:underline">{t('findTutors.filters.availability.clear')}</button>
                                            <button onClick={() => setOpenDropdown(null)} className="text-xs font-semibold bg-[#0b6459] text-white px-3 py-1.5 rounded-md">{t('findTutors.filters.availability.apply')}</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* New Controls Section - Moved to a separate div */}
                <div className="mt-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-grow">
                        <div className="relative flex-grow max-w-xs">
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder={t('findTutors.filters.placeholders.searchByKeyword')}
                                className="w-full bg-white p-2.5 pl-10 pr-12 text-sm font-medium text-gray-800 rounded-xl border border-gray-200/80 shadow-sm focus:border-[#065a46] focus:outline-none"
                                value={keyword}
                                onChange={handleKeywordChange}
                                onKeyDown={handleKeyPress}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                            />
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            {isSearching && (
                                <div className="absolute right-10 top-1/2 -translate-y-1/2">
                                    <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            )}
                            <button
                                onClick={() => onSearch(keyword)}
                                aria-label="Search"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            {/* Fuzzy Search Suggestions Dropdown */}
                            {showSuggestions && fuzzySuggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                                    {fuzzySuggestions.map((suggestion) => (
                                        <button
                                            key={suggestion.id}
                                            onClick={() => handleSuggestionSelect(suggestion)}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-3 transition-colors"
                                        >
                                            <div className="flex-shrink-0">
                                                {suggestion.type === 'tutor' && (
                                                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                    </svg>
                                                )}
                                                {suggestion.type === 'subject' && (
                                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                                    </svg>
                                                )}
                                                {suggestion.type === 'category' && (
                                                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-gray-900 truncate">
                                                    {suggestion.text}
                                                </div>
                                                <div className="text-xs text-gray-500 capitalize">
                                                    {suggestion.type}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="w-48">
                            <CustomDropdown
                                options={sortByOptions}
                                selectedValue={selectedValues.sortBy}
                                placeholder={placeholders.sortBy}
                                onSelect={(value) => handleSelect('sortBy', value)}
                                dropdownId="sortBy"
                                openDropdown={openDropdown}
                                setOpenDropdown={setOpenDropdown}
                            />
                        </div>
                    </div>
                    <div className="w-48">
                        <CustomDropdown options={timezoneOptions} selectedValue={selectedValues.timezone} placeholder={placeholders.timezone} onSelect={(value) => handleSelect('timezone', value)} dropdownId="timezone" openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} loading={loadingFilterData} />
                    </div>
                </div>
            </div>
        </>
    );
}