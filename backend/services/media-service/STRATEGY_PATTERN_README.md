# Media Service - Strategy Pattern Implementation

## Tổng quan

Media Service đã được refactor để sử dụng **Strategy Pattern** nhằm xử lý các loại media khác nhau một cách linh hoạt và có thể mở rộng. Thiết kế này cho phép dễ dàng thêm mới các loại media mà không cần thay đổi code hiện có.

## Kiến trúc Strategy Pattern

### 1. Interface Strategy - `MediaProcessingStrategy`
```java
public interface MediaProcessingStrategy {
    MediaType getMediaType();
    String generateObjectKey(String prefix, String contentType);
    String generatePresignedUrl(String objectKey, String contentType);
    boolean isValidFile(MultipartFile file);
    String getFileExtension(String contentType);
    String getBaseUrl();
    void deleteFile(String objectKey);
}
```

### 2. Concrete Strategies
- **`ImageProcessingStrategy`** - Xử lý hình ảnh (JPG, PNG, GIF, WEBP)
- **`VideoProcessingStrategy`** - Xử lý video (MP4, MOV, AVI, WEBM, WMV)  
- **`DocumentProcessingStrategy`** - Xử lý tài liệu (PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT)

### 3. Strategy Factory - `MediaStrategyFactory`
```java
@Component
public class MediaStrategyFactory {
    public MediaProcessingStrategy getStrategy(MediaType mediaType);
    public MediaType detectMediaType(String contentType);
    public MediaProcessingStrategy getStrategyByContentType(String contentType);
}
```

### 4. Context - `UnifiedMediaService`
```java
@Service
public class UnifiedMediaService {
    public String generateObjectKey(String contentType, String prefix);
    public MediaUploadResponse generatePresignedUrl(String contentType, String prefix);
    public boolean isValidFile(MultipartFile file);
    public void deleteFile(String objectKey, MediaType mediaType);
}
```

## Cấu trúc thư mục

```
src/main/java/com/elearning/mediaservice/
├── strategy/
│   ├── MediaProcessingStrategy.java          # Interface Strategy
│   ├── MediaStrategyFactory.java            # Strategy Factory
│   └── impl/
│       ├── ImageProcessingStrategy.java     # Concrete Strategy cho Images
│       ├── VideoProcessingStrategy.java     # Concrete Strategy cho Videos
│       └── DocumentProcessingStrategy.java  # Concrete Strategy cho Documents
├── service/
│   ├── UnifiedMediaService.java            # Context sử dụng Strategy
│   └── impl/
│       └── S3ServiceImpl.java              # S3 operations
├── controller/
│   ├── UnifiedMediaController.java         # API endpoint unified
│   └── ImageController.java                # Backward compatibility
├── config/
│   ├── ImageProperties.java               # Cấu hình cho Images
│   ├── VideoProperties.java               # Cấu hình cho Videos
│   ├── DocumentProperties.java            # Cấu hình cho Documents
│   └── StorageProperties.java             # Cấu hình S3 buckets
└── enums/
    ├── MediaType.java                     # IMAGE, VIDEO, DOCUMENT
    └── StorageType.java                  # IMAGES, VIDEOS, DOCUMENTS
```

## API Endpoints

### Unified Media Controller (Mới)

#### 1. Generate Presigned URL
```http
POST /api/media/presigned-url
Content-Type: application/x-www-form-urlencoded

contentType=image/jpeg&prefix=course
```

#### 2. Validate File
```http
POST /api/media/validate
Content-Type: multipart/form-data

file: [MultipartFile]
```

#### 3. Delete File  
```http
DELETE /api/media/{mediaType}/{objectKey}
```

#### 4. Detect Media Type
```http
GET /api/media/detect-type?contentType=image/jpeg
```

#### 5. Get File Extension
```http
GET /api/media/extension?contentType=image/jpeg
```

### Image Controller (Backward Compatibility)
```http
POST /api/images/presigned-url
POST /api/images/upload
DELETE /api/images/{imageKey}
POST /api/images/validate
```

## Configuration

