# Media Service

## Overview
Media Service quản lý tất cả nội dung multimedia trong hệ thống E-learning, hỗ trợ upload video với cơ chế multipart upload lên S3, xử lý ảnh và các loại media khác.

## Architecture

### Multipart Upload Flow (Recommended)
```
1. Initiate Upload → Backend tạo Video entity và generate presigned URLs cho từng chunk
2. Client Upload → Upload từng chunk song song trực tiếp lên S3
3. Complete Upload → Client gửi ETags, backend complete multipart upload trên S3
4. Processing → Background processing để extract metadata và generate thumbnail
5. Ready → Video sẵn sàng để streaming
```

### Legacy Upload Flow
```
1. Generate Presigned URL → Client yêu cầu presigned URL
2. Direct Upload → Client upload trực tiếp lên S3
```

## API Endpoints

### Video Multipart Upload (Recommended)

#### 1. Initiate Upload
```http
POST /api/videos/upload/initiate
Headers: X-User-Id: {userId}
Content-Type: application/json

{
  "lessonId": 123,
  "fileName": "lesson-video.mp4",
  "fileSize": 1073741824,
  "title": "Introduction to Spring Boot",
  "description": "Basic concepts of Spring Boot framework",
  "isPreview": true
}

Response:
{
  "status": 200,
  "message": "Upload initiated successfully",
  "data": {
    "videoId": 456,
    "uploadId": "uuid-upload-id",
    "presignedUrls": [
      "https://s3.../videos/uuid-upload-id.mp4?uploadId=...&partNumber=1&signature=...",
      "https://s3.../videos/uuid-upload-id.mp4?uploadId=...&partNumber=2&signature=..."
    ],
    "chunkSize": 5242880,
    "totalChunks": 205
  }
}
```

#### 2. Complete Upload
```http
POST /api/videos/upload/complete
Content-Type: application/json

{
  "uploadId": "uuid-upload-id",
  "etags": ["\"etag1\"", "\"etag2\"", "\"etag3\""]
}

Response:
{
  "status": 200,
  "message": "Upload completed successfully",
  "data": {
    "id": 456,
    "lessonId": 123,
    "title": "Introduction to Spring Boot",
    "status": "PROCESSING",
    "videoUrl": "https://s3.../videos/uuid-upload-id.mp4",
    "uploadProgressPercent": 100
  }
}
```

#### 3. Check Upload Status
```http
GET /api/videos/upload/status/{uploadId}

Response:
{
  "status": 200,
  "message": "Upload status retrieved successfully",
  "data": {
    "id": 456,
    "status": "READY",
    "videoUrl": "https://s3.../videos/uuid-upload-id.mp4",
    "thumbnailUrl": "https://s3.../thumbnails/uuid-upload-id.jpg",
    "durationSeconds": 300,
    "uploadProgressPercent": 100
  }
}
```

### Video Management

#### 4. Get Video by ID
```http
GET /api/videos/{id}

Response:
{
  "status": 200,
  "message": "Video retrieved successfully",
  "data": {
    "id": 456,
    "lessonId": 123,
    "title": "Introduction to Spring Boot",
    "description": "Basic concepts of Spring Boot framework",
    "originalFileName": "lesson-video.mp4",
    "fileSize": 1073741824,
    "durationSeconds": 300,
    "videoUrl": "https://s3.../videos/uuid-upload-id.mp4",
    "thumbnailUrl": "https://s3.../thumbnails/uuid-upload-id.jpg",
    "status": "READY",
    "isPreview": true,
    "isActive": true,
    "viewCount": 0,
    "uploadedBy": 789,
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:35:00"
  }
}
```

#### 5. Get Videos by Lesson ID
```http
GET /api/videos/lesson/{lessonId}

Response:
{
  "status": 200,
  "message": "Videos retrieved successfully",
  "data": [
    {
      "id": 456,
      "lessonId": 123,
      "title": "Introduction to Spring Boot",
      "status": "READY",
      "videoUrl": "https://s3.../videos/uuid-upload-id.mp4"
    }
  ]
}
```

#### 6. Get Videos by Lesson ID (Paginated)
```http
GET /api/videos/lesson/{lessonId}/paginated?page=0&size=10&sort=createdAt&direction=desc

Response:
{
  "status": 200,
  "message": "Videos retrieved successfully",
  "data": {
    "content": [...],
    "pageable": {...},
    "totalElements": 25,
    "totalPages": 3,
    "number": 0,
    "size": 10
  }
}
```

#### 7. Update Video
```http
PUT /api/videos/{id}?title=New Title&description=New Description&isPreview=false

Response:
{
  "status": 200,
  "message": "Video updated successfully",
  "data": {
    "id": 456,
    "title": "New Title",
    "description": "New Description",
    "isPreview": false
  }
}
```

#### 8. Delete Video (Soft Delete)
```http
DELETE /api/videos/{id}

Response:
{
  "status": 200,
  "message": "Video deleted successfully",
  "data": null
}
```

### Video Queries

#### 9. Get Videos by Status
```http
GET /api/videos/status/{status}?page=0&size=10

Response:
{
  "status": 200,
  "message": "Videos retrieved successfully",
  "data": {
    "content": [...],
    "totalElements": 15
  }
}
```

