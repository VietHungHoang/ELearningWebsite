import React, { useState } from 'react'
import { X, Save, Eye, Upload, Palette, Type, Image, Download } from 'lucide-react'
import type { CertificateTemplate } from '../../types/certificate'

interface CertificateTemplateBuilderProps {
  template?: CertificateTemplate | null
  isOpen: boolean
  onClose: () => void
  onSave: (template: CertificateTemplate) => void
}

const CertificateTemplateBuilder: React.FC<CertificateTemplateBuilderProps> = ({
  template,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    title: template?.title || '',
    description: template?.description || '',
    templateData: {
      backgroundColor: template?.templateData.backgroundColor || '#ffffff',
      textColor: template?.templateData.textColor || '#1f2937',
      logoUrl: template?.templateData.logoUrl || '',
      signatureUrl: template?.templateData.signatureUrl || '',
      borderColor: template?.templateData.borderColor || '#3b82f6',
      fontFamily: template?.templateData.fontFamily || 'Inter',
      fontSize: template?.templateData.fontSize || 16
    }
  })

  const [activeTab, setActiveTab] = useState('design')
  const [previewMode, setPreviewMode] = useState(false)

  if (!isOpen) return null

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSave = () => {
    const newTemplate: CertificateTemplate = {
      id: template?.id || `template-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      templateData: formData.templateData,
      isActive: true,
      createdAt: template?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    onSave(newTemplate)
    onClose()
  }

  const fontOptions = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Playfair Display', label: 'Playfair Display' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Montserrat', label: 'Montserrat' }
  ]

  const colorPresets = [
    { name: 'Blue', bg: '#eff6ff', text: '#1e40af', border: '#2563eb' },
    { name: 'Green', bg: '#f0fdf4', text: '#166534', border: '#16a34a' },
    { name: 'Purple', bg: '#faf5ff', text: '#7c3aed', border: '#8b5cf6' },
    { name: 'Gold', bg: '#fefce8', text: '#92400e', border: '#f59e0b' },
    { name: 'Gray', bg: '#f9fafb', text: '#374151', border: '#6b7280' }
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {template ? 'Edit Template' : 'Create New Template'}
              </h2>
              <p className="text-sm text-gray-600">Design your certificate template</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Eye className="w-4 h-4" />
                <span>{previewMode ? 'Edit' : 'Preview'}</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                <span>Save Template</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex h-[calc(90vh-120px)]">
            {/* Sidebar */}
            <div className="w-80 border-r border-gray-200 overflow-y-auto">
              <div className="p-6">
                {/* Tabs */}
                <div className="flex space-x-1 mb-6">
                  <button
                    onClick={() => setActiveTab('design')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                      activeTab === 'design' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Palette className="w-4 h-4 inline mr-2" />
                    Design
                  </button>
                  <button
                    onClick={() => setActiveTab('content')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                      activeTab === 'content' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Type className="w-4 h-4 inline mr-2" />
                    Content
                  </button>
                </div>

                {/* Design Tab */}
                {activeTab === 'design' && (
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Basic Information</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                          <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter template name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={3}
                            placeholder="Enter template description"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Color Presets */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Color Presets</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {colorPresets.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => {
                              handleInputChange('templateData.backgroundColor', preset.bg)
                              handleInputChange('templateData.textColor', preset.text)
                              handleInputChange('templateData.borderColor', preset.border)
                            }}
                            className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 text-left"
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <div 
                                className="w-4 h-4 rounded-full border"
                                style={{ backgroundColor: preset.bg, borderColor: preset.border }}
                              />
                              <span className="text-sm font-medium">{preset.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Colors */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Custom Colors</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={formData.templateData.backgroundColor}
                              onChange={(e) => handleInputChange('templateData.backgroundColor', e.target.value)}
                              className="w-8 h-8 border border-gray-300 rounded"
                            />
                            <input
                              type="text"
                              value={formData.templateData.backgroundColor}
                              onChange={(e) => handleInputChange('templateData.backgroundColor', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={formData.templateData.textColor}
                              onChange={(e) => handleInputChange('templateData.textColor', e.target.value)}
                              className="w-8 h-8 border border-gray-300 rounded"
                            />
                            <input
                              type="text"
                              value={formData.templateData.textColor}
                              onChange={(e) => handleInputChange('templateData.textColor', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Border Color</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={formData.templateData.borderColor}
                              onChange={(e) => handleInputChange('templateData.borderColor', e.target.value)}
                              className="w-8 h-8 border border-gray-300 rounded"
                            />
                            <input
                              type="text"
                              value={formData.templateData.borderColor}
                              onChange={(e) => handleInputChange('templateData.borderColor', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Typography */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Typography</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
                          <select
                            value={formData.templateData.fontFamily}
                            onChange={(e) => handleInputChange('templateData.fontFamily', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {fontOptions.map((font) => (
                              <option key={font.value} value={font.value}>
                                {font.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
                          <input
                            type="range"
                            min="12"
                            max="24"
                            value={formData.templateData.fontSize}
                            onChange={(e) => handleInputChange('templateData.fontSize', parseInt(e.target.value))}
                            className="w-full"
                          />
                          <div className="text-center text-sm text-gray-500">{formData.templateData.fontSize}px</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content Tab */}
                {activeTab === 'content' && (
                  <div className="space-y-6">
                    {/* Images */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Images</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="url"
                              value={formData.templateData.logoUrl}
                              onChange={(e) => handleInputChange('templateData.logoUrl', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="https://example.com/logo.png"
                            />
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <Upload className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Signature URL</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="url"
                              value={formData.templateData.signatureUrl}
                              onChange={(e) => handleInputChange('templateData.signatureUrl', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="https://example.com/signature.png"
                            />
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <Upload className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Preview */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="h-full flex items-center justify-center">
                <div className="w-full max-w-2xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Certificate Preview</h3>
                  <div 
                    className="rounded-lg shadow-lg p-8 text-center"
                    style={{ 
                      backgroundColor: formData.templateData.backgroundColor,
                      color: formData.templateData.textColor,
                      fontFamily: formData.templateData.fontFamily,
                      fontSize: `${formData.templateData.fontSize}px`,
                      border: `4px solid ${formData.templateData.borderColor}`
                    }}
                  >
                    {/* Logo */}
                    {formData.templateData.logoUrl && (
                      <div className="mb-6">
                        <img 
                          src={formData.templateData.logoUrl} 
                          alt="Logo" 
                          className="w-16 h-16 mx-auto object-contain"
                        />
                      </div>
                    )}

                    {/* Header */}
                    <div className="mb-8">
                      <h1 className="text-3xl font-bold mb-2">Certificate of Completion</h1>
                      <p className="text-lg">This is to certify that</p>
                    </div>

                    {/* Student Name */}
                    <div className="mb-8">
                      <h2 className="text-4xl font-bold mb-2" style={{ color: formData.templateData.borderColor }}>
                        John Doe
                      </h2>
                      <p className="text-lg">has successfully completed the course</p>
                    </div>

                    {/* Course Title */}
                    <div className="mb-8">
                      <h3 className="text-2xl font-semibold mb-2">Sample Course Title</h3>
                      <p className="text-lg">instructed by Sample Instructor</p>
                    </div>

                    {/* Completion Date */}
                    <div className="mb-8">
                      <p className="text-lg">Completed on</p>
                      <p className="text-xl font-semibold">January 15, 2024</p>
                    </div>

                    {/* Certificate ID */}
                    <div className="mb-8">
                      <p className="text-sm opacity-75">Certificate ID: CERT-2024-001</p>
                    </div>

                    {/* Signature */}
                    <div className="flex justify-between items-end">
                      <div className="text-center">
                        <div className="w-32 h-16 bg-gray-200 rounded mb-2 flex items-center justify-center">
                          <span className="text-xs opacity-75">Signature</span>
                        </div>
                        <p className="text-sm">Sample Instructor</p>
                        <p className="text-xs opacity-75">Instructor</p>
                      </div>
                      <div className="text-center">
                        <div className="w-32 h-16 bg-gray-200 rounded mb-2 flex items-center justify-center">
                          <span className="text-xs opacity-75">Date</span>
                        </div>
                        <p className="text-sm">January 15, 2024</p>
                        <p className="text-xs opacity-75">Issue Date</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CertificateTemplateBuilder
