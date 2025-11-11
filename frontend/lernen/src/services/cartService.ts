import apiService from './apiService';
import { store } from '../lib/store';
import courseService from './courseService';
import type {
  CartItem as FrontendCartItem,
  CartResponse,
  CheckoutResponse,
  AddToCartRequest,
  ApplyCouponRequest,
  CheckoutRequest,
  AddToCartBFFResponse,
  ViewCartBFFResponse,
  CartItemBFF,
  ApplyCouponBFFResponse,
  CheckoutBFFResponse,
  CourseLevel
} from '../types/cart';


// Helper function to enrich cart item with course data
const enrichCartItemWithCourseData = async (cartItem: FrontendCartItem): Promise<FrontendCartItem> => {
  try {
    // Try to fetch course data from courseService
    const courseData = await courseService.getCourseByCourseId(cartItem.courseId);

    if (courseData && courseData.id !== 0 && courseData.name && courseData.name !== 'Unknown Course') {
      // Use real course data if it's good quality
      return {
        ...cartItem,
        name: courseData.name,
        category: courseData.category || 'Technology',
        instructor: {
          id: courseData.instructorId || 1,
          name: courseData.instructorName || 'Expert Instructor'
        },
        price: courseData.price || 99.99,
        image: courseData.image || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop&crop=center",
        rating: courseData.rating || 4.8,
        reviews: courseData.reviews || 1500,
        level: courseData.level as CourseLevel || 'Intermediate',
        language: courseData.language || 'English',
        lessons: courseData.lessons || 50,
        duration: courseData.duration || '10 hours'
      };
    }
  } catch (error) {
    console.warn(`Failed to fetch course data for courseId ${cartItem.courseId}, using mock data:`, error);
  }
  
  // Fallback to mock data if courseService fails or returns null
  return cartItem;
};
const mockCartItems: FrontendCartItem[] = [
  {
    id: 1,
    courseId: 101,
    name: "Complete React Developer Bootcamp",
    category: "Web Development",
    instructor: {
      id: 1,
      name: "Sarah Johnson"
    },
    price: 99.99,
    image: "/images/courses/react.jpg",
    rating: 4.8,
    reviews: 2847,
    level: "Intermediate",
    language: "English",
    lessons: 67,
    duration: "12 hours",
    availableCoupon: {
      code: "REACT25",
      value: 25
    }
  },
  {
    id: 2,
    courseId: 102,
    name: "Python for Data Science & Machine Learning",
    category: "Data Science",
    instructor: {
      id: 2,
      name: "Dr. Michael Chen"
    },
    price: 129.99,
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop&crop=center",
    rating: 4.9,
    reviews: 1923,
    level: "Advanced",
    language: "English",
    lessons: 89,
    duration: "18 hours",
    availableCoupon: {
      code: "DATA30",
      value: 30
    }
  },
];

const mockCartResponse: CartResponse = {
  id: 1,
  learnerId: 1,
  totalAmount: 99.99,
  items: mockCartItems
};

const mockCheckoutResponse: CheckoutResponse = {
  orderId: "ORD-2025-001",
  totalAmount: 99.99
};

function transformBFFCartItem(item: CartItemBFF): FrontendCartItem {
  return {
    id: item.id,
    courseId: item.courseId,
    name: item.courseTitle,
    category: item.category,
    instructor: {
      id: typeof item.instructorId === 'string' ? parseInt(item.instructorId, 10) : item.instructorId,
      name: item.instructorName
    },
    price: item.price,
    image: item.image,
    rating: item.rating,
    reviews: item.reviews,
    level: item.level,
    language: item.language,
    lessons: item.lessons,
    duration: item.duration
  };
}

function transformAddToCartBFFResponse(response: AddToCartBFFResponse, learnerId: string): CartResponse {
  return {
    id: response.cartId,
    learnerId: parseInt(learnerId),
    totalAmount: response.totalAmount,
    items: []
  };
}

function transformViewCartBFFResponse(response: ViewCartBFFResponse): CartResponse {
  return {
    id: response.cartId,
    learnerId: parseInt(response.learnerId),
    totalAmount: response.totalAmount,
    items: response.items?.map(transformBFFCartItem) || []
  };
}

function transformApplyCouponBFFResponse(response: ApplyCouponBFFResponse, learnerId: string): CartResponse {
  // ApplyCoupon only gives us summary, call getCart() to get full details
  return {
    id: response.cartId,
    learnerId: parseInt(learnerId),
    totalAmount: response.totalAmount,
    items: []
  };
}

function transformCheckoutBFFResponse(response: CheckoutBFFResponse): CheckoutResponse {
  return {
    orderId: response.orderId,
    totalAmount: response.totalAmount
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
    const response = await apiService.get<ViewCartBFFResponse>(`/learners/${learnerId}/cart`);
    if (response.success === true && response.data) {
      try {
        const cartResponse = transformViewCartBFFResponse(response.data);
        return cartResponse.items;
      } catch {
        throw new Error('Invalid cart data format');
      }
    } else {
      throw new Error(response.message || 'Failed to fetch cart');
    }
  } catch (error) {
    console.error('Error fetching cart from API:', error);
    
    // Try to enrich mock data with real course data before returning
    try {
      const enrichedItems = await Promise.all(
        mockCartItems.map(item => enrichCartItemWithCourseData(item))
      );
      return enrichedItems;
    } catch (enrichError) {
      console.warn('Failed to enrich mock data with course data, using basic mock:', enrichError);
      return mockCartItems;
    }
  }
};

const addToCart = async (request: AddToCartRequest): Promise<CartResponse> => {
  try {
    const learnerId = getLearnerId();
    const response = await apiService.post<AddToCartBFFResponse>(`/learners/${learnerId}/cart/items`, request);
    if (response.success === true && response.data) {
      return transformAddToCartBFFResponse(response.data, learnerId);
    } else {
      const errorMessage = response.message || 'Failed to add to cart';
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
    const response = await apiService.delete<ViewCartBFFResponse>(`/learners/${learnerId}/cart/items/${courseId}`);
    if (!response?.success || !response?.data) {
      const errorMsg = response?.message || 'Failed to remove item from cart';
      console.error('API Error:', {
        success: response?.success,
        message: errorMsg,
        data: response?.data
      });
      throw new Error(errorMsg);
    }
    return transformViewCartBFFResponse(response.data);
  } catch (error) {
    console.error('Error removing item from API:', error);
    return mockCartResponse;
  }
};

const checkout = async (request?: CheckoutRequest): Promise<CheckoutResponse> => {
  try {
    const learnerId = getLearnerId();
    const response = await apiService.post<CheckoutBFFResponse>(`/learners/${learnerId}/cart/checkout`, request || {});
    if (response.success === true && response.data) {
      return transformCheckoutBFFResponse(response.data);
    } else {
      const errorMessage = response.message || 'Failed to checkout';
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
    const response = await apiService.post<ApplyCouponBFFResponse>(`/learners/${learnerId}/cart/items/${courseId}/apply-coupon`, request);
    if (response.success === true && response.data) {
      return transformApplyCouponBFFResponse(response.data, learnerId);
    } else {
      throw new Error(response.message || 'Failed to apply coupon');
    }
  } catch (error) {
    console.error('Error applying coupon from API:', error);
    return mockCartResponse;
  }
};
export default { getCart, addToCart, removeItem, checkout, applyCoupon };