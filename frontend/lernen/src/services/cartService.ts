import apiService from './apiService';
import type { CartItem } from '../types/cart';
import type { CartItemDetail } from '../types/api';

// Mock data as fallback
const mockCartItems: CartItem[] = [
  { id: 1, name: 'Mastering Algebra', category: 'Mathematics', tutor: 'Cynthia Hunter', price: 99.99, image: 'https://picsum.photos/seed/course1/80/80', rating: 4.9, reviews: 150 },
  { id: 2, name: 'Intro to Physics', category: 'Science', tutor: 'Steven Ford', price: 119.99, image: 'https://picsum.photos/seed/course2/80/80', rating: 4.8, reviews: 142 },
  { id: 3, name: 'Digital Art Fundamentals', category: 'Art', tutor: 'Arianne Kearns', price: 89.99, image: 'https://picsum.photos/seed/course4/80/80', rating: 4.9, reviews: 212 },
];

const mockCartItemDetails: CartItemDetail[] = [
  { id: 1, name: 'Mastering Algebra', category: 'Mathematics', tutor: 'Cynthia Hunter', price: 99.99, image: 'https://picsum.photos/seed/course1/128/128', rating: 4.9, reviews: 150, level: 'Intermediate', language: 'English', lessons: 24, duration: '12h 30m', availableCoupon: { code: 'CYNTHIA20', type: 'percentage', value: 20 } },
  { id: 2, name: 'Introduction to Physics', category: 'Science', tutor: 'Steven Ford', price: 119.99, image: 'https://picsum.photos/seed/course2/128/128', rating: 4.8, reviews: 142, level: 'Beginner', language: 'English', lessons: 32, duration: '15h 0m' },
  { id: 3, name: 'Digital Art Fundamentals', category: 'Art', tutor: 'Arianne Kearns', price: 89.99, image: 'https://picsum.photos/seed/course4/128/128', rating: 4.9, reviews: 212, level: 'Beginner', language: 'English', lessons: 20, duration: '10h 45m' },
];

const getCart = async (): Promise<CartItem[]> => {
  try {
    const response = await apiService.get<CartItem[]>('/cart');
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.warn('Failed to fetch cart from API, using mock data:', error);
    return mockCartItems;
  }
};

const getCartDetail = async (): Promise<CartItemDetail[]> => {
  try {
    const response = await apiService.get<CartItemDetail[]>('/cart/detail');
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.warn('Failed to fetch cart detail from API, using mock data:', error);
    return mockCartItemDetails;
  }
};

export default { getCart, getCartDetail };