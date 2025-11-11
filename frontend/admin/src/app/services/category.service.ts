import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Category {
    id: string;
    name: string;
    slug?: string;
    description: string;
    image?: string;
    displayOrder: number;
    isActive: boolean;
    courseCount: number;
}

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private categoriesSubject = new BehaviorSubject<Category[]>([]);
    public categories$ = this.categoriesSubject.asObservable();

    constructor() {
        this.loadMockData();
    }

    private loadMockData(): void {
        const mockCategories: Category[] = [
            {
                id: '1',
                name: 'Technology',
                slug: 'technology',
                description: 'All courses related to technology, programming, and software development',
                displayOrder: 1,
                isActive: true,
                courseCount: 5
            },
            {
                id: '1.1',
                name: 'Web Development',
                slug: 'web-development',
                description: 'Learn web development with modern frameworks and tools',
                displayOrder: 1,
                isActive: true,
                courseCount: 2
            },
            {
                id: '1.2',
                name: 'Mobile Development',
                slug: 'mobile-development',
                description: 'iOS and Android app development courses',
                displayOrder: 2,
                isActive: true,
                courseCount: 1
            },
            {
                id: '1.3',
                name: 'Cybersecurity',
                slug: 'cybersecurity',
                description: 'Security and cybersecurity training',
                displayOrder: 3,
                isActive: true,
                courseCount: 1
            },
            {
                id: '2',
                name: 'Science',
                slug: 'science',
                description: 'Science and research-based courses',

                displayOrder: 2,
                isActive: true,
                courseCount: 2
            },
            {
                id: '2.1',
                name: 'Data Science',
                slug: 'data-science',
                description: 'Data analysis and machine learning',
                displayOrder: 1,
                isActive: true,
                courseCount: 1
            },
            {
                id: '2.2',
                name: 'Natural Science',
                slug: 'natural-science',
                description: 'Physics, chemistry, and biology courses',
                displayOrder: 2,
                isActive: true,
                courseCount: 1
            },
            {
                id: '3',
                name: 'Marketing',
                slug: 'marketing',
                description: 'Digital marketing and business strategy',
                displayOrder: 3,
                isActive: true,
                courseCount: 1
            },
            {
                id: '3.1',
                name: 'Digital Marketing',
                slug: 'digital-marketing',
                description: 'SEO, SEM, and social media marketing',
                displayOrder: 1,
                isActive: true,
                courseCount: 1
            },
            {
                id: '4',
                name: 'Design',
                slug: 'design',
                description: 'Design and creative courses',
                displayOrder: 4,
                isActive: true,
                courseCount: 1
            },
            {
                id: '4.1',
                name: 'UI/UX Design',
                slug: 'ui-ux-design',
                description: 'User interface and user experience design',
                displayOrder: 1,
                isActive: true,
                courseCount: 1
            }
        ];

        this.categoriesSubject.next(mockCategories);
    }

    getCategories(): Observable<Category[]> {
        return this.categories$;
    }

    addCategory(category: Omit<Category, 'id'>): void {
        const currentCategories = this.categoriesSubject.value;
        const newId = Math.max(...currentCategories.map(c => parseInt(c.id) || 0)) + 1;
        const newCategory: Category = {
            ...category,
            id: newId.toString()
        };
        this.categoriesSubject.next([...currentCategories, newCategory]);
    }

    updateCategory(id: string, category: Partial<Category>): void {
        const currentCategories = this.categoriesSubject.value;
        const updatedCategories = currentCategories.map(c =>
            c.id === id ? { ...c, ...category } : c
        );
        this.categoriesSubject.next(updatedCategories);
    }

    deleteCategory(id: string): void {
        const currentCategories = this.categoriesSubject.value;
        const filtered = currentCategories.filter(c => c.id !== id);
        this.categoriesSubject.next(filtered);
    }

    toggleActive(id: string): void {
        const currentCategories = this.categoriesSubject.value;
        const updatedCategories = currentCategories.map(c =>
            c.id === id ? { ...c, isActive: !c.isActive } : c
        );
        this.categoriesSubject.next(updatedCategories);
    }

    generateSlug(name: string): string {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }

}
