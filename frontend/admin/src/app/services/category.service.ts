import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError, shareReplay } from 'rxjs/operators';
import { ApiService } from './api.service';
import {
    Category,
    Subject,
    CategoryCreateRequest,
    CategoryUpdateRequest,
    SubjectCreateRequest,
    SubjectUpdateRequest
} from '../types/category';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private categoriesSubject = new BehaviorSubject<Category[]>([]);
    public categories$ = this.categoriesSubject.asObservable();

    constructor(private apiService: ApiService) {
        this.loadCategoriesFromAPI();
    }

    private loadCategoriesFromAPI(): void {
        this.fetchCategories().subscribe({
            next: (categories) => {
            },
            error: (error) => {
                // Fallback to mock data if API fails
                this.loadMockData();
            }
        });
    }

    private loadMockData(): void {
        const mockCategories: Category[] = [
            {
                id: '1',
                nameVi: 'Technology',
                nameEn: 'Technology',
                name: 'Technology',
                description: 'All courses related to technology, programming, and software development',
                displayOrder: 1,
                isActive: true,
                tutorCount: 5,
                subjects: [
                    { id: '1.1', nameVi: 'Web Development', nameEn: 'Web Development', name: 'Web Development', description: 'HTML, CSS, JavaScript', isActive: true, tutorCount: 3 },
                    { id: '1.2', nameVi: 'Mobile Development', nameEn: 'Mobile Development', name: 'Mobile Development', description: 'iOS and Android development', isActive: true, tutorCount: 2 },
                    { id: '1.3', nameVi: 'Cybersecurity', nameEn: 'Cybersecurity', name: 'Cybersecurity', description: 'Security and network protection', isActive: true, tutorCount: 0 }
                ]
            },
            // ... other mock categories with updated structure
        ];

        this.categoriesSubject.next(mockCategories);
    }

    getCategories(): Observable<Category[]> {
        return this.categories$;
    }

    // API Methods for Categories
    fetchCategories(): Observable<Category[]> {
        // Use public common API as per BE response
        return this.apiService.getPublicCommon<Category[]>('/categories').pipe(
            map(response => {
                // ✅ ƯU TIÊN: Xử lý data thật từ API
                if (response.success && response.data && Array.isArray(response.data)) {
                    // Map BE response to UI-friendly format
                    const mappedCategories = response.data.map(category => ({
                        ...category,
                        name: category.nameVi || category.nameEn, // Computed property for UI
                        isActive: true, // Default value
                        tutorCount: 0, // Default value
                        subjects: [] // Will be populated separately
                    }));

                    this.categoriesSubject.next(mappedCategories);
                    return mappedCategories;
                }
                // ⚠️ FALLBACK: Chỉ khi API trả về success=false
                return this.categoriesSubject.value.length > 0
                    ? this.categoriesSubject.value
                    : [];
            }),
            catchError(error => {
                return of(this.categoriesSubject.value.length > 0
                    ? this.categoriesSubject.value
                    : []);
            })
        );
    }

    getCategoryById(id: string): Observable<Category | undefined> {
        // Thử lấy từ API - apiService.getCommon() trả về ApiResponse<Category>
        return this.apiService.getCommon<Category>(`/categories/${id}`).pipe(
            map(response => {
                // ✅ ƯU TIÊN: Xử lý data thật từ API
                if (response.success && response.data) {
                    return response.data;
                }
                // ⚠️ FALLBACK: Chỉ khi API trả về success=false
                return undefined;
            }),
            catchError(error => {
                // ⚠️ FALLBACK: Chỉ khi API throw exception (network error, timeout)
                return of(undefined);
            })
        );
    }

    addCategory(request: CategoryCreateRequest): Observable<Category | undefined> {
        return this.apiService.postCommon<Category>('/categories', request).pipe(
            map(response => {
                // ✅ ƯU TIÊN: Xử lý data thật từ API
                if (response.success && response.data) {
                    const newCategory = response.data;
                    const currentCategories = this.categoriesSubject.value;
                    this.categoriesSubject.next([...currentCategories, newCategory]);
                    return newCategory;
                }
                // ⚠️ FALLBACK: Chỉ khi API trả về success=false
                return undefined;
            }),
            catchError(error => {
                // ⚠️ FALLBACK: Chỉ khi API throw exception
                return of(undefined);
            })
        );
    }

    updateCategory(id: string, request: CategoryUpdateRequest): Observable<Category | undefined> {
        return this.apiService.putCommon<Category>(`/categories/${id}`, request).pipe(
            map(response => {
                // ✅ ƯU TIÊN: Xử lý data thật từ API
                if (response.success && response.data) {
                    const updatedCategory = response.data;
                    const currentCategories = this.categoriesSubject.value;
                    const updatedCategories = currentCategories.map(c =>
                        c.id === id ? updatedCategory : c
                    );
                    this.categoriesSubject.next(updatedCategories);
                    return updatedCategory;
                }
                // ⚠️ FALLBACK: Chỉ khi API trả về success=false
                return undefined;
            }),
            catchError(error => {
                // ⚠️ FALLBACK: Chỉ khi API throw exception
                return of(undefined);
            })
        );
    }

    deleteCategory(id: string): Observable<boolean> {
        return this.apiService.deleteCommon<void>(`/categories/${id}`).pipe(
            map(response => {
                // ✅ ƯU TIÊN: Xử lý data thật từ API
                if (response.success) {
                    const currentCategories = this.categoriesSubject.value;
                    const filtered = currentCategories.filter(c => c.id !== id);
                    this.categoriesSubject.next(filtered);
                    return true;
                }
                // ⚠️ FALLBACK: Chỉ khi API trả về success=false
                return false;
            }),
            catchError(error => {
                // ⚠️ FALLBACK: Chỉ khi API throw exception
                return of(false);
            })
        );
    }

    toggleCategoryActive(id: string): Observable<Category | undefined> {
        return this.apiService.patch<Category>(`/categories/${id}/toggle-active`, {}).pipe(
            map(response => {
                // ✅ ƯU TIÊN: Xử lý data thật từ API
                if (response.success && response.data) {
                    const updatedCategory = response.data;
                    const currentCategories = this.categoriesSubject.value;
                    const updatedCategories = currentCategories.map(c =>
                        c.id === id ? updatedCategory : c
                    );
                    this.categoriesSubject.next(updatedCategories);
                    return updatedCategory;
                }
                // ⚠️ FALLBACK: Chỉ khi API trả về success=false
                return undefined;
            }),
            catchError(error => {
                // ⚠️ FALLBACK: Chỉ khi API throw exception
                return of(undefined);
            })
        );
    }

    // API Methods for Subjects
    getSubjectsByCategory(categoryId: string): Observable<Subject[]> {
        // Gọi API thực - apiService.get() trả về ApiResponse<Subject[]>
        return this.apiService.get<Subject[]>(`/categories/${categoryId}/subjects`).pipe(
            map(response => {
                // ✅ ƯU TIÊN: Xử lý data thật từ API
                if (response.success && response.data && Array.isArray(response.data)) {
                    // Map BE response to UI-friendly format
                    const mappedSubjects = response.data.map(subject => ({
                        ...subject,
                        name: subject.nameVi || subject.nameEn, // Computed property for UI
                        isActive: true, // Default value
                        tutorCount: 0 // Default value
                    }));

                    return mappedSubjects;
                }
                // ⚠️ FALLBACK: Chỉ khi API trả về success=false
                return [];
            }),
            catchError(error => {
                // ⚠️ FALLBACK: Chỉ khi API throw exception (network error, timeout)
                return of([]);
            })
        );
    }

    getSubjectById(categoryId: string, subjectId: string): Observable<Subject | undefined> {
        // Thử lấy từ API - apiService.get() trả về ApiResponse<Subject>
        return this.apiService.get<Subject>(`/categories/${categoryId}/subjects/${subjectId}`).pipe(
            map(response => {
                // ✅ ƯU TIÊN: Xử lý data thật từ API
                if (response.success && response.data) {
                    return response.data;
                }
                // ⚠️ FALLBACK: Chỉ khi API trả về success=false
                return undefined;
            }),
            catchError(error => {
                // ⚠️ FALLBACK: Chỉ khi API throw exception (network error, timeout)
                return of(undefined);
            })
        );
    }

    addSubjectToCategory(categoryId: string, request: SubjectCreateRequest): Observable<Subject | undefined> {
        return this.apiService.post<Subject>(`/categories/${categoryId}/subjects`, request).pipe(
            map(response => {
                // ✅ ƯU TIÊN: Xử lý data thật từ API
                if (response.success && response.data) {
                    const newSubject = response.data;
                    const currentCategories = this.categoriesSubject.value;
                    const updatedCategories = currentCategories.map(c => {
                        if (c.id === categoryId) {
                            return {
                                ...c,
                                subjects: [...c.subjects, { ...newSubject, categoryId }]
                            };
                        }
                        return c;
                    });
                    this.categoriesSubject.next(updatedCategories);
                    return newSubject;
                }
                // ⚠️ FALLBACK: Chỉ khi API trả về success=false
                return undefined;
            }),
            catchError(error => {
                // ⚠️ FALLBACK: Chỉ khi API throw exception
                return of(undefined);
            })
        );
    }

    updateSubject(categoryId: string, subjectId: string, request: SubjectUpdateRequest): Observable<Subject | undefined> {
        return this.apiService.put<Subject>(`/categories/${categoryId}/subjects/${subjectId}`, request).pipe(
            map(response => {
                // ✅ ƯU TIÊN: Xử lý data thật từ API
                if (response.success && response.data) {
                    const updatedSubject = response.data;
                    const currentCategories = this.categoriesSubject.value;
                    const updatedCategories = currentCategories.map(c => {
                        if (c.id === categoryId) {
                            const updatedSubjects = (c.subjects || []).map(s =>
                                s.id === subjectId ? updatedSubject : s
                            );
                            return {
                                ...c,
                                subjects: updatedSubjects
                            };
                        }
                        return c;
                    });
                    this.categoriesSubject.next(updatedCategories);
                    return updatedSubject;
                }
                // ⚠️ FALLBACK: Chỉ khi API trả về success=false
                return undefined;
            }),
            catchError(error => {
                // ⚠️ FALLBACK: Chỉ khi API throw exception
                return of(undefined);
            })
        );
    }

    deleteSubject(categoryId: string, subjectId: string): Observable<boolean> {
        return this.apiService.delete<void>(`/categories/${categoryId}/subjects/${subjectId}`).pipe(
            map(response => {
                // ✅ ƯU TIÊN: Xử lý data thật từ API
                if (response.success) {
                    const currentCategories = this.categoriesSubject.value;
                    const updatedCategories = currentCategories.map(c => {
                        if (c.id === categoryId) {
                            const updatedSubjects = (c.subjects || []).filter(s => s.id !== subjectId);
                            return {
                                ...c,
                                subjects: updatedSubjects
                            };
                        }
                        return c;
                    });
                    this.categoriesSubject.next(updatedCategories);
                    return true;
                }
                // ⚠️ FALLBACK: Chỉ khi API trả về success=false
                return false;
            }),
            catchError(error => {
                // ⚠️ FALLBACK: Chỉ khi API throw exception
                return of(false);
            })
        );
    }

    toggleSubjectActive(categoryId: string, subjectId: string): Observable<Subject | undefined> {
        return this.apiService.patch<Subject>(`/categories/${categoryId}/subjects/${subjectId}/toggle-active`, {}).pipe(
            map(response => {
                // ✅ ƯU TIÊN: Xử lý data thật từ API
                if (response.success && response.data) {
                    const updatedSubject = response.data;
                    const currentCategories = this.categoriesSubject.value;
                    const updatedCategories = currentCategories.map(c => {
                        if (c.id === categoryId) {
                            const updatedSubjects = (c.subjects || []).map(s =>
                                s.id === subjectId ? updatedSubject : s
                            );
                            return {
                                ...c,
                                subjects: updatedSubjects
                            };
                        }
                        return c;
                    });
                    this.categoriesSubject.next(updatedCategories);
                    return updatedSubject;
                }
                // ⚠️ FALLBACK: Chỉ khi API trả về success=false
                return undefined;
            }),
            catchError(error => {
                // ⚠️ FALLBACK: Chỉ khi API throw exception
                return of(undefined);
            })
        );
    }

    // Legacy methods for mock data compatibility
    toggleActive(id: string): void {
        this.toggleCategoryActive(id).subscribe();
    }

    addSubjectToCategoryLocal(categoryId: string, subject: Subject): void {
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

    updateSubjectLocal(categoryId: string, subjectIndex: number, subject: Subject): void {
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
                const updatedSubjects = (c.subjects || []).filter((_, index) => index !== subjectIndex);
                return {
                    ...c,
                    subjects: updatedSubjects
                };
            }
            return c;
        });
        this.categoriesSubject.next(updatedCategories);
    }

    toggleSubjectActiveLocal(categoryId: string, subjectIndex: number): void {
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

    // API Method to fetch all subjects from all categories
    fetchAllSubjects(): Observable<Subject[]> {
        // PRIMARY: Try to get from dedicated subjects API first
        return this.apiService.getPublicCommon<Subject[]>('/subjects').pipe(
            shareReplay(1), // Cache kết quả, tránh duplicate requests
            map(response => {
                // ✅ ƯU TIÊN: Xử lý data thật từ primary subjects API
                if (response.success && response.data && Array.isArray(response.data)) {
                    return response.data;
                }
                // ⚠️ FALLBACK: Extract subjects from existing categories
                const allSubjects: Subject[] = [];
                this.categoriesSubject.value.forEach(category => {
                    if (category.subjects) {
                        category.subjects.forEach(subject => {
                            allSubjects.push({
                                ...subject,
                                name: subject.nameVi || subject.nameEn || subject.name, // Computed property for UI
                                categoryId: category.id // Ensure categoryId is set
                            });
                        });
                    }
                });
                return allSubjects;
            }),
            catchError(error => {
                // ⚠️ FALLBACK: Extract subjects from existing categories
                const allSubjects: Subject[] = [];
                this.categoriesSubject.value.forEach(category => {
                    if (category.subjects) {
                        category.subjects.forEach(subject => {
                            allSubjects.push({
                                ...subject,
                                name: subject.nameVi || subject.nameEn || subject.name, // Computed property for UI
                                categoryId: category.id // Ensure categoryId is set
                            });
                        });
                    }
                });
                return of(allSubjects);
            })
        );
    }

    // PRIMARY SUBJECT API METHODS (Recommended for new implementations)

    // Get subject by ID using primary endpoint
    getSubjectByIdPrimary(subjectId: string): Observable<Subject | undefined> {
        return this.apiService.getPublicCommon<Subject>(`/subjects/${subjectId}`).pipe(
            map(response => {
                if (response.success && response.data) {
                    return response.data;
                }
                return undefined;
            }),
            catchError(error => {
                return of(undefined);
            })
        );
    }

    // Add subject using primary endpoint
    addSubjectPrimary(request: SubjectCreateRequest & { categoryId: string }): Observable<Subject | undefined> {
        return this.apiService.postCommon<Subject>('/subjects', request).pipe(
            map(response => {
                if (response.success && response.data) {
                    const newSubject = response.data;
                    // Update local categories data
                    const currentCategories = this.categoriesSubject.value;
                    const updatedCategories = currentCategories.map(c => {
                        if (c.id === request.categoryId) {
                            return {
                                ...c,
                                subjects: [...(c.subjects || []), newSubject]
                            };
                        }
                        return c;
                    });
                    this.categoriesSubject.next(updatedCategories);
                    return newSubject;
                }
                return undefined;
            }),
            catchError(error => {
                return of(undefined);
            })
        );
    }

    // Update subject using primary endpoint
    updateSubjectPrimary(subjectId: string, request: SubjectUpdateRequest): Observable<Subject | undefined> {
        return this.apiService.putCommon<Subject>(`/subjects/${subjectId}`, request).pipe(
            map(response => {
                if (response.success && response.data) {
                    const updatedSubject = response.data;
                    // Update local categories data
                    const currentCategories = this.categoriesSubject.value;
                    const updatedCategories = currentCategories.map(c => {
                        const updatedSubjects = (c.subjects || []).map(s =>
                            s.id === subjectId ? updatedSubject : s
                        );
                        return {
                            ...c,
                            subjects: updatedSubjects
                        };
                    });
                    this.categoriesSubject.next(updatedCategories);
                    return updatedSubject;
                }
                return undefined;
            }),
            catchError(error => {
                return of(undefined);
            })
        );
    }

    // Delete subject using primary endpoint
    deleteSubjectPrimary(subjectId: string): Observable<boolean> {
        return this.apiService.deleteCommon<void>(`/subjects/${subjectId}`).pipe(
            map(response => {
                if (response.success) {
                    // Update local categories data
                    const currentCategories = this.categoriesSubject.value;
                    const updatedCategories = currentCategories.map(c => ({
                        ...c,
                        subjects: (c.subjects || []).filter(s => s.id !== subjectId)
                    }));
                    this.categoriesSubject.next(updatedCategories);
                    return true;
                }
                return false;
            }),
            catchError(error => {
                return of(false);
            })
        );
    }

    // Toggle subject active using primary endpoint
    toggleSubjectActivePrimary(subjectId: string): Observable<Subject | undefined> {
        return this.apiService.patchCommon<Subject>(`/subjects/${subjectId}/toggle-active`, {}).pipe(
            map(response => {
                if (response.success && response.data) {
                    const updatedSubject = response.data;
                    // Update local categories data
                    const currentCategories = this.categoriesSubject.value;
                    const updatedCategories = currentCategories.map(c => {
                        const updatedSubjects = (c.subjects || []).map(s =>
                            s.id === subjectId ? updatedSubject : s
                        );
                        return {
                            ...c,
                            subjects: updatedSubjects
                        };
                    });
                    this.categoriesSubject.next(updatedCategories);
                    return updatedSubject;
                }
                return undefined;
            }),
            catchError(error => {
                return of(undefined);
            })
        );
    }

    // LEGACY NESTED SUBJECT API METHODS (Deprecated - kept for backward compatibility)

}
