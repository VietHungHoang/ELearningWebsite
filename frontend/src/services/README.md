# API Service Documentation

## Overview
This directory contains the API service layer that simulates real API calls for the e-learning platform. The service provides a realistic experience with loading states, error handling, and async operations.

## Files

### `api.ts`
Main API service with all course-related operations.

**Key Features:**
- ✅ Simulated network delays (800ms)
- ✅ Random error simulation (10% chance)
- ✅ Proper error handling with custom ApiError class
- ✅ TypeScript type safety
- ✅ Pagination support
- ✅ Search and filtering

**Available Methods:**
- `getCourses(page, limit, filters)` - Get paginated courses
- `getCourseBySlug(slug)` - Get course by slug
- `getCourseById(id)` - Get course by ID
- `completeLesson(courseId, lessonId)` - Mark lesson as completed
- `setCurrentLesson(courseId, lessonId)` - Set current lesson
- `updateCourseProgress(courseId, progress)` - Update course progress
- `enrollInCourse(courseId, userId)` - Enroll in course
- `searchCourses(query, filters)` - Search courses
- `getEnrolledCourses(userId)` - Get user's enrolled courses

### `api-demo.ts`
Demo file to test all API endpoints and error handling.

**Usage:**
```javascript
// In browser console
runApiDemo() // Run full API demo
testErrorHandling() // Test error scenarios
```

## Hooks

### `useCourseApi.ts`
Custom React hooks for course operations.

**useCourseApi Hook:**
```typescript
const {
  loading,
  error,
  getCourseBySlug,
  completeLesson,
  setCurrentLesson,
  // ... other methods
} = useCourseApi()
```

**useCourse Hook:**
```typescript
const {
  course,
  currentLesson,
  loading,
  error,
  isInitialized,
  loadCourse,
  completeLesson,
  selectLesson,
  getNextLesson,
  clearError
} = useCourse(slug)
```

### `useQuiz.ts`
Custom React hook for quiz operations.

**useQuiz Hook:**
```typescript
const {
  loading,
  error,
  currentQuiz,
  quizResult,
  startQuiz,
  submitQuiz,
  clearQuiz,
  updateAnswer,
  canRetake,
  getRemainingAttempts,
  isAllQuestionsAnswered
} = useQuiz()
```

## Usage Examples

### Basic Course Loading
```typescript
import { useCourse } from '../hooks/useCourseApi'

const CoursePage = () => {
  const { course, loading, error, loadCourse } = useCourse()
  
  useEffect(() => {
    loadCourse('course-slug')
  }, [])
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!course) return <div>Course not found</div>
  
  return <div>{course.title}</div>
}
```

### Quiz Integration
```typescript
import { useQuiz } from '../hooks/useQuiz'

const QuizPage = () => {
  const {
    currentQuiz,
    startQuiz,
    submitQuiz,
    updateAnswer,
    isAllQuestionsAnswered
  } = useQuiz()
  
  const handleStartQuiz = (quiz) => {
    startQuiz(quiz)
  }
  
  const handleSubmitQuiz = async () => {
    const result = await submitQuiz()
    if (result?.attempt.passed) {
      // Handle success
    }
  }
  
  return (
    <div>
      {currentQuiz && (
        <QuizComponent
          quiz={currentQuiz}
          onAnswerChange={updateAnswer}
          onSubmit={handleSubmitQuiz}
          canSubmit={isAllQuestionsAnswered()}
        />
      )}
    </div>
  )
}
```

## Error Handling

The API service includes comprehensive error handling:

```typescript
try {
  const course = await courseApi.getCourseBySlug('invalid-slug')
} catch (error) {
  if (error instanceof ApiError) {
    console.log('API Error:', error.message)
    console.log('Status:', error.status)
    console.log('Code:', error.code)
  }
}
```

## Configuration

### Network Delay
```typescript
// In api.ts
private delayMs = 800 // Adjust simulation delay
```

### Error Rate
```typescript
// In api.ts
const shouldSimulateError = () => Math.random() < 0.1 // 10% error rate
```

## Testing

Run the demo to test all functionality:

```typescript
import { runApiDemo, testErrorHandling } from './api-demo'

// Test all endpoints
await runApiDemo()

// Test error handling
await testErrorHandling()
```

## Integration with Components

The API service is designed to work seamlessly with React components:

1. **Loading States** - Automatic loading indicators
2. **Error Handling** - User-friendly error messages
3. **Optimistic Updates** - Immediate UI updates with rollback on error
4. **Caching** - Efficient data management
5. **Type Safety** - Full TypeScript support

## Future Enhancements

- [ ] Add caching layer
- [ ] Implement offline support
- [ ] Add retry mechanisms
- [ ] Include request/response logging
- [ ] Add performance metrics
