# Learner Service

## Overview
Learner Service quản lý toàn bộ learning journey của students trong hệ thống E-learning, bao gồm enrollment, progress tracking, wishlist, và review system.

## Features
- ✅ **Enrollment Management**: Enroll/unenroll courses, payment tracking
- ✅ **Progress Tracking**: Real-time video/lesson completion tracking
- ✅ **Wishlist System**: Save courses for later purchase
- ✅ **Review & Rating**: Course rating và feedback system
- ✅ **Certificate Generation**: Auto-generate certificates upon completion
- ✅ **Learning Analytics**: Detailed progress analytics và insights
- ✅ **Access Control**: Verify enrollment before content access

## Architecture

### Domain Model
```
Student Learning Journey:
├── Enrollment: Core relationship between student and course
├── StudentProgress: Track video/lesson completion progress
├── StudentWishlist: Save courses for future enrollment
└── StudentReview: Rate and review completed courses
```

### Core Entities

#### **Enrollment Entity**
```
Enrollment:
├── Identity: id, studentId, courseId, status
├── Payment: paidAmount, paymentMethod, transactionId
├── Progress: completedLessons, completionPercentage
├── Timing: enrolledAt, completedAt, accessExpiresAt
├── Certificate: certificateUrl, certificateIssuedAt
└── Analytics: totalWatchTimeMinutes, lastAccessedAt
```

#### **StudentProgress Entity**
```
StudentProgress:
├── Identity: id, studentId, courseId, videoId, lessonId
├── Progress: watchTimeSeconds, watchPercentage, isCompleted
├── Timing: firstWatchedAt, lastWatchedAt, completedAt
├── Analytics: watchCount, seekCount, lastWatchPosition
└── Features: studentNotes, isBookmarked
```

#### **StudentWishlist Entity**
```
StudentWishlist:
├── Identity: id, studentId, courseId
├── Timing: addedAt
└── Analytics: addedFrom, notificationsSent
```

#### **StudentReview Entity**
```
StudentReview:
├── Identity: id, studentId, courseId
├── Content: rating (1.0-5.0), reviewText
├── Metadata: isVerifiedPurchase, isPublic, isApproved
├── Interaction: helpfulVotes, totalVotes
└── Response: instructorResponse, instructorResponseAt
```

### Enums
- **EnrollmentStatus**: ACTIVE, COMPLETED, CANCELLED, SUSPENDED, EXPIRED
- **ProgressStatus**: NOT_STARTED, IN_PROGRESS, COMPLETED

## API Endpoints

### Enrollment Management
- `POST /api/enrollments` - Enroll in a course
- `GET /api/enrollments/{id}` - Get enrollment details
- `GET /api/enrollments/student/{studentId}` - Get student's enrollments
- `GET /api/enrollments/course/{courseId}` - Get course enrollments
- `PUT /api/enrollments/{id}/status` - Update enrollment status
- `DELETE /api/enrollments/{id}` - Cancel enrollment

### Progress Tracking
- `POST /api/progress` - Update learning progress
- `GET /api/progress/student/{studentId}/course/{courseId}` - Get course progress
- `GET /api/progress/student/{studentId}` - Get all student progress
- `PUT /api/progress/{id}/complete` - Mark content as completed
- `POST /api/progress/{id}/bookmark` - Bookmark content

### Wishlist Management
- `POST /api/wishlist` - Add course to wishlist
- `GET /api/wishlist/student/{studentId}` - Get student's wishlist
- `DELETE /api/wishlist/{id}` - Remove from wishlist

### Review & Rating
- `POST /api/reviews` - Submit course review
- `GET /api/reviews/course/{courseId}` - Get course reviews
- `GET /api/reviews/student/{studentId}` - Get student's reviews
- `PUT /api/reviews/{id}` - Update review
- `POST /api/reviews/{id}/helpful` - Mark review as helpful

### Analytics & Reports
- `GET /api/analytics/student/{studentId}/dashboard` - Student learning dashboard
- `GET /api/analytics/course/{courseId}/completion` - Course completion rates
- `GET /api/analytics/course/{courseId}/engagement` - Course engagement metrics

## Database Schema

### Enrollments Table
```sql
CREATE TABLE enrollments (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    paid_amount DECIMAL(10,2),
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    completed_lessons INTEGER DEFAULT 0,
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    enrolled_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP,
    access_expires_at TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    certificate_url VARCHAR(500),
    certificate_issued_at TIMESTAMP,
    total_watch_time_minutes INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP,
    enrollment_source VARCHAR(50),
    notes TEXT,
    UNIQUE(student_id, course_id)
);
```

