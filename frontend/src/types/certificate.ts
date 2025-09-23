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

export interface StudentCertificate {
  id: string
  studentId: string
  studentName: string
  studentEmail: string
  courseId: string
  courseTitle: string
  instructorName: string
  templateId: string
  certificateData: {
    studentName: string
    courseTitle: string
    instructorName: string
    completionDate: string
    certificateId: string
    qrCode: string
  }
  status: 'pending' | 'approved' | 'rejected'
  issuedAt: string
  expiresAt?: string
  downloadUrl: string
  verificationUrl: string
}

export interface CertificateStats {
  totalCertificates: number
  pendingCertificates: number
  approvedCertificates: number
  rejectedCertificates: number
  thisMonthCertificates: number
  lastMonthCertificates: number
}

export interface CertificateVerification {
  isValid: boolean
  certificate: StudentCertificate | null
  message: string
}
