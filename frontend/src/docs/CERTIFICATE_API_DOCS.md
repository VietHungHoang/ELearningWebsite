# Certificate System API Documentation

## Overview
This document outlines the API endpoints required for the Certificate System in the e-learning platform. The system allows tutors to create certificate templates and manage student certificates, while students can view and download their earned certificates.

## Base URL
```
http://localhost:8081/api
```

## Authentication
All endpoints require authentication. Include the authorization header:
```
Authorization: Bearer <token>
```

---

## Certificate Templates API

### 1. Get All Certificate Templates
**GET** `/certificates/templates`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "template-1",
      "title": "Default Certificate Template",
      "description": "A clean and professional certificate template",
      "templateData": {
        "backgroundColor": "#ffffff",
        "textColor": "#1f2937",
        "logoUrl": "https://example.com/logo.png",
        "signatureUrl": "https://example.com/signature.png",
        "borderColor": "#3b82f6",
        "fontFamily": "Inter",
        "fontSize": 16
      },
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 2. Get Certificate Template by ID
**GET** `/certificates/templates/{id}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "template-1",
    "title": "Default Certificate Template",
    "description": "A clean and professional certificate template",
    "templateData": {
      "backgroundColor": "#ffffff",
      "textColor": "#1f2937",
      "logoUrl": "https://example.com/logo.png",
      "signatureUrl": "https://example.com/signature.png",
      "borderColor": "#3b82f6",
      "fontFamily": "Inter",
      "fontSize": 16
    },
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 3. Create Certificate Template
**POST** `/certificates/templates`

**Request Body:**
```json
{
  "title": "New Template",
  "description": "Template description",
  "templateData": {
    "backgroundColor": "#ffffff",
    "textColor": "#1f2937",
    "logoUrl": "https://example.com/logo.png",
    "signatureUrl": "https://example.com/signature.png",
    "borderColor": "#3b82f6",
    "fontFamily": "Inter",
    "fontSize": 16
  },
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "template-2",
    "title": "New Template",
    "description": "Template description",
    "templateData": { ... },
    "isActive": true,
    "createdAt": "2024-01-02T00:00:00Z",
    "updatedAt": "2024-01-02T00:00:00Z"
  }
}
```

### 4. Update Certificate Template
**PUT** `/certificates/templates/{id}`

**Request Body:** Same as create

**Response:** Same as create

### 5. Delete Certificate Template
**DELETE** `/certificates/templates/{id}`

**Response:**
```json
{
  "success": true,
  "message": "Template deleted successfully"
}
```

---

## Student Certificates API

### 1. Get All Student Certificates (Tutor)
**GET** `/certificates/students`

**Query Parameters:**
- `status` (optional): Filter by status (pending, approved, rejected)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "certificates": [
      {
        "id": "cert-1",
        "studentId": "student-1",
        "studentName": "John Doe",
        "studentEmail": "john.doe@example.com",
        "courseId": "course-1",
        "courseTitle": "Goal Setting Masterclass",
        "instructorName": "Sarah Johnson",
        "templateId": "template-1",
        "certificateData": {
          "studentName": "John Doe",
          "courseTitle": "Goal Setting Masterclass",
          "instructorName": "Sarah Johnson",
          "completionDate": "2024-01-15",
          "certificateId": "CERT-2024-001",
          "qrCode": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://elearning.com/verify/cert-1"
        },
        "status": "approved",
        "issuedAt": "2024-01-15T10:30:00Z",
        "expiresAt": "2025-01-15T10:30:00Z",
        "downloadUrl": "https://elearning.com/certificates/cert-1.pdf",
        "verificationUrl": "https://elearning.com/verify/cert-1"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### 2. Get Student Certificates (Student)
**GET** `/certificates/my-certificates`

**Query Parameters:**
- `status` (optional): Filter by status
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:** Same as above

### 3. Get Certificate by ID
**GET** `/certificates/{id}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cert-1",
    "studentId": "student-1",
    "studentName": "John Doe",
    "studentEmail": "john.doe@example.com",
    "courseId": "course-1",
    "courseTitle": "Goal Setting Masterclass",
    "instructorName": "Sarah Johnson",
    "templateId": "template-1",
    "certificateData": { ... },
    "status": "approved",
    "issuedAt": "2024-01-15T10:30:00Z",
    "expiresAt": "2025-01-15T10:30:00Z",
    "downloadUrl": "https://elearning.com/certificates/cert-1.pdf",
    "verificationUrl": "https://elearning.com/verify/cert-1"
  }
}
```

### 4. Approve Certificate
**PUT** `/certificates/{id}/approve`

**Response:**
```json
{
  "success": true,
  "message": "Certificate approved successfully",
  "data": {
    "id": "cert-1",
    "status": "approved",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### 5. Reject Certificate
**PUT** `/certificates/{id}/reject`

**Request Body:**
```json
{
  "reason": "Reason for rejection"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Certificate rejected successfully",
  "data": {
    "id": "cert-1",
    "status": "rejected",
    "rejectionReason": "Reason for rejection",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### 6. Generate Certificate
**POST** `/certificates/generate`

**Request Body:**
```json
{
  "studentId": "student-1",
  "courseId": "course-1",
  "templateId": "template-1",
  "completionDate": "2024-01-15"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Certificate generated successfully",
  "data": {
    "id": "cert-1",
    "status": "pending",
    "downloadUrl": "https://elearning.com/certificates/cert-1.pdf",
    "verificationUrl": "https://elearning.com/verify/cert-1"
  }
}
```

---

## Certificate Statistics API

### 1. Get Certificate Statistics (Tutor)
**GET** `/certificates/statistics`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCertificates": 156,
    "pendingCertificates": 12,
    "approvedCertificates": 134,
    "rejectedCertificates": 10,
    "thisMonthCertificates": 28,
    "lastMonthCertificates": 32,
    "monthlyGrowth": -12.5
  }
}
```

### 2. Get Student Certificate Statistics
**GET** `/certificates/my-statistics`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCertificates": 5,
    "approvedCertificates": 4,
    "pendingCertificates": 1,
    "rejectedCertificates": 0,
    "thisMonthCertificates": 2,
    "lastMonthCertificates": 1
  }
}
```

---

## Certificate Verification API

### 1. Verify Certificate
**GET** `/certificates/verify/{certificateId}`

**Response:**
```json
{
  "success": true,
  "data": {
    "isValid": true,
    "certificate": {
      "id": "cert-1",
      "studentName": "John Doe",
      "courseTitle": "Goal Setting Masterclass",
      "instructorName": "Sarah Johnson",
      "issuedAt": "2024-01-15T10:30:00Z",
      "expiresAt": "2025-01-15T10:30:00Z",
      "status": "approved"
    }
  }
}
```

---

## File Upload API

### 1. Upload Certificate Logo
**POST** `/certificates/upload/logo`

**Request:** Multipart form data with `logo` file

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://elearning.com/uploads/logos/logo-123.png"
  }
}
```

