import type { Subject, Category } from "../types/api";
import apiService from "./apiService";

export const getSubjects = async (): Promise<Subject[]> => {
    try {
        const response = await apiService.get<Subject[]>("/v1/public/common/subjects");
        return response.data;
    } catch (error) {
        console.warn("Failed to fetch subjects from API:", error);
        return [];
    }
};

export const getCategories = async (): Promise<Category[]> => {
    try {
        const response = await apiService.get<Category[]>("/v1/public/common/categories");
        return response.data;
    } catch (error) {
        console.warn("Failed to fetch categories from API:", error);
        return [];
    }
};
