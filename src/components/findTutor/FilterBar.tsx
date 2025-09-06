import React, { useState } from 'react'

const FilterBar = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [filters, setFilters] = useState({
    subjectGroup: '',
    subject: '',
    feePerSession: '',
    tutorLocation: '',
    searchKeyword: '',
    sortBy: '',
    language: ''
  })

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const tabs = [
    { id: 'all', label: 'All Sessions' },
    { id: 'private', label: 'Private Sessions' },
    { id: 'group', label: 'Group Sessions' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      {/* Session Type Tabs */}
      <div className="flex space-x-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-[#FAF8F6] text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Subject Group */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject group
          </label>
          <select
            value={filters.subjectGroup}
            onChange={(e) => handleFilterChange('subjectGroup', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#134E4A] focus:border-[#134E4A] outline-none"
          >
            <option value="">Choose subject group</option>
            <option value="mathematics">Mathematics</option>
            <option value="science">Science</option>
            <option value="languages">Languages</option>
            <option value="arts">Arts</option>
          </select>
        </div>

        {/* Choose Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose subject
          </label>
          <select
            value={filters.subject}
            onChange={(e) => handleFilterChange('subject', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#134E4A] focus:border-[#134E4A] outline-none"
          >
            <option value="">Choose subject</option>
            <option value="algebra">Algebra</option>
            <option value="calculus">Calculus</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
          </select>
        </div>

        {/* Fee per Session */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fee per session
          </label>
          <input
            type="text"
            placeholder="$0.00"
            value={filters.feePerSession}
            onChange={(e) => handleFilterChange('feePerSession', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#134E4A] focus:border-[#134E4A] outline-none"
          />
        </div>

        {/* Tutor Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tutor location
          </label>
          <select
            value={filters.tutorLocation}
            onChange={(e) => handleFilterChange('tutorLocation', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#134E4A] focus:border-[#134E4A] outline-none"
          >
            <option value="">Search by country</option>
            <option value="usa">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="canada">Canada</option>
            <option value="australia">Australia</option>
            <option value="germany">Germany</option>
          </select>
        </div>

        {/* Search by Keyword */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search by keyword
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by keyword"
              value={filters.searchKeyword}
              onChange={(e) => handleFilterChange('searchKeyword', e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#134E4A] focus:border-[#134E4A] outline-none"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Sort by */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort by
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#134E4A] focus:border-[#134E4A] outline-none"
          >
            <option value="">Sort by</option>
            <option value="rating">Rating</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="experience">Experience</option>
            <option value="availability">Availability</option>
          </select>
        </div>

        {/* Select Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select language
          </label>
          <select
            value={filters.language}
            onChange={(e) => handleFilterChange('language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#134E4A] focus:border-[#134E4A] outline-none"
          >
            <option value="">Select language</option>
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
            <option value="french">French</option>
            <option value="german">German</option>
            <option value="chinese">Chinese</option>
          </select>
        </div>
      </div>

      {/* Help Button */}
      <div className="flex justify-end mt-4">
        <button className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default FilterBar
