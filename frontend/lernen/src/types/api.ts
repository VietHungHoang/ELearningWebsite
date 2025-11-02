export interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

<<<<<<< HEAD
export interface CartItemDetail {
  id: number;
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
  id: number;
  name: string;
}

export interface Subcategory {
  id: number;
  categoryId: number;
  name: string;
}

export interface Location {
  id: number;
  name: string;
  code: string;
}

export interface Language {
  id: number;
  name: string;
  code: string;
}

export interface TutorSearchFilters {
  category?: string;
  subcategories?: string[];
  locations?: string[];
  minFee?: number;
  maxFee?: number;
  sortBy?: string;
  language?: string;
  keyword?: string;
  sessionType?: 'online' | 'offline';
  page?: number;
  limit?: number;
}

export interface Tutor {
  id: number;
  name: string;
  avatar: string;
  verified: boolean;
  specialization: string;
  specializationIcon: 'learning' | 'academic';
  rating: number;
  reviews: number;
  bookedSessions: number;
  currentSessions: number;
  languages: string;
  bio: string;
  sessionFee: number;
  videoUrl: string;
  videoThumbnail: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
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

export interface SignUpResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

=======
>>>>>>> a691ed1f7e409c02119473b77f37bfff3b328ec8
