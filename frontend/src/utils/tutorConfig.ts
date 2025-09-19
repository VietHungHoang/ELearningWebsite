import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  BookOpen, 
  Package, 
  FileText, 
  Users, 
  HelpCircle, 
  Inbox, 
  Gift, 
  Award, 
  CreditCard, 
  Receipt, 
  AlertTriangle,
  Settings
} from 'lucide-react';

// Main sidebar items for tutor
export const tutorMainSidebarItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/tutor/dashboard',
    isActive: false
  },
  {
    id: 'profile',
    label: 'Profile Settings',
    icon: User,
    path: '/tutor/profile',
    isActive: false
  },
  {
    id: 'bookings',
    label: 'Manage Bookings',
    icon: Calendar,
    path: '/tutor/bookings',
    isActive: false
  },
  {
    id: 'courses',
    label: 'Manage Courses',
    icon: BookOpen,
    path: '/tutor/courses',
    isActive: false
  },
  {
    id: 'bundles',
    label: 'Course Bundles',
    icon: Package,
    path: '/tutor/bundles',
    isActive: false
  },
  {
    id: 'assignments',
    label: 'Assignments',
    icon: FileText,
    path: '/tutor/assignments',
    isActive: false
  },
  {
    id: 'community',
    label: 'Community',
    icon: Users,
    path: '/tutor/community',
    isActive: false
  },
  {
    id: 'quizzes',
    label: 'Manage Quizzes',
    icon: HelpCircle,
    path: '/tutor/quizzes',
    isActive: false
  },
  {
    id: 'inbox',
    label: 'Inbox',
    icon: Inbox,
    path: '/tutor/inbox',
    isActive: false
  },
  {
    id: 'deals',
    label: 'Deal & Coupons',
    icon: Gift,
    path: '/tutor/deals',
    isActive: false
  },
  {
    id: 'certificates',
    label: 'Certificates',
    icon: Award,
    path: '/tutor/certificates',
    isActive: false
  }
];

// Additional sidebar items for tutor (scrollable)
export const tutorAdditionalSidebarItems = [
  {
    id: 'payouts',
    label: 'Payouts',
    icon: CreditCard,
    path: '/tutor/payouts',
    isActive: false
  },
  {
    id: 'invoices',
    label: 'Invoices',
    icon: Receipt,
    path: '/tutor/invoices',
    isActive: false
  },
  {
    id: 'disputes',
    label: 'Disputes',
    icon: AlertTriangle,
    path: '/tutor/disputes',
    isActive: false
  }
];

// User controls for tutor header
export const tutorUserControls = {
  currency: 'USD',
  language: 'English',
  languageFlag: 'us.png',
  cartCount: 0,
  notifications: [
    {
      id: 1,
      title: 'New booking request',
      message: 'Sarah Johnson wants to book a session',
      time: '2 min ago',
      isRead: false
    },
    {
      id: 2,
      title: 'Course approved',
      message: 'Your "Advanced React" course has been approved',
      time: '1 hour ago',
      isRead: true
    }
  ],
  messages: [
    {
      id: 1,
      name: 'John Smith',
      message: 'Hi, I have a question about the assignment',
      time: '5 min ago',
      isRead: false,
      avatar: '/media/students/john-smith.jpg'
    },
    {
      id: 2,
      name: 'Emily Davis',
      message: 'Thank you for the great lesson!',
      time: '2 hours ago',
      isRead: true,
      avatar: '/media/students/emily-davis.jpg'
    }
  ],
  userAvatar: '/media/tutors/sarah-johnson.jpg',
  userName: 'Dr. Sarah Johnson',
  userRole: 'Tutor'
};

// Function to get tutor sidebar items
export const getTutorSidebarItems = () => {
  return {
    mainItems: tutorMainSidebarItems,
    additionalItems: tutorAdditionalSidebarItems
  };
};