### Student Progress Table
```sql
CREATE TABLE student_progress (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    video_id BIGINT,
    lesson_id BIGINT,
    status VARCHAR(20) NOT NULL DEFAULT 'NOT_STARTED',
    watch_time_seconds INTEGER,
    video_duration_seconds INTEGER,
    watch_percentage DECIMAL(5,2) DEFAULT 0.00,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    first_watched_at TIMESTAMP,
    last_watched_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    watch_count INTEGER DEFAULT 0,
    seek_count INTEGER,
    last_watch_position VARCHAR(20),
    student_notes TEXT,
    is_bookmarked BOOLEAN DEFAULT FALSE,
    required_watch_percentage DECIMAL(5,2) DEFAULT 80.00
);
```

### Student Wishlist Table
```sql
CREATE TABLE student_wishlist (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    added_at TIMESTAMP NOT NULL DEFAULT NOW(),
    added_from VARCHAR(50),
    notifications_sent INTEGER DEFAULT 0,
    last_notification_at TIMESTAMP,
    unique_key VARCHAR(50) UNIQUE NOT NULL
);
```

### Student Reviews Table
```sql
CREATE TABLE student_reviews (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
    review_text TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    is_approved BOOLEAN DEFAULT TRUE,
    helpful_votes INTEGER DEFAULT 0,
    total_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    moderation_notes TEXT,
    moderated_at TIMESTAMP,
    moderated_by BIGINT,
    review_source VARCHAR(50),
    was_prompted BOOLEAN DEFAULT FALSE,
    instructor_response TEXT,
    instructor_response_at TIMESTAMP,
    unique_key VARCHAR(50) UNIQUE NOT NULL
);
```

## Business Logic

### Enrollment Flow
1. **Check Prerequisites**: Verify course exists, student not already enrolled
2. **Process Payment**: Validate payment information
3. **Create Enrollment**: Set status to ACTIVE, record enrollment date
4. **Initialize Progress**: Create initial progress tracking records
5. **Send Notifications**: Welcome email, access instructions

### Progress Tracking Flow
1. **Content Access**: Verify enrollment before allowing access
2. **Track Viewing**: Record watch time, percentage, seeking behavior
3. **Mark Completion**: Auto-complete when watch threshold reached (80%)
4. **Update Enrollment**: Update overall course completion percentage
5. **Generate Certificate**: Auto-generate when course 100% complete

### Review System Flow
1. **Eligibility Check**: Only enrolled students can review
2. **One Review Per Course**: Prevent duplicate reviews
3. **Moderation**: Optional admin approval process
4. **Helpfulness Voting**: Community-driven quality assessment
5. **Instructor Response**: Allow instructors to respond to reviews

## Configuration

### Application Properties
```properties
# Application
spring.application.name=learner-service
server.port=8083

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/learner_service_db

# Business Rules
app.enrollment.default-completion-threshold=80.0
app.enrollment.certificate-generation-enabled=true
app.analytics.batch-size=1000
```

## Integration Points

### With User Service
- Verify student identity and profile information
- Check user role and permissions

### With Course Service
- Validate course exists before enrollment
- Get course metadata (title, price, duration)
- Check course availability and prerequisites

### With Content Service
- Track video viewing progress
- Verify content access permissions
- Get video metadata for progress calculation

### With Payment Service (Future)
- Process enrollment payments
- Handle refunds for cancelled enrollments
- Track payment status and methods

## Performance Considerations

### Database Optimization
- Index on (student_id, course_id) for quick enrollment lookups
- Index on (student_id, last_watched_at) for recent activity
- Composite indexes for analytics queries

### Caching Strategy
- Cache enrollment status for frequent access checks
- Cache course completion percentages
- Cache popular course reviews

### Analytics Optimization
- Batch progress updates every 10 seconds
- Pre-calculate completion statistics
- Use read replicas for analytics queries

## Security & Privacy

### Access Control
- Students can only access their own data
- Instructors can view their course enrollments
- Admins have full access with audit logging

### Data Privacy
- Personal notes are encrypted
- Review anonymization options
- GDPR compliance for data deletion

## Monitoring & Analytics

### Key Metrics
- Enrollment conversion rates
- Course completion rates
- Average time to completion
- Student engagement patterns
- Review sentiment analysis

### Alerts
- Unusual enrollment patterns
- Low completion rates
- Negative review spikes
- Payment failures

## Future Enhancements
- **Learning Paths**: Sequential course recommendations
- **Achievements System**: Badges and milestones
- **Social Learning**: Study groups and peer interaction
- **Adaptive Learning**: Personalized content recommendations
- **Offline Support**: Download progress for offline viewing
