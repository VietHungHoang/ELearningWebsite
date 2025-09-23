import { api } from './api'
import type { 
  CertificateTemplate, 
  StudentCertificate, 
  CertificateStats,
  CertificateVerification 
} from '../types/certificate'

// Certificate Templates API
export const certificateTemplateApi = {
  // Get all certificate templates
  getAllTemplates: async (): Promise<CertificateTemplate[]> => {
    try {
      console.log('📋 API: Fetching all certificate templates')
      const response = await api.get('/certificates/templates')
      console.log('✅ API: Templates received:', response.data)
      return response.data.data || response.data
    } catch (error) {
      console.error('❌ API: Error fetching templates:', error)
      throw error
    }
  },

  // Get template by ID
  getTemplateById: async (id: string): Promise<CertificateTemplate> => {
    try {
      console.log('📋 API: Fetching template by ID:', id)
      const response = await api.get(`/certificates/templates/${id}`)
      console.log('✅ API: Template received:', response.data)
      return response.data.data || response.data
    } catch (error) {
      console.error('❌ API: Error fetching template:', error)
      throw error
    }
  },

  // Create new template
  createTemplate: async (template: Omit<CertificateTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<CertificateTemplate> => {
    try {
      console.log('📋 API: Creating template:', template)
      const response = await api.post('/certificates/templates', template)
      console.log('✅ API: Template created:', response.data)
      return response.data.data || response.data
    } catch (error) {
      console.error('❌ API: Error creating template:', error)
      throw error
    }
  },

  // Update template
  updateTemplate: async (id: string, template: Partial<CertificateTemplate>): Promise<CertificateTemplate> => {
    try {
      console.log('📋 API: Updating template:', id, template)
      const response = await api.put(`/certificates/templates/${id}`, template)
      console.log('✅ API: Template updated:', response.data)
      return response.data.data || response.data
    } catch (error) {
      console.error('❌ API: Error updating template:', error)
      throw error
    }
  },

  // Delete template
  deleteTemplate: async (id: string): Promise<void> => {
    try {
      console.log('📋 API: Deleting template:', id)
      await api.delete(`/certificates/templates/${id}`)
      console.log('✅ API: Template deleted successfully')
    } catch (error) {
      console.error('❌ API: Error deleting template:', error)
      throw error
    }
  }
}

// Student Certificates API
export const studentCertificateApi = {
  // Get all student certificates (for tutor)
  getAllCertificates: async (params?: {
    status?: 'pending' | 'approved' | 'rejected'
    page?: number
    limit?: number
  }): Promise<{
    certificates: StudentCertificate[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> => {
    try {
      console.log('📜 API: Fetching all student certificates with params:', params)
      const response = await api.get('/certificates/students', { params })
      console.log('✅ API: Certificates received:', response.data)
      return response.data.data || response.data
    } catch (error) {
      console.error('❌ API: Error fetching certificates:', error)
      throw error
    }
  },

  // Get my certificates (for student)
  getMyCertificates: async (params?: {
    status?: 'pending' | 'approved' | 'rejected'
    page?: number
    limit?: number
  }): Promise<{
    certificates: StudentCertificate[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> => {
    try {
      console.log('📜 API: Fetching my certificates with params:', params)
      const response = await api.get('/certificates/my-certificates', { params })
      console.log('✅ API: My certificates received:', response.data)
      return response.data.data || response.data
    } catch (error) {
      console.error('❌ API: Error fetching my certificates:', error)
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

  // Approve certificate
  approveCertificate: async (id: string): Promise<StudentCertificate> => {
    try {
      console.log('📜 API: Approving certificate:', id)
      const response = await api.put(`/certificates/${id}/approve`)
      console.log('✅ API: Certificate approved:', response.data)
      return response.data.data || response.data
    } catch (error) {
      console.error('❌ API: Error approving certificate:', error)
      throw error
    }
  },

  // Reject certificate
  rejectCertificate: async (id: string, reason: string): Promise<StudentCertificate> => {
    try {
      console.log('📜 API: Rejecting certificate:', id, reason)
      const response = await api.put(`/certificates/${id}/reject`, { reason })
      console.log('✅ API: Certificate rejected:', response.data)
      return response.data.data || response.data
    } catch (error) {
      console.error('❌ API: Error rejecting certificate:', error)
      throw error
    }
  },

  // Generate certificate
  generateCertificate: async (data: {
    studentId: string
    courseId: string
    templateId: string
    completionDate: string
  }): Promise<StudentCertificate> => {
    try {
      console.log('📜 API: Generating certificate:', data)
      const response = await api.post('/certificates/generate', data)
      console.log('✅ API: Certificate generated:', response.data)
      return response.data.data || response.data
    } catch (error) {
      console.error('❌ API: Error generating certificate:', error)
      throw error
    }
  }
}

// Certificate Statistics API
export const certificateStatsApi = {
  // Get certificate statistics (for tutor)
  getTutorStats: async (): Promise<CertificateStats> => {
    try {
      console.log('📊 API: Fetching tutor certificate statistics')
      const response = await api.get('/certificates/statistics')
      console.log('✅ API: Tutor stats received:', response.data)
      return response.data.data || response.data
    } catch (error) {
      console.error('❌ API: Error fetching tutor stats:', error)
      throw error
    }
  },

  // Get student certificate statistics
  getStudentStats: async (): Promise<CertificateStats> => {
    try {
      console.log('📊 API: Fetching student certificate statistics')
      const response = await api.get('/certificates/my-statistics')
      console.log('✅ API: Student stats received:', response.data)
      return response.data.data || response.data
    } catch (error) {
      console.error('❌ API: Error fetching student stats:', error)
      throw error
    }
  }
}

// Certificate Verification API
export const certificateVerificationApi = {
  // Verify certificate
  verifyCertificate: async (certificateId: string): Promise<CertificateVerification> => {
    try {
      console.log('🔍 API: Verifying certificate:', certificateId)
      const response = await api.get(`/certificates/verify/${certificateId}`)
      console.log('✅ API: Certificate verification result:', response.data)
      return response.data.data || response.data
    } catch (error) {
      console.error('❌ API: Error verifying certificate:', error)
      throw error
    }
  }
}

// File Upload API
export const certificateFileApi = {
  // Upload certificate logo
  uploadLogo: async (file: File): Promise<{ url: string }> => {
    try {
      console.log('📁 API: Uploading certificate logo:', file.name)
      const formData = new FormData()
      formData.append('logo', file)
      
      const response = await api.post('/certificates/upload/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log('✅ API: Logo uploaded:', response.data)
      return response.data.data || response.data
    } catch (error) {
      console.error('❌ API: Error uploading logo:', error)
      throw error
    }
  },

  // Upload certificate signature
  uploadSignature: async (file: File): Promise<{ url: string }> => {
    try {
      console.log('📁 API: Uploading certificate signature:', file.name)
      const formData = new FormData()
      formData.append('signature', file)
      
      const response = await api.post('/certificates/upload/signature', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log('✅ API: Signature uploaded:', response.data)
      return response.data.data || response.data
    } catch (error) {
      console.error('❌ API: Error uploading signature:', error)
      throw error
    }
  }
}

// Main certificate API object
export const certificateApi = {
  templates: certificateTemplateApi,
  certificates: studentCertificateApi,
  stats: certificateStatsApi,
  verification: certificateVerificationApi,
  files: certificateFileApi
}

export default certificateApi
