import { 
  Settings, 
  Calendar, 
  BookOpen, 
  Users, 
  GraduationCap, 
  FileText, 
  Mail, 
  MessageCircle, 
  Award, 
  CreditCard
} from 'lucide-react'

// Shared configuration for all student pages
export const studentSidebarItems = [
  { icon: Settings, label: 'Profile Settings', path: '/student/profile' },
  { icon: Calendar, label: 'My Bookings', path: '/student/bookings' },
  { icon: BookOpen, label: 'My Learning', path: '/student/course-list' },
  { icon: Users, label: 'Find Tutors', path: '/find-tutors' },
  { icon: FileText, label: 'My Quizzes', path: '/student/quizzes' },
  { icon: GraduationCap, label: 'Find Courses', path: '/courses' },
  { icon: BookOpen, label: 'Find Course Bundles', path: '/course-bundles' },
  { icon: FileText, label: 'Assignments', path: '/assignments' },
  { icon: Mail, label: 'Inbox', path: '/student/inbox' },
  { icon: MessageCircle, label: 'Community', path: '/forums' },
  { icon: Award, label: 'My Certificates', path: '/student/certificates' },
  { icon: CreditCard, label: 'Favourites', path: '/student/favourites' },
  { icon: CreditCard, label: 'Billing Details', path: '/student/billing-detail' },
  { icon: FileText, label: 'Invoices', path: '/student/invoices' },
  { icon: FileText, label: 'Disputes', path: '/student/disputes' },
]

export const studentUserControls = {
  currency: 'USD $',
  language: 'En',
  languageFlag: 'https://flagcdn.com/w20/gb.png',
  cartCount: 2, // Same as homepage
  userAvatar: '/media/students/sarah-chapman.jpg', // Same as homepage
  onCurrencyChange: () => console.log('Currency change clicked'),
  onLanguageChange: () => console.log('Language change clicked'),
  onCartClick: () => console.log('Cart clicked'),
  onNotificationClick: () => console.log('Notification clicked'),
  onMessageClick: () => console.log('Message clicked'),
  onUserClick: () => console.log('User clicked')
}

export const getStudentSidebarItems = (activeItem: string) => {
  return studentSidebarItems.map(item => ({
    ...item,
    active: item.path === activeItem
  }))
}
