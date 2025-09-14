import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { StudentLayout } from '../../components'
import { PersonalDetailsTab, AccountSettingsTab, IdentityVerificationTab } from '../../components/student/profile'
import { studentUserControls, getStudentSidebarItems } from '../../utils/studentConfig'

const ProfileSettingsPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('personal-details')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  // Determine active tab based on current route
  React.useEffect(() => {
    const path = location.pathname
    if (path.includes('account-settings')) {
      setActiveTab('account-settings')
    } else if (path.includes('identification')) {
      setActiveTab('identity-verification')
    } else {
      setActiveTab('personal-details')
    }
  }, [location.pathname])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    const routeMap: { [key: string]: string } = {
      'personal-details': '/student/profile/personal-details',
      'account-settings': '/student/profile/account-settings',
      'identity-verification': '/student/profile/identification'
    }
    navigate(routeMap[tab] || '/student/profile/personal-details')
  }

  const handleSidebarItemClick = (path: string) => {
    navigate(path)
  }

  const sidebarItems = getStudentSidebarItems('/student/profile')

  const breadcrumbItems = [
    { label: 'Profile Settings' },
    { label: activeTab === 'personal-details' ? 'Personal Details' : 
              activeTab === 'account-settings' ? 'Account Settings' : 'Identity Verification' }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal-details':
        return <PersonalDetailsTab />
      case 'account-settings':
        return <AccountSettingsTab />
      case 'identity-verification':
        return <IdentityVerificationTab />
      default:
        return <PersonalDetailsTab />
    }
  }

  return (
    <StudentLayout
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      sidebarItems={sidebarItems}
      onSidebarItemClick={handleSidebarItemClick}
      walletBalance={0}
      onWithdraw={() => console.log('Withdraw clicked')}
      onSignOut={() => console.log('Sign out clicked')}
      breadcrumbItems={breadcrumbItems}
      searchPlaceholder="Quick search here"
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      searchShortcut="Ctrl + K"
      userControls={studentUserControls}
    >
      <div className="p-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => handleTabChange('personal-details')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'personal-details'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Personal Details
              </button>
              <button
                onClick={() => handleTabChange('account-settings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'account-settings'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Account Settings
              </button>
              <button
                onClick={() => handleTabChange('identity-verification')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'identity-verification'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Identity Verification
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </StudentLayout>
  )
}

export default ProfileSettingsPage
