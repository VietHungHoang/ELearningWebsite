import apiService from './apiService';
// TODO: Import khi restore code backup
// import { store } from '../lib/store';

// CartItemResponse từ BE (chứa cả CartItem và CartItemDetail)
export interface CartItemResponse {
  // CartItem fields
  id: number;
  name: string;
  category: string;
  tutor: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  // CartItemDetail fields
  courseId: number;
  instructorName: string;
  instructorAvatar: string;
  description: string;
  level: string;
  listPrice: number;
  discountPrice: number;
  totalStudents: number;
  duration: string;
  language: string;
  lessons: number;
  hasCertificate: boolean;
  lastUpdated: string;
  whatYouWillLearn: string[];
  requirements: string[];
  includes: string[];
  availableCoupon?: {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
  };
  appliedCoupon?: string;
  valid: boolean;
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

interface ApiResponseWrapper<T> {
  status: number;
  message: string;
  data: T;
}

// ==========================================
// TODO: Backup - Lấy learnerId từ Redux store
// ==========================================
// const getLearnerId = (): string => {
//   const user = store.getState().auth.user;
//   if (!user) throw new Error('User not authenticated');
//   return user.id;
// };

// TEMPORARY: Hardcode learnerId = 1 để test
const getLearnerId = (): string => {
  // TODO: Sau khi hoàn thành testing, thay bằng code backup ở trên
  return '1';
};

const getCart = async (): Promise<CartItemResponse[]> => {
  try {
    const learnerId = getLearnerId();
    const response = await apiService.get(`/learners/${learnerId}/cart`);
    
    // axios trả về response.data là cart object
    if (response.status === 200 && response.data) {
      const cartData = response.data as Record<string, unknown>;
      
      // Lấy items array trực tiếp
      if ('items' in cartData && Array.isArray(cartData.items)) {
        return cartData.items as CartItemResponse[];
      }
    }
    
    throw new Error('No items found in cart');
  } catch (error) {
    console.error('Error fetching cart from API:', error);
    throw error;
  }
};

const addToCart = async (request: AddToCartRequest): Promise<CartResponse> => {
  try {
    const learnerId = getLearnerId();
    const response = await apiService.post<ApiResponseWrapper<CartResponse>>(`/learners/${learnerId}/cart/items`, request);
    if (response.data && response.data.status === 200) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || 'Failed to add to cart');
    }
  } catch (error) {
    console.error('Error adding to cart from API:', error);
    throw error;
  }
};

const removeItem = async (courseId: number): Promise<CartResponse> => {
  try {
    const learnerId = getLearnerId();
    const response = await apiService.delete<ApiResponseWrapper<CartResponse>>(`/learners/${learnerId}/cart/items/${courseId}`);
    if (response.data && response.data.status === 200) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || 'Failed to remove item');
    }
  } catch (error) {
    console.error('Error removing item from API:', error);
    throw error;
  }
};

const checkout = async (request?: CheckoutRequest): Promise<CheckoutResponse> => {
  try {
    const learnerId = getLearnerId();
    const response = await apiService.post<ApiResponseWrapper<CheckoutResponse>>(`/learners/${learnerId}/cart/checkout`, request || {});
    if (response.data && response.data.status === 200) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || 'Failed to checkout');
    }
  } catch (error) {
    console.error('Error during checkout from API:', error);
    throw error;
  }
};

const applyCoupon = async (courseId: number, request: ApplyCouponRequest): Promise<CartResponse> => {
  try {
    const learnerId = getLearnerId();
    request.courseId = courseId;
    
    const response = await apiService.post(`/learners/${learnerId}/cart/items/${courseId}/apply-coupon`, request);
    
    if (response.status === 200 && response.data) {
      const cartData = response.data as Record<string, unknown>;
      
      // Check if it has items array (CartResponse format)
      if ('items' in cartData) {
        return {
          items: (cartData.items as CartItemResponse[]) || [],
          totalPrice: (cartData.totalAmount as number) || 0
        };
      } else {
        throw new Error('Invalid response format from apply coupon API');
      }
    } else {
      throw new Error('HTTP request failed');
    }
  } catch (error) {
    console.error('Error applying coupon from API:', error);
    throw error;
  }
};

export default { getCart, addToCart, removeItem, checkout, applyCoupon };