import apiService from './apiService';
import { store } from '../lib/store';
import type { ApiResponse } from '../types/api';
import type { AddToWishlistRequest, WishlistItemResponse } from '../types/wishlist';


const getLearnerId = (): string => {
  const user = store.getState().auth.user;
  if (!user) return '1';
  return user.id;
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

export default { getWishlist, addToWishlist, removeFromWishlist, isInWishlist };