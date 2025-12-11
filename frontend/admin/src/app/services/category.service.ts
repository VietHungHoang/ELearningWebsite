import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Category {
    id: string;
    name: string;
    slug?: string;
    description: string;
    image?: string;
    displayOrder?: number;
    isActive: boolean;
    tutorCount: number;
    subjects: Subject[];
}

export interface Subject {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    tutorCount?: number;
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
                tutorCount: 5,
                subjects: [
                    { id: '1.1', name: 'Web Development', description: 'HTML, CSS, JavaScript', isActive: true, tutorCount: 3 },
                    { id: '1.2', name: 'Mobile Development', description: 'iOS and Android development', isActive: true, tutorCount: 2 },
                    { id: '1.3', name: 'Cybersecurity', description: 'Security and network protection', isActive: true, tutorCount: 0 }
                ]
            },
            {
                id: '2',
                name: 'Science',
                slug: 'science',
                description: 'Science and research-based courses',
                displayOrder: 2,
                isActive: true,
                tutorCount: 3,
                subjects: [
                    { id: '2.1', name: 'Data Science', description: 'Statistics and data analysis', isActive: true, tutorCount: 2 },
                    { id: '2.2', name: 'Natural Science', description: 'Physics, chemistry, biology', isActive: true, tutorCount: 1 }
                ]
            },
            {
                id: '3',
                name: 'Marketing',
                slug: 'marketing',
                description: 'Digital marketing and business strategy',
                displayOrder: 3,
                isActive: true,
                tutorCount: 2,
                subjects: [
                    { id: '3.1', name: 'Digital Marketing', description: 'SEO, SEM, social media', isActive: true, tutorCount: 1 },
                    { id: '3.2', name: 'Business Strategy', description: 'Management and planning', isActive: true, tutorCount: 1 }
                ]
            },
            {
                id: '4',
                name: 'Languages',
                slug: 'languages',
                description: 'Foreign language learning',
                displayOrder: 4,
                isActive: true,
                tutorCount: 4,
                subjects: [
                    { id: '4.1', name: 'English', description: 'English language courses', isActive: true, tutorCount: 2 },
                    { id: '4.2', name: 'Spanish', description: 'Spanish language courses', isActive: true, tutorCount: 1 },
                    { id: '4.3', name: 'French', description: 'French language courses', isActive: true, tutorCount: 1 }
                ]
            },
            {
                id: '5',
                name: 'Arts',
                slug: 'arts',
                description: 'Creative arts and design',
                displayOrder: 5,
                isActive: true,
                tutorCount: 1,
                subjects: [
                    { id: '5.1', name: 'Graphic Design', description: 'Visual design and tools', isActive: true, tutorCount: 1 }
                ]
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

    addSubjectToCategory(categoryId: string, subject: Subject): void {
        const currentCategories = this.categoriesSubject.value;
        const updatedCategories = currentCategories.map(c => {
            if (c.id === categoryId) {
                return {
                    ...c,
                    subjects: [...c.subjects, subject]
                };
            }
            return c;
        });
        this.categoriesSubject.next(updatedCategories);
    }

    updateSubject(categoryId: string, subjectIndex: number, subject: Subject): void {
        const currentCategories = this.categoriesSubject.value;
        const updatedCategories = currentCategories.map(c => {
            if (c.id === categoryId && c.subjects[subjectIndex]) {
                const updatedSubjects = [...c.subjects];
                updatedSubjects[subjectIndex] = subject;
                return {
                    ...c,
                    subjects: updatedSubjects
                };
            }
            return c;
        });
        this.categoriesSubject.next(updatedCategories);
    }

    deleteSubjectFromCategory(categoryId: string, subjectIndex: number): void {
        const currentCategories = this.categoriesSubject.value;
        const updatedCategories = currentCategories.map(c => {
            if (c.id === categoryId) {
                const updatedSubjects = c.subjects.filter((_, index) => index !== subjectIndex);
                return {
                    ...c,
                    subjects: updatedSubjects
                };
            }
            return c;
        });
        this.categoriesSubject.next(updatedCategories);
    }

    toggleSubjectActive(categoryId: string, subjectIndex: number): void {
        const currentCategories = this.categoriesSubject.value;
        const updatedCategories = currentCategories.map(c => {
            if (c.id === categoryId && c.subjects[subjectIndex]) {
                const updatedSubjects = [...c.subjects];
                updatedSubjects[subjectIndex] = {
                    ...updatedSubjects[subjectIndex],
                    isActive: !updatedSubjects[subjectIndex].isActive
                };
                return {
                    ...c,
                    subjects: updatedSubjects
                };
            }
            return c;
        });
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
