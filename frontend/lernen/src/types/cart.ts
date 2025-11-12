export interface CartResponse {
  id: number;
  learnerId: number;
  status: 'OPEN' | 'CHECKED_OUT';
  totalAmount: number;
  items: CartItem[];
}


export interface CartItem {

  id: number;             
  courseId: number;       
  name: string;          
  category: string;       
  tutor: string;        
  tutorId: number;       
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


export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';


export interface CouponInfo {
  code: string;           
  type: 'percentage' | 'fixed'; 
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
  instructorId: number;
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