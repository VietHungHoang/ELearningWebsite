import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NotificationsPopup from "./NotificationsPopup";
import { FiShoppingCart, FiBell, FiMessageSquare, FiChevronDown } from "react-icons/fi";
import { currencyOptions, languageOptions } from "../../constants/headerConstants";
import CartPopup from "../../features/cart/components/CartPopup";
import { LernenLogo } from "../LernenLogo";
import ProfileDropdown from "./ProfileDropdown";
import { useAuth } from "../../context/AuthContext";
import { useCurrency } from "../../context/CurrencyContext";
import { getCurrencyCodeFromDisplay } from "../../utils/currencyHelper";
// import { useWebSocket } from '../../hooks/useWebSocket';

interface LanguageOption {
    name: string;
    code: string;
    icon: React.ReactElement;
}

const Header: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [cartCount, setCartCount] = useState(0);

    const { state } = useAuth();
    const { currencyDisplay, setSelectedCurrency } = useCurrency();
    const isLoggedIn = state.isAuthenticated;

    const navigate = useNavigate();
    const location = useLocation();

    const currentLanguageOption = languageOptions.find(option => option.code === i18n.language) || languageOptions[0];

    const cartRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const currencyRef = useRef<HTMLDivElement>(null);
    const languageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
                setIsCartOpen(false);
            }
            if (
                notificationsRef.current &&
                !notificationsRef.current.contains(event.target as Node)
            ) {
                setIsNotificationsOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
            if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
                if (openDropdown === "currency") setOpenDropdown(null);
            }
            if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
                if (openDropdown === "language") setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openDropdown]);

    const handleDropdownToggle = (type: string) => {
        setOpenDropdown(openDropdown === type ? null : type);
    };

    const handleCurrencySelect = (currencyDisplay: string) => {
        const currencyCode = getCurrencyCodeFromDisplay(currencyDisplay);
        setSelectedCurrency(currencyCode);
        setOpenDropdown(null);
    };

    const handleLanguageSelect = (language: LanguageOption) => {
        i18n.changeLanguage(language.code);
        setOpenDropdown(null);
    };

    const handleSignIn = () => {
        // Intelligent routing based on current page context using query params
        const currentPath = location.pathname;
        const isTutorContext = currentPath.includes('tutor') ||
            currentPath.includes('become-a-tutor') ||
            currentPath.includes('/teach');

        navigate(isTutorContext ? "/login?role=tutor" : "/login?role=student");
    };

    const handleGetStarted = () => {
        navigate("/signup");
    };

    return (
        <header className="bg-[var(--page-bg-color)] border-b border-gray-200">
            <div className="px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-8">
                        {/* Logo */}
                        <NavLink to="/" className="text-[#0b6459]">
                            <LernenLogo />
                        </NavLink>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center space-x-6">
                            <LnNavLink to="/">{t('header.home')}</LnNavLink>
                            <LnNavLink to="/find-tutors">{t('header.findTutors')}</LnNavLink>
                            {/* <LnNavLink to="/courses">Courses</LnNavLink> */}
                            <LnNavLink to="/become-a-tutor">{t('header.becomeTutor')}</LnNavLink>
                            {/* <LnNavLink to="/subscriptions">Subscriptions</LnNavLink> */}
                            {/* <LnNavLink to="/more">More</LnNavLink> */}
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Currency Dropdown */}
                        <div ref={currencyRef} className="relative">
                            <button
                                onClick={() => handleDropdownToggle("currency")}
                                className="hidden sm:flex items-center space-x-1 text-gray-600 cursor-pointer"
                            >
                                <span className="font-medium">{currencyDisplay}</span>
                                <FiChevronDown size={20} />
                            </button>
                            {openDropdown === "currency" && (
                                <div className="absolute top-full right-0 mt-2 w-28 bg-white rounded-lg shadow-xl z-50 p-2 border border-gray-100 transform transition-all duration-150 ease-out opacity-100 scale-100">
                                    <ul className="space-y-1">
                                        {currencyOptions.map((option) => (
                                            <li
                                                key={option}
                                                onClick={() => handleCurrencySelect(option)}
                                                className="p-2 text-sm font-medium text-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 text-center"
                                            >
                                                {option}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Language Dropdown */}
                        <div ref={languageRef} className="relative">
                            <button
                                onClick={() => handleDropdownToggle("language")}
                                className="hidden sm:flex items-center space-x-2 text-gray-600 cursor-pointer"
                            >
                                <div style={{ width: "20px", height: "15px" }}>
                                    {currentLanguageOption.icon}
                                </div>
                                <span>{currentLanguageOption.name}</span>
                                <FiChevronDown size={20} />
                            </button>
                            {openDropdown === "language" && (
                                <div className="absolute top-full right-0 mt-2 w-24 bg-white rounded-lg shadow-xl z-50 p-2 border border-gray-100 transform transition-all duration-150 ease-out opacity-100 scale-100">
                                    <ul className="space-y-1">
                                        {languageOptions.map((option) => (
                                            <li
                                                key={option.name}
                                                onClick={() => handleLanguageSelect(option)}
                                                className="flex items-center gap-2 p-2 text-sm font-medium text-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 justify-center"
                                            >
                                                <div style={{ width: "20px", height: "15px" }}>
                                                    {option.icon}
                                                </div>
                                                <span>{option.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Action Icons - Only show when logged in */}
                        {isLoggedIn && (
                            <div className="flex items-center space-x-3">
                                <div ref={cartRef} className="relative">
                                    <LnIconButton onClick={() => setIsCartOpen(!isCartOpen)}>
                                        <div className="relative">
                                            <FiShoppingCart size={24} />
                                            {cartCount > 0 && (
                                                <span className="absolute -top-4 -right-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </div>
                                    </LnIconButton>
                                    {isCartOpen && <CartPopup onCartCountChange={setCartCount} />}
                                </div>
                                <div ref={notificationsRef} className="relative">
                                    <LnIconButton
                                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                    >
                                        <div className="relative">
                                            <FiBell size={24} />
                                            {/* {notificationCount > 0 && (
                         <span className="absolute -top-4 -right-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                           {notificationCount > 99 ? '99+' : notificationCount}
                         </span>
                       )} */}
                                        </div>
                                    </LnIconButton>
                                    {isNotificationsOpen && <NotificationsPopup />}
                                </div>
                                <LnIconButton hasDot={true}>
                                    <FiMessageSquare size={24} />
                                </LnIconButton>
                            </div>
                        )}

                        {/* Auth Buttons - Show when not logged in */}
                        {!isLoggedIn ? (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleSignIn}
                                    className="flex items-center justify-center gap-2 border border-[#0b6459] bg-[#0b6459] text-white font-medium py-1.75 px-4 rounded-xl hover:bg-[#084c43] transition-colors"
                                >
                                    {t('header.signIn')}
                                </button>
                                <button
                                    onClick={handleGetStarted}
                                    className="flex items-center justify-center gap-2 border border-[#e9bb71] bg-transparent text-[#585858] font-medium py-1.75 px-4 rounded-xl hover:bg-[#084c43] hover:text-white hover:border-[#084c43] transition-colors"
                                >
                                    {t('header.getStarted')}
                                </button>
                            </div>
                        ) : (
                            /* Profile - Show when logged in */
                            <div ref={profileRef} className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="cursor-pointer"
                                >
                                    <img
                                        src={state.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${state.user?.id || 'default'}`}
                                        alt="User Avatar"
                                        className="w-10 h-10 rounded-full"
                                    />
                                </button>
                                {isProfileOpen && <ProfileDropdown />}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header >
    );
};

const LnIconButton: React.FC<{
    children: React.ReactNode;
    onClick?: () => void;
    hasDot?: boolean;
}> = ({ children, onClick, hasDot = false }) => (
    <button
        onClick={onClick}
        className="relative text-gray-500 hover:text-gray-800 p-2 bg-white rounded-lg shadow-sm flex items-center justify-center cursor-pointer"
    >
        {children}
        {hasDot && (
            <span className="absolute top-0 right-0 block h-2 w-2 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-red-500 ring-2 ring-white" />
        )}
    </button>
);

const LnNavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
    <NavLink
        to={to}
        className={({ isActive }) => `
      font-bold text-gray-700 
      flex items-center space-x-1 border-b-2
      transition-all duration-300
      ${isActive ? "border-[#0b6459]" : "border-transparent hover:border-[#0b6459]"}
    `}
    >
        {children}
    </NavLink>
);

export default Header;
