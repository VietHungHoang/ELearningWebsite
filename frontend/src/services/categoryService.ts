import apiClient from "../api/client";
import type { ApiResponse, Category } from "../types";

const COURSE_SERVICE_URL = "http://localhost:8081/api/course";

export class CategoryService {

    private baseURL: string;

    constructor() {
        this.baseURL = COURSE_SERVICE_URL;
    }

    // Get all categories
    async getCategories(): Promise<ApiResponse<Category[]>> {
        return apiClient.get<Category[]>(this.baseURL, "/course/category");
    }

    // Get category by ID
    async getCategoryById(id: number): Promise<ApiResponse<Category>> {
        return apiClient.get<Category>(this.baseURL, `/course/category/${id}`);
    }
}

// Export singleton instance
export const categoryService = new CategoryService();
export default categoryService;
