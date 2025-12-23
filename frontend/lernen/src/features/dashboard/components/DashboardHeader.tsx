import React, { useState, useRef, useEffect } from 'react';
import { HiChevronDown, HiMenu } from 'react-icons/hi';
import { FiBell } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import type { UserInfo } from '../config/dashboardConfigs';
import NotificationsPopup from '../../../components/ui/NotificationsPopup';
import ProfileDropdown from '../../../components/ui/ProfileDropdown';
import { LernenLogo } from '../../../components/LernenLogo';
import Breadcrumb, { type BreadcrumbItem } from './Breadcrumb';
import { useCurrency } from '../../../context/CurrencyContext';
import { getCurrencyCodeFromDisplay } from '../../../utils/currencyHelper';
import { currencyOptions, languageOptions } from '../../../constants/headerConstants';

interface DashboardHeaderProps {
    userInfo: UserInfo;
    onToggleSidebar: () => void;
    breadcrumb?: BreadcrumbItem[];
    isSidebarOpen?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userInfo, onToggleSidebar, breadcrumb, isSidebarOpen = true }) => {
    const { t, i18n } = useTranslation();
    const { currencyDisplay, setSelectedCurrency } = useCurrency();

    const currentLanguageOption = languageOptions.find(option => option.code === i18n.language) || languageOptions[0];

    // State for popups
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    // Refs for popups and dropdowns to detect outside clicks
    const notificationsRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const currencyRef = useRef<HTMLDivElement>(null);
    const languageRef = useRef<HTMLDivElement>(null);

    // Outside click handler effect
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) setIsNotificationsOpen(false);
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) setIsProfileOpen(false);
            if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
                if (openDropdown === 'currency') setOpenDropdown(null);
            }
            if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
                if (openDropdown === 'language') setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openDropdown]);

    const handleDropdownToggle = (type: string) => {
        setOpenDropdown(openDropdown === type ? null : type);
    };

    const handleCurrencySelect = (currencyDisplay: string) => {
        const currencyCode = getCurrencyCodeFromDisplay(currencyDisplay);
        setSelectedCurrency(currencyCode);
        setOpenDropdown(null);
    };

    const handleLanguageSelect = (language: { name: string; code: string; icon: React.ReactElement }) => {
        i18n.changeLanguage(language.code);
        setOpenDropdown(null);
    };

    return (
        <header className="flex-shrink-0 bg-[#f7f7f8]">
            <div className="flex items-center justify-between h-14 pr-6 pt-3">
                {/* Left side - Logo, toggle button, and breadcrumb */}  
                <div className="flex items-center gap-3">
                    <div className={`transition-all duration-300 ${isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                        {isSidebarOpen && (
                            <div className="flex items-center gap-2 pl-6 pr-16">
                                <LernenLogo />
                            </div>
                        )}
                    </div>
                    <button
                        onClick={onToggleSidebar}
                        className="text-gray-500 hover:text-gray-700 transition-colors pl-3"
                    >
                        <HiMenu className="w-5 h-5" />
                    </button>
                    {breadcrumb && <Breadcrumb items={breadcrumb} />}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-4 ml-auto">
                    {/* Currency Dropdown */}
                    <div ref={currencyRef} className="relative hidden sm:block">
                        <button onClick={() => handleDropdownToggle('currency')} className="flex items-center gap-1 text-base text-gray-600">
                            <span className="font-bold">{currencyDisplay}</span> <HiChevronDown className="w-3 h-3" />
                        </button>
                        {openDropdown === 'currency' && (
                            <div className="absolute top-full right-0 mt-2 w-24 bg-white rounded-lg shadow-xl z-50 p-2 border border-gray-100">
                                <ul className="space-y-1">
                                    {currencyOptions.map(option => (
                                        <li key={option} onClick={() => handleCurrencySelect(option)} className="p-2 text-sm font-bold text-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 text-center">
                                            {option}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Language Dropdown */}
                    <div ref={languageRef} className="relative hidden sm:block">
                        <button onClick={() => handleDropdownToggle('language')} className="flex items-center gap-2 text-base text-gray-600">
                            <div style={{ width: "24px", height: "18px" }}>{currentLanguageOption.icon}</div>
                            <HiChevronDown className="w-3 h-3" />
                        </button>
                        {openDropdown === 'language' && (
                            <div className="absolute top-full right-0 mt-2 w-24 bg-white rounded-lg shadow-xl z-50 p-2 border border-gray-100">
                                <ul className="space-y-1">
                                    {languageOptions.map(option => (
                                        <li key={option.name} onClick={() => handleLanguageSelect(option)} className="flex items-center gap-2 p-2 text-sm font-medium text-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 justify-center">
                                            <div style={{ width: "24px", height: "18px" }}>{option.icon}</div>
                                            <span>{option.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Action Icons */}
                    <div className="flex items-center gap-2">
                        <div ref={notificationsRef} className="relative">
                            <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative p-2.25 bg-white shadow-md text-gray-500 hover:text-gray-700" style={{ borderRadius: '10px' }}>
                                <FiBell className="w-5 h-5" />
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            </button>
                            {isNotificationsOpen && <NotificationsPopup />}
                        </div>
                    </div>

                    {/* Profile Dropdown */}
                    <div ref={profileRef} className="relative">
                        <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center justify-center">
                            <img src="https://picsum.photos/seed/avatar/32/32" alt="User Avatar" className="w-9 h-9 rounded-lg"  style={{ borderRadius: '10px' }} />
                        </button>
                        {isProfileOpen && <ProfileDropdown />}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;