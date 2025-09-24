// Certificate API Service
// This service handles all certificate-related API calls
// Updated for new workflow: Auto-generated certificates after final test completion

import { api } from './api'
import type { 
  StudentCertificate, 
  CertificateStats,
  CertificateVerification 
} from '../types/certificate'

// Student Certificates API
export const certificateApi = {
  // Get my certificates
  certificates: {
    getMyCertificates: async (params?: { status?: string; page?: number; limit?: number }) => {
      try {
        console.log('📜 API: Fetching my certificates with params:', params)
        const response = await api.get('/certificates/my-certificates', { params })
        console.log('✅ API: Certificates received:', response.data)
        return response.data.data || response.data
      } catch (error) {
        console.error('❌ API: Error fetching certificates:', error)
        throw error
      }
    },

    // Get certificate by ID
    getCertificateById: async (id: string): Promise<StudentCertificate> => {
      try {
        console.log('📜 API: Fetching certificate by ID:', id)
        const response = await api.get(`/certificates/${id}`)
        console.log('✅ API: Certificate received:', response.data)
        return response.data.data || response.data
      } catch (error) {
        console.error('❌ API: Error fetching certificate:', error)
        throw error
      }
    },

    // Download certificate
    downloadCertificate: async (certificateId: string): Promise<Blob> => {
      try {
        console.log('📥 API: Downloading certificate:', certificateId)
        const response = await api.get(`/certificates/${certificateId}/download`, {
          responseType: 'blob'
        })
        console.log('✅ API: Certificate downloaded')
        return response.data
      } catch (error) {
        console.error('❌ API: Error downloading certificate:', error)
        throw error
      }
    },

    // Share certificate
    shareCertificate: async (certificateId: string, platform: string, message?: string) => {
      try {
        console.log('📤 API: Sharing certificate:', certificateId, 'on', platform)
        const response = await api.post(`/certificates/${certificateId}/share`, {
          platform,
          message
        })
        console.log('✅ API: Certificate shared:', response.data)
        return response.data.data || response.data
      } catch (error) {
        console.error('❌ API: Error sharing certificate:', error)
        throw error
      }
    }
  },

  // Certificate statistics
  stats: {
    getStudentStats: async (): Promise<CertificateStats> => {
      try {
        console.log('📊 API: Fetching student certificate statistics')
        const response = await api.get('/certificates/my-certificates/stats')
        console.log('✅ API: Stats received:', response.data)
        return response.data.data || response.data
      } catch (error) {
        console.error('❌ API: Error fetching stats:', error)
        throw error
      }
    }
  },

  // Certificate verification (public)
  verification: {
    verifyCertificate: async (certificateId: string): Promise<CertificateVerification> => {
      try {
        console.log('🔍 API: Verifying certificate:', certificateId)
        const response = await api.get(`/certificates/verify/${certificateId}`)
        console.log('✅ API: Certificate verified:', response.data)
        return response.data.data || response.data
      } catch (error) {
        console.error('❌ API: Error verifying certificate:', error)
        throw error
      }
    }
  },

  // Final test completion (internal)
  finalTest: {
    completeFinalTest: async (courseId: string, score: number): Promise<StudentCertificate> => {
      try {
        console.log('🎯 API: Completing final test for course:', courseId, 'with score:', score)
        const response = await api.post('/certificates/generate', {
          courseId,
          score,
          templateId: 'default' // Use default template for now
        })
        console.log('✅ API: Certificate generated:', response.data)
        return response.data.data || response.data
      } catch (error) {
        console.error('❌ API: Error generating certificate:', error)
        throw error
      }
    }
  }
}

// Helper functions
export const certificateHelpers = {
  // Check if score is passing
  isPassingScore: (score: number, passingScore: number = 70): boolean => {
    return score >= passingScore
  },

  // Format certificate date
  formatCertificateDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  },

  // Generate certificate ID
  generateCertificateId: (): string => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const random = Math.random().toString(36).substr(2, 6).toUpperCase()
    return `CERT-${year}${month}${day}-${random}`
  },

  // Get certificate status color
  getStatusColor: (status: string): string => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'rejected':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  },

  // Get certificate status icon
  getStatusIcon: (status: string): string => {
    switch (status) {
      case 'approved':
        return '✅'
      case 'pending':
        return '⏳'
      case 'rejected':
        return '❌'
      default:
        return '❓'
    }
  }
}

export default certificateApi