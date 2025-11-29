export interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

export interface CartItemDetail {
  id: string;
  name: string;
  category: string;
  tutor: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  level: string;
  language: string;
  lessons: number;
  duration: string;
  availableCoupon?: {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
  };
  appliedCouponCode?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
}

export interface Location {
  id: string;
  name: string;
  offset: string;
}

export interface Language {
  id: string;
  name: string;
  code: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface FilterData {
  timezones: Location[];
  languages: Language[];
  categories: Category[];
}

export interface TutorSearchFilters {
  category?: string;
  subcategories?: string[];
  languages?: string[];
  minFee?: number;
  maxFee?: number;
  sortBy?: string;
  timezone?: string;
  keyword?: string;
  sessionType?: 'online' | 'offline';
  page?: number;
  limit?: number;
}

export interface Tutor {
  id: string;
  name: string;
  avatarUrl: string;
  isVerified: boolean;
  specialization: string;
  nationalityCode: string;
  currentSessionFee: number;
  originalSessionFee?: number; // Optional old price for discount display
  currency: string;
  averageRating: number;
  reviewCount: number;
  languages: {
    code: string;
    level: string;
  }[];
  categoryIds: string[];
  teachesInGroups: boolean;
  maxGroupMembers: number;
  videoUrl: string;
  videoThumbnailUrl: string;
  bio: string;
  studentCount: number;
  sessionDurationMinutes: number;
  bookedSessionsCount: number;
  socials: {
    id: string;
    url: string;
    platform: string;
  }[];
  subjects: {
    id: string;
    name: string;
    categoryId: string;
  }[];
  availability?: string[];
  hasTrialSession: boolean;
}

export interface PaginatedResponse<T> {
  content: T[]; // Array of items (Java standard naming)
  pageable: {
    pageNumber: number; // Current page number (0-based)
    pageSize: number; // Page size
    offset: number; // Offset from start
    paged: boolean; // Whether pagination is enabled
  };
  totalPages: number; // Total number of pages
  totalElements: number; // Total number of elements
  last: boolean; // Whether this is the last page
  first: boolean; // Whether this is the first page
  numberOfElements: number; // Number of elements in current page
  size: number; // Page size
  number: number; // Current page number (0-based)
  empty: boolean; // Whether the page is empty
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

export interface SignUpRequest {
  email: string;
  password: string;
  fullName: string;
}

export type UserRole = 'student' | 'tutor' | null;

export interface StartSignUpRequest {
  email: string;
  fullname: string;
  role: UserRole;
}

export interface SignUpResponse {
  message: string;
}

export interface AccountCreatedResponse {
  id: string;
  email: string;
  name: string;
}

// Schedule View Mode
export type ScheduleViewMode = 'daily' | 'weekly' | 'monthly';

// Tutor Availability (recurring pattern - matches backend entity)
export interface TutorAvailability {
  id?: string; // UUID - returned from backend, undefined when creating new
  dayOfWeek: number; // 0-6 (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  startTime: string; // HH:mm format (e.g., "09:00")
  endTime: string; // HH:mm format (e.g., "17:00")
  effectiveStartDate: string; // ISO date (YYYY-MM-DD)
  effectiveEndDate?: string; // ISO date (YYYY-MM-DD), null if ongoing
  status: 'AVAILABLE' | 'DELETED';
}

// Request to get availability (with date range for filtering)
export interface GetAvailabilityRequest {
  tutorId: string; // UUID of the tutor
  startDate: string; // ISO date (YYYY-MM-DD) - for filtering/prefetch
  endDate: string; // ISO date (YYYY-MM-DD) - for filtering/prefetch
  // timezoneOffset removed - all times are UTC
}

// Response with availability list
export interface GetAvailabilityResponse {
  availabilities: TutorAvailability[]; // All active availability patterns
}

// Bulk update availability - single API call for both modes
export interface BulkUpdateAvailabilityRequest {
  tutorId: string; // UUID of the tutor
  mode: 'this_period' | 'recurring'; // Apply to this week only OR update for all future
  startDate: string; // YYYY-MM-DD - for determining which availabilities to update
  endDate: string; // YYYY-MM-DD - for determining which availabilities to update
  // timezoneOffset removed - all times are UTC
  oldAvailabilityIds: string[]; // IDs of existing availabilities in this range (for backend to delete/update)
  newAvailabilities: Omit<TutorAvailability, 'id'>[]; // New availabilities (without IDs, backend will generate)
}

export interface BulkUpdateAvailabilityResponse {
  availabilities: TutorAvailability[]; // Updated availabilities with IDs
  message: string;
}

// ===== BOOKED SESSIONS API =====
// Represents an actual session booked by a student
export interface BookedSession {
  id: string; // UUID - session ID
  studentId: string; // UUID
  studentName: string;
  studentAvatarUrl?: string;
  
