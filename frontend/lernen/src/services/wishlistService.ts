import apiService from './apiService';
import { decodeJwt } from '../lib/jwt';
import type { ApiResponse } from '../types/api';
import type { AddToWishlistRequest, WishlistItemResponse, AddTutorToWishlistRequest, TutorWishlistItemResponse } from '../types/wishlist';


const getLearnerId = (): string => {
  const token = localStorage.getItem('accessToken');
  if (!token) return '1';
  const decoded = decodeJwt(token);
  return decoded?.sub || '1';
};

const getWishlist = async (): Promise<WishlistItemResponse[]> => {
  try {
    const learnerId = getLearnerId();
    const response = await apiService.get<ApiResponse<{items: WishlistItemResponse[]}>>(`/learners/${learnerId}/wishlist`);

    if (response.success === true) {
      if (response.data) {
        const data = response.data as unknown as Record<string, unknown>;
        if ('items' in data && Array.isArray(data.items)) {
          return data.items as WishlistItemResponse[];
        }
      }
      return [];
    } else {
      throw new Error(response.message || 'Failed to fetch wishlist');
    }
  } catch (error) {
    console.error('Error fetching wishlist from API:', error);
    return [];
  }
};

const addToWishlist = async (courseId: number): Promise<WishlistItemResponse> => {
  try {
    const learnerId = getLearnerId();
    const request: AddToWishlistRequest = { courseId };
    const response = await apiService.post<ApiResponse<WishlistItemResponse>>(`/learners/${learnerId}/wishlist`, request);

    if (response.success === true) {
      if (response.data) {
        return response.data as unknown as WishlistItemResponse;
      }
      throw new Error('No data returned from add to wishlist');
    } else {
      throw new Error(response.message || 'Failed to add to wishlist');
    }
  } catch (error) {
    console.error('Error adding to wishlist from API:', error);
    throw error;
  }
};

const removeFromWishlist = async (courseId: number): Promise<void> => {
  try {
    const learnerId = getLearnerId();
    const response = await apiService.delete<ApiResponse<void>>(`/learners/${learnerId}/wishlist/${courseId}`);

    if (response.success !== true) {
      throw new Error(response.message || 'Failed to remove from wishlist');
    }
  } catch (error) {
    console.error('Error removing from wishlist from API:', error);
    throw error;
  }
};

const isInWishlist = async (courseId: number): Promise<boolean> => {
  try {
    const learnerId = getLearnerId();
    const response = await apiService.get<ApiResponse<{inWishlist: boolean}>>(`/learners/${learnerId}/wishlist/check/${courseId}`);

    if (response.success === true && response.data) {
      const data = response.data as unknown as Record<string, unknown>;
      return Boolean(data.inWishlist);
    }
    return false;
  } catch (error) {
    console.error('Error checking wishlist status from API:', error);
    return false;
  }
};

// Tutor Wishlist Functions
const getTutorWishlist = async (): Promise<TutorWishlistItemResponse[]> => {
  try {
    const learnerId = getLearnerId();
    const response = await apiService.get<ApiResponse<{items: TutorWishlistItemResponse[]}>>(`/learners/${learnerId}/tutor-wishlist`);

    if (response.success === true) {
      if (response.data) {
        const data = response.data as unknown as Record<string, unknown>;
        if ('items' in data && Array.isArray(data.items)) {
          return data.items as TutorWishlistItemResponse[];
        }
      }
      return [];
    } else {
      throw new Error(response.message || 'Failed to fetch tutor wishlist');
    }
  } catch (error) {
    console.error('Error fetching tutor wishlist from API:', error);
    return [];
  }
};

const addTutorToWishlist = async (tutorId: string): Promise<TutorWishlistItemResponse> => {
  try {
    const learnerId = getLearnerId();
    const request: AddTutorToWishlistRequest = { tutorId };
    const response = await apiService.post<ApiResponse<TutorWishlistItemResponse>>(`/learners/${learnerId}/tutor-wishlist`, request);

    if (response.success === true) {
      if (response.data) {
        return response.data as unknown as TutorWishlistItemResponse;
      }
      throw new Error('No data returned from add tutor to wishlist');
    } else {
      throw new Error(response.message || 'Failed to add tutor to wishlist');
    }
  } catch (error) {
    console.error('Error adding tutor to wishlist from API:', error);
    throw error;
  }
};

const removeTutorFromWishlist = async (tutorId: string): Promise<void> => {
  try {
    const learnerId = getLearnerId();
    const response = await apiService.delete<ApiResponse<void>>(`/learners/${learnerId}/tutor-wishlist/${tutorId}`);

    if (response.success !== true) {
      throw new Error(response.message || 'Failed to remove tutor from wishlist');
    }
  } catch (error) {
    console.error('Error removing tutor from wishlist from API:', error);
    throw error;
  }
};

const isTutorInWishlist = async (tutorId: string): Promise<boolean> => {
  try {
    const learnerId = getLearnerId();
    const response = await apiService.get<ApiResponse<{inWishlist: boolean}>>(`/learners/${learnerId}/tutor-wishlist/check/${tutorId}`);

    if (response.success === true && response.data) {
      const data = response.data as unknown as Record<string, unknown>;
      return Boolean(data.inWishlist);
    }
    return false;
  } catch (error) {
    console.error('Error checking tutor wishlist status from API:', error);
    return false;
  }
};

export default { 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist, 
  isInWishlist,
  getTutorWishlist,
  addTutorToWishlist,
  removeTutorFromWishlist,
  isTutorInWishlist
};