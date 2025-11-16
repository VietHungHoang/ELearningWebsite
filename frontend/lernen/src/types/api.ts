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

export type UserRole = 'student' | 'tutor' | 'admin';

export interface StartSignUpRequest {
  email: string;
  fullname: string;
  role: UserRole;
}

export interface SignUpResponse {
  message: string;
}

export interface TutorScheduleResponse {
  tutorId: string;
  availabilityId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  effectiveStartDate: string;
  effectiveEndDate: string;
  status: string;
}

export interface Course {
  id: number;
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

