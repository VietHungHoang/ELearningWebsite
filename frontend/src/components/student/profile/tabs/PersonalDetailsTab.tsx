import React, { useState } from 'react'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Globe, 
  Upload, 
  Trash2, 
  Sparkles,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from 'lucide-react'

const PersonalDetailsTab = () => {
  const [formData, setFormData] = useState({
    firstName: 'Anthony',
    lastName: 'Shao',
    email: 'anthony@amentotech.com',
    phone: '07123456789',
    gender: 'male',
    country: 'Angola',
    state: 'Bié',
    city: 'Jomala',
    zipCode: '10012',
    nativeLanguage: 'Albanian',
    languages: ['Arabic', 'Aragonese'],
    introduction: `I am Anthony Shao, a committed and enthusiastic tutor with expertise in subjects ranging from mathematics, science, and English. My teaching philosophy centers on empowering students to reach their full potential through personalized learning approaches and interactive methodologies.

With a strong academic background and years of experience in education, I strive to create an encouraging learning environment where students feel confident to ask questions and explore new concepts. I believe that every student has unique learning needs, and I adapt my teaching style accordingly to ensure maximum comprehension and retention.

My goal is not just to help students achieve academic success, but also to instill in them a lifelong love for learning. I am passionate about making complex topics accessible and engaging, using real-world examples and practical applications to enhance understanding.`,
    profilePhoto: 'anthony-shao.jpg'
  })

  const [newLanguage, setNewLanguage] = useState('')

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }))
      setNewLanguage('')
    }
  }

  const handleRemoveLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== language)
    }))
  }

  const handleSave = () => {
    console.log('Saving personal details:', formData)
    // Add API call here
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Details</h1>
        <p className="text-gray-600">
          Please provide your personal information below to complete your profile.
        </p>
      </div>

      <form className="space-y-8">
        {/* Full Name Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Full Name</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Email Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Email</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Phone Number Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Phone number</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Gender Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Gender</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select Gender <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'not-specified', label: 'Not specified' }
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value={option.value}
                    checked={formData.gender === option.value}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Address <span className="text-red-500">*</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                >
                  <option value="Angola">Angola</option>
                  <option value="Vietnam">Vietnam</option>
                  <option value="USA">USA</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                >
                  <option value="Bié">Bié</option>
                  <option value="Luanda">Luanda</option>
                  <option value="Huambo">Huambo</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Zip code</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Native Language Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Native Language <span className="text-red-500">*</span></h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Native Language</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={formData.nativeLanguage}
                onChange={(e) => handleInputChange('nativeLanguage', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
              >
                <option value="Albanian">Albanian</option>
                <option value="English">English</option>
                <option value="Vietnamese">Vietnamese</option>
                <option value="Spanish">Spanish</option>
              </select>
            </div>
          </div>
        </div>

        {/* Languages I know Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Languages I know <span className="text-red-500">*</span></h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Add Languages</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLanguage())}
                placeholder="Enter language name"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleAddLanguage}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add
              </button>
            </div>
            
            {/* Selected Languages */}
            <div className="mt-4 flex flex-wrap gap-2">
              {formData.languages.map((language) => (
                <div
                  key={language}
                  className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full"
                >
                  <span className="text-sm">{language}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLanguage(language)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Introduction Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">A brief introduction <span className="text-red-500">*</span></h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Write your introduction</label>
            
            {/* Rich Text Editor Toolbar */}
            <div className="border border-gray-300 rounded-t-lg p-3 bg-gray-50 flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-200 rounded">
                <Bold className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded">
                <Italic className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded">
                <Underline className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <select className="px-2 py-1 border border-gray-300 rounded text-sm">
                <option>14</option>
                <option>16</option>
                <option>18</option>
              </select>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <button className="p-2 hover:bg-gray-200 rounded">
                <AlignLeft className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded">
                <AlignCenter className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded">
                <AlignRight className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded">
                <AlignJustify className="w-4 h-4" />
              </button>
            </div>
            
            <textarea
              value={formData.introduction}
              onChange={(e) => handleInputChange('introduction', e.target.value)}
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 border-t-0 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">Characters count: {formData.introduction.length}</span>
              <button className="flex items-center space-x-2 text-green-600 hover:text-green-700">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Write with AI</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Photo Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Photo <span className="text-red-500">*</span></h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Upload Profile Photo</label>
            
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Drop a file here or click here to upload</p>
              <p className="text-sm text-gray-500">jpg, jpeg, gif, png (max. 5 mb)</p>
            </div>
            
            {/* Current Photo */}
            {formData.profilePhoto && (
              <div className="mt-4 flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{formData.profilePhoto}</p>
                  <p className="text-sm text-gray-500">Current profile photo</p>
                </div>
                <button className="p-2 text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end space-x-4">
          <div className="text-sm text-gray-500">
            Save & update the latest changes to the live
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Save & Update
          </button>
        </div>
      </form>
    </div>
  )
}

export default PersonalDetailsTab
