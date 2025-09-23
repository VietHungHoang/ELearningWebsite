import React from 'react'
import { X, Download, Share2, ExternalLink, Award } from 'lucide-react'
import type { StudentCertificate } from '../../types/certificate'

interface CertificatePreviewModalProps {
  certificate: StudentCertificate | null
  isOpen: boolean
  onClose: () => void
  onDownload?: (certificate: StudentCertificate) => void
  onShare?: (certificate: StudentCertificate) => void
}

const CertificatePreviewModal: React.FC<CertificatePreviewModalProps> = ({
  certificate,
  isOpen,
  onClose,
  onDownload,
  onShare
}) => {
  if (!isOpen || !certificate) return null

  const handleDownload = () => {
    if (onDownload) {
      onDownload(certificate)
    } else {
      window.open(certificate.downloadUrl, '_blank')
    }
  }

  const handleShare = () => {
    if (onShare) {
      onShare(certificate)
    } else {
      if (navigator.share) {
        navigator.share({
          title: `Certificate: ${certificate.courseTitle}`,
          text: `I completed the course "${certificate.courseTitle}" and earned a certificate!`,
          url: certificate.verificationUrl
        })
      } else {
        navigator.clipboard.writeText(certificate.verificationUrl)
        alert('Certificate link copied to clipboard!')
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Certificate Preview</h2>
              <p className="text-sm text-gray-600">{certificate.courseTitle}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Certificate Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 text-center relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-200 rounded-full -translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-200 rounded-full translate-x-12 translate-y-12"></div>
                <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-indigo-200 rounded-full -translate-x-8 -translate-y-8"></div>
              </div>
              
              {/* Certificate Design */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto relative z-10 border border-gray-100">
                {/* Header */}
                <div className="mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificate of Completion</h1>
                  <p className="text-gray-600 font-medium">This is to certify that</p>
                </div>

                {/* Student Name */}
                <div className="mb-8">
                  <h2 className="text-4xl font-bold text-blue-600 mb-2">{certificate.studentName}</h2>
                  <p className="text-gray-600">has successfully completed the course</p>
                </div>

                {/* Course Title */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">{certificate.courseTitle}</h3>
                  <p className="text-gray-600">instructed by {certificate.instructorName}</p>
                </div>

                {/* Completion Date */}
                <div className="mb-8">
                  <p className="text-gray-600">Completed on</p>
                  <p className="text-lg font-semibold text-gray-900">{certificate.certificateData.completionDate}</p>
                </div>

                {/* Certificate ID */}
                <div className="mb-8">
                  <p className="text-sm text-gray-500">Certificate ID: {certificate.certificateData.certificateId}</p>
                </div>

                {/* QR Code */}
                <div className="mb-8">
                  <div className="inline-block p-4 bg-white rounded-lg shadow-sm">
                    <img 
                      src={certificate.certificateData.qrCode} 
                      alt="QR Code" 
                      className="w-24 h-24"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Scan to verify</p>
                </div>

                {/* Signature */}
                <div className="flex justify-between items-end">
                  <div className="text-center">
                    <div className="w-32 h-16 bg-gray-200 rounded mb-2 flex items-center justify-center">
                      <span className="text-xs text-gray-500">Signature</span>
                    </div>
                    <p className="text-sm text-gray-600">{certificate.instructorName}</p>
                    <p className="text-xs text-gray-500">Instructor</p>
                  </div>
                  <div className="text-center">
                    <div className="w-32 h-16 bg-gray-200 rounded mb-2 flex items-center justify-center">
                      <span className="text-xs text-gray-500">Date</span>
                    </div>
                    <p className="text-sm text-gray-600">{certificate.certificateData.completionDate}</p>
                    <p className="text-xs text-gray-500">Issue Date</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate Details */}
            <div className="mt-6 bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificate Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Student Name</p>
                  <p className="text-sm text-gray-900">{certificate.studentName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Student Email</p>
                  <p className="text-sm text-gray-900">{certificate.studentEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Course Title</p>
                  <p className="text-sm text-gray-900">{certificate.courseTitle}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Instructor</p>
                  <p className="text-sm text-gray-900">{certificate.instructorName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Certificate ID</p>
                  <p className="text-sm text-gray-900 font-mono">{certificate.certificateData.certificateId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    certificate.status === 'approved' 
                      ? 'bg-green-100 text-green-800'
                      : certificate.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Issued Date</p>
                  <p className="text-sm text-gray-900">{new Date(certificate.issuedAt).toLocaleDateString()}</p>
                </div>
                {certificate.expiresAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Expires</p>
                    <p className="text-sm text-gray-900">{new Date(certificate.expiresAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Verification Link */}
            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">Verification Link</p>
                  <p className="text-sm text-blue-700">{certificate.verificationUrl}</p>
                </div>
                <button
                  onClick={() => window.open(certificate.verificationUrl, '_blank')}
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CertificatePreviewModal
