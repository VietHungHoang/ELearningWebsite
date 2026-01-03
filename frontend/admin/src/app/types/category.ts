// Category and Subject type definitions

export interface Category {
    id: string;
    nameVi: string;
    nameEn: string;
    description: string;
    parentId?: string | null;
    createdAt: string;
    updatedAt: string;
    // Computed properties for UI
    name?: string; // Will be mapped from nameVi/nameEn
    slug?: string;
    image?: string;
    displayOrder?: number;
    isActive?: boolean;
    tutorCount?: number;
    subjects?: Subject[];
}

export interface Subject {
    id: string;
    categoryId?: string;
    nameVi?: string;
    nameEn?: string;
    description?: string;
    image?: string;
    displayOrder?: number;
    isActive?: boolean;
    tutorCount?: number;
    createdAt?: string;
    updatedAt?: string;
    // Computed properties for UI
    name?: string; // Will be mapped from nameVi/nameEn
    slug?: string;
}

// Request DTOs for API calls
export interface CategoryCreateRequest {
    name: string;
    description: string;
    image?: string;
    displayOrder?: number;
    isActive?: boolean;
}

export interface CategoryUpdateRequest {
    name?: string;
    description?: string;
    image?: string;
    displayOrder?: number;
    isActive?: boolean;
}

export interface SubjectCreateRequest {
    name: string;
    description: string;
    image?: string;
    displayOrder?: number;
    isActive?: boolean;
}

export interface SubjectUpdateRequest {
    name?: string;
    description?: string;
    image?: string;
    displayOrder?: number;
    isActive?: boolean;
}
