import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LernenLogo } from '../LernenLogo';
import { FiLogOut } from 'react-icons/fi';

const HeaderNoNavbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-[var(--page-bg-color)] border-b shadow-sm border-gray-300 px-3">
      <div className="w-full mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <NavLink to="/" className="text-[#0b6459]">
              <LernenLogo />
            </NavLink>
          </div>
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-4 py-1 text-gray-700 border border-gray-300 rounded-lg hover:text-gray-800 hover:bg-gray-100 transition-colors"
            >
              <FiLogOut />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderNoNavbar;