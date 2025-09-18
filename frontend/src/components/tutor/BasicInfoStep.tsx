import React from 'react'

interface BasicInfoStepProps {
  formData: {
    title: string
    subtitle: string
    description: string
    category: string
    subcategory: string
    level: string
    language: string
    price: string
    currency: string
  }
  onFormDataChange: (field: string, value: string) => void
  errors: Record<string, string>
}

const CATEGORIES = [
  { id: 'programming', name: 'Programming' },
  { id: 'design', name: 'Design' },
  { id: 'business', name: 'Business' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'data-science', name: 'Data Science' },
  { id: 'photography', name: 'Photography' },
  { id: 'music', name: 'Music' },
  { id: 'health', name: 'Health & Fitness' }
]

const SUBCATEGORIES: Record<string, { id: string; name: string }[]> = {
  programming: [
    { id: 'web-development', name: 'Web Development' },
    { id: 'mobile-development', name: 'Mobile Development' },
    { id: 'data-structures', name: 'Data Structures & Algorithms' },
    { id: 'software-engineering', name: 'Software Engineering' }
  ],
  design: [
    { id: 'ui-ux', name: 'UI/UX Design' },
    { id: 'graphic-design', name: 'Graphic Design' },
    { id: 'web-design', name: 'Web Design' },
    { id: 'game-design', name: 'Game Design' }
  ],
  // Add more subcategories for other categories...
}

const LEVELS = [
  { id: 'beginner', name: 'Beginner' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced', name: 'Advanced' },
  { id: 'all-levels', name: 'All Levels' }
]

const LANGUAGES = [
  { id: 'vietnamese', name: 'Tiếng Việt' },
  { id: 'english', name: 'English' },
  { id: 'japanese', name: '日本語' },
  { id: 'korean', name: '한국어' }
]

const CURRENCIES = [
  { id: 'VND', name: 'VND (₫)' },
  { id: 'USD', name: 'USD ($)' }
]

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ formData, onFormDataChange, errors }) => {
  const selectedSubcategories = SUBCATEGORIES[formData.category] || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Tell us about your course</h2>
        <p className="mt-2 text-gray-600">
          Start with the basics. You can always edit these details later.
        </p>
      </div>

      {/* Course Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Course Title *
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => onFormDataChange('title', e.target.value)}
          placeholder="e.g., Complete Web Development Bootcamp"
          className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.title ? 'border-red-300' : 'border-gray-300'
          }`}
          maxLength={100}
        />
        <div className="flex justify-between mt-1">
          {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
          <p className="text-sm text-gray-500">{formData.title.length}/100</p>
        </div>
      </div>

      {/* Course Subtitle */}
      <div>
        <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-2">
          Course Subtitle
        </label>
        <input
          type="text"
          id="subtitle"
          value={formData.subtitle}
          onChange={(e) => onFormDataChange('subtitle', e.target.value)}
          placeholder="e.g., Build 15+ Projects with HTML, CSS, JavaScript, React & Node.js"
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          maxLength={120}
        />
        <p className="text-sm text-gray-500 mt-1">{formData.subtitle.length}/120</p>
      </div>

      {/* Short Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Course Description *
        </label>
        <textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={(e) => onFormDataChange('description', e.target.value)}
          placeholder="What will students learn in your course? Keep it brief and engaging."
          className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.description ? 'border-red-300' : 'border-gray-300'
          }`}
          maxLength={200}
        />
        <div className="flex justify-between mt-1">
          {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
          <p className="text-sm text-gray-500">{formData.description.length}/200</p>
        </div>
      </div>

      {/* Category & Subcategory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => {
              onFormDataChange('category', e.target.value)
              onFormDataChange('subcategory', '') // Reset subcategory
            }}
            className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.category ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category}</p>}
        </div>

        <div>
          <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-2">
            Subcategory
          </label>
          <select
            id="subcategory"
            value={formData.subcategory}
            onChange={(e) => onFormDataChange('subcategory', e.target.value)}
            disabled={!formData.category}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="">Select a subcategory</option>
            {selectedSubcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Level & Language */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
            Level *
          </label>
          <select
            id="level"
            value={formData.level}
            onChange={(e) => onFormDataChange('level', e.target.value)}
            className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.level ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select level</option>
            {LEVELS.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name}
              </option>
            ))}
          </select>
          {errors.level && <p className="text-sm text-red-600 mt-1">{errors.level}</p>}
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
            Primary Language *
          </label>
          <select
            id="language"
            value={formData.language}
            onChange={(e) => onFormDataChange('language', e.target.value)}
            className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.language ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select language</option>
            {LANGUAGES.map((language) => (
              <option key={language.id} value={language.id}>
                {language.name}
              </option>
            ))}
          </select>
          {errors.language && <p className="text-sm text-red-600 mt-1">{errors.language}</p>}
        </div>
      </div>

      {/* Pricing */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Course Price *
            </label>
            <input
              type="number"
              id="price"
              value={formData.price}
              onChange={(e) => onFormDataChange('price', e.target.value)}
              placeholder="0"
              min="0"
              className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.price ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price}</p>}
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
              Currency *
            </label>
            <select
              id="currency"
              value={formData.currency}
              onChange={(e) => onFormDataChange('currency', e.target.value)}
              className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.currency ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select currency</option>
              {CURRENCIES.map((currency) => (
                <option key={currency.id} value={currency.id}>
                  {currency.name}
                </option>
              ))}
            </select>
            {errors.currency && <p className="text-sm text-red-600 mt-1">{errors.currency}</p>}
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          💡 Tip: Research similar courses to price competitively. You can always adjust pricing later.
        </p>
      </div>
    </div>
  )
}

export default BasicInfoStep