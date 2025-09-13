# Quiz Data Flow Documentation

## Overview
This document describes the standardized data flow for the quiz system, from when a user clicks on a selected topic until the result page is returned.

## Data Flow Architecture

### 1. Quiz Selection Phase
```
User clicks quiz topic → QuizCard component → QuizService.getQuizById() → Redux store → QuizDetailPage
```

**Data Structures:**
- `QuizTopic`: Contains quiz metadata, questions, and configuration
- `QuizListResponse`: API response with pagination and filters

### 2. Quiz Session Initialization
```
QuizDetailPage → QuizService.startQuizSession() → Redux store → QuizTakingPage
```

**Data Structures:**
- `QuizSession`: Tracks session state, time, progress, and answers
- `QuizSessionResponse`: API response with session data

### 3. Quiz Taking Phase
```
QuizTakingPage → useQuizFlow hook → Redux actions → QuizService → Real-time updates
```

**Data Structures:**
- `QuizQuestion`: Individual question with options and metadata
- `QuizAnswer`: User's answer with validation and timing
- `QuizProgress`: Real-time progress tracking

### 4. Quiz Submission
```
Submit button → QuizService.submitQuiz() → QuizResult → QuizResultPage
```

**Data Structures:**
- `QuizResult`: Complete result with scoring and analysis
- `QuizSubmitResponse`: API response with result data

## Key Components

### Types (`types/quiz.ts`)
- **QuizTopic**: Quiz metadata and configuration
- **QuizQuestion**: Individual question structure
- **QuizSession**: Active session state
- **QuizResult**: Final result with analysis
- **API Response Types**: Standardized API responses

### Service (`services/quizService.ts`)
- **QuizService**: Centralized API communication
- **Error Handling**: Standardized error responses
- **Authentication**: Token-based auth integration

### Redux Store (`store/slices/quizSlice.ts`)
- **State Management**: Centralized quiz state
- **Async Actions**: API integration with Redux Toolkit
- **Real-time Updates**: Progress and timer management

### Custom Hook (`hooks/useQuizFlow.ts`)
- **Business Logic**: Quiz flow orchestration
- **Timer Management**: Automatic time tracking
- **State Synchronization**: Local and server state sync

## Data Flow Sequence

### 1. Quiz Discovery
```typescript
// User browses available quizzes
const { data } = await quizService.getQuizzes({
  category: 'Mathematics',
  difficulty: 'advanced'
})

// Redux state updated
dispatch(fetchQuizzes.fulfilled(data))
```

### 2. Quiz Selection
```typescript
// User clicks on a quiz
const quiz = await quizService.getQuizById('quiz-123')

// Store quiz details
dispatch(setCurrentQuiz(quiz))
```

### 3. Session Start
```typescript
// Start quiz session
const session = await quizService.startQuizSession('quiz-123')

// Initialize session state
dispatch(startQuizSession.fulfilled(session))
```

### 4. Question Navigation
```typescript
// Navigate to question
await quizService.navigateToQuestion(sessionId, questionIndex)

// Update current question
dispatch(setCurrentQuestionIndex(questionIndex))
```

### 5. Answer Submission
```typescript
// Save answer
await quizService.saveAnswer(sessionId, questionId, answer)

// Update local state
dispatch(updateAnswer({ questionId, answer }))
```

### 6. Quiz Completion
```typescript
// Submit quiz
const result = await quizService.submitQuiz(sessionId)

// Store result
dispatch(submitQuiz.fulfilled(result))
```

### 7. Result Display
```typescript
// Fetch result details
const result = await quizService.getQuizResult(sessionId)

// Display result page
dispatch(fetchQuizResult.fulfilled(result))
```

## State Management

### Redux State Structure
```typescript
interface QuizState {
  // Quiz List
  quizzes: QuizTopic[]
  currentQuiz: QuizTopic | null
  
  // Session Management
  currentSession: QuizSession | null
  currentQuestionIndex: number
  answers: Record<string, string | string[]>
  
  // Progress Tracking
  timeRemaining: number
  progress: QuizProgress | null
  
  // Results
  currentResult: QuizResult | null
  
  // UI State
  isQuizActive: boolean
  sessionLoading: boolean
  resultLoading: boolean
}
```

### Real-time Updates
- **Timer**: Automatic countdown with Redux updates
- **Progress**: Real-time progress calculation
- **Answers**: Immediate local state updates
- **Navigation**: Seamless question switching

## Error Handling

### API Error Structure
```typescript
interface QuizApiError {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
}
```

### Error Scenarios
1. **Network Errors**: Connection failures, timeouts
2. **Validation Errors**: Invalid answers, session expired
3. **Authentication Errors**: Token expired, unauthorized access
4. **Business Logic Errors**: Quiz not available, already completed

## Performance Optimizations

### 1. Local State Updates
- Immediate UI updates for better UX
- Background API synchronization
- Optimistic updates for answers

### 2. Caching Strategy
- Quiz metadata cached in Redux
- Session state persisted locally
- Result data cached for quick access

### 3. Lazy Loading
- Questions loaded on demand
- Media assets loaded progressively
- Results fetched only when needed

## Security Considerations

### 1. Authentication
- JWT token validation
- Session-based access control
- User permission checks

### 2. Data Validation
- Server-side answer validation
- Time limit enforcement
- Anti-cheating measures

### 3. Privacy
- User data encryption
- Secure API communication
- GDPR compliance

## Testing Strategy

### 1. Unit Tests
- Service layer testing
- Redux action testing
- Hook testing

### 2. Integration Tests
- API integration testing
- State management testing
- Component integration testing

### 3. E2E Tests
- Complete quiz flow testing
- Error scenario testing
- Performance testing

## Future Enhancements

### 1. Real-time Features
- Live quiz sessions
- Collaborative quizzes
- Real-time leaderboards

### 2. Advanced Analytics
- Detailed performance metrics
- Learning path recommendations
- Adaptive difficulty

### 3. Offline Support
- Offline quiz taking
- Sync when online
- Progressive web app features
