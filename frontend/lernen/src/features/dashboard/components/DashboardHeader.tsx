import React, { useState, useRef, useEffect } from 'react';
import { HiChevronDown, HiBell } from 'react-icons/hi';
import type { UserInfo } from '../config/dashboardConfigs';
import NotificationsPopup from '../../../components/ui/NotificationsPopup';
import ProfileDropdown from '../../../components/ui/ProfileDropdown';
import { LernenLogo } from '../../../components/LernenLogo';

interface DashboardHeaderProps {
    userInfo: UserInfo;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userInfo }) => {
    // State for popups
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    // State for dropdowns
    const [selectedCurrency, setSelectedCurrency] = useState('USD $');
    const [selectedLanguage, setSelectedLanguage] = useState({ name: 'En', icon: '🇺🇸' });

    // Refs for popups and dropdowns to detect outside clicks
    const notificationsRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const currencyRef = useRef<HTMLDivElement>(null);
    const languageRef = useRef<HTMLDivElement>(null);

    // Dropdown options
    const currencyOptions = ['USD $', 'EUR €', 'GBP £'];
    const languageOptions = [
        { name: 'En', icon: '🇺🇸' },
        { name: 'De', icon: '🇩🇪' },
        { name: 'Fr', icon: '🇫🇷' },
    ];

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

    const handleCurrencySelect = (currency: string) => {
        setSelectedCurrency(currency);
        setOpenDropdown(null);
    };

    const handleLanguageSelect = (language: { name: string; icon: string }) => {
        setSelectedLanguage(language);
        setOpenDropdown(null);
    };

    return (
        <header className="flex-shrink-0 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between h-14 px-6">
                {/* <div className="flex items-center gap-2 -ml-20 pr-3">
                    <LernenLogo />
                </div> */}

                {/* Center - Empty, search removed */}
                <div className="flex-1">
                    {/* Search box removed */}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-4 ml-auto">
                    {/* Currency Dropdown */}
                    <div ref={currencyRef} className="relative hidden sm:block">
                        <button onClick={() => handleDropdownToggle('currency')} className="flex items-center gap-1 text-sm text-gray-600">
                            {selectedCurrency} <HiChevronDown className="w-4 h-4" />
                        </button>
                        {openDropdown === 'currency' && (
                            <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-lg shadow-xl z-50 p-2 border border-gray-100">
                                <ul className="space-y-1">
                                    {currencyOptions.map(option => (
                                        <li key={option} onClick={() => handleCurrencySelect(option)} className="p-2 text-sm font-medium text-gray-800 rounded-lg cursor-pointer hover:bg-gray-100">
                                            {option}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Language Dropdown */}
                    <div ref={languageRef} className="relative hidden sm:block">
                        <button onClick={() => handleDropdownToggle('language')} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-lg">{selectedLanguage.icon}</span> {selectedLanguage.name} <HiChevronDown className="w-4 h-4" />
                        </button>
                        {openDropdown === 'language' && (
                            <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-lg shadow-xl z-50 p-2 border border-gray-100">
                                <ul className="space-y-1">
                                    {languageOptions.map(option => (
                                        <li key={option.name} onClick={() => handleLanguageSelect(option)} className="flex items-center gap-2 p-2 text-sm font-medium text-gray-800 rounded-lg cursor-pointer hover:bg-gray-100">
                                            {option.icon}
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
                            <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative p-2 text-gray-500 hover:text-gray-700">
                                <HiBell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            </button>
                            {isNotificationsOpen && <NotificationsPopup />}
                        </div>
                    </div>

                    {/* Profile Dropdown */}
                    <div ref={profileRef} className="relative">
                        <button onClick={() => setIsProfileOpen(!isProfileOpen)}>
                            <img src="https://picsum.photos/seed/avatar/32/32" alt="User Avatar" className="w-8 h-8 rounded-full" />
                        </button>
                        {isProfileOpen && <ProfileDropdown />}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;