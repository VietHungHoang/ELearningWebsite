import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LernenLogo } from '../../features/home/components/icons/LernenLogo';
import { ChevronDownIcon } from '../../features/home/components/icons/ChevronDownIcon';
import NotificationsPopup from '../../features/home/components/NotificationsPopup';
import { FiShoppingCart, FiBell, FiMessageSquare } from 'react-icons/fi';
import { currencyOptions, languageOptions } from '../../constants/headerConstants';

interface LanguageOption {
  name: string;
  icon: React.ReactElement;
}

const Header: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [selectedCurrency, setSelectedCurrency] = useState('USD $');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(languageOptions[0]);

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
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        if (openDropdown === 'currency') setOpenDropdown(null);
      }
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        if (openDropdown === 'language') setOpenDropdown(null);
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

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency);
    setOpenDropdown(null);
  };

  const handleLanguageSelect = (language: LanguageOption) => {
    setSelectedLanguage(language);
    setOpenDropdown(null);
  };

  return (
    <header className="bg-[#F8F7F4] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <NavLink to="/" className="text-[#0b6459]">
              <LernenLogo />
            </NavLink>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <LnNavLink to="/">Home</LnNavLink>
              <LnNavLink to="/find-tutors">Find Tutors</LnNavLink>
              <LnNavLink to="/courses">Courses</LnNavLink>
              <LnNavLink to="/subscriptions">Subscriptions</LnNavLink>
              <LnNavLink to="/more">More</LnNavLink>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {/* Currency Dropdown */}
            <div ref={currencyRef} className="relative">
              <button onClick={() => handleDropdownToggle('currency')} className="hidden sm:flex items-center space-x-1 text-gray-600 cursor-pointer">
                <span className="font-medium">{selectedCurrency}</span>
                <ChevronDownIcon />
              </button>
              {openDropdown === 'currency' && (
                <div className="absolute top-full right-0 mt-2 w-24 bg-white rounded-lg shadow-xl z-50 p-2 border border-gray-100 transform transition-all duration-150 ease-out opacity-100 scale-100">
                  <ul className="space-y-1">
                    {currencyOptions.map(option => (
                      <li key={option} onClick={() => handleCurrencySelect(option)} className="p-2 text-sm font-medium text-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 text-center">
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Language Dropdown */}
            <div ref={languageRef} className="relative">
              <button onClick={() => handleDropdownToggle('language')} className="hidden sm:flex items-center space-x-2 text-gray-600 cursor-pointer">
                <div style={{width: '20px', height: '15px'}}>{selectedLanguage.icon}</div>
                <span>{selectedLanguage.name}</span>
                <ChevronDownIcon />
              </button>
              {openDropdown === 'language' && (
                <div className="absolute top-full right-0 mt-2 w-24 bg-white rounded-lg shadow-xl z-50 p-2 border border-gray-100 transform transition-all duration-150 ease-out opacity-100 scale-100">
                   <ul className="space-y-1">
                    {languageOptions.map(option => (
                      <li key={option.name} onClick={() => handleLanguageSelect(option)} className="flex items-center gap-2 p-2 text-sm font-medium text-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 justify-center">
                        <div style={{width: '20px', height: '15px'}}>{option.icon}</div>
                        <span>{option.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action Icons */}
            <div className="flex items-center space-x-3">
               <div ref={cartRef} className="relative">
                <LnIconButton onClick={() => setIsCartOpen(!isCartOpen)}><FiShoppingCart size={24} /></LnIconButton>
                {isCartOpen && <div>Cart Popup Placeholder</div>}
              </div>
               <div ref={notificationsRef} className="relative">
                 <LnIconButton onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} hasDot={true}><FiBell size={24} /></LnIconButton>
                {isNotificationsOpen && <NotificationsPopup />}
              </div>
              <LnIconButton hasDot={true}><FiMessageSquare size={24} /></LnIconButton>
            </div>

            {/* Profile */}
            <div ref={profileRef} className="relative">
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="cursor-pointer">
                <img src="https://picsum.photos/seed/avatar/40/40" alt="User Avatar" className="w-10 h-10 rounded-full" />
              </button>
              {isProfileOpen && <div>Profile Dropdown Placeholder</div>}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const LnIconButton: React.FC<{ children: React.ReactNode; onClick?: () => void; hasDot?: boolean }> = ({ children, onClick, hasDot = false }) => (
  <button onClick={onClick} className="relative text-gray-500 hover:text-gray-800 p-2 bg-white rounded-lg shadow-sm flex items-center justify-center cursor-pointer">
    {children}
    {hasDot && <span className="absolute top-0 right-0 block h-2 w-2 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-red-500 ring-2 ring-white" />}
  </button>
);

const LnNavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      font-bold text-gray-700 
      flex items-center space-x-1 border-b-2
      transition-all duration-300
      ${isActive ? 'border-[#0b6459]' : 'border-transparent hover:border-[#0b6459]'}
    `}
  >
    {children}
  </NavLink>
);

export default Header;