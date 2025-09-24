# Certificate API Documentation

## Overview
Certificate system cho phép tự động tạo certificates khi student hoàn thành khóa học và vượt qua final test. Certificates được lưu trữ và quản lý trong My Certificates section của student.

## API Endpoints

### 1. Student Certificates

#### Get My Certificates
```http
GET /api/certificates/my-certificates
```

**Query Parameters:**
- `status` (optional): Filter by status (`pending`, `approved`, `rejected`)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "certificates": [
      {
        "id": "cert_123",
        "studentId": "student_456",
        "courseId": "course_789",
        "courseTitle": "Advanced React Development",
        "instructorName": "Dr. Sarah Johnson",
        "studentName": "John Smith",
        "studentEmail": "john@example.com",
        "status": "approved",
        "score": 85,
        "issuedAt": "2024-01-15T10:30:00Z",
        "certificateData": {
          "certificateId": "CERT-20240115-001",
          "templateId": "template_001",
          "verificationUrl": "https://platform.com/verify/CERT-20240115-001",
          "downloadUrl": "https://platform.com/certificates/CERT-20240115-001.pdf"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10
    }
  }
}
```

#### Get Certificate Statistics
```http
GET /api/certificates/my-certificates/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCertificates": 25,
    "approvedCertificates": 20,
    "pendingCertificates": 3,
    "rejectedCertificates": 2,
    "averageScore": 82.5,
    "completionRate": 80.0
  }
}
```

#### Download Certificate
```http
GET /api/certificates/{certificateId}/download
```

**Response:** PDF file download

#### Share Certificate
```http
POST /api/certificates/{certificateId}/share
```

**Request Body:**
```json
{
  "platform": "linkedin", // "linkedin", "twitter", "facebook", "email"
  "message": "I just completed the Advanced React Development course!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "shareUrl": "https://linkedin.com/share?url=https://platform.com/verify/CERT-20240115-001",
    "message": "Certificate shared successfully"
  }
}
```

### 2. Certificate Generation (Internal)

#### Generate Certificate
```http
POST /api/certificates/generate
```

**Request Body:**
```json
{
  "studentId": "student_456",
  "courseId": "course_789",
  "finalTestScore": 85,
  "templateId": "template_001"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "certificateId": "cert_123",
    "certificateUrl": "https://platform.com/certificates/CERT-20240115-001.pdf",
    "verificationUrl": "https://platform.com/verify/CERT-20240115-001",
    "status": "approved"
  }
}
```

### 3. Certificate Verification (Public)

#### Verify Certificate
```http
GET /api/certificates/verify/{certificateId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "certificateId": "CERT-20240115-001",
    "studentName": "John Smith",
    "courseTitle": "Advanced React Development",
    "instructorName": "Dr. Sarah Johnson",
    "issuedAt": "2024-01-15T10:30:00Z",
    "score": 85,
    "status": "approved",
    "verificationDate": "2024-01-20T14:22:00Z"
  }
}
```

## Data Models

### Certificate
```typescript
interface Certificate {
  id: string;
  studentId: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  studentName: string;
  studentEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  score: number;
  issuedAt: string;
  certificateData: {
    certificateId: string;
    templateId: string;
    verificationUrl: string;
    downloadUrl: string;
  };
}
```

### Certificate Stats
```typescript
interface CertificateStats {
  totalCertificates: number;
  approvedCertificates: number;
  pendingCertificates: number;
  rejectedCertificates: number;
  averageScore: number;
  completionRate: number;
}
```

## Workflow

### 1. Course Completion Flow
1. Student hoàn thành tất cả lessons trong khóa học
2. Final test xuất hiện trong Course Player
3. Student làm final test và đạt điểm ≥ 70%
4. System tự động gọi API `POST /api/certificates/generate`
5. Certificate được tạo với status `approved`
6. Certificate hiển thị trong My Certificates

### 2. Certificate Management Flow
1. Student truy cập My Certificates page
2. System gọi API `GET /api/certificates/my-certificates`
3. Student có thể:
   - Xem danh sách certificates
   - Download PDF
   - Share lên social media
   - Verify certificate

## Error Handling

### Common Error Responses
```json
{
  "success": false,
  "error": {
    "code": "CERTIFICATE_NOT_FOUND",
    "message": "Certificate not found",
    "details": "The requested certificate does not exist or has been deleted"
  }
}
```

### Error Codes
- `CERTIFICATE_NOT_FOUND`: Certificate không tồn tại
- `INSUFFICIENT_SCORE`: Điểm số không đủ để tạo certificate
- `COURSE_NOT_COMPLETED`: Khóa học chưa hoàn thành
- `TEMPLATE_NOT_FOUND`: Template không tồn tại
- `GENERATION_FAILED`: Lỗi khi tạo certificate
- `DOWNLOAD_FAILED`: Lỗi khi download certificate
- `SHARE_FAILED`: Lỗi khi share certificate

## Security Considerations

1. **Authentication**: Tất cả API calls cần JWT token
2. **Authorization**: Student chỉ có thể truy cập certificates của mình
3. **Rate Limiting**: Giới hạn số lượng requests per minute
4. **File Security**: PDF files được lưu trữ an toàn với signed URLs
5. **Verification**: Public verification endpoint không cần authentication

## Performance Optimization

1. **Caching**: Certificate data được cache trong Redis
2. **CDN**: PDF files được serve qua CDN
3. **Pagination**: Large datasets được paginate
4. **Lazy Loading**: Certificate images được load khi cần
5. **Compression**: API responses được compress

## Testing

### Test Scenarios
1. **Certificate Generation**: Test tạo certificate sau khi pass final test
2. **Certificate Listing**: Test hiển thị danh sách certificates
3. **Certificate Download**: Test download PDF
4. **Certificate Sharing**: Test share lên social media
5. **Certificate Verification**: Test public verification
6. **Error Handling**: Test các error cases

### Mock Data
```json
{
  "certificates": [
    {
      "id": "cert_001",
      "studentId": "student_001",
      "courseId": "course_001",
      "courseTitle": "React Fundamentals",
      "instructorName": "Dr. Sarah Johnson",
      "studentName": "John Smith",
      "studentEmail": "john@example.com",
      "status": "approved",
      "score": 85,
      "issuedAt": "2024-01-15T10:30:00Z",
      "certificateData": {
        "certificateId": "CERT-20240115-001",
        "templateId": "template_001",
        "verificationUrl": "https://platform.com/verify/CERT-20240115-001",
        "downloadUrl": "https://platform.com/certificates/CERT-20240115-001.pdf"
      }
    }
  ]
}
```

## Future Enhancements

1. **Certificate Templates**: Cho phép tutor tạo custom templates
2. **Digital Badges**: Tích hợp với Open Badges standard
3. **Blockchain Verification**: Sử dụng blockchain để verify certificates
4. **AI-Generated Certificates**: Tự động tạo certificates với AI
5. **Multi-language Support**: Hỗ trợ nhiều ngôn ngữ cho certificates
6. **Analytics**: Thống kê chi tiết về certificate completion rates
7. **Integration**: Tích hợp với LinkedIn, GitHub, và các platform khác
8. **Mobile App**: Native mobile app để quản lý certificates