# Transcoding Service

Video transcoding service for E-Learning platform that converts uploaded videos into multiple quality HLS streams for adaptive streaming.

## Features

- **Automatic Video Processing**: Listens to SQS messages for new video uploads
- **Multi-Quality Transcoding**: Generates 1080p, 720p, and 480p streams
- **HLS Streaming**: Outputs HLS format with adaptive bitrate streaming
- **AWS Integration**: Uses S3 for storage and SQS for messaging
- **Fault Tolerance**: Supports retries and dead letter queues
- **Health Monitoring**: Built-in health checks and monitoring endpoints

## Architecture

The service follows a complete 8-step workflow:

1. **Receive & Lock Job**: Listen to SQS messages and lock them during processing
2. **Prepare Workspace**: Create temporary working directory
3. **Fetch Raw Material**: Download original video from S3
4. **Core Processing**: Transcode video using FFmpeg to multiple qualities
5. **Store Results**: Upload transcoded files to S3
6. **Update System State**: Notify course service of completion
7. **Cleanup Workspace**: Remove temporary files
8. **Finalize Job**: Delete SQS message on success

## Prerequisites

- Java 17+
- Maven 3.6+
- FFmpeg (for video processing)
- AWS credentials configured
- Docker (optional, for containerized deployment)

## Configuration

The service uses the following configuration properties:

```yaml
# Server Configuration
server:
  port: 8085

# AWS Configuration
aws:
  region: us-east-1
  s3:
    raw-videos-bucket: raw-videos
    streaming-assets-bucket: streaming-assets
  sqs:
    transcoding-queue: video-transcoding-queue
    dead-letter-queue: video-transcoding-dlq

# FFmpeg Configuration
ffmpeg:
  binary-path: ffmpeg
  output-formats:
    - resolution: 1080p
    - resolution: 720p
    - resolution: 480p

# Processing Configuration
processing:
  workspace-root: /tmp/transcoding
  cleanup-after-processing: true
  max-concurrent-jobs: 2
```

## Building and Running

### Local Development

```bash
# Build the project
mvn clean package

# Run the service
java -jar target/transcoding-service-0.0.1-SNAPSHOT.jar
```

### Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or run just the service
docker build -f docker/Dockerfile.dev -t transcoding-service .
docker run -p 8085:8085 transcoding-service
```

## API Endpoints

### Health Check
- `GET /api/transcoding/health` - Basic health status
- `GET /api/transcoding/status` - Detailed system status

### Actuator Endpoints
- `GET /actuator/health` - Spring Boot health check
- `GET /actuator/metrics` - Application metrics

## Message Format

### Current: S3 Event Notification Format

The service currently listens to S3 Event Notifications sent to SQS when videos are uploaded to S3:

```json
{
  "Records": [
    {
      "eventVersion": "2.1",
      "eventSource": "aws:s3",
      "eventName": "ObjectCreated:Put",
      "s3": {
        "bucket": {
          "name": "raw-videos"
        },
        "object": {
          "key": "courses/123/videos/lecture1.mp4",
          "size": 104857600
        }
      }
    }
  ]
}
```

### Future: Direct Message Format (Kafka Migration)

For future Kafka migration, the service will support direct message format:

```json
{
  "bucket": "raw-videos",
  "key": "courses/123/original.mp4",
  "videoId": "video-uuid",
  "lessonId": "lesson-123",
  "originalFilename": "lecture1.mp4",
  "fileSize": 104857600,
  "contentType": "video/mp4",
  "uploadTimestamp": 1639123456789
}
```

**Note**: Direct message listener is currently commented out in `VideoTranscodingListener.java` and will be reactivated during Kafka migration.

## Output Structure

After processing, the service creates the following structure in S3:

```
streaming-assets/
└── courses/
    └── {courseId}/
        └── videos/
            └── {videoId}/
                ├── playlist.m3u8              # Master playlist
                ├── 1080p/
                │   ├── playlist.m3u8          # 1080p playlist
                │   ├── segment_001.ts
                │   ├── segment_002.ts
                │   └── ...
                ├── 720p/
                │   ├── playlist.m3u8          # 720p playlist
                │   ├── segment_001.ts
                │   └── ...
                └── 480p/
                    ├── playlist.m3u8          # 480p playlist
                    ├── segment_001.ts
                    └── ...
```

## Error Handling

- **Retry Logic**: Failed messages are retried after visibility timeout
- **Dead Letter Queue**: Messages failing multiple times are moved to DLQ
- **Graceful Degradation**: Service continues processing other videos if one fails
- **Comprehensive Logging**: Detailed logs for troubleshooting

## Monitoring

- Health checks available at `/api/transcoding/health`
- Spring Boot Actuator endpoints for monitoring
- Detailed logging with configurable levels
- Docker health checks included

## Scaling

The service is designed to be horizontally scalable:

- Multiple instances can process messages concurrently
- SQS ensures each message is processed only once
- Stateless design allows easy scaling
- Resource usage monitoring for optimal sizing

## Security

- Runs as non-root user in Docker
- AWS credentials management via IAM roles
- Input validation for all messages
- Secure file handling with cleanup

## Development

### Project Structure

```
src/main/java/com/elearning/transcodingservice/
├── config/          # Configuration classes
├── controller/      # REST controllers
├── dto/             # Data Transfer Objects
├── enums/           # Enumerations
├── exception/       # Custom exceptions
├── listener/        # SQS message listeners
├── service/         # Business logic services
└── utils/           # Utility classes
```

### Testing

```bash
# Run unit tests
mvn test

# Run integration tests
mvn verify
```

## Troubleshooting

### Common Issues

1. **FFmpeg not found**: Ensure FFmpeg is installed and in PATH
2. **AWS credentials**: Verify AWS credentials are properly configured
3. **S3 permissions**: Check bucket permissions for read/write access
4. **SQS permissions**: Verify queue access permissions
5. **Disk space**: Ensure adequate space for transcoding workspace

### Logging

Enable debug logging for troubleshooting:

```yaml
logging:
  level:
    com.elearning.transcodingservice: DEBUG
    software.amazon.awssdk: INFO
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request