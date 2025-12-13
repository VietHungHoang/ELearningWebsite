import type { Subject, Category } from "../types/api";
import apiService from "./apiService";

const mockSubjects: Subject[] = [
    {
        id: "s1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6",
        name: "Mathematics",
        categoryId: "c1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6",
    },
    { id: "s2a3b4c5-d6e7-f8g9-h0i1-j2k3l4m5n6o7", name: "Physics", categoryId: "c1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6" },
    {
        id: "s3a4b5c6-d7e8-f9g0-h1i2-j3k4l5m6n7o8",
        name: "Chemistry",
        categoryId: "c1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6",
    },
    { id: "s4a5b6c7-d8e9-f0g1-h2i3-j4k5l6m7n8o9", name: "Biology", categoryId: "c1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6" },
    {
        id: "s5a6b7c8-d9e0-f1g2-h3i4-j5k6l7m8n9o0",
        name: "English Literature",
        categoryId: "c2a3b4c5-d6e7-f8g9-h0i1-j2k3l4m5n6o7",
    },
    { id: "s6a7b8c9-d0e1-f2g3-h4i5-j6k7l8m9n0o1", name: "History", categoryId: "c2a3b4c5-d6e7-f8g9-h0i1-j2k3l4m5n6o7" },
    {
        id: "s7a8b9c0-d1e2-f3g4-h5i6-j7k8l9m0n1o2",
        name: "Geography",
        categoryId: "c2a3b4c5-d6e7-f8g9-h0i1-j2k3l4m5n6o7",
    },
    {
        id: "s8a9b0c1-d2e3-f4g5-h6i7-j8k9l0m1n2o3",
        name: "Computer Science",
        categoryId: "c3a4b5c6-d7e8-f9g0-h1i2-j3k4l5m6n7o8",
    },
];

const mockCategories: Category[] = [
    { id: "a3b4c5d6-e7f8-9012-6789-345678901234", name: "Primary school (Grade 1 to 5)" },
    { id: "b4c5d6e7-f8a9-0123-7890-456789012345", name: "Middle School (Grades 6-8)" },
    { id: "c5d6e7f8-a9b0-1234-8901-567890123456", name: "High School (Grades 9-10)" },
    { id: "d6e7f8a9-b0c1-2345-9012-678901234567", name: "Intermediate (Grades 11-12)" },
    { id: "e7f8a9b0-c1d2-3456-0123-789012345678", name: "Undergraduate (Bachelor's Degree)" },
    { id: "f8a9b0c1-d2e3-4567-1234-890123456789", name: "Graduate (Masters degree)" },
];

export const getSubjects = async (): Promise<Subject[]> => {
    try {
        const response = await apiService.get<Subject[]>("/v1/common/subjects");
        return response.data;
    } catch (error) {
        console.warn("Failed to fetch subjects, using mock data:", error);
        return mockSubjects;
    }
};

export const getCategories = async (): Promise<Category[]> => {
    try {
        const response = await apiService.get<Category[]>("/v1/common/categories");
        return response.data;
    } catch (error) {
        console.warn("Failed to fetch categories, using mock data:", error);
        return mockCategories;
    }
};