### 2. Upload Certificate Signature
**POST** `/certificates/upload/signature`

**Request:** Multipart form data with `signature` file

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://elearning.com/uploads/signatures/signature-123.png"
  }
}
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": {
    "code": "CERTIFICATE_NOT_FOUND",
    "message": "Certificate not found",
    "details": "The requested certificate does not exist"
  }
}
```

### Common Error Codes:
- `CERTIFICATE_NOT_FOUND`: Certificate not found
- `TEMPLATE_NOT_FOUND`: Template not found
- `UNAUTHORIZED`: User not authorized
- `FORBIDDEN`: Access denied
- `VALIDATION_ERROR`: Request validation failed
- `FILE_UPLOAD_ERROR`: File upload failed
- `CERTIFICATE_ALREADY_EXISTS`: Certificate already exists for this student/course

---

## Database Schema

### Certificate Templates Table
```sql
CREATE TABLE certificate_templates (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    template_data JSON NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Student Certificates Table
```sql
CREATE TABLE student_certificates (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    course_id VARCHAR(36) NOT NULL,
    template_id VARCHAR(36) NOT NULL,
    certificate_data JSON NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    download_url VARCHAR(500),
    verification_url VARCHAR(500),
    rejection_reason TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES certificate_templates(id),
    INDEX idx_student_id (student_id),
    INDEX idx_course_id (course_id),
    INDEX idx_status (status)
);
```

---

## Implementation Notes

1. **File Storage**: Use cloud storage (AWS S3, Google Cloud Storage) for logo and signature files
2. **PDF Generation**: Use libraries like Puppeteer or jsPDF for certificate PDF generation
3. **QR Code**: Generate QR codes for certificate verification
4. **Security**: Implement proper authentication and authorization
5. **Validation**: Validate all input data before processing
6. **Rate Limiting**: Implement rate limiting for file uploads
7. **Caching**: Cache frequently accessed data like templates
8. **Logging**: Log all certificate operations for audit purposes

---

## Frontend Integration

The frontend expects the following data structures:

### Certificate Template Interface
```typescript
interface CertificateTemplate {
  id: string;
  title: string;
  description: string;
  templateData: {
    backgroundColor: string;
    textColor: string;
    logoUrl: string;
    signatureUrl: string;
    borderColor: string;
    fontFamily: string;
    fontSize: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Student Certificate Interface
```typescript
interface StudentCertificate {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  templateId: string;
  certificateData: {
    studentName: string;
    courseTitle: string;
    instructorName: string;
    completionDate: string;
    certificateId: string;
    qrCode: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  issuedAt: string;
  expiresAt?: string;
  downloadUrl: string;
  verificationUrl: string;
}
```

This documentation provides a complete guide for implementing the Certificate System backend APIs.
