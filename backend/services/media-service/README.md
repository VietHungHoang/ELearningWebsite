# Media Service

## Overview
Media Service quản lý tất cả nội dung multimedia trong hệ thống E-learning, bao gồm upload video chunked lên S3, upload ảnh thumbnail cho khóa học, xử lý content và streaming.

## Features
- ✅ **Chunked Video Upload**: Upload video files lên đến 2GB với resume capability
- ✅ **Image Upload**: Upload ảnh thumbnail cho khóa học (JPG, PNG, WEBP)
- ✅ **Direct S3 Upload**: Client upload trực tiếp lên S3 qua presigned URLs
- ✅ **Content Processing**: Tự động extract metadata, generate thumbnails
- ✅ **Progress Tracking**: Real-time upload và processing progress
- ✅ **Access Control**: Preview videos (free) và paid content
- ✅ **Multi-format Support**: MP4, WebM videos; JPG, PNG, WEBP images
- ✅ **Async Processing**: Background content processing với queue system

## Architecture

### Upload Flow
```
1. Client Request → Generate Presigned URLs
2. Client Upload → Direct to S3 (chunked)
3. Complete Upload → S3 Multipart Complete
4. Async Processing → Extract metadata + Generate thumbnail
5. Update Status → READY for streaming
```

### Domain Model
```
Video Entity:
├── Identity: id, lessonId, title, description
├── File Info: originalFileName, fileSize, durationSeconds
├── Storage: videoUrl, thumbnailUrl
├── Processing: status, processingMessage, processingTimestamps
├── Upload: uploadId, totalChunks, uploadedChunks
├── Access: isPreview, isActive, viewCount
└── Audit: uploadedBy, createdAt, updatedAt
```

### Video Status Flow
```
UPLOADING → PROCESSING → READY
    ↓           ↓         ↑
   FAILED ←─── FAILED ───┘
```

## API Endpoints

### Video Upload Management
- `POST /api/videos/upload/initiate` - Khởi tạo upload session
- `POST /api/videos/upload/complete` - Hoàn thành upload
- `GET /api/videos/upload/status/{uploadId}` - Kiểm tra progress

### Video CRUD
- `GET /api/videos/{id}` - Lấy thông tin video theo ID
- `GET /api/videos/lesson/{lessonId}` - Lấy videos của lesson
- `GET /api/videos/lesson/{lessonId}/paginated` - Lấy videos có phân trang
- `PUT /api/videos/{id}` - Cập nhật thông tin video
- `DELETE /api/videos/{id}` - Xóa video (soft delete)

### Video Queries
- `GET /api/videos/status/{status}` - Lấy videos theo status
- `GET /api/videos/uploader/{uploaderId}` - Lấy videos theo uploader
- `GET /api/videos/preview` - Lấy preview videos (free content)

### Image Upload Management
- `POST /api/images/presigned-url` - Tạo presigned URL cho image upload
- `POST /api/images/upload` - Upload ảnh trực tiếp qua multipart form
- `DELETE /api/images/{imageKey}` - Xóa ảnh khỏi S3
- `POST /api/images/validate` - Validate file ảnh
- `GET /api/images/health` - Health check cho image service

### Statistics
- `GET /api/videos/count/lesson/{lessonId}` - Đếm videos trong lesson
- `GET /api/videos/count/status/{status}` - Đếm videos theo status

### Processing
- `POST /api/videos/{id}/process` - Trigger manual processing
- `GET /api/videos/processing/pending` - Lấy videos đang chờ processing

## Usage Examples

### 1. Initiate Upload
```bash
POST /api/videos/upload/initiate
Headers: X-User-Id: 123
{
  "lessonId": 456,
  "fileName": "course-intro.mp4",
  "fileSize": 1073741824,
  "title": "Course Introduction",
  "description": "Welcome to the course",
  "isPreview": true
}

Response:
{
  "status": 200,
  "data": {
    "videoId": 789,
    "uploadId": "uuid-upload-id",
    "presignedUrls": [
      "https://s3.../chunk-0?signature=...",
      "https://s3.../chunk-1?signature=..."
    ],
    "chunkSize": 5242880,
    "totalChunks": 205
  }
}
```

