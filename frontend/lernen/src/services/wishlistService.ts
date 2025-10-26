import apiService from './apiService';

// WishlistItemResponse từ BE
export interface WishlistItemResponse {
  id: number;
  courseId: number;
  name: string;
  category: string;
  tutor: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
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
  addedAt: string;
}

class WishlistService {
  async getWishlist(): Promise<WishlistItemResponse[]> {
    try {
      const learnerId = this.getLearnerId();
      const response = await apiService.get(`/learners/${learnerId}/wishlist`);

      if (response.status === 200 && response.data) {
        const data = response.data as Record<string, unknown>;
        if ('items' in data && Array.isArray(data.items)) {
          return data.items as WishlistItemResponse[];
        }
      }
      return [];
    } catch (error) {
      console.error('Error fetching wishlist from API:', error);
      throw error;
    }
  }

  async addToWishlist(courseId: number): Promise<void> {
    try {
      const learnerId = this.getLearnerId();
      await apiService.post(`/learners/${learnerId}/wishlist`, { courseId });
    } catch (error) {
      console.error('Error adding to wishlist from API:', error);
      throw error;
    }
  }

  async removeFromWishlist(courseId: number): Promise<void> {
    try {
      const learnerId = this.getLearnerId();
      await apiService.delete(`/learners/${learnerId}/wishlist/${courseId}`);
    } catch (error) {
      console.error('Error removing from wishlist from API:', error);
      throw error;
    }
  }

  async isInWishlist(courseId: number): Promise<boolean> {
    try {
      const learnerId = this.getLearnerId();
      const response = await apiService.get(`/learners/${learnerId}/wishlist/check/${courseId}`);

      if (response.status === 200 && response.data) {
        const data = response.data as Record<string, unknown>;
        return Boolean(data.inWishlist);
      }
      return false;
    } catch (error) {
      console.error('Error checking wishlist status from API:', error);
      return false;
    }
  }

  private getLearnerId(): string {
    // TODO: Get from auth store
    return '1001';
  }
}

const wishlistService = new WishlistService();
export default wishlistService;