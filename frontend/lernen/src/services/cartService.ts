import apiService from './apiService';
import { store } from '../lib/store';
import type { ApiResponse } from '../types/api';

// Mock data for testing when API fails
const mockCartItems: CartItemResponse[] = [
  {
    id: 1,
    courseId: 101,
    appliedCoupon: undefined,
    valid: true,
    name: "React Masterclass",
    category: "Web Development",
    price: 99.99,
    image: "/images/courses/react.jpg",
    rating: 4.8,
    reviews: 1250,
    instructorId: 1,
    description: "Learn React from basics to advanced",
    level: "Intermediate",
    listPrice: 199.99,
    discountPrice: 99.99,
    totalStudents: 5000,
    duration: "8 hours",
    language: "English",
    lessons: 45,
    lastUpdated: "2024-01-15",
    requirements: ["Basic JavaScript knowledge"],
    includes: ["Video lectures", "Code exercises", "Certificate"],
    instructor: {
      id: 1,
      name: "John Doe"
    }
  },
  {
    id: 2,
    courseId: 102,
    appliedCoupon: "SAVE20",
    valid: true,
    name: "Node.js Backend Development",
    category: "Backend Development",
    price: 79.99,
    image: "/images/courses/nodejs.jpg",
    rating: 4.6,
    reviews: 890,
    instructorId: 2,
    description: "Build scalable backend applications",
    level: "Advanced",
    listPrice: 149.99,
    discountPrice: 79.99,
    totalStudents: 3200,
    duration: "12 hours",
    language: "English",
    lessons: 62,
    lastUpdated: "2024-02-20",
    requirements: ["JavaScript fundamentals", "Basic programming"],
    includes: ["Video content", "Projects", "Q&A support"],
    instructor: {
      id: 2,
      name: "Jane Smith"
    }
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

// Utility function to show mock data warning
const showMockDataWarning = (operation: string) => {
  const message = `🚨 API Error: Using mock data for ${operation}. Please check backend connection.`;
  console.warn(message);
  
  // You can also trigger a toast notification here if you have a toast system
  // For now, we'll just use console.warn and alert for immediate visibility
  if (typeof window !== 'undefined') {
    // Simple browser alert for immediate user feedback
    setTimeout(() => {
      alert(`⚠️ Development Mode: ${operation} is using mock data due to API error.`);
    }, 100);
  }
};

// CartItem từ BE (chỉ chứa thông tin cơ bản của item trong cart)
export interface CartItem {
  id: number;
  courseId: number;
  appliedCoupon?: string;
  valid: boolean;
}
// Instructor information (để sử dụng khi cần fetch riêng)
export interface Instructor {
  id: number;
  name: string;
}
// CourseDetail từ BE (thông tin chi tiết của course)
export interface CourseDetail {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  instructorId: number; // Foreign key to instructor
  description: string;
  level: string;
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

// CartItemResponse từ BE (kết hợp CartItem + CourseDetail + Instructor)
export interface CartItemResponse extends CartItem, CourseDetail {
  instructor: Instructor; // Instructor object populated by backend JOIN
}



export interface CartResponse {
  items: CartItemResponse[];
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

// TEMPORARY: Hardcode learnerId = 1 để test khi không có user
// TODO: Sau khi hoàn thành authentication, bỏ điều kiện !user
const getLearnerId = (): string => {
  const user = store.getState().auth.user;
  if (!user) return '1'; // Temporary fallback for testing
  return user.id;
};

const getCart = async (): Promise<CartItemResponse[]> => {
  try {
    const learnerId = getLearnerId();
    const response = await apiService.get<ApiResponse<{items: CartItemResponse[]}>>(`/learners/${learnerId}/cart`);
    
    // Kiểm tra business logic success
    if (response.success === true) {
      if (response.data) {
        const cartData = response.data as unknown as Record<string, unknown>;
        
        // Nếu có items property, return nó
        if ('items' in cartData && Array.isArray(cartData.items)) {
          return cartData.items as CartItemResponse[];
        }
        
        // Nếu không có items, có thể cart trống, return empty array
        return [];
      } else {
        // Success nhưng không có data - có thể cart trống
        return [];
      }
    } else {
      // Business logic failed
      throw new Error(response.message || 'Failed to fetch cart');
    }
  } catch (error) {
    console.error('Error fetching cart from API:', error);
    showMockDataWarning('getCart');
    return mockCartItems; // Return mock data for UI testing
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
    showMockDataWarning('addToCart');
    return mockCartResponse; // Return mock data for UI testing
  }
};

const removeItem = async (courseId: number): Promise<CartResponse> => {
  try {
    const learnerId = getLearnerId();
    const response = await apiService.delete<ApiResponse<ApiResponse<CartResponse>>>(`/learners/${learnerId}/cart/items/${courseId}`);
    
    if (response.success === true && response.data && response.data.success === true) {
      return response.data.data as unknown as CartResponse;
    } else {
      const errorMessage = response.data?.message || response.message || 'Failed to remove item';
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Error removing item from API:', error);
    showMockDataWarning('removeItem');
    return mockCartResponse; // Return mock data for UI testing
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
    showMockDataWarning('checkout');
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
        
        // Check if it has items array (CartResponse format)
        if ('items' in cartData) {
          return {
            items: (cartData.items as CartItemResponse[]) || [],
            totalPrice: (cartData.totalAmount as number) || 0
          };
        } else {
          // Invalid format but success - return empty cart
          return {
            items: [],
            totalPrice: 0
          };
        }
      } else {
        // Success but no data - return empty cart
        return {
          items: [],
          totalPrice: 0
        };
      }
    } else {
      // Business logic failed
      throw new Error(response.message || 'Failed to apply coupon');
    }
  } catch (error) {
    console.error('Error applying coupon from API:', error);
    showMockDataWarning('applyCoupon');
    return mockCartResponse; // Return mock data for UI testing
  }
};

export default { getCart, addToCart, removeItem, checkout, applyCoupon };