import { useState, useEffect } from 'react'
import { 
  Award, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock,
} from 'lucide-react'
import { CertificatePreviewModal, CertificateTemplateBuilder } from '../../components/certificate'
import { certificateApi } from '../../services/certificateApi'
import type { CertificateTemplate, StudentCertificate, CertificateStats } from '../../types/certificate'

const TutorCertificatesPage = () => {
  const [activeTab, setActiveTab] = useState('templates')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showTemplateBuilder, setShowTemplateBuilder] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<CertificateTemplate | null>(null)
  const [selectedCertificate, setSelectedCertificate] = useState<StudentCertificate | null>(null)
  const [showCertificatePreview, setShowCertificatePreview] = useState(false)
  const [templates, setTemplates] = useState<CertificateTemplate[]>([])
  const [certificates, setCertificates] = useState<StudentCertificate[]>([])
  const [stats, setStats] = useState<CertificateStats | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Load data on component mount
  useEffect(() => {
    loadTemplates()
    loadCertificates()
    loadStats()
  }, [activeTab, statusFilter])

  const loadTemplates = async () => {
    try {
      console.log('📋 Loading certificate templates...')
      const templatesData = await certificateApi.templates.getAllTemplates()
      console.log('✅ Templates loaded:', templatesData.length)
      setTemplates(templatesData)
    } catch (err: any) {
      console.error('❌ Error loading templates:', err)
      setError(err.response?.data?.message || 'Failed to load templates. Please try again.')
    }
  }

  const loadCertificates = async () => {
    try {
      console.log('📜 Loading student certificates...')
      const params = statusFilter !== 'all' ? { status: statusFilter as any } : {}
      const response = await certificateApi.certificates.getAllCertificates(params)
      console.log('✅ Certificates loaded:', response.certificates.length)
      setCertificates(response.certificates)
    } catch (err: any) {
      console.error('❌ Error loading certificates:', err)
      setError(err.response?.data?.message || 'Failed to load certificates. Please try again.')
    }
  }

  const loadStats = async () => {
    try {
      console.log('📊 Loading certificate statistics...')
      const statsData = await certificateApi.stats.getTutorStats()
      console.log('✅ Stats loaded:', statsData)
      setStats(statsData)
    } catch (err: any) {
      console.error('❌ Error loading stats:', err)
      // Don't set error for stats, just log it
    }
  }

  // Filter certificates based on status
  const filteredCertificates = certificates.filter(cert => {
    const matchesStatus = statusFilter === 'all' || cert.status === statusFilter
    
    return matchesStatus
  })

  const handleCreateTemplate = () => {
    setShowTemplateBuilder(true)
  }

  const handleEditTemplate = (template: CertificateTemplate) => {
    setSelectedTemplate(template)
    setShowTemplateBuilder(true)
  }

  const handlePreviewCertificate = (certificate: StudentCertificate) => {
    setSelectedCertificate(certificate)
    setShowCertificatePreview(true)
  }

  const handleApproveCertificate = async (certificateId: string) => {
    try {
      console.log('Approving certificate:', certificateId)
      await certificateApi.certificates.approveCertificate(certificateId)
      console.log('✅ Certificate approved successfully')
      // Reload certificates to update the list
      loadCertificates()
      loadStats()
    } catch (err: any) {
      console.error('❌ Error approving certificate:', err)
      setError(err.response?.data?.message || 'Failed to approve certificate. Please try again.')
    }
  }

  const handleRejectCertificate = async (certificateId: string) => {
    try {
      console.log('Rejecting certificate:', certificateId)
      const reason = prompt('Please provide a reason for rejection:')
      if (reason) {
        await certificateApi.certificates.rejectCertificate(certificateId, reason)
        console.log('✅ Certificate rejected successfully')
        // Reload certificates to update the list
        loadCertificates()
        loadStats()
      }
    } catch (err: any) {
      console.error('❌ Error rejecting certificate:', err)
      setError(err.response?.data?.message || 'Failed to reject certificate. Please try again.')
    }
  }

  const handleDownloadCertificate = (certificateId: string) => {
    console.log('Downloading certificate:', certificateId)
    // TODO: Implement download logic
  }

  const handleSaveTemplate = async (template: CertificateTemplate) => {
    try {
      console.log('Saving template:', template)
      if (template.id && template.id.startsWith('template-')) {
        // Update existing template
        await certificateApi.templates.updateTemplate(template.id, template)
        console.log('✅ Template updated successfully')
      } else {
        // Create new template
        await certificateApi.templates.createTemplate(template)
        console.log('✅ Template created successfully')
      }
      // Reload templates to update the list
      loadTemplates()
      setShowTemplateBuilder(false)
    } catch (err: any) {
      console.error('❌ Error saving template:', err)
      setError(err.response?.data?.message || 'Failed to save template. Please try again.')
    }
  }


  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Certificate Management</h1>
            <p className="text-gray-600">Manage certificate templates and student certificates</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCreateTemplate}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Template</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-sm border border-blue-200 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Total</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">{stats.totalCertificates}</p>
                  <p className="text-xs text-blue-600 mt-1">All certificates</p>
                </div>
                <div className="p-3 bg-blue-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-sm border border-green-200 hover:shadow-lg hover:shadow-green-200/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-green-700 uppercase tracking-wide">Approved</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">{stats.approvedCertificates}</p>
                  <p className="text-xs text-green-600 mt-1">Ready to issue</p>
                </div>
                <div className="p-3 bg-green-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl shadow-sm border border-yellow-200 hover:shadow-lg hover:shadow-yellow-200/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-yellow-700 uppercase tracking-wide">Pending</p>
                  <p className="text-3xl font-bold text-yellow-900 mt-2">{stats.pendingCertificates}</p>
                  <p className="text-xs text-yellow-600 mt-1">Awaiting review</p>
                </div>
                <div className="p-3 bg-yellow-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl shadow-sm border border-red-200 hover:shadow-lg hover:shadow-red-200/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-red-700 uppercase tracking-wide">Rejected</p>
                  <p className="text-3xl font-bold text-red-900 mt-2">{stats.rejectedCertificates}</p>
                  <p className="text-xs text-red-600 mt-1">Needs attention</p>
                </div>
                <div className="p-3 bg-red-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Templates ({templates.length})
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'certificates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Student Certificates ({certificates.length})
            </button>
          </nav>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Certificate Templates</h2>
              <button
                onClick={handleCreateTemplate}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Create Template</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{template.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                    </div>
                    <div className="ml-4">
                      <span className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full ${
                        template.isActive 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${template.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        {template.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div 
                      className="w-full h-40 rounded-xl border-2 border-dashed flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300"
                      style={{ 
                        backgroundColor: template.templateData.backgroundColor,
                        borderColor: template.templateData.borderColor
                      }}
                    >
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-2 left-2 w-8 h-8 bg-current rounded-full"></div>
                        <div className="absolute bottom-2 right-2 w-6 h-6 bg-current rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-current rounded-full -translate-x-2 -translate-y-2"></div>
                      </div>
                      
                      <div className="text-center relative z-10">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm font-medium text-gray-600">Template Preview</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleEditTemplate(template)}
                        className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                        title="Edit Template"
                      >
                        <Edit className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                      <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 group" title="Preview Template">
                        <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                      <button className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group" title="Delete Template">
                        <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                    <button className="px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 group">
                      <span className="group-hover:translate-x-0.5 transition-transform inline-block">Use Template</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === 'certificates' && (
    <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Student Certificates</h2>
              <div className="flex items-center space-x-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Certificate ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Issued Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCertificates.map((certificate) => (
                      <tr key={certificate.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{certificate.studentName}</div>
                            <div className="text-sm text-gray-500">{certificate.studentEmail}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{certificate.courseTitle}</div>
                            <div className="text-sm text-gray-500">by {certificate.instructorName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {certificate.certificateData.certificateId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            certificate.status === 'approved' 
                              ? 'bg-green-100 text-green-800'
                              : certificate.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {certificate.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {certificate.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                            {certificate.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                            {certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(certificate.issuedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handlePreviewCertificate(certificate)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDownloadCertificate(certificate.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            {certificate.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApproveCertificate(certificate.id)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRejectCertificate(certificate.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
      </div>
        )}

        {/* Modals */}
        <CertificatePreviewModal
          certificate={selectedCertificate}
          isOpen={showCertificatePreview}
          onClose={() => setShowCertificatePreview(false)}
          onDownload={(certificate) => handleDownloadCertificate(certificate.id)}
        />

        <CertificateTemplateBuilder
          template={selectedTemplate}
          isOpen={showTemplateBuilder}
          onClose={() => {
            setShowTemplateBuilder(false)
            setSelectedTemplate(null)
          }}
          onSave={handleSaveTemplate}
        />
    </div>
  )
}

export default TutorCertificatesPage