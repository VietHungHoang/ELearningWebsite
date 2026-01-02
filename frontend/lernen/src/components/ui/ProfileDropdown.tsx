import React from 'react';
import { FiBookOpen, FiLogOut, FiSettings, FiCalendar, FiCreditCard, FiHeart, FiMessageSquare, FiHome, FiTag, FiBell, FiCode, FiShoppingBag, FiFileText, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
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
    const { state, logout } = useAuth();
    const { user } = state;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Tutor menu items
    const tutorMenuItems = [
        { icon: <FiHome />, label: "Dashboard", path: "/dashboard" },
        { icon: <FiUsers />, label: "My Students", path: "/dashboard/my-students" },
        { icon: <FiBookOpen />, label: "My Courses", path: "/dashboard/my-courses" },
        { icon: <FiBookOpen />, label: "My Class", path: "/dashboard/my-class" },
        { icon: <FiCalendar />, label: "Schedule", path: "/dashboard/schedule" },
        { icon: <FiCreditCard />, label: "Payouts", path: "/dashboard/payouts" },
        { icon: <FiTag />, label: "Deals & Coupons", path: "/dashboard/deals-coupons" },
        { icon: <FiBell />, label: "Requests", path: "/dashboard/requests" },
        { icon: <FiMessageSquare />, label: "Inbox", path: "/dashboard/inbox" },
        { icon: <FiSettings />, label: "Profile Settings", path: "/dashboard/profile-settings/personal-details" },
        { icon: <FiCode />, label: "API", path: "/dashboard/api" },
    ];

    // Student menu items
    const studentMenuItems = [
        { icon: <FiCalendar />, label: "My Bookings", path: "/dashboard/my-bookings" },
        { icon: <FiBookOpen />, label: "My Courses", path: "/dashboard/my-courses" },
        { icon: <FiShoppingBag />, label: "My Purchases", path: "/dashboard/purchases" },
        { icon: <FiFileText />, label: "Certificates", path: "/dashboard/certificates" },
        { icon: <FiMessageSquare />, label: "Messages", path: "/dashboard/messages" },
        { icon: <FiHeart />, label: "Favourites", path: "/profile/favourites" },
        { icon: <FiSettings />, label: "Profile Settings", path: "/dashboard/profile-settings/personal-details" },
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
                    <p className="font-bold text-gray-800">{user?.name || 'User'}</p>
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
                    <NavItem icon={<FiLogOut />} label="Sign out" isSignOut onClick={handleLogout} />
                </div>
            </nav>
        </div>
    );
};

export default ProfileDropdown;
