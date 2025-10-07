import React from 'react'
import { BarChart3, Users, BookOpen, Settings, CreditCard, Bell, FileText } from 'lucide-react'

type NavIcon = React.ComponentType<{ className?: string }>

export interface SidebarItemConfig {
  label: string
  path: string
  icon: NavIcon
}

export const adminMainSidebarItems: SidebarItemConfig[] = [
  { label: 'Insights', path: '/admin/insights', icon: BarChart3 },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Courses', path: '/admin/courses', icon: BookOpen },
  { label: 'Pages', path: '/admin/pages', icon: FileText },
]

export const adminAdditionalSidebarItems: SidebarItemConfig[] = [
  { label: 'Settings', path: '/admin/settings', icon: Settings },
  { label: 'Payment Methods', path: '/admin/payment-methods', icon: CreditCard },
  { label: 'Notifications', path: '/admin/notification-settings', icon: Bell },
]

export const adminUserControls = {
  notifications: 5,
  messages: 2
}


