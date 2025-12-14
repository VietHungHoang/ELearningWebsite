import React, { useState, useRef, useEffect } from 'react';
import { FiMenu, FiSearch, FiChevronDown, FiShoppingCart, FiBell, FiMessageSquare } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
// import { AppPage } from '../App';
// import CartPopup from './CartPopup';
// import NotificationsPopup from './NotificationsPopup';
// import ProfileDropdown from './ProfileDropdown';

interface DashboardHeaderProps {
    // navigateToApp: (page: AppPage, options?: any) => void;
    onToggleSidebar: () => void;
    activeView: string;
    onItemClick: (label: string) => void;
    // handleLogout: () => void;
    detailViewName?: string;
    onBackToListView?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onToggleSidebar, activeView, onItemClick, detailViewName, onBackToListView }) => {
    const { t } = useTranslation();
    // State for popups
    const [isCartOpen, setIsCartOpen] = useState(false);
    // Fix: Add state for cart loading to pass to the CartPopup component.
    // const [isCartLoading, setIsCartLoading] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    // State for dropdowns
    const [selectedCurrency, setSelectedCurrency] = useState('USD $');
    const [selectedLanguage, setSelectedLanguage] = useState({ name: 'En', flag: '🇺🇸' });

    // Refs for popups and dropdowns to detect outside clicks
    const cartRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const currencyRef = useRef<HTMLDivElement>(null);
    const languageRef = useRef<HTMLDivElement>(null);
    
    // Dropdown options
    const currencyOptions = ['USD $', 'EUR €', 'GBP £'];
    const languageOptions = [
        { name: 'En', flag: '🇺🇸' },
        { name: 'De', flag: '🇩🇪' },
        { name: 'Fr', flag: '🇫🇷' },
    ];
    
    // Outside click handler effect
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cartRef.current && !cartRef.current.contains(event.target as Node)) setIsCartOpen(false);
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

    const handleLanguageSelect = (language: { name: string; flag: string }) => {
        setSelectedLanguage(language);
        setOpenDropdown(null);
    };

    // Fix: Add handler to simulate cart loading, similar to the main Header component.
    // const handleCartClick = () => {
    //     if (isCartOpen) {
    //         setIsCartOpen(false);
    //         return;
    //     }
    //     setIsCartOpen(true);
    //     setIsCartLoading(true);
    //     setTimeout(() => {
    //         setIsCartLoading(false);
    //     }, 3000);
    // };

    return (
        <header className="flex-shrink-0 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-6">
                {/* Left side */}
                <div className="flex items-center gap-4">
                    <button onClick={onToggleSidebar} className="text-gray-500 hover:text-gray-700">
                        <FiMenu />
                    </button>
                    <div className="text-sm text-gray-500 hidden md:block">
                        <span className="hover:text-gray-700 cursor-pointer" onClick={() => onItemClick('Profile Settings')}>{t('profile.sidebar.profileSettings')}</span>
                        <span className="mx-2">/</span>
                        {detailViewName ? (
                            <>
                                <span className="hover:text-gray-700 cursor-pointer font-medium" onClick={onBackToListView}>
                                    {activeView}
                                </span>
                                <span className="mx-2">/</span>
                                <span className="text-gray-800 font-medium truncate max-w-[250px] inline-block align-bottom">{detailViewName}</span>
                            </>
                        ) : (
                            <span className="text-gray-800 font-medium">{activeView}</span>
                        )}
                    </div>
                </div>

                {/* Center search */}
                <div className="flex-1 max-w-sm ml-6 hidden lg:block">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch />
                        </div>
                        <input
                            type="text"
                            placeholder={t('profile.header.quickSearch')}
                            className="w-full bg-gray-100 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b6459]"
                        />
                         <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <kbd className="inline-flex items-center border border-gray-200 rounded px-2 text-xs font-sans font-medium text-gray-400">
                                Ctrl + K
                            </kbd>
                        </div>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-4 ml-auto">
                    {/* Currency Dropdown */}
                    <div ref={currencyRef} className="relative hidden sm:block">
                        <button onClick={() => handleDropdownToggle('currency')} className="flex items-center gap-1 text-sm text-gray-600">
                            {selectedCurrency} <FiChevronDown />
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
                            {selectedLanguage.flag} {selectedLanguage.name} <FiChevronDown />
                        </button>
                         {openDropdown === 'language' && (
                            <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-lg shadow-xl z-50 p-2 border border-gray-100">
                                <ul className="space-y-1">
                                {languageOptions.map(option => (
                                    <li key={option.name} onClick={() => handleLanguageSelect(option)} className="flex items-center gap-2 p-2 text-sm font-medium text-gray-800 rounded-lg cursor-pointer hover:bg-gray-100">
                                        <span>{option.flag}</span>
                                        <span>{option.name}</span>
                                    </li>
                                ))}
                                </ul>
                            </div>
                         )}
                    </div>
                    
                    {/* Action Icons */}
                    <div className="flex items-center gap-2">
                        <div ref={cartRef} className="relative">
                            <button onClick={() => setIsCartOpen(!isCartOpen)} className="relative p-2 text-gray-500 hover:text-gray-700">
                                <FiShoppingCart />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            </button>
                            {isCartOpen && <div>Cart Popup Placeholder</div>}
                        </div>
                         <div ref={notificationsRef} className="relative">
                             <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative p-2 text-gray-500 hover:text-gray-700">
                                <FiBell />
                                 <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            </button>
                            {isNotificationsOpen && <div>Notifications Popup Placeholder</div>}
                        </div>
                         <button onClick={() => onItemClick('Inbox')} className="relative p-2 text-gray-500 hover:text-gray-700">
                            <FiMessageSquare />
                        </button>
                    </div>

                    {/* Profile Dropdown */}
                    <div ref={profileRef} className="relative">
                        <button onClick={() => setIsProfileOpen(!isProfileOpen)}>
                            <img src="https://picsum.photos/seed/avatar/32/32" alt="User Avatar" className="w-8 h-8 rounded-full" />
                        </button>
                        {isProfileOpen && <div>Profile Dropdown Placeholder</div>}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;