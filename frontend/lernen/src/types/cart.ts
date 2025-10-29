
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