import React from 'react';
import { FiSettings, FiCalendar, FiBell, FiBookOpen, FiUsers, FiSearch, FiFileText, FiBook, FiPackage, FiClipboard, FiMessageSquare, FiAward, FiHeart, FiCreditCard, FiAlertTriangle, FiLogOut, FiHome } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

interface DashboardSidebarProps {
  isOpen: boolean;
  activeView: string;
  onItemClick: (label: string) => void;
  handleLogout: () => void;
  pendingRequestsCount?: number;
}

interface NavItemProps {
    icon: React.ReactNode; 
    label: string; 
    active?: boolean; 
    isSidebarOpen: boolean;
    onClick: () => void;
    count?: number;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, isSidebarOpen, onClick, count }) => (
  <li className="relative group">
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onClick(); }}
      className={`relative flex items-center gap-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
        isSidebarOpen ? 'px-4' : 'justify-center'
      } ${
        active ? 'bg-[#0b6459] text-white' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <span className="relative w-5 h-5 flex-shrink-0">
        {icon}
        {!isSidebarOpen && count && count > 0 && (
          <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </span>
      <span className={`transition-all duration-200 ${isSidebarOpen ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0 sr-only'}`}>{label}</span>
      {isSidebarOpen && count && count > 0 && (
        <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {count > 99 ? '99+' : count}
        </span>
      )}
    </a>
    {!isSidebarOpen && (
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
        {label}
      </div>
    )}
  </li>
);

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen, activeView, onItemClick, handleLogout, pendingRequestsCount }) => {
  const { t } = useTranslation();

  const navItems = [
    { icon: <FiSettings />, activeIcon: <FiSettings />, label: t('profile.sidebar.profileSettings') },
    { icon: <FiCalendar />, activeIcon: <FiCalendar />, label: t('profile.sidebar.myBookings') },
    { icon: <FiBell />, activeIcon: <FiBell />, label: t('profile.sidebar.myRequests'), count: pendingRequestsCount },
    { icon: <FiBookOpen />, activeIcon: <FiBookOpen />, label: t('profile.sidebar.myLearning') },
    { icon: <FiUsers />, activeIcon: <FiUsers />, label: t('profile.sidebar.myClass') },
    { icon: <FiSearch />, activeIcon: <FiSearch />, label: t('profile.sidebar.findTutors') },
    { icon: <FiFileText />, activeIcon: <FiFileText />, label: t('profile.sidebar.myQuizzes') },
    { icon: <FiBook />, activeIcon: <FiBook />, label: t('profile.sidebar.findCourses') },
    { icon: <FiPackage />, activeIcon: <FiPackage />, label: t('profile.sidebar.findCourseBundles') },
    { icon: <FiClipboard />, activeIcon: <FiClipboard />, label: t('profile.sidebar.assignments') },
    { icon: <FiMessageSquare />, activeIcon: <FiMessageSquare />, label: t('profile.sidebar.inbox') },
    { icon: <FiUsers />, activeIcon: <FiUsers />, label: t('profile.sidebar.community') },
    { icon: <FiAward />, activeIcon: <FiAward />, label: t('profile.sidebar.myCertificates') },
    { icon: <FiHeart />, activeIcon: <FiHeart />, label: t('profile.sidebar.favourites') },
    { icon: <FiCreditCard />, activeIcon: <FiCreditCard />, label: t('profile.sidebar.billingDetails') },
    { icon: <FiFileText />, activeIcon: <FiFileText />, label: t('profile.sidebar.invoices') },
    { icon: <FiAlertTriangle />, activeIcon: <FiAlertTriangle />, label: t('profile.sidebar.disputes') },
  ];

  return (
    <aside className={`flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className={`flex items-center h-16 border-b border-gray-200 flex-shrink-0 transition-all duration-300 ${isOpen ? 'px-6' : 'px-4 justify-center'}`}>
        <div className="flex items-center gap-2">
            <FiHome />
            <span className={`text-xl font-bold text-gray-800 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 sr-only'}`}>Lernen</span>
        </div>
      </div>
      <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        <ul className="space-y-1">
          {navItems.map(item => {
              const isActive = activeView === item.label;
              return (
                <NavItem 
                  key={item.label} 
                  label={item.label}
                  icon={isActive ? item.activeIcon : item.icon}
                  active={isActive}
                  isSidebarOpen={isOpen}
                  onClick={() => onItemClick(item.label)}
                  count={item.count}
                />
              )
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 relative group">
        <button 
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors ${isOpen ? 'px-4' : 'justify-center'}`}>
          <span className="w-5 h-5 flex-shrink-0">
            <FiLogOut />
          </span>
          <span className={`font-semibold transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 sr-only'}`}>{t('profile.sidebar.signOut')}</span>
        </button>
         {!isOpen && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                {t('profile.sidebar.signOut')}
            </div>
        )}
      </div>
    </aside>
  );
};

export default DashboardSidebar;