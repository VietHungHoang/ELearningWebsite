
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