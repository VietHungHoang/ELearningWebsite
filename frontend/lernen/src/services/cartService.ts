import apiService from './apiService';
import { store } from '../lib/store';
import type { ApiResponse } from '../types/api';
import type {
  CartItem as FrontendCartItem,
  CartResponse,
  CheckoutResponse,
  AddToCartRequest,
  ApplyCouponRequest,
  CheckoutRequest,
  CartItemResponse
} from '../types/cart';

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
  }
];

const mockCartResponse: CartResponse = {
  id: 1,
  learnerId: 1,
  status: 'OPEN',
  totalAmount: 99.99,
  items: mockCartItems
};

const mockCheckoutResponse: CheckoutResponse = {
  orderId: "ORD-2025-001",
  totalAmount: 99.99
};

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

const getLearnerId = (): string => {
  const user = store.getState().auth.user;
  if (!user) return '1';
  return user.id;
};

const getCart = async (): Promise<FrontendCartItem[]> => {
  try {
    const learnerId = getLearnerId();
    const response = await apiService.get<{ items: CartItemResponse[] }>(`/learners/${learnerId}/cart`);
    if (response.success === true && response.data) {
      try {
        const cartItems = response.data.items;
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
        return [];
      } catch {
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
    return mockCartResponse; 
  }
};

const removeItem = async (courseId: number): Promise<CartResponse> => {
  try {
    const learnerId = getLearnerId();
    type CartApiResponse = {
      id: number;
      learnerId: number;
      status: 'OPEN' | 'CHECKED_OUT';
      totalAmount: number;
      items: CartItemResponse[];
    };
    const response = await apiService.delete<ApiResponse<CartApiResponse>>(`/learners/${learnerId}/cart/items/${courseId}`);
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
      return {
        id: 0,
        learnerId: parseInt(getLearnerId()),
        status: 'OPEN',
        items: [],
        totalAmount: 0
      };
    }
    return {
      id: cartData.id || 0,
      learnerId: cartData.learnerId || parseInt(getLearnerId()),
      status: cartData.status || 'OPEN',
      items: cartData.items.map((item: CartItemResponse) => transformCartItem(item)),
      totalAmount: cartData.totalAmount || 0
    };
  } catch (error) {
    console.error('Error removing item from API:', error);
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
    return mockCheckoutResponse;
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
            id: 0,
            learnerId: parseInt(getLearnerId()),
            status: 'OPEN',
            items: (cartData.items as CartItemResponse[]).map(item => transformCartItem(item)) || [],
            totalAmount: (cartData.totalAmount as number) || 0
          };
        } else {
          return {
            id: 0,
            learnerId: parseInt(getLearnerId()),
            status: 'OPEN',
            items: [],
            totalAmount: 0
          };
        }
      } else {
        return {
          id: 0,
          learnerId: parseInt(getLearnerId()),
          status: 'OPEN',
          items: [],
          totalAmount: 0
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