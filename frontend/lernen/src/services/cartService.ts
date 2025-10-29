import apiService from './apiService';
import { store } from '../lib/store';
import type { ApiResponse } from '../types/api';

// Mock data for testing when API fails
const mockCartItems: FrontendCartItem[] = [
  {
    id: 1,
    courseId: 101,
    name: "React Masterclass",
    category: "Web Development",
    tutor: "John Doe",
    tutorId: 1,
    price: 99.99,
    image: "/images/courses/react.jpg",
    rating: 4.8,
    reviews: 1250,
    level: "Intermediate",
    language: "English",
    lessons: 45,
    duration: "8 hours",
    availableCoupon: {
      code: "REACT25",
      type: "percentage",
      value: 25
    }
  },
  {
    id: 2,
    courseId: 102,
    name: "Node.js Backend Development",
    category: "Backend Development",
    tutor: "Jane Smith",
    tutorId: 2,
    price: 79.99,
    image: "/images/courses/nodejs.jpg",
    rating: 4.6,
    reviews: 890,
    level: "Advanced",
    language: "English",
    lessons: 62,
    duration: "12 hours",
    availableCoupon: {
      code: "NODE15",
      type: "percentage",
      value: 15
    }
  },
  {
    id: 3,
    courseId: 103,
    name: "Python for Data Science",
    category: "Data Science",
    tutor: "Sarah Johnson",
    tutorId: 3,
    price: 89.99,
    image: "/images/courses/python.jpg",
    rating: 4.7,
    reviews: 1200,
    level: "Beginner",
    language: "English",
    lessons: 55,
    duration: "10 hours"
  }
];

const mockCartResponse: CartResponse = {
  items: mockCartItems,
  totalPrice: 179.98
};

const mockCheckoutResponse: CheckoutResponse = {
  orderId: "ORD-2025-001",
  totalAmount: 179.98
};



import type { CartItem as FrontendCartItem, CourseLevel } from '../types/cart';


interface CartItemBE {
  id: number;
  courseId: number;
  appliedCoupon?: string;
  valid: boolean;
}


interface InstructorBE {
  id: number;
  name: string;
}


interface CourseDetailBE {
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
  availableCoupon?: {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
  };
}


export interface CartItemResponse extends CartItemBE, CourseDetailBE {
  instructor: InstructorBE;
}


function transformCartItem(item: CartItemResponse): FrontendCartItem {
  if (!item) {
    throw new Error('Cart item is undefined');
  }


  const fallbackTutor = "Unknown Instructor";
  const fallbackTutorId = 0;


  const courseId = item.courseId || item.id;

  return {
    id: item.id,
    courseId: courseId,
    name: item.name || "Untitled Course",
    category: item.category || "Uncategorized",
    tutor: item.instructor?.name || fallbackTutor,
    tutorId: item.instructor?.id || item.instructorId || fallbackTutorId,
    price: item.price || 0,
    image: item.image || "/images/default-course.jpg",
    rating: item.rating || 0,
    reviews: item.reviews || 0,
    level: item.level || "Beginner",
    language: item.language || "English",
    lessons: item.lessons || 0,
    duration: item.duration || "0h",
    availableCoupon: item.availableCoupon,
    appliedCoupon: item.appliedCoupon
  };
}



