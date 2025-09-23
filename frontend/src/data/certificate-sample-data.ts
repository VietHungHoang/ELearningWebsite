import type { CertificateTemplate, StudentCertificate, CertificateStats } from '../types/certificate'

// Mock Certificate Templates
export const sampleCertificateTemplates: CertificateTemplate[] = [
  {
    id: 'template-1',
    title: 'Default Certificate Template',
    description: 'A clean and professional certificate template for course completion',
    templateData: {
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      logoUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=200&fit=crop',
      signatureUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=50&fit=crop',
      borderColor: '#3b82f6',
      fontFamily: 'Inter',
      fontSize: 16
    },
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'template-2',
    title: 'Elegant Gold Template',
    description: 'An elegant certificate template with gold accents',
    templateData: {
      backgroundColor: '#fefce8',
      textColor: '#92400e',
      logoUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=200&fit=crop',
      signatureUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=50&fit=crop',
      borderColor: '#f59e0b',
      fontFamily: 'Playfair Display',
      fontSize: 18
    },
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: 'template-3',
    title: 'Modern Blue Template',
    description: 'A modern certificate template with blue gradient',
    templateData: {
      backgroundColor: '#eff6ff',
      textColor: '#1e40af',
      logoUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=200&fit=crop',
      signatureUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=50&fit=crop',
      borderColor: '#2563eb',
      fontFamily: 'Roboto',
      fontSize: 16
    },
    isActive: false,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  }
]

// Mock Student Certificates
export const sampleStudentCertificates: StudentCertificate[] = [
  {
    id: 'cert-1',
    studentId: 'student-1',
    studentName: 'John Doe',
    studentEmail: 'john.doe@example.com',
    courseId: 'course-1',
    courseTitle: 'Goal Setting Masterclass: Achieve Your Dreams',
    instructorName: 'Sarah Johnson',
    templateId: 'template-1',
    certificateData: {
      studentName: 'John Doe',
      courseTitle: 'Goal Setting Masterclass: Achieve Your Dreams',
      instructorName: 'Sarah Johnson',
      completionDate: '2024-01-15',
      certificateId: 'CERT-2024-001',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://elearning.com/verify/cert-1'
    },
    status: 'approved',
    issuedAt: '2024-01-15T10:30:00Z',
    expiresAt: '2025-01-15T10:30:00Z',
    downloadUrl: 'https://elearning.com/certificates/cert-1.pdf',
    verificationUrl: 'https://elearning.com/verify/cert-1'
  },
  {
    id: 'cert-2',
    studentId: 'student-2',
    studentName: 'Jane Smith',
    studentEmail: 'jane.smith@example.com',
    courseId: 'course-1',
    courseTitle: 'Goal Setting Masterclass: Achieve Your Dreams',
    instructorName: 'Sarah Johnson',
    templateId: 'template-2',
    certificateData: {
      studentName: 'Jane Smith',
      courseTitle: 'Goal Setting Masterclass: Achieve Your Dreams',
      instructorName: 'Sarah Johnson',
      completionDate: '2024-01-14',
      certificateId: 'CERT-2024-002',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://elearning.com/verify/cert-2'
    },
    status: 'approved',
    issuedAt: '2024-01-14T14:20:00Z',
    expiresAt: '2025-01-14T14:20:00Z',
    downloadUrl: 'https://elearning.com/certificates/cert-2.pdf',
    verificationUrl: 'https://elearning.com/verify/cert-2'
  },
  {
    id: 'cert-3',
    studentId: 'student-3',
    studentName: 'Mike Johnson',
    studentEmail: 'mike.johnson@example.com',
    courseId: 'course-2',
    courseTitle: 'Complete React Development Bootcamp',
    instructorName: 'Mike Chen',
    templateId: 'template-1',
    certificateData: {
      studentName: 'Mike Johnson',
      courseTitle: 'Complete React Development Bootcamp',
      instructorName: 'Mike Chen',
      completionDate: '2024-01-13',
      certificateId: 'CERT-2024-003',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://elearning.com/verify/cert-3'
    },
    status: 'pending',
    issuedAt: '2024-01-13T09:15:00Z',
    downloadUrl: 'https://elearning.com/certificates/cert-3.pdf',
    verificationUrl: 'https://elearning.com/verify/cert-3'
  },
  {
    id: 'cert-4',
    studentId: 'student-4',
    studentName: 'Emily Davis',
    studentEmail: 'emily.davis@example.com',
    courseId: 'course-3',
    courseTitle: 'Digital Marketing Mastery',
    instructorName: 'Emily Rodriguez',
    templateId: 'template-3',
    certificateData: {
      studentName: 'Emily Davis',
      courseTitle: 'Digital Marketing Mastery',
      instructorName: 'Emily Rodriguez',
      completionDate: '2024-01-12',
      certificateId: 'CERT-2024-004',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://elearning.com/verify/cert-4'
    },
    status: 'rejected',
    issuedAt: '2024-01-12T16:45:00Z',
    downloadUrl: 'https://elearning.com/certificates/cert-4.pdf',
    verificationUrl: 'https://elearning.com/verify/cert-4'
  }
]

// Mock Certificate Stats
export const sampleCertificateStats: CertificateStats = {
  totalCertificates: 156,
  pendingCertificates: 12,
  approvedCertificates: 134,
  rejectedCertificates: 10,
  thisMonthCertificates: 28,
  lastMonthCertificates: 32
}
