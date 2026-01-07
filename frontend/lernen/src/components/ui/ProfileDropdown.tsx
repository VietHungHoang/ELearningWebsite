import React from 'react';
import { FiBookOpen, FiLogOut, FiSettings, FiCalendar, FiCreditCard, FiHeart, FiMessageSquare, FiHome, FiTag, FiBell, FiCode, FiShoppingBag, FiFileText, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    isSignOut?: boolean;
    onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isSignOut, onClick }) => (
    <div onClick={onClick} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${isSignOut ? 'text-red-500' : 'text-gray-700'}`}>
        <span className="w-5 h-5">{icon}</span>
        <span className="font-medium text-sm">{label}</span>
    </div>
);

const ProfileDropdown: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { state, logout } = useAuth();
    const { user } = state;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Tutor menu items
    const tutorMenuItems = [
        { icon: <FiHome />, label: t('profile.dropdown.dashboard'), path: "/dashboard" },
        { icon: <FiUsers />, label: t('profile.dropdown.myStudents'), path: "/dashboard/my-students" },
        { icon: <FiBookOpen />, label: t('profile.dropdown.myClass'), path: "/dashboard/my-class" },
        { icon: <FiCalendar />, label: t('profile.dropdown.schedule'), path: "/dashboard/schedule" },
        { icon: <FiCreditCard />, label: t('profile.dropdown.payouts'), path: "/dashboard/payouts" },
        { icon: <FiTag />, label: t('profile.dropdown.dealsCoupons'), path: "/dashboard/deals-coupons" },
        { icon: <FiBell />, label: t('profile.dropdown.requests'), path: "/dashboard/requests" },
        { icon: <FiMessageSquare />, label: t('profile.dropdown.inbox'), path: "/dashboard/inbox" },
        { icon: <FiSettings />, label: t('profile.dropdown.profileSettings'), path: "/dashboard/profile-settings/personal-details" },
        { icon: <FiCode />, label: t('profile.dropdown.api'), path: "/dashboard/api" },
    ];

    // Student menu items
    const studentMenuItems = [
        { icon: <FiCalendar />, label: t('profile.dropdown.myBookings'), path: "/dashboard/my-bookings" },
        { icon: <FiShoppingBag />, label: t('profile.dropdown.myPurchases'), path: "/dashboard/purchases" },
        { icon: <FiFileText />, label: t('profile.dropdown.certificates'), path: "/dashboard/certificates" },
        { icon: <FiMessageSquare />, label: t('profile.dropdown.messages'), path: "/dashboard/messages" },
        { icon: <FiHeart />, label: t('profile.dropdown.favourites'), path: "/profile/favourites" },
        { icon: <FiSettings />, label: t('profile.dropdown.profileSettings'), path: "/dashboard/profile-settings/personal-details" },
    ];

    // Select menu items based on user role
    const menuItems = user?.role === 'tutor' ? tutorMenuItems : studentMenuItems;

    return (
        <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-xl shadow-lg z-50 border border-gray-100 p-4 animate-dropdown-in">
            {/* User Info */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <img
                    src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'default'}`}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full"
                />
                <div>
                    <p className="font-bold text-gray-800">{user?.name || t('profile.dropdown.user')}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1 mt-4">
                {menuItems.map((item, index) => (
                    <NavItem
                        key={index}
                        icon={item.icon}
                        label={item.label}
                        onClick={() => navigate(item.path)}
                    />
                ))}
                <div className="pt-2 mt-2 border-t border-gray-100">
                    <NavItem icon={<FiLogOut />} label={t('profile.dropdown.signOut')} isSignOut onClick={handleLogout} />
                </div>
            </nav>
        </div>
    );
};

export default ProfileDropdown;