  // Session details
  sessionDatetime: string; // ISO 8601 datetime (e.g., "2025-01-20T09:00:00.000Z")
  durationMinutes: number; // Session duration (e.g., 60)
  className: string; // Class/course name (e.g., "Mathematics Advanced", "English Conversation")
  sessionType: '1-on-1' | 'Group' | 'Trial'; // Type of session
  
  // Status tracking
  status: 'PENDING' | 'BOOKED' | 'CANCELLED';
  
  // Additional info
  meetingUrl?: string; // Video call link (Zoom, Google Meet, etc.)
  notes?: string; // Tutor notes about the session
  
  // Timestamps
  bookedAt: string; // When the session was booked
  updatedAt?: string; // Last update time
}

// Request to get booked sessions
export interface GetBookedSessionsRequest {
  tutorId: string; // UUID of the tutor
  startDate: string; // ISO date (YYYY-MM-DD) - start of range
  endDate: string; // ISO date (YYYY-MM-DD) - end of range
  statuses?: ('PENDING' | 'BOOKED' | 'CANCELLED')[]; // Filter by statuses
  // timezoneOffset removed - all times are UTC
}

// Response with booked sessions
export interface GetBookedSessionsResponse {
  sessions: BookedSession[];
}

export interface Course {
  id: string;
  image: string;
  title: string;
  lessons: number;
  students: number;
  price: number;
  duration: string;
  review: number;
}

export interface TimezoneResponse {
  id: string;
  name: string;
  utcOffset: string;
}

export interface PaymentRequest {
  paymentMethod: 'momo' | 'zalopay' | 'credit-card' | 'paypal';
  amount: number;
  currency: string;
}

export interface PaymentResponse {
  paymentId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentUrl?: string; // For QR code payments like Momo, ZaloPay
  transactionId?: string;
  message: string;
}

export interface Student {
  id: string;
  name: string;
  avatarUrl: string;
  registeredDate: string;
  email: string;
  enrollmentTypes: ('1-on-1' | 'Group' | 'Trial')[];
  status: 'Ongoing' | 'Completed';
}

export interface StudentStats {
  sessionsCompleted: number;
  totalSessions: number;
  sessionsRemaining: number;
  completionRate: number;
  attendanceRate: number;
  lastSessionDate: string;
}

export interface StudentContact {
  phone: string;
  joinedDate: string;
}

export interface StudentClassInfo {
  name: string;
  instructor: string;
  schedule: string;
}

export interface StudentPayment {
  status: string;
  nextDueDate: string;
  totalPaid: string;
}

export interface StudentSession {
  id: string;
  date: string;
  time?: string;
  duration: string;
  topic: string;
  attendance?: string;
}

export interface StudentCourseProgress {
  title: string;
  progress: number;
  type: '1-on-1' | 'Group' | 'Trial';
}

export interface StudentPerformance {
  testScores: number[];
  homeworkCompletion: number;
  averageScore: number;
}

export interface StudentCommunication {
  id: string;
  date: string;
  type: string;
  content: string;
}

export interface StudentDetail extends Student {
  stats: StudentStats;
  contact: StudentContact;
  class: StudentClassInfo;
  payment: StudentPayment;
  upcomingSessions: StudentSession[];
  sessionHistory: StudentSession[];
  courses: StudentCourseProgress[];
  performance: StudentPerformance;
  strengths: string[];
  weaknesses: string[];
  communications: StudentCommunication[];
  tutorNotes?: string;
}

export interface ClassStudent {
  id: string;
  name: string;
  avatar: string;
}

export interface ClassSchedule {
  day: string;
  time: string;
}

export interface ClassQuiz {
  id: string;
  title: string;
  status: 'Completed' | 'Pending';
}

export interface ClassMaterial {
  id: string;
  name: string;
  type: 'PDF' | 'Video' | 'ZIP';
  date: string;
}

export interface Class {
  id: string;
  courseTitle: string;
  students: ClassStudent[];
  type: '1-on-1' | 'Group';
  status: 'Ongoing' | 'Completed';
  schedules: ClassSchedule[];
  startDate: string;
  completedSessions: number;
  totalSessions: number;
  quizzes: ClassQuiz[];
  materials: ClassMaterial[];
}

export interface ClassStats {
  totalStudents: number;
  activeStudents: number;
  completedSessions: number;
  totalSessions: number;
  averageAttendance: number;
  averageProgress: number;
}

export interface ClassSession {
  id: string;
  date: string;
  time: string;
  duration: string;
  topic: string;
  attendance: { studentId: string; status: 'Present' | 'Absent' | 'Late' }[];
  materials: ClassMaterial[];
}

export interface ClassDetail extends Class {
  stats: ClassStats;
  sessions: ClassSession[];
  announcements: { id: string; title: string; content: string; date: string; author: string }[];
  assignments: { id: string; title: string; description: string; dueDate: string; submissions: number }[];
}

export type PayoutStatus = 'Completed' | 'Processing' | 'Failed';
export type PayoutMethodType = 'PayPal' | 'Bank';

export interface PayoutMethod {
  id: string; // UUID
  type: PayoutMethodType;
  identifier: string;
}

export interface PayoutHistoryItem {
  id: string;
  date: string;
  amount: number;
  method: PayoutMethod;
  status: PayoutStatus;
}

export interface PayoutSummary {
  availableBalance: number;
  pendingBalance: number;
  withdrawalCount: number;
  maxWithdrawals: number;
  minimumThreshold: number;
  commissionRate: number;
  nextPayoutDate: string;
  totalEarned: number;
  currentPaymentMethod?: PayoutMethod;
}

export interface PayoutFilters {
  status?: PayoutStatus;
  page?: number;
  limit?: number;
}

export interface RecentEarning {
  id: string;
  course: string;
  type: '1-on-1' | 'Group';
  date: string;
  amount: number;
}

export interface RecentEarningsFilters {
  type?: '1-on-1' | 'Group' | 'All';
  page?: number;
  limit?: number;
}

// Tutor Profile Types
export interface EducationItem {
  id: string;
  title: string; // Degree name
  institution: string; // School name
  startDate: string; // ISO date format (YYYY-MM-DD)
  endDate?: string; // Null if ongoing
  location?: string;
  description?: string;
}

export interface ExperienceItem {
  id: string;
  title: string; // Position
  institution: string; // Company name
  startDate: string; // ISO date format (YYYY-MM-DD)
  endDate?: string; // Null if ongoing
  location?: string;
  description?: string;
}

export interface CertificationItem {
  id: string;
  name: string; // Certificate name (e.g., IELTS 8.0)
  issuingOrganization: string; // Issuing organization (e.g., British Council)
  issueDate: string; // ISO date format (YYYY-MM-DD)
  expirationDate?: string; // Null if no expiration
  credentialId?: string; // Certificate ID for verification
  credentialUrl?: string; // Online verification link
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface TutorProfile {
  // Basic Information
  fullName: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Not specified';
  country: string;
  city: string;
  nativeLanguage: Language;
  languages: Language[];

  // Professional Profile
  headline: string;
  subjects: Subject[];
  introduction: string;

  // Media & Portfolio
  avatarUrl?: string;
  introductionVideoUrl?: string;

  // Social Links
  socialLinks: SocialLink[];

  // Resume Highlights
  education: EducationItem[];
  experience: ExperienceItem[];
  certifications: CertificationItem[];
}

export interface UpdateTutorProfileRequest {
  // Basic Information
  fullName?: string;
  phone?: string;
  gender?: 'Male' | 'Female' | 'Not specified';
  country?: string;
  city?: string;
  nativeLanguage?: Language;
  languages?: Language[];

  // Professional Profile
  headline?: string;
  subjects?: Subject[];
  introduction?: string;

  // Social Links
  socialLinks?: SocialLink[];

  // Resume Highlights
  education?: EducationItem[];
  experience?: ExperienceItem[];
  certifications?: CertificationItem[];
}

export interface UploadFileResponse {
  fileUrl: string;
  fileName: string;
  fileSize: number;
}

export interface OnboardingData {
  // Step 1: Basic Information
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: 'Male' | 'Female' | 'Not specified';
  country: string;
  city: string;
  nativeLanguage: Language | null;
  languages: Language[];

  // Step 2: Professional Profile
  subjects: Subject[];
  headline: string;
  introduction: string;

  // Step 3: Media Portfolio
  profilePhoto: string | null;
  introVideo: string | null;
  socialLinks: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
    youtube: string;
  };

  // Step 4: Education & Experience
  education: EducationItem[];
  experience: ExperienceItem[];

  // Step 5: Certifications
  certifications: CertificationItem[];

  // Step 6: Availability
  availability: string[];
  timezone: string;
}

