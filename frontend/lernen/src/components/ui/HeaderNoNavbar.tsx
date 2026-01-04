import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LernenLogo } from '../LernenLogo';
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';

const HeaderNoNavbar: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {/* Logo */}
            <NavLink to="/" className="text-[#0b6459]">
              <LernenLogo />
            </NavLink>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => navigate('/tutors')}
                className="text-sm font-medium text-gray-700 hover:text-[#0b6459] transition-colors"
              >
                Tìm gia sư
              </button>
            </div>

            {/* Avatar & Profile Dropdown */}
            <div ref={profileRef} className="relative">
              <div
                className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#0b6459]/50 transition-all"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <img
                  src={state.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${state.user?.id || 'default'}`}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              {isProfileOpen && <ProfileDropdown />}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderNoNavbar;