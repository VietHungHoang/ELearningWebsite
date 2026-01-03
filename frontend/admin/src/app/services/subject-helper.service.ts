// import { Injectable } from '@angular/core';
// import { Observable, of, BehaviorSubject } from 'rxjs';
// import { map, tap, catchError } from 'rxjs/operators';
// import { CategoryService } from './category.service';
// import { Subject } from '../types/category';

// @Injectable({
//     providedIn: 'root'
// })
// export class SubjectHelperService {
//     private subjectsSubject = new BehaviorSubject<Subject[]>([]);
//     public subjects$ = this.subjectsSubject.asObservable();

//     private readonly STORAGE_KEY = 'cached_subjects';
//     private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

//     constructor(private categoryService: CategoryService) {
//         this.loadCachedSubjects();
//     }

//     /**
//      * Load subjects from localStorage if available and not expired
//      */
//     private loadCachedSubjects(): void {
//         try {
//             const cached = localStorage.getItem(this.STORAGE_KEY);
//             if (cached) {
//                 const parsed = JSON.parse(cached);
//                 const now = Date.now();

//                 // Check if cache is still valid
//                 if (parsed.timestamp && (now - parsed.timestamp) < this.CACHE_DURATION) {
//                     this.subjectsSubject.next(parsed.subjects);
//                     console.log('[SubjectHelper] Loaded subjects from cache:', parsed.subjects.length);
//                 } else {
//                     // Cache expired, remove it
//                     localStorage.removeItem(this.STORAGE_KEY);
//                 }
//             }
//         } catch (error) {
//             console.error('[SubjectHelper] Error loading cached subjects:', error);
//             localStorage.removeItem(this.STORAGE_KEY);
//         }
//     }

//     /**
//      * Save subjects to localStorage with timestamp
//      */
//     private saveSubjectsToCache(subjects: Subject[]): void {
//         try {
//             const cacheData = {
//                 subjects: subjects,
//                 timestamp: Date.now()
//             };
//             localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cacheData));
//             console.log('[SubjectHelper] Saved subjects to cache:', subjects.length);
//         } catch (error) {
//             console.error('[SubjectHelper] Error saving subjects to cache:', error);
//         }
//     }

//     /**
//      * Load all subjects from API and cache them
//      */
//     loadAndCacheSubjects(): Observable<Subject[]> {
//         // If we already have subjects in cache, return them
//         if (this.subjectsSubject.value.length > 0) {
//             console.log('[SubjectHelper] Using cached subjects:', this.subjectsSubject.value.length);
//             return of(this.subjectsSubject.value);
//         }

//         console.log('[SubjectHelper] Loading subjects from API...');
//         // Otherwise, fetch from API
//         return this.categoryService.fetchAllSubjects().pipe(
//             tap((subjects: Subject[]) => {
//                 console.log('[SubjectHelper] Loaded subjects from API:', subjects.length);
//                 this.subjectsSubject.next(subjects);
//                 this.saveSubjectsToCache(subjects);
//             }),
//             catchError(error => {
//                 console.error('[SubjectHelper] Error loading subjects:', error);
//                 return of([]);
//             })
//         );
//     }
//     }

//     /**
//      * Get subject name by ID from cache
//      */
//     getSubjectNameById(subjectId: string): string {
//         const subject = this.subjectsSubject.value.find(s => s.id === subjectId);
//         const name = subject?.name || `Subject ${subjectId}`;
//         console.log('[SubjectHelper] getSubjectNameById:', subjectId, '->', name, 'Total subjects:', this.subjectsSubject.value.length);
//         return name;
//     }

//     /**
//      * Convert array of subject IDs to subject names
//      */
//     getSubjectNamesByIds(subjectIds: string[]): string[] {
//         if (!subjectIds || !Array.isArray(subjectIds)) {
//             return [];
//         }

//         return subjectIds.map(id => this.getSubjectNameById(id));
//     }

//     /**
//      * Get subject object by ID from cache
//      */
//     getSubjectById(subjectId: string): Subject | undefined {
//         return this.subjectsSubject.value.find(s => s.id === subjectId);
//     }

//     /**
//      * Get subjects by IDs
//      */
//     getSubjectsByIds(subjectIds: string[]): Subject[] {
//         if (!subjectIds || !Array.isArray(subjectIds)) {
//             return [];
//         }

//         return subjectIds
//             .map(id => this.getSubjectById(id))
//             .filter(subject => subject !== undefined) as Subject[];
//     }

//     /**
//      * Check if subjects are loaded
//      */
//     areSubjectsLoaded(): boolean {
//         return this.subjectsSubject.value.length > 0;
//     }

//     /**
//      * Clear cache (useful for testing or manual refresh)
//      */
//     clearCache(): void {
//         localStorage.removeItem(this.STORAGE_KEY);
//         this.subjectsSubject.next([]);
//     }

//     /**
//      * Get all cached subjects
//      */
//     getAllSubjects(): Subject[] {
//         return this.subjectsSubject.value;
//     }
// }
