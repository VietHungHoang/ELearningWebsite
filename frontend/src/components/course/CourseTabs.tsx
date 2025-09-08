interface CourseTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const CourseTabs = ({ activeTab, onTabChange }: CourseTabsProps) => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'objectives', label: 'Objectives' },
    { id: 'curriculum', label: 'Course Curriculum' },
    { id: 'prerequisites', label: 'Prerequisites & FAQs' },
    { id: 'reviews', label: 'Reviews' }
  ]

  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-[#134E4A] text-[#134E4A]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            role="tab"
            aria-selected={activeTab === tab.id}
            tabIndex={activeTab === tab.id ? 0 : -1}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default CourseTabs