### application.yml
```yaml
# AWS S3 Configuration
aws:
  s3:
    buckets:
      IMAGES:
        name: my-elearning-course-images
        region: ap-southeast-2
        baseUrl: https://my-elearning-course-images.s3.ap-southeast-2.amazonaws.com/
      VIDEOS:
        name: my-elearning-course-videos
        region: ap-southeast-2
        baseUrl: https://my-elearning-course-videos.s3.ap-southeast-2.amazonaws.com/
      DOCUMENTS:
        name: my-elearning-documents
        region: ap-southeast-2
        baseUrl: https://my-elearning-documents.s3.ap-southeast-2.amazonaws.com/

# Media Type Configurations
media:
  image:
    max-size-in-bytes: 10485760  # 10MB
    allowed-types: [image/jpeg, image/png, image/gif, image/webp]
    allowed-extensions: [.jpg, .jpeg, .png, .gif, .webp]
    
  video:
    max-size-in-bytes: 524288000  # 500MB  
    allowed-types: [video/mp4, video/quicktime, video/x-msvideo, video/webm]
    allowed-extensions: [.mp4, .mov, .avi, .webm, .wmv]
    
  document:
    max-size-in-bytes: 52428800  # 50MB
    allowed-types: [application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document]
    allowed-extensions: [.pdf, .docx, .doc, .pptx, .ppt, .xlsx, .xls, .txt]
```

## Ưu điểm của Strategy Pattern

### 1. **Extensibility** (Khả năng mở rộng)
- Dễ dàng thêm loại media mới (Audio, Presentation, v.v.)
- Chỉ cần tạo strategy mới và register vào factory

### 2. **Maintainability** (Dễ bảo trì)
- Mỗi loại media có logic riêng biệt
- Thay đổi một loại không ảnh hưởng đến loại khác

### 3. **Single Responsibility Principle**
- Mỗi strategy chỉ xử lý một loại media
- Code rõ ràng, dễ hiểu và debug

### 4. **Open/Closed Principle**
- Mở cho extension (thêm strategy mới)
- Đóng cho modification (không cần sửa code hiện có)

### 5. **Runtime Strategy Selection**
- Tự động detect media type từ content type
- Chọn strategy phù hợp tại runtime

## Cách thêm loại media mới

### Ví dụ: Thêm Audio Support

#### 1. Tạo AudioProcessingStrategy
```java
@Component
public class AudioProcessingStrategy implements MediaProcessingStrategy {
    @Override
    public MediaType getMediaType() {
        return MediaType.AUDIO;
    }
    
    // Implement các method khác...
}
```

#### 2. Cập nhật MediaType enum
```java
public enum MediaType {
    IMAGE, VIDEO, DOCUMENT, AUDIO
}
```

#### 3. Cập nhật MediaStrategyFactory
```java
@PostConstruct
public void initialize() {
    strategies.put(MediaType.AUDIO, audioProcessingStrategy);
}
```

#### 4. Thêm AudioProperties configuration
```java
@ConfigurationProperties(prefix = "media.audio")
public class AudioProperties { ... }
```

## Testing Strategy Pattern

```java
@Test
public void testImageStrategy() {
    MediaProcessingStrategy strategy = factory.getStrategyByContentType("image/jpeg");
    assertEquals(MediaType.IMAGE, strategy.getMediaType());
    assertTrue(strategy.isValidFile(imageFile));
}

@Test 
public void testVideoStrategy() {
    MediaProcessingStrategy strategy = factory.getStrategyByContentType("video/mp4");
    assertEquals(MediaType.VIDEO, strategy.getMediaType());
}
```

## Monitoring & Logging

- Mỗi strategy có log riêng với media type
- Metrics cho từng loại media riêng biệt
- Health check cho từng storage bucket

## Migration từ code cũ

1. **Backward Compatibility**: ImageController vẫn hoạt động
2. **Gradual Migration**: Chuyển dần sang UnifiedMediaController  
3. **Configuration Update**: Cập nhật config format mới
4. **Testing**: Đảm bảo tất cả functionality vẫn hoạt động

Thiết kế này đảm bảo tính linh hoạt, khả năng mở rộng và dễ bảo trì cho hệ thống media processing trong tương lai.