export interface CartResponse {
  items: FrontendCartItem[];
  totalPrice: number;
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

const getLearnerId = (): string => {
  const user = store.getState().auth.user;
  if (!user) return '1'; // Temporary fallback for testing
  return user.id;
};

const getCart = async (): Promise<FrontendCartItem[]> => {
  try {
    const learnerId = getLearnerId();
    const response = await apiService.get<{ items: CartItemResponse[] }>(`/learners/${learnerId}/cart`);
    
    // Kiểm tra business logic success
    if (response.success === true && response.data) {
      try {
        const cartItems = response.data.items;
        
        // Kiểm tra và xử lý items
        if (Array.isArray(cartItems)) {
          return cartItems
            .filter((item): item is CartItemResponse => 
              item !== null && 
              typeof item === 'object' && 
              'id' in item
            )
            .map(item => {
              try {
                return transformCartItem(item);
              } catch (transformError) {
                console.error('Error transforming cart item:', transformError, item);
                return null;
              }
            })
            .filter((item): item is FrontendCartItem => item !== null); 
        }
        

        console.warn('Cart response does not contain valid items array');
        return [];
      } catch (parseError) {
        console.error('Error parsing cart response:', parseError);
        throw new Error('Invalid cart data format');
      }
    } else {
      throw new Error(response.message || 'Failed to fetch cart');
    }
  } catch (error) {
    console.error('Error fetching cart from API:', error);
    return mockCartItems; 
  }
};

const addToCart = async (request: AddToCartRequest): Promise<CartResponse> => {
  try {
    const learnerId = getLearnerId();
    const response = await apiService.post<ApiResponse<ApiResponse<CartResponse>>>(`/learners/${learnerId}/cart/items`, request);
    
    if (response.success === true && response.data && response.data.success === true) {
      return response.data.data as unknown as CartResponse;
    } else {
      const errorMessage = response.data?.message || response.message || 'Failed to add to cart';
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Error adding to cart from API:', error);
    
    return mockCartResponse; // Return mock data for UI testing
  }
};

const removeItem = async (courseId: number): Promise<CartResponse> => {
  try {
    const learnerId = getLearnerId();

    // Define API response type for cart data
    type CartApiResponse = {
      id: number;
      learnerId: number;
      status: 'OPEN' | 'CHECKED_OUT';
      totalAmount: number;
      items: CartItemResponse[];
    };

    console.log('Removing item:', { courseId, learnerId });

    const response = await apiService.delete<ApiResponse<CartApiResponse>>(`/learners/${learnerId}/cart/items/${courseId}`);

    console.log('API Response:', {
      success: response?.success,
      message: response?.message,
      data: response?.data
    });

    if (!response?.success || !response?.data) {
      const errorMsg = response?.message || 'Failed to remove item from cart';
      console.error('API Error:', {
        success: response?.success,
        message: errorMsg,
        data: response?.data
      });
      throw new Error(errorMsg);
    }

    const cartData = response.data.data as CartApiResponse;
    
    if (!cartData?.items || !Array.isArray(cartData.items)) {
      console.warn('Empty or invalid items array:', cartData);
      return {
        items: [],
        totalPrice: 0
      };
    }

    return {
      items: cartData.items.map((item: CartItemResponse) => transformCartItem(item)),
      totalPrice: cartData.totalAmount || 0
    };
  } catch (error) {
    console.error('Error removing item from API:', error);
    
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        courseId,
        learnerId: getLearnerId()
      });
    }


    return mockCartResponse;
  }
};

const checkout = async (request?: CheckoutRequest): Promise<CheckoutResponse> => {
  try {
    const learnerId = getLearnerId();
    const response = await apiService.post<ApiResponse<ApiResponse<CheckoutResponse>>>(`/learners/${learnerId}/cart/checkout`, request || {});
    
    if (response.success === true && response.data && response.data.success === true) {
      return response.data.data as unknown as CheckoutResponse;
    } else {
      const errorMessage = response.data?.message || response.message || 'Failed to checkout';
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Error during checkout from API:', error);

    return mockCheckoutResponse; // Return mock data for UI testing
  }
};

const applyCoupon = async (courseId: number, request: ApplyCouponRequest): Promise<CartResponse> => {
  try {
    const learnerId = getLearnerId();
    request.courseId = courseId;
    
    const response = await apiService.post<ApiResponse<{items: CartItemResponse[], totalAmount: number}>>(`/learners/${learnerId}/cart/items/${courseId}/apply-coupon`, request);
    
    if (response.success === true) {
      if (response.data) {
        const cartData = response.data as unknown as Record<string, unknown>;
        
        if ('items' in cartData) {
          return {
            items: (cartData.items as CartItemResponse[]).map(item => transformCartItem(item)) || [],
            totalPrice: (cartData.totalAmount as number) || 0
          };
        } else {
          return {
            items: [],
            totalPrice: 0
          };
        }
      } else {
        return {
          items: [],
          totalPrice: 0
        };
      }
    } else {

      throw new Error(response.message || 'Failed to apply coupon');
    }
  } catch (error) {
    console.error('Error applying coupon from API:', error);
    return mockCartResponse;
  }
};

export default { getCart, addToCart, removeItem, checkout, applyCoupon };