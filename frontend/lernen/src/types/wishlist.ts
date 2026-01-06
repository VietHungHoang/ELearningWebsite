
export interface AddToWishlistRequest {
  courseId: number;
}

export interface WishlistItemResponse {
  id: number;
  courseId: number;
  addedAt: string;
}

export interface WishlistItemWithCourse extends WishlistItemResponse {
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  instructorName: string;
  level: string;
  duration: string;
  language: string;
}

// Tutor Wishlist Types
export interface AddTutorToWishlistRequest {
  tutorId: string;
}

export interface TutorWishlistItemResponse {
  id: number;
  tutorId: string;
  addedAt: string;
}

export interface TutorWishlistItemWithTutor extends TutorWishlistItemResponse {
  tutor: {
    id: string;
    fullName: string;
    headline: string;
    avatarUrl: string;
    averageRating: number;
    reviewsCount: number;
    currentSessionFee: number;
    country: {
      code: string;
      name: string;
    };
    isVerified: boolean;
  };
}