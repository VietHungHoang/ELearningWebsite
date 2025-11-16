import React from 'react';
import { FiBookOpen } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

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
    return (
        <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-xl shadow-lg z-50 border border-gray-100 p-4 animate-dropdown-in">
            {/* User Info */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <img src="https://picsum.photos/seed/avatar/40/40" alt="User Avatar" className="w-10 h-10 rounded-full" />
                <div>
                    <p className="font-bold text-gray-800">Sarah Chapman</p>
                    <p className="text-xs text-gray-500">student@amentotech.com</p>
                </div>
            </div>

            {/* Switch Role */}
            <div className="my-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-gray-800">Switch to tutor account</h4>
                <p className="text-xs text-gray-500 mt-1">You can switch back to student account anytime with one click</p>
                <button className="mt-3 w-full flex items-center justify-center gap-2 bg-[#345B55] text-white font-semibold py-2 px-3 rounded-lg text-sm hover:bg-opacity-90 transition-colors">
                    <span>Icon</span>
                    <span>Switch user role</span>
                </button>
            </div>
            
            {/* Navigation Links */}
            <nav className="space-y-1">
                <NavItem icon={<FiBookOpen />} label="Profile Settings" onClick={() => navigate('/profile/profile-settings')} />
                <NavItem icon={<FiBookOpen />} label="My Bookings" onClick={() => navigate('/profile/my-bookings')} />
                <NavItem icon={<FiBookOpen />} label="My Learning" onClick={() => navigate('/profile/my-learning')} />
                <NavItem icon={<FiBookOpen />} label="Billing Details" onClick={() => navigate('/profile/billing-details')} />
                <NavItem icon={<FiBookOpen />} label="Favourites" onClick={() => navigate('/profile/favourites')} />
                <NavItem icon={<FiBookOpen />} label="Find Tutors" onClick={() => navigate('/profile/find-tutors')} />
                <NavItem icon={<FiBookOpen />} label="Find Courses" onClick={() => navigate('/profile/find-courses')} />
                <NavItem icon={<FiBookOpen />} label="Inbox" onClick={() => navigate('/profile/inbox')} />
                <NavItem icon={<FiBookOpen />} label="Subscriptions" onClick={() => navigate('/profile/subscriptions')} />
                <div className="pt-2 mt-2 border-t border-gray-100">
                    <NavItem icon={<FiBookOpen />} label="Sign out" isSignOut />
                </div>
            </nav>
        </div>
    );
};

export default ProfileDropdown;