### 2. Upload Chunks (Client Side)
```javascript
// Client uploads each chunk directly to S3
for (let i = 0; i < totalChunks; i++) {
    const chunk = file.slice(i * chunkSize, (i + 1) * chunkSize);
    const response = await fetch(presignedUrls[i], {
        method: 'PUT',
        body: chunk
    });
    const etag = response.headers.get('ETag');
    etags.push(etag);
}
```

### 3. Complete Upload
```bash
POST /api/videos/upload/complete
{
  "uploadId": "uuid-upload-id",
  "etags": ["etag1", "etag2", "etag3", ...]
}

Response:
{
  "status": 200,
  "data": {
    "id": 789,
    "status": "PROCESSING",
    "videoUrl": "https://s3.../videos/uuid-upload-id.mp4"
  }
}
```

### 4. Check Processing Status
```bash
GET /api/videos/upload/status/uuid-upload-id

Response:
{
  "status": 200,
  "data": {
    "id": 789,
    "status": "READY",
    "videoUrl": "https://s3.../videos/uuid-upload-id.mp4",
    "thumbnailUrl": "https://s3.../thumbnails/uuid-upload-id.jpg",
    "durationSeconds": 300,
    "uploadProgressPercent": 100
  }
}
```

## Configuration

### Application Properties
```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/media_service_db

# File Upload
spring.servlet.multipart.max-file-size=10MB
app.video.chunk-size=5242880
app.video.max-file-size=2147483648

# S3 Configuration
app.s3.bucket-name=elearning-videos
app.s3.region=us-east-1
```

### Environment Variables
```bash
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=elearning-videos
```

## Database Schema
```sql
CREATE TABLE videos (
    id BIGSERIAL PRIMARY KEY,
    lesson_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    original_file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    duration_seconds INTEGER,
    video_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'UPLOADING',
    processing_message TEXT,
    upload_id VARCHAR(255) UNIQUE,
    total_chunks INTEGER,
    uploaded_chunks INTEGER DEFAULT 0,
    is_preview BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    view_count INTEGER DEFAULT 0,
    uploaded_by BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    processing_started_at TIMESTAMP,
    processing_completed_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_videos_lesson_id ON videos(lesson_id);
CREATE INDEX idx_videos_upload_id ON videos(upload_id);
CREATE INDEX idx_videos_status ON videos(status);
CREATE INDEX idx_videos_uploaded_by ON videos(uploaded_by);
```

## Technologies
- **Spring Boot 3.5.5** - Main framework
- **Spring Data JPA** - Database access
- **PostgreSQL** - Database
- **AWS S3** - Video storage
- **FFmpeg** - Video processing (future)
- **Async Processing** - Background jobs

## Performance Considerations
- **Chunked Upload**: 5MB chunks để tối ưu network và memory
- **Direct S3 Upload**: Không qua backend server
- **Async Processing**: Background video processing
- **Lazy Loading**: Video content chỉ load khi cần
- **CDN Integration**: Fast global content delivery

## Security
- **Presigned URLs**: Time-limited access to S3
- **User Validation**: Check user permissions trước khi upload
- **File Type Validation**: Chỉ accept video formats
- **Size Limits**: Maximum 2GB per file

## Monitoring & Analytics
- Upload success/failure rates
- Processing time metrics  
- Video view statistics
- Storage usage tracking

## Future Enhancements
- **HLS Streaming**: Adaptive bitrate streaming
- **Video Transcoding**: Multiple quality versions
- **Subtitle Support**: SRT, VTT file uploads
- **Video Analytics**: Detailed viewing behavior
- **Offline Download**: Mobile app support
