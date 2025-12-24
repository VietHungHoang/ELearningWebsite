export interface CartResponse {
  id: number;
  learnerId: number;
  totalAmount: number;
  items: CartItem[];
}


export interface CartItem {

  id: number;             
  courseId: number;       
  name: string;          
  category: string;       
  instructor: InstructorInfo;  
  price: number;         
  image: string;          
  rating: number;        
  reviews: number;        
  level: CourseLevel;    
  language: string;       
  lessons: number;        
  duration: string;       
  
  availableCoupon?: CouponInfo; 
  appliedCoupon?: string;
}

export interface InstructorInfo {
  id: number;
  name: string;
}


export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';


export interface CouponInfo {
  code: string;           
  value: number;         
}

// Backend interfaces
export interface CartItemBE {
  id: number;
  courseId: number;
  appliedCoupon?: string;
  valid: boolean;
}

export interface InstructorBE {
  id: number;
  name: string;
}

export interface CourseDetailBE {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  instructorId: string;
  description: string;
  level: CourseLevel;
  listPrice: number;
  discountPrice: number;
  totalStudents: number;
  duration: string;
  language: string;
  lessons: number;
  lastUpdated: string;
  requirements: string[];
  includes: string[];
  availableCoupon?: CouponInfo;
}

export interface CartItemResponse extends CartItemBE, CourseDetailBE {
  instructor: InstructorBE;
}

export interface AddToCartBFFResponse {
  cartId: number;
  courseId: number;
  itemCount: number;
  totalAmount: number;
}

export interface CartItemBFF {
  id: number;
  courseId: number;
  courseTitle: string;
  category: string;
  instructorId: string;
  instructorName: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  level: CourseLevel;
  language: string;
  lessons: number;
  duration: string;
}

export interface ViewCartBFFResponse {
  cartId: number;
  learnerId: string;
  items: CartItemBFF[];
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  discountPercentage?: number;
  availableCoupons?: string[];
}

export interface ApplyCouponBFFResponse {
  cartId: number;
  courseId: number;
  couponCode: string;
  discountAmount: number;
  totalAmount: number;
  itemCount: number;
}

export interface CheckoutBFFResponse {
  orderId: string;
  totalAmount: number;
}

export interface CheckoutResponse {
  orderId: string;
  totalAmount: number;
}

export interface AddToCartRequest {
  courseId: number;
}

export interface ApplyCouponRequest {
  code: string;
  courseId?: number;
}

export type CheckoutRequest = Record<string, unknown>;