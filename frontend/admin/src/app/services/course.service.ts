import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Course {
    id: string;
    name: string;
    category: string;
    instructor: {
        name: string;
        avatar: string;
    };
    enrolled: number;
    startDate: string;
    lessons: number;
    price: string;
    rating: number;
    status: 'pending' | 'rejected' | 'approved';
}

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    private coursesSubject = new BehaviorSubject<Course[]>([]);
    public courses$ = this.coursesSubject.asObservable();

    constructor() {
        this.loadMockData();
    }

    private loadMockData(): void {
        const mockCourses: Course[] = [
            {
                id: '854',
                name: 'Cybersecurity Awareness',
                category: 'Technology',
                instructor: {
                    name: 'Oliver Khan',
                    avatar: 'images/users/user6.jpg'
                },
                enrolled: 180,
                startDate: '25 Mar 2025',
                lessons: 24,
                price: '$49.99',
                rating: 4.7,
                status: 'approved'
            },
            {
                id: '853',
                name: 'Python Programming',
                category: 'Science',
                instructor: {
                    name: 'Ava Cooper',
                    avatar: 'images/users/user7.jpg'
                },
                enrolled: 250,
                startDate: '20 Mar 2025',
                lessons: 36,
                price: '$59.99',
                rating: 4.8,
                status: 'pending'
            },
            {
                id: '852',
                name: 'Digital Marketing',
                category: 'Marketing',
                instructor: {
                    name: 'James Wilson',
                    avatar: 'images/users/user8.jpg'
                },
                enrolled: 145,
                startDate: '15 Mar 2025',
                lessons: 18,
                price: '$39.99',
                rating: 4.6,
                status: 'approved'
            },
            {
                id: '851',
                name: 'Web Development Basics',
                category: 'Technology',
                instructor: {
                    name: 'Emma Davis',
                    avatar: 'images/users/user9.jpg'
                },
                enrolled: 320,
                startDate: '10 Mar 2025',
                lessons: 42,
                price: '$69.99',
                rating: 4.5,
                status: 'rejected'
            },
            {
                id: '850',
                name: 'Advanced React',
                category: 'Technology',
                instructor: {
                    name: 'Michael Brown',
                    avatar: 'images/users/user10.jpg'
                },
                enrolled: 215,
                startDate: '05 Mar 2025',
                lessons: 32,
                price: '$79.99',
                rating: 4.9,
                status: 'approved'
            },
            {
                id: '849',
                name: 'UI/UX Design Principles',
                category: 'Design',
                instructor: {
                    name: 'Sarah Johnson',
                    avatar: 'images/users/user11.jpg'
                },
                enrolled: 189,
                startDate: '01 Mar 2025',
                lessons: 28,
                price: '$49.99',
                rating: 4.7,
                status: 'pending'
            },
            {
                id: '848',
                name: 'Data Science Fundamentals',
                category: 'Science',
                instructor: {
                    name: 'Robert Taylor',
                    avatar: 'images/users/user12.jpg'
                },
                enrolled: 267,
                startDate: '25 Feb 2025',
                lessons: 40,
                price: '$89.99',
                rating: 4.8,
                status: 'approved'
            },
            {
                id: '847',
                name: 'Cloud Computing with AWS',
                category: 'Technology',
                instructor: {
                    name: 'Lisa Anderson',
                    avatar: 'images/users/user13.jpg'
                },
                enrolled: 178,
                startDate: '20 Feb 2025',
                lessons: 35,
                price: '$99.99',
                rating: 4.6,
                status: 'rejected'
            }
        ];
        this.coursesSubject.next(mockCourses);
    }

    getCourses(): Observable<Course[]> {
        return this.courses$;
    }

    getCourseById(id: string): Observable<Course | undefined> {
        return new Observable(subscriber => {
            this.courses$.subscribe(courses => {
                subscriber.next(courses.find(course => course.id === id));
            });
        });
    }

    deleteCourse(id: string): void {
        const currentCourses = this.coursesSubject.value;
        const updatedCourses = currentCourses.filter(course => course.id !== id);
        this.coursesSubject.next(updatedCourses);
    }

    updateCourseStatus(id: string, status: 'pending' | 'rejected' | 'approved'): void {
        const currentCourses = this.coursesSubject.value;
        const updatedCourses = currentCourses.map(course =>
            course.id === id ? { ...course, status } : course
        );
        this.coursesSubject.next(updatedCourses);
    }

    searchCourses(searchTerm: string): Observable<Course[]> {
        return new Observable(subscriber => {
            this.courses$.subscribe(courses => {
                if (!searchTerm.trim()) {
                    subscriber.next(courses);
                } else {
                    const searchLower = searchTerm.toLowerCase().trim();
                    const filteredCourses = courses.filter(course =>
                        course.name.toLowerCase().includes(searchLower)
                    );
                    subscriber.next(filteredCourses);
                }
            });
        });
    }
}
