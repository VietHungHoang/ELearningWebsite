# Content Service Docker Configuration

## Development Environment

### Quick Start
```bash
# Start content service with database
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f content-service

# Stop services
docker-compose down
```

### Development Features
- **Hot Reload**: Code changes are automatically reflected
- **Volume Mounting**: `src/main` and `pom.xml` are mounted for live development
- **Database**: PostgreSQL container with persistent storage
- **Port**: Service runs on `http://localhost:8082`

## Production Environment

### Build Production Image
```bash
# Build production image
docker build -f docker/Dockerfile.prod -t content-service:latest .

# Run production container
docker run -d \
  --name content-service \
  -p 8082:8082 \
  -e DATABASE_URL=jdbc:postgresql://your-db-host:5432/content_db \
  -e DATABASE_USERNAME=your-username \
  -e DATABASE_PASSWORD=your-password \
  -e AWS_S3_BUCKET_NAME=your-bucket \
  -e AWS_S3_REGION=your-region \
  -e AWS_ACCESS_KEY_ID=your-access-key \
  -e AWS_SECRET_ACCESS_KEY=your-secret-key \
  content-service:latest
```

## Environment Variables

### Database Configuration
- `DATABASE_URL`: PostgreSQL connection URL
- `DATABASE_USERNAME`: Database username
- `DATABASE_PASSWORD`: Database password

### AWS S3 Configuration
- `AWS_S3_BUCKET_NAME`: S3 bucket for content storage
- `AWS_S3_REGION`: AWS region
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key

### File Upload Configuration
- `VIDEO_MAX_FILE_SIZE`: Maximum video file size (default: 2GB)
- `IMAGE_MAX_FILE_SIZE`: Maximum image file size (default: 10MB)

## Database

### Connection Details
- **Host**: `localhost:5434` (development)
- **Database**: `content_service_db`
- **Username**: `content_user`
- **Password**: `content_pass`

### Access Database
```bash
# Connect to database container
docker exec -it content-db psql -U content_user -d content_service_db

# Backup database
docker exec content-db pg_dump -U content_user content_service_db > backup.sql

# Restore database
docker exec -i content-db psql -U content_user content_service_db < backup.sql
```

## Monitoring

### Health Checks
- **Development**: `http://localhost:8082/actuator/health`
- **Production**: Built-in Docker health check

### Logs
```bash
# View application logs
docker-compose logs content-service

# Follow logs in real-time
docker-compose logs -f content-service

# View database logs
docker-compose logs db
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check if port 8082 is in use
   netstat -tulpn | grep 8082
   
   # Change port in docker-compose.yml if needed
   ports:
     - "8083:8082"  # Map to different host port
   ```

2. **Database Connection Issues**
   ```bash
   # Check database container status
   docker-compose ps db
   
   # Check database logs
   docker-compose logs db
   
   # Test database connection
   docker exec content-db pg_isready -U content_user
   ```

3. **File Upload Issues**
   - Ensure AWS credentials are properly set
   - Check S3 bucket permissions
   - Verify file size limits

### Reset Everything
```bash
# Stop and remove all containers and volumes
docker-compose down -v

# Remove images
docker rmi content-service-dev

# Start fresh
docker-compose up --build
```

## Integration with Other Services

### Multi-Service Setup
```bash
# Start content-service with course-service
cd ../course-service && docker-compose up -d
cd ../content-service && docker-compose up -d

# Or use a parent docker-compose.yml for all services
```

### Network Configuration
- Content Service: `http://localhost:8082`
- Course Service: `http://localhost:8081`
- Content Database: `localhost:5434`
- Course Database: `localhost:5433`