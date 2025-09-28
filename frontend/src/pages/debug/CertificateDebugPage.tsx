import React from 'react'
import { Eye } from 'lucide-react'
import { certificateApi } from '../../services/certificateApi'

const CertificateDebugPage: React.FC = () => {
  const handlePreview = async () => {
    await certificateApi.preview.openPreviewInNewTab({
      learnerName: 'John Smith',
      courseName: 'Using Python to Access Web Data',
      instructorName: 'Dr. Charles Severance',
      organizationName: 'E-LEARNING ACADEMY',
      certificateId: 'CERT-TEST-001',
      verificationUrl: 'https://example.com/verify/CERT-TEST-001'
    })
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Certificate Debug</h1>
      <p className="text-gray-600 mb-6">Click the button below to generate a Coursera-style PDF preview using the backend endpoint.</p>
      <button
        onClick={handlePreview}
        className="inline-flex items-center space-x-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        <Eye className="w-4 h-4" />
        <span>Preview Demo</span>
      </button>
    </div>
  )
}

export default CertificateDebugPage


