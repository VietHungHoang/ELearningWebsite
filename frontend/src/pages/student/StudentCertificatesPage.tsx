import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StudentLayout } from '../../components/layout'
import { studentUserControls, getStudentSidebarItems } from '../../utils/studentConfig'
import { 
  Award, 
  Download, 
  Share2, 
  Eye, 
  CheckCircle, 
  Clock, 
  XCircle,
  ExternalLink
} from 'lucide-react'
import { CertificatePreviewModal } from '../../components/certificate'
// import { certificateApi } from '../../services/certificateApi'
import { sampleStudentCertificates } from '../../data/certificate-sample-data'
import type { StudentCertificate } from '../../types/certificate'

const StudentCertificatesPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCertificate, setSelectedCertificate] = useState<StudentCertificate | null>(null)
  const [showCertificatePreview, setShowCertificatePreview] = useState(false)
  // const [certificates, setCertificates] = useState<StudentCertificate[]>([])
  // const [stats, setStats] = useState<CertificateStats | null>(null)
  // const [loading, setLoading] = useState(true)
  // const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  const handleSidebarItemClick = (path: string) => {
    navigate(path)
  }

  const sidebarItems = getStudentSidebarItems('/student/certificates')

  // Load certificates and stats on component mount
  // useEffect(() => {
  //   loadCertificates()
  //   loadStats()
  // }, [statusFilter])

  // const loadCertificates = async () => {
  //   try {
  //     setLoading(true)
  //     setError(null)
  //     console.log('📜 Loading student certificates...')

  //     const params = statusFilter !== 'all' ? { status: statusFilter as any } : {}
  //     const response = await certificateApi.certificates.getMyCertificates(params)
      
  //     console.log('✅ Certificates loaded:', response.certificates.length)
  //     setCertificates(response.certificates)
  //   } catch (err: any) {
  //     console.error('❌ Error loading certificates:', err)
  //     setError(err.response?.data?.message || 'Failed to load certificates. Please try again.')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // const loadStats = async () => {
  //   try {
  //     console.log('📊 Loading certificate statistics...')
  //     const statsData = await certificateApi.stats.getStudentStats()
  //     console.log('✅ Stats loaded:', statsData)
  //     setStats(statsData)
  //   } catch (err: any) {
  //     console.error('❌ Error loading stats:', err)
  //     // Don't set error for stats, just log it
  //   }
  // }

  // Filter certificates based on search and status
  const filteredCertificates = sampleStudentCertificates.filter(cert => {
    const matchesSearch = cert.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.certificateData.certificateId.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || cert.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handlePreviewCertificate = (certificate: StudentCertificate) => {
    setSelectedCertificate(certificate)
    setShowCertificatePreview(true)
  }

  const handleDownloadCertificate = (certificate: StudentCertificate) => {
    console.log('Downloading certificate:', certificate.id)
    // Open the download URL
    window.open(certificate.downloadUrl, '_blank')
  }

  const handleShareCertificate = (certificate: StudentCertificate) => {
    console.log('Sharing certificate:', certificate.id)
    if (navigator.share) {
      navigator.share({
        title: `Certificate: ${certificate.courseTitle}`,
        text: `I completed the course "${certificate.courseTitle}" and earned a certificate!`,
        url: certificate.verificationUrl
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(certificate.verificationUrl)
      alert('Certificate link copied to clipboard!')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const breadcrumbItems = [
    { label: 'My Certificates' }
  ]

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
      searchPlaceholder="Search certificates..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      searchShortcut="Ctrl + K"
      userControls={studentUserControls}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Certificates</h1>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">
              {filteredCertificates.length} certificate{filteredCertificates.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-sm border border-blue-200 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Total Certificates</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{sampleStudentCertificates.length}</p>
                <p className="text-xs text-blue-600 mt-1">All time</p>
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
                <p className="text-3xl font-bold text-green-900 mt-2">
                  {sampleStudentCertificates.filter(c => c.status === 'approved').length}
                </p>
                <p className="text-xs text-green-600 mt-1">Ready to share</p>
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
                <p className="text-3xl font-bold text-yellow-900 mt-2">
                  {sampleStudentCertificates.filter(c => c.status === 'pending').length}
                </p>
                <p className="text-xs text-yellow-600 mt-1">Under review</p>
              </div>
              <div className="p-3 bg-yellow-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map((certificate) => (
            <div key={certificate.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1">
              {/* Certificate Preview */}
              <div className="relative h-52 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-blue-200 rounded-full -translate-x-16 -translate-y-16"></div>
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-200 rounded-full translate-x-12 translate-y-12"></div>
                  <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-indigo-200 rounded-full -translate-x-8 -translate-y-8"></div>
                </div>
                
                <div className="text-center relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{certificate.courseTitle}</h3>
                  <p className="text-sm text-gray-600 font-medium">by {certificate.instructorName}</p>
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${getStatusColor(certificate.status)}`}>
                    {getStatusIcon(certificate.status)}
                    <span className="ml-1.5">{certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}</span>
                  </span>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="p-6 bg-gradient-to-b from-white to-gray-50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Certificate ID</p>
                      <p className="text-sm text-gray-900 font-mono font-medium">{certificate.certificateData.certificateId}</p>
                    </div>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Completed</p>
                      <p className="text-sm text-gray-900 font-medium">{certificate.completionDate}</p>
                    </div>
                    {certificate.expiresAt && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Expires</p>
                        <p className="text-sm text-gray-900 font-medium">{new Date(certificate.expiresAt).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handlePreviewCertificate(certificate)}
                        className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                        title="Preview Certificate"
                      >
                        <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                      <button
                        onClick={() => handleDownloadCertificate(certificate)}
                        className="p-2.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 group"
                        title="Download Certificate"
                      >
                        <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                      <button
                        onClick={() => handleShareCertificate(certificate)}
                        className="p-2.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 group"
                        title="Share Certificate"
                      >
                        <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => window.open(certificate.verificationUrl, '_blank')}
                      className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                    >
                      <span>Verify</span>
                      <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCertificates.length === 0 && (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Certificates Found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Complete courses to earn certificates!'
              }
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <button
                onClick={() => navigate('/student/course-list')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Courses
              </button>
            )}
          </div>
        )}

        {/* Certificate Preview Modal */}
        <CertificatePreviewModal
          certificate={selectedCertificate}
          isOpen={showCertificatePreview}
          onClose={() => setShowCertificatePreview(false)}
          onDownload={(certificate) => handleDownloadCertificate(certificate)}
          onShare={(certificate) => handleShareCertificate(certificate)}
        />
      </div>
    </StudentLayout>
  )
}

export default StudentCertificatesPage
