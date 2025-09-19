import React, { useState } from 'react'
import { 
  Shield, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Camera, 
  FileText,
  Save,
  Eye,
  EyeOff,
  Download
} from 'lucide-react'

const IdentityVerificationTab = () => {
  const [formData, setFormData] = useState({
    fullName: 'Anthony Shao',
    idNumber: '',
    idType: 'passport',
    dateOfBirth: '1990-01-15',
    nationality: 'Angola',
    address: 'Jomala, Bié, Angola',
    documents: {
      front: null as File | null,
      back: null as File | null,
      selfie: null as File | null
    },
    status: 'pending' // pending, verified, rejected
  })

  const [showIdNumber, setShowIdNumber] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = (field: 'front' | 'back' | 'selfie', file: File) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: file
      }
    }))
  }

  const handleSave = async () => {
    setIsUploading(true)
    setMessage({ type: '', text: '' })

    try {
      // Validate required fields
      if (!formData.idNumber) {
        setMessage({ type: 'error', text: 'Please enter your ID number' })
        return
      }

      if (!formData.documents.front || !formData.documents.back || !formData.documents.selfie) {
        setMessage({ type: 'error', text: 'Please upload all required documents' })
        return
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      setMessage({ type: 'success', text: 'Identity verification submitted successfully! We will review your documents within 24-48 hours.' })
      setFormData(prev => ({ ...prev, status: 'pending' }))
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to submit identity verification' })
    } finally {
      setIsUploading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-100'
      case 'rejected':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-yellow-600 bg-yellow-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Verified'
      case 'rejected':
        return 'Rejected'
      default:
        return 'Pending Review'
    }
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Identity Verification</h1>
        <p className="text-gray-600">
          Verify your identity to access all platform features and ensure account security.
        </p>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Verification Status</h3>
              <p className="text-sm text-gray-600">Your identity verification status</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(formData.status)}`}>
            {getStatusText(formData.status)}
          </div>
        </div>
      </div>

      <form className="space-y-8">
        {/* Personal Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nationality <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="Angola">Angola</option>
                <option value="Vietnam">Vietnam</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.idType}
                onChange={(e) => handleInputChange('idType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="passport">Passport</option>
                <option value="national_id">National ID</option>
                <option value="driver_license">Driver's License</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showIdNumber ? 'text' : 'password'}
                  value={formData.idNumber}
                  onChange={(e) => handleInputChange('idNumber', e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your ID number"
                />
                <button
                  type="button"
                  onClick={() => setShowIdNumber(!showIdNumber)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showIdNumber ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your full address"
              />
            </div>
          </div>
        </div>

        {/* Document Upload */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Document Upload</h3>
          <p className="text-sm text-gray-600 mb-6">
            Please upload clear, high-quality images of your documents. All documents must be clearly visible and readable.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Front of ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Front of ID <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">Upload front of ID</p>
                <p className="text-xs text-gray-500 mb-4">JPG, PNG (max 5MB)</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('front', e.target.files[0])}
                  className="hidden"
                  id="front-upload"
                />
                <label
                  htmlFor="front-upload"
                  className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Choose File
                </label>
              </div>
              {formData.documents.front && (
                <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>{formData.documents.front.name}</span>
                </div>
              )}
            </div>

            {/* Back of ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Back of ID <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">Upload back of ID</p>
                <p className="text-xs text-gray-500 mb-4">JPG, PNG (max 5MB)</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('back', e.target.files[0])}
                  className="hidden"
                  id="back-upload"
                />
                <label
                  htmlFor="back-upload"
                  className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Choose File
                </label>
              </div>
              {formData.documents.back && (
                <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>{formData.documents.back.name}</span>
                </div>
              )}
            </div>

            {/* Selfie with ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selfie with ID <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">Upload selfie with ID</p>
                <p className="text-xs text-gray-500 mb-4">JPG, PNG (max 5MB)</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('selfie', e.target.files[0])}
                  className="hidden"
                  id="selfie-upload"
                />
                <label
                  htmlFor="selfie-upload"
                  className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Choose File
                </label>
              </div>
              {formData.documents.selfie && (
                <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>{formData.documents.selfie.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-4">Document Guidelines</h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
              <span>Ensure all text is clearly visible and readable</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
              <span>Use good lighting and avoid shadows or glare</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
              <span>Make sure the entire document is visible in the frame</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
              <span>For selfie with ID, hold the ID next to your face</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
              <span>Documents must be valid and not expired</span>
            </li>
          </ul>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`p-4 rounded-lg flex items-center space-x-3 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end space-x-4">
          <div className="text-sm text-gray-500">
            Save & update the latest changes to the live
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={isUploading}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Submit Verification</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default IdentityVerificationTab