#### 10. Get Videos by Uploader
```http
GET /api/videos/uploader/{uploaderId}?page=0&size=10

Response:
{
  "status": 200,
  "message": "Videos retrieved successfully",
  "data": {
    "content": [...],
    "totalElements": 8
  }
}
```

#### 11. Get Preview Videos
```http
GET /api/videos/preview?page=0&size=10

Response:
{
  "status": 200,
  "message": "Preview videos retrieved successfully",
  "data": {
    "content": [...],
    "totalElements": 12
  }
}
```

### Statistics

#### 12. Count Videos by Lesson
```http
GET /api/videos/count/lesson/{lessonId}

Response:
{
  "status": 200,
  "message": "Video count retrieved successfully",
  "data": 5
}
```

#### 13. Count Videos by Status
```http
GET /api/videos/count/status/{status}

Response:
{
  "status": 200,
  "message": "Video count retrieved successfully",
  "data": 25
}
```

### Processing

#### 14. Trigger Manual Processing
```http
POST /api/videos/{id}/process

Response:
{
  "status": 200,
  "message": "Video processing triggered successfully",
  "data": null
}
```

#### 15. Get Pending Processing Videos
```http
GET /api/videos/processing/pending?page=0&size=10

Response:
{
  "status": 200,
  "message": "Pending videos retrieved successfully",
  "data": {
    "content": [...],
    "totalElements": 3
  }
}
```

### Legacy API

#### 16. Generate Presigned URL (Legacy)
```http
POST /api/videos/presigned-url
Content-Type: application/json

{
  "courseId": 123,
  "contentType": "video/mp4"
}

Response:
{
  "status": 200,
  "message": "Presigned URL generated successfully",
  "data": {
    "objectKey": "videos/uuid.mp4",
    "presignedUrl": "https://s3.../videos/uuid.mp4?signature=...",
    "finalUrl": "https://s3.../videos/uuid.mp4",
    "expiresAt": "2024-01-15T11:00:00"
  }
}
```

## Video Status Flow
```
UPLOADING → PROCESSING → READY
    ↓           ↓         
   FAILED ←─── FAILED    
```

- **UPLOADING**: Video đang được upload
- **PROCESSING**: Video đang được xử lý (extract metadata, generate thumbnail)
- **READY**: Video sẵn sàng để streaming
- **FAILED**: Upload hoặc processing thất bại

## Client Implementation Example

### JavaScript Multipart Upload
```javascript
// 1. Initiate upload
const initiateResponse = await fetch('/api/videos/upload/initiate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-User-Id': userId
  },
  body: JSON.stringify({
    lessonId: 123,
    fileName: file.name,
    fileSize: file.size,
    title: "Video Title",
    description: "Video Description",
    isPreview: true
  })
});

const { data } = await initiateResponse.json();
const { presignedUrls, chunkSize, uploadId } = data;

// 2. Upload chunks in parallel
const etags = [];
const uploadPromises = [];

for (let i = 0; i < presignedUrls.length; i++) {
  const start = i * chunkSize;
  const end = Math.min(start + chunkSize, file.size);
  const chunk = file.slice(start, end);
  
  const uploadPromise = fetch(presignedUrls[i], {
    method: 'PUT',
    body: chunk
  }).then(response => {
    const etag = response.headers.get('ETag');
    etags[i] = etag;
    return etag;
  });
  
  uploadPromises.push(uploadPromise);
}

await Promise.all(uploadPromises);

// 3. Complete upload
const completeResponse = await fetch('/api/videos/upload/complete', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    uploadId: uploadId,
    etags: etags
  })
});

const result = await completeResponse.json();
console.log('Upload completed:', result.data);
```

## Configuration

### application.yml
```yaml
media:
  video:
    max-size-in-bytes: 2147483648  # 2GB
    chunk-size-in-bytes: 5242880   # 5MB
    presigned-url-expiry-minutes: 15
    allowed-types:
      - video/mp4
      - video/quicktime
      - video/webm
    allowed-extensions:
      - .mp4
      - .mov
      - .webm

aws:
  s3:
    bucket-name: ${S3_BUCKET_NAME:elearning-videos}
    region: ${AWS_REGION:us-east-1}

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/media_service_db
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:password}
```

## Performance & Security

### Performance
- **Multipart Upload**: Upload file lớn với chunks 5MB để tối ưu performance
- **Parallel Upload**: Client có thể upload nhiều chunks song song
- **Direct S3 Upload**: Không qua backend server, giảm tải cho server
- **Async Processing**: Background processing không block upload process

### Security
- **Presigned URLs**: Time-limited access (15 phút)
- **User Validation**: Kiểm tra quyền user trước khi generate URLs
- **File Type Validation**: Chỉ accept video formats được phép
- **Size Limits**: Maximum 2GB per file

## Error Handling

### Common Error Codes
- **400**: Invalid request (file size, format, missing parameters)
- **404**: Video not found
- **500**: Server error (S3 connection, database error)

### Error Response Format
```json
{
  "status": 400,
  "message": "Invalid request",
  "data": "File size exceeds maximum allowed size"
}
```

## Technologies
- **Spring Boot 3.5.5**
- **Spring Data JPA**  
- **PostgreSQL**
- **AWS S3 SDK**
- **AWS S3 Multipart Upload**
