import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { HiCreditCard, HiLogout, HiMenu } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import type { SidebarOption } from "../config/dashboardConfigs";
import { LernenLogo } from "../../../components/LernenLogo";

interface DashboardSidebarProps {
    options: SidebarOption[];
    isOpen: boolean;
    onToggleSidebar?: () => void;
}

interface NavItemProps {
    icon: React.ReactNode;
    labelKey: string;
    path: string;
    isSidebarOpen: boolean;
    count?: number;
    t: (key: string) => string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, labelKey, path, isSidebarOpen, count, t }) => (
    <li className="relative group">
        <NavLink
            to={path}
            end={path === "/dashboard"}
            className={({ isActive }) =>
                `relative flex items-center gap-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${isSidebarOpen ? "px-4" : "justify-center"
                } ${isActive ? "bg-[#0b6459] text-white" : "text-gray-600 hover:bg-gray-100"}`
            }
        >
            <span className="relative w-5 h-5 flex-shrink-0">
                {icon}
                {!isSidebarOpen && count && count > 0 && (
                    <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                        {count > 9 ? "9+" : count}
                    </span>
                )}
            </span>
            <span
                className={`transition-all duration-200 ${isSidebarOpen ? "opacity-100 max-w-full" : "opacity-0 max-w-0 sr-only"
                    }`}
            >
                {t(labelKey)}
            </span>
            {isSidebarOpen && count && count > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {count > 99 ? "99+" : count}
                </span>
            )}
        </NavLink>
        {!isSidebarOpen && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                {t(labelKey)}
            </div>
        )}
    </li>
);

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
    options,
    isOpen,
    onToggleSidebar,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleWithdraw = () => {
        navigate("/dashboard/payouts");
    };

    return (
        <aside
            className={`flex flex-col bg-white transition-all duration-300 ${isOpen ? "w-72" : "w-20"
                }`}
        >
            <div
                className={`flex items-center h-14 border-b border-gray-200 flex-shrink-0 transition-all duration-300 ${isOpen ? "px-6" : "px-4 justify-center"
                    }`}
            >
                {onToggleSidebar && (
                    <button
                        onClick={onToggleSidebar}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <HiMenu className="w-6 h-6" />
                    </button>
                )}
                {isOpen && (
                    <div className="flex items-center gap-2 ml-auto pr-3">
                        <LernenLogo />
                    </div>
                )}
            </div>
            <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar border-r border-gray-200">
                <ul className="space-y-1">
                    {options.map((item) => (
                        <NavItem
                            key={item.labelKey}
                            labelKey={item.labelKey}
                            path={item.path}
                            icon={item.icon}
                            isSidebarOpen={isOpen}
                            count={item.count}
                            t={t}
                        />
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t border-gray-200">
                {isOpen ? (
                    <div className="bg-white p-4 rounded-lg mb-4 shadow-md border border-gray-100">
                        <div className="grid grid-cols-3 gap-3 items-center">
                            <div className="col-span-1 flex items-center justify-center bg-green-100 p-3 rounded-lg">
                                <div className="w-8 h-8 text-[#0b6459]">
                                    <HiCreditCard className="w-full h-full" />
                                </div>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs text-gray-500">{t('dashboard.common.myWallet')}</p>
                                <p className="text-xl font-bold text-gray-800">$1,250.75</p>
                            </div>
                        </div>
                        <button
                            onClick={handleWithdraw}
                            className="mt-4 w-full text-sm font-bold bg-[#0b6459] text-white hover:bg-[#084c43] rounded-lg py-2 transition-colors"
                        >
                            {t('dashboard.common.withdraw')}
                        </button>
                    </div>
                ) : (
                    <div className="relative group mb-4">
                        <button
                            onClick={handleWithdraw}
                            className="w-full flex justify-center py-3 rounded-lg bg-gray-100 text-[#0b6459] hover:bg-gray-200"
                        >
                            <div className="w-5 h-5">
                                <HiCreditCard className="w-full h-full" />
                            </div>
                        </button>
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none z-20">
                            {t('dashboard.common.myWallet')}: $1,250.75
                        </div>
                    </div>
                )}
                <div className="relative group">
                    <button
                        onClick={() => console.log("Logout")}
                        className={`flex items-center gap-3 w-full py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors ${isOpen ? "px-4" : "justify-center"
                            }`}
                    >
                        <span className="w-5 h-5 flex-shrink-0">
                            <HiLogout className="w-full h-full" />
                        </span>
                        <span
                            className={`font-semibold transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 sr-only"
                                }`}
                        >
                            {t('dashboard.common.signOut')}
                        </span>
                    </button>
                    {!isOpen && (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                            {t('dashboard.common.signOut')}
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
