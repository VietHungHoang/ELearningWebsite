// import React from 'react';
// import { SwitchUserRoleIcon } from './icons/SwitchUserRoleIcon';
// import { ProfileSettingsIcon } from './icons/ProfileSettingsIcon';
// import { MyBookingsIcon } from './icons/MyBookingsIcon';
// import { MyLearningIcon } from './icons/MyLearningIcon';
// import { BillingDetailsIcon } from './icons/BillingDetailsIcon';
// import { HeartIcon } from './icons/HeartIcon';
// import { FindTutorsIcon } from './icons/FindTutorsIcon';
// import { FindCoursesIcon } from './icons/FindCoursesIcon';
// import { MessageIcon } from './icons/MessageIcon';
// import { SubscriptionsIcon } from './icons/SubscriptionsIcon';
// import { SignOutIcon } from './icons/SignOutIcon';
// import type { AppPage } from '../../../App';

// interface NavItemProps {
//     icon: React.ReactNode;
//     label: string;
//     isSignOut?: boolean;
//     onClick?: () => void;
// }

// const NavItem: React.FC<NavItemProps> = ({ icon, label, isSignOut, onClick }) => (
//     <a href="#" onClick={(e) => { e.preventDefault(); onClick?.(); }} className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors ${isSignOut ? 'text-red-500' : 'text-gray-700'}`}>
//         <span className="w-5 h-5">{icon}</span>
//         <span className="font-medium text-sm">{label}</span>
//     </a>
// );

// interface ProfileDropdownProps {
//   navigateToApp: (page: AppPage, options?: { initialView?: string }) => void;
//   handleLogout: () => void;
// }

// const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ navigateToApp, handleLogout }) => {
//     return (
//         <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-xl shadow-lg z-50 border border-gray-100 p-4 animate-dropdown-in">
//             {/* User Info */}
//             <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
//                 <img src="https://picsum.photos/seed/avatar/40/40" alt="User Avatar" className="w-10 h-10 rounded-full" />
//                 <div>
//                     <p className="font-bold text-gray-800">Sarah Chapman</p>
//                     <p className="text-xs text-gray-500">student@amentotech.com</p>
//                 </div>
//             </div>

//             {/* Switch Role */}
//             <div className="my-4 p-4 bg-gray-50 rounded-lg">
//                 <h4 className="font-bold text-gray-800">Switch to tutor account</h4>
//                 <p className="text-xs text-gray-500 mt-1">You can switch back to student account anytime with one click</p>
//                 <button className="mt-3 w-full flex items-center justify-center gap-2 bg-[#345B55] text-white font-semibold py-2 px-3 rounded-lg text-sm hover:bg-opacity-90 transition-colors">
//                     <SwitchUserRoleIcon />
//                     <span>Switch user role</span>
//                 </button>
//             </div>
            
//             {/* Navigation Links */}
//             <nav className="space-y-1">
//                 <NavItem icon={<ProfileSettingsIcon />} label="Profile Settings" onClick={() => navigateToApp('profileSettings')} />
//                 <NavItem icon={<MyBookingsIcon />} label="My Bookings" onClick={() => navigateToApp('profileSettings', { initialView: 'My Bookings' })} />
//                 <NavItem icon={<MyLearningIcon />} label="My Learning" onClick={() => navigateToApp('profileSettings', { initialView: 'My Learning' })} />
//                 <NavItem icon={<BillingDetailsIcon />} label="Billing Details" onClick={() => navigateToApp('profileSettings', { initialView: 'Invoices' })}/>
//                 <NavItem icon={<HeartIcon />} label="Favourites" onClick={() => navigateToApp('favorites')} />
//                 <NavItem icon={<FindTutorsIcon />} label="Find Tutors" onClick={() => navigateToApp('findTutors')} />
//                 <NavItem icon={<FindCoursesIcon />} label="Find Courses" onClick={() => navigateToApp('findCourses')} />
//                 <NavItem icon={<MessageIcon />} label="Inbox" onClick={() => navigateToApp('profileSettings', { initialView: 'Inbox' })} />
//                 <NavItem icon={<SubscriptionsIcon />} label="Subscriptions" />
//                 <div className="pt-2 mt-2 border-t border-gray-100">
//                     <NavItem icon={<SignOutIcon />} label="Sign out" isSignOut onClick={handleLogout} />
//                 </div>
//             </nav>
//         </div>
//     );
// };

// export default ProfileDropdown;