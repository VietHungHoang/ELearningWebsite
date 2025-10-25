export interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

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

