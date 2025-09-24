// Certificate Types
// This file contains all TypeScript interfaces for the certificate system
// Updated for new workflow: Auto-generated certificates after final test completion

export interface StudentCertificate {
  id: string
  studentId: string
  studentName: string
  studentEmail: string
  courseId: string
  courseTitle: string
  instructorName: string
  status: 'pending' | 'approved' | 'rejected'
  score: number
  issuedAt: string
  completionDate: string
  expiresAt?: string
  downloadUrl: string
  verificationUrl: string
  certificateData: {
    certificateId: string
    templateId: string
    verificationUrl: string
    downloadUrl: string
  }
}

export interface CertificateStats {
  totalCertificates: number
  approvedCertificates: number
  pendingCertificates: number
  rejectedCertificates: number
  averageScore: number
  completionRate: number
}

export interface CertificateVerification {
  certificateId: string
  studentName: string
  courseTitle: string
  instructorName: string
  issuedAt: string
  score: number
  status: string
  verificationDate: string
}

export interface FinalTestResult {
  courseId: string
  studentId: string
  score: number
  passed: boolean
  completedAt: string
}

// Legacy types (kept for backward compatibility)
export interface CertificateTemplate {
  id: string
  title: string
  description: string
  templateData: {
    backgroundColor: string
    textColor: string
    logoUrl: string
    signatureUrl: string
    borderColor: string
    fontFamily: string
    fontSize: number
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}