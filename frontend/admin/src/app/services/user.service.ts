import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Course {
    id: string;
    title: string;
    description: string;
    price: number;
    studentsEnrolled: number;
    rating: number;
}

export interface Instructor {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    nationality: string;
    joinDate: string;
    coursesCreated: number;
    totalStudents: number;
    rating: number;
    experience: number;
    specialization: string;
    courses: Course[];

    certification?: string[];
    studentSatisfaction?: number; 
    contentQuality?: number; 
    teachingStyle?: string; 
    totalReviews?: number;
    totalHours?: number; 
    languages?: string[]; 
    isVerified?: boolean;
}

export interface Learner {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    joinDate: string;
    coursesEnrolled: number;
    coursesCompleted: number;
    averageScore: number;
    level?: string;
    courses: Course[];

    learningGoal?: string; 
    totalHoursLearned?: number;
    streak?: number; 
    certificates?: string[]; 
    preferredLearningStyle?: string; 
    languages?: string[]; 
    enrolledOn?: { [courseId: string]: string }; 
    progressPercentage?: { [courseId: string]: number }; 
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private instructorsSubject = new BehaviorSubject<Instructor[]>([]);
    public instructors$ = this.instructorsSubject.asObservable();

    private learnersSubject = new BehaviorSubject<Learner[]>([]);
    public learners$ = this.learnersSubject.asObservable();

    constructor() {
        this.loadMockData();
    }

    private loadMockData(): void {
        const mockInstructors: Instructor[] = [
            {
                id: '1',
                name: 'Oliver Khan',
                email: 'oliver.khan@example.com',
                phone: '+1 (555) 123-4567',
                avatar: 'images/users/user6.jpg',
                nationality: 'United States',
                joinDate: '15 Jan 2023',
                coursesCreated: 5,
                totalStudents: 1000,
                rating: 4.7,
                experience: 12,
                specialization: 'Cybersecurity',
                courses: [
                    { id: 'c1', title: 'Advanced Cybersecurity Fundamentals', description: 'Master advanced security concepts', price: 99, studentsEnrolled: 245, rating: 4.8 },
                    { id: 'c2', title: 'Network Penetration Testing', description: 'Learn ethical hacking techniques', price: 129, studentsEnrolled: 189, rating: 4.7 },
                    { id: 'c3', title: 'Cloud Security for Enterprises', description: 'Secure your cloud infrastructure', price: 149, studentsEnrolled: 156, rating: 4.9 },
                    { id: 'c4', title: 'Cryptography Basics', description: 'Understanding encryption algorithms', price: 79, studentsEnrolled: 312, rating: 4.6 },
                    { id: 'c5', title: 'Incident Response Strategy', description: 'Handle security incidents effectively', price: 119, studentsEnrolled: 98, rating: 4.5 }
                ],
                certification: ['CISSP', 'CEH (Certified Ethical Hacker)', 'CompTIA Security+'],
                studentSatisfaction: 4.7,
                contentQuality: 4.8,
                teachingStyle: 'Interactive, Hands-on, Real-world Examples',
                totalReviews: 2847,
                totalHours: 45,
                languages: ['English', 'Spanish'],
                isVerified: true
            },
            {
                id: '2',
                name: 'Ava Cooper',
                email: 'ava.cooper@example.com',
                phone: '+1 (555) 234-5678',
                avatar: 'images/users/user7.jpg',
                nationality: 'Canada',
                joinDate: '20 Feb 2023',
                coursesCreated: 8,
                totalStudents: 2401,
                rating: 4.75,
                experience: 9,
                specialization: 'Python Development',
                courses: [
                    { id: 'c6', title: 'Python for Data Science', description: 'Complete Python programming guide', price: 89, studentsEnrolled: 567, rating: 4.9 },
                    { id: 'c7', title: 'Full Stack Web Development', description: 'Frontend + Backend mastery', price: 139, studentsEnrolled: 423, rating: 4.8 },
                    { id: 'c8', title: 'Django REST Framework', description: 'Build powerful APIs', price: 99, studentsEnrolled: 234, rating: 4.7 },
                    { id: 'c9', title: 'Machine Learning with Python', description: 'ML algorithms and implementations', price: 129, studentsEnrolled: 345, rating: 4.8 },
                    { id: 'c10', title: 'Database Design', description: 'SQL and NoSQL databases', price: 79, studentsEnrolled: 289, rating: 4.6 },
                    { id: 'c11', title: 'FastAPI Modern Development', description: 'High-performance APIs', price: 109, studentsEnrolled: 167, rating: 4.7 },
                    { id: 'c12', title: 'Testing in Python', description: 'Unit and integration testing', price: 69, studentsEnrolled: 198, rating: 4.5 },
                    { id: 'c13', title: 'Docker & Kubernetes', description: 'Container orchestration', price: 119, studentsEnrolled: 276, rating: 4.8 }
                ],
                certification: ['AWS Solutions Architect', 'Google Cloud Professional', 'Python Professional Certificate'],
                studentSatisfaction: 4.75,
                contentQuality: 4.8,
                teachingStyle: 'Project-based, Practical Coding, Step-by-Step',
                totalReviews: 4156,
                totalHours: 72,
                languages: ['English', 'French'],
                isVerified: true
            },
            {
                id: '3',
                name: 'James Wilson',
                email: 'james.wilson@example.com',
                phone: '+1 (555) 345-6789',
                avatar: 'images/users/user8.jpg',
                nationality: 'United Kingdom',
                joinDate: '10 Mar 2023',
                coursesCreated: 6,
                totalStudents: 1523,
                rating: 4.65,
                experience: 8,
                specialization: 'Digital Marketing',
                courses: [
                    { id: 'c14', title: 'Digital Marketing Fundamentals', description: 'Master digital marketing basics', price: 79, studentsEnrolled: 421, rating: 4.7 },
                    { id: 'c15', title: 'SEO Mastery 2024', description: 'Advanced search optimization', price: 99, studentsEnrolled: 356, rating: 4.8 },
                    { id: 'c16', title: 'Social Media Strategy', description: 'Grow your social presence', price: 89, studentsEnrolled: 234, rating: 4.6 },
                    { id: 'c17', title: 'Content Marketing Excellence', description: 'Create engaging content', price: 79, studentsEnrolled: 278, rating: 4.7 },
                    { id: 'c18', title: 'Email Campaign Automation', description: 'Automate marketing campaigns', price: 69, studentsEnrolled: 145, rating: 4.5 },
                    { id: 'c19', title: 'Analytics & ROI Tracking', description: 'Measure marketing success', price: 89, studentsEnrolled: 189, rating: 4.6 }
                ],
                certification: ['Google Analytics Certified', 'HubSpot Inbound Certified', 'Facebook Blueprint Certified'],
                studentSatisfaction: 4.65,
                contentQuality: 4.7,
                teachingStyle: 'Data-driven, Case Studies, Real Examples',
                totalReviews: 1834,
                totalHours: 38,
                languages: ['English', 'German'],
                isVerified: true
            },
            {
                id: '4',
                name: 'Emma Davis',
                email: 'emma.davis@example.com',
                phone: '+1 (555) 456-7890',
                avatar: 'images/users/user9.jpg',
                nationality: 'Australia',
                joinDate: '05 Apr 2023',
                coursesCreated: 7,
                totalStudents: 2613,
                rating: 4.77,
                experience: 10,
                specialization: 'Frontend Development',
                courses: [
                    { id: 'c20', title: 'React.js Mastery', description: 'Build modern UIs with React', price: 119, studentsEnrolled: 523, rating: 4.9 },
                    { id: 'c21', title: 'Vue.js Comprehensive Guide', description: 'Progressive framework learning', price: 99, studentsEnrolled: 267, rating: 4.7 },
                    { id: 'c22', title: 'Angular Advanced Patterns', description: 'Enterprise Angular development', price: 129, studentsEnrolled: 198, rating: 4.8 },
                    { id: 'c23', title: 'TypeScript Mastery', description: 'Type-safe JavaScript development', price: 89, studentsEnrolled: 412, rating: 4.8 },
                    { id: 'c24', title: 'CSS Grid & Flexbox', description: 'Modern layout techniques', price: 59, studentsEnrolled: 634, rating: 4.7 },
                    { id: 'c25', title: 'Web Performance Optimization', description: 'Speed up your applications', price: 99, studentsEnrolled: 234, rating: 4.6 },
                    { id: 'c26', title: 'Responsive Design Principles', description: 'Mobile-first development', price: 69, studentsEnrolled: 345, rating: 4.7 }
                ],
                certification: ['Google Certified Associate Cloud Engineer', 'Scrum Master Certified', 'AWS Developer Associate'],
                studentSatisfaction: 4.77,
                contentQuality: 4.85,
                teachingStyle: 'Hands-on Labs, Live Coding, Best Practices',
                totalReviews: 3421,
                totalHours: 54,
                languages: ['English', 'Chinese'],
                isVerified: true
            },
            {
                id: '5',
                name: 'Michael Brown',
                email: 'michael.brown@example.com',
                phone: '+1 (555) 567-8901',
                avatar: 'images/users/user10.jpg',
                nationality: 'United States',
                joinDate: '12 May 2023',
                coursesCreated: 4,
                totalStudents: 1066,
                rating: 4.83,
                experience: 11,
                specialization: 'React Development',
                courses: [
                    { id: 'c27', title: 'React Hooks Deep Dive', description: 'Master React Hooks', price: 109, studentsEnrolled: 389, rating: 4.9 },
                    { id: 'c28', title: 'State Management with Redux', description: 'Redux and Redux Toolkit', price: 99, studentsEnrolled: 276, rating: 4.8 },
                    { id: 'c29', title: 'Next.js Full Stack', description: 'Full-stack React apps', price: 129, studentsEnrolled: 234, rating: 4.9 },
                    { id: 'c30', title: 'React Testing Library', description: 'Component testing strategies', price: 79, studentsEnrolled: 167, rating: 4.7 }
                ],
                certification: ['React Advanced', 'JavaScript Expert', 'Redux Specialist'],
                studentSatisfaction: 4.83,
                contentQuality: 4.82,
                teachingStyle: 'Problem-Solving, Code Reviews, Best Practices',
                totalReviews: 2156,
                totalHours: 42,
                languages: ['English', 'French'],
                isVerified: true
            }
        ];

        const mockLearners: Learner[] = [
            {
                id: '101',
                name: 'Sarah Johnson',
                email: 'sarah.j@example.com',
                phone: '+1 (555) 678-9012',
                avatar: 'images/users/user11.jpg',
                joinDate: '01 Feb 2023',
                coursesEnrolled: 3,
                coursesCompleted: 2,
                averageScore: 87.5,
                level: 'Intermediate',
                courses: [
                    { id: 'c20', title: 'React.js Mastery', description: 'Build modern UIs with React', price: 119, studentsEnrolled: 523, rating: 4.9 },
                    { id: 'c24', title: 'CSS Grid & Flexbox', description: 'Modern layout techniques', price: 59, studentsEnrolled: 634, rating: 4.7 },
                    { id: 'c26', title: 'Responsive Design Principles', description: 'Mobile-first development', price: 69, studentsEnrolled: 345, rating: 4.7 }
                ],
                learningGoal: 'Career Switch to Frontend Development',
                totalHoursLearned: 42,
                streak: 15,
                certificates: ['React Fundamentals', 'CSS Mastery'],
                preferredLearningStyle: 'Video + Interactive Exercises',
                languages: ['English'],
                enrolledOn: { 'c20': '15 Jan 2024', 'c24': '22 Jan 2024', 'c26': '01 Feb 2024' },
                progressPercentage: { 'c20': 75, 'c24': 100, 'c26': 60 }
            },
            {
                id: '102',
                name: 'Robert Taylor',
                email: 'robert.t@example.com',
                phone: '+1 (555) 789-0123',
                avatar: 'images/users/user12.jpg',
                joinDate: '15 Feb 2023',
                coursesEnrolled: 5,
                coursesCompleted: 3,
                averageScore: 92.3,
                level: 'Advanced',
                courses: [
                    { id: 'c6', title: 'Python for Data Science', description: 'Complete Python programming guide', price: 89, studentsEnrolled: 567, rating: 4.9 },
                    { id: 'c9', title: 'Machine Learning with Python', description: 'ML algorithms and implementations', price: 129, studentsEnrolled: 345, rating: 4.8 },
                    { id: 'c10', title: 'Database Design', description: 'SQL and NoSQL databases', price: 79, studentsEnrolled: 289, rating: 4.6 },
                    { id: 'c14', title: 'Digital Marketing Fundamentals', description: 'Master digital marketing basics', price: 79, studentsEnrolled: 421, rating: 4.7 },
                    { id: 'c17', title: 'Content Marketing Excellence', description: 'Create engaging content', price: 79, studentsEnrolled: 278, rating: 4.7 }
                ],
                learningGoal: 'Skill Enhancement - Advanced Analytics',
                totalHoursLearned: 156,
                streak: 45,
                certificates: ['Python for Data Science', 'ML Fundamentals', 'Database Design'],
                preferredLearningStyle: 'Hands-on Projects, Real Datasets',
                languages: ['English', 'Japanese'],
                enrolledOn: { 'c6': '05 Dec 2023', 'c9': '12 Dec 2023', 'c10': '18 Dec 2023', 'c14': '02 Jan 2024', 'c17': '15 Jan 2024' },
                progressPercentage: { 'c6': 100, 'c9': 100, 'c10': 85, 'c14': 70, 'c17': 50 }
            },
            {
                id: '103',
                name: 'Lisa Anderson',
                email: 'lisa.a@example.com',
                phone: '+1 (555) 890-1234',
                avatar: 'images/users/user13.jpg',
                joinDate: '20 Feb 2023',
                coursesEnrolled: 2,
                coursesCompleted: 1,
                averageScore: 85.0,
                level: 'Beginner',
                courses: [
                    { id: 'c13', title: 'Docker & Kubernetes', description: 'Container orchestration', price: 119, studentsEnrolled: 276, rating: 4.8 },
                    { id: 'c25', title: 'Web Performance Optimization', description: 'Speed up your applications', price: 99, studentsEnrolled: 234, rating: 4.6 }
                ],
                learningGoal: 'AWS Certification Preparation',
                totalHoursLearned: 28,
                streak: 8,
                certificates: ['Docker Basics'],
                preferredLearningStyle: 'Video Tutorials, Hands-on Labs',
                languages: ['English', 'Portuguese'],
                enrolledOn: { 'c13': '10 Jan 2024', 'c25': '28 Jan 2024' },
                progressPercentage: { 'c13': 100, 'c25': 65 }
            },
            {
                id: '104',
                name: 'David Martinez',
                email: 'david.m@example.com',
                phone: '+1 (555) 901-2345',
                avatar: 'images/users/user1.jpg',
                joinDate: '25 Feb 2023',
                coursesEnrolled: 4,
                coursesCompleted: 2,
                averageScore: 88.7,
                level: 'Intermediate',
                courses: [
                    { id: 'c7', title: 'Full Stack Web Development', description: 'Frontend + Backend mastery', price: 139, studentsEnrolled: 423, rating: 4.8 },
                    { id: 'c8', title: 'Django REST Framework', description: 'Build powerful APIs', price: 99, studentsEnrolled: 234, rating: 4.7 },
                    { id: 'c22', title: 'Angular Advanced Patterns', description: 'Enterprise Angular development', price: 129, studentsEnrolled: 198, rating: 4.8 },
                    { id: 'c23', title: 'TypeScript Mastery', description: 'Type-safe JavaScript development', price: 89, studentsEnrolled: 412, rating: 4.8 }
                ],
                learningGoal: 'Career Switch to Full Stack Developer',
                totalHoursLearned: 87,
                streak: 12,
                certificates: ['Full Stack Basics', 'Django Fundamentals'],
                preferredLearningStyle: 'Mix of Video and Coding Projects',
                languages: ['English', 'German'],
                enrolledOn: { 'c7': '08 Dec 2023', 'c8': '15 Dec 2023', 'c22': '22 Dec 2023', 'c23': '29 Dec 2023' },
                progressPercentage: { 'c7': 100, 'c8': 100, 'c22': 55, 'c23': 40 }
            },
            {
                id: '105',
                name: 'Jennifer Lee',
                email: 'jennifer.l@example.com',
                phone: '+1 (555) 012-3456',
                avatar: 'images/users/user2.jpg',
                joinDate: '01 Mar 2023',
                coursesEnrolled: 6,
                coursesCompleted: 5,
                averageScore: 94.2,
                level: 'Advanced',
                courses: [
                    { id: 'c1', title: 'Advanced Cybersecurity Fundamentals', description: 'Master advanced security concepts', price: 99, studentsEnrolled: 245, rating: 4.8 },
                    { id: 'c15', title: 'SEO Mastery 2024', description: 'Advanced search optimization', price: 99, studentsEnrolled: 356, rating: 4.8 },
                    { id: 'c16', title: 'Social Media Strategy', description: 'Grow your social presence', price: 89, studentsEnrolled: 234, rating: 4.6 },
                    { id: 'c27', title: 'React Hooks Deep Dive', description: 'Master React Hooks', price: 109, studentsEnrolled: 389, rating: 4.9 },
                    { id: 'c28', title: 'State Management with Redux', description: 'Redux and Redux Toolkit', price: 99, studentsEnrolled: 276, rating: 4.8 },
                    { id: 'c29', title: 'Next.js Full Stack', description: 'Full-stack React apps', price: 129, studentsEnrolled: 234, rating: 4.9 }
                ],
                learningGoal: 'Multi-skill Development for Career Growth',
                totalHoursLearned: 234,
                streak: 89,
                certificates: ['Cybersecurity Basics', 'Marketing Fundamentals', 'React Advanced', 'Next.js Mastery'],
                preferredLearningStyle: 'Project-based, Real-world Scenarios',
                languages: ['English', 'Mandarin'],
                enrolledOn: { 'c1': '01 Oct 2023', 'c15': '08 Oct 2023', 'c16': '20 Oct 2023', 'c27': '01 Nov 2023', 'c28': '15 Nov 2023', 'c29': '01 Dec 2023' },
                progressPercentage: { 'c1': 100, 'c15': 100, 'c16': 100, 'c27': 100, 'c28': 100, 'c29': 90 }
            },
            {
                id: '106',
                name: 'Chris Thompson',
                email: 'chris.t@example.com',
                phone: '+1 (555) 123-4560',
                avatar: 'images/users/user3.jpg',
                joinDate: '10 Mar 2023',
                coursesEnrolled: 3,
                coursesCompleted: 1,
                averageScore: 81.5,
                level: 'Beginner',
                courses: [
                    { id: 'c2', title: 'Network Penetration Testing', description: 'Learn ethical hacking techniques', price: 129, studentsEnrolled: 189, rating: 4.7 },
                    { id: 'c11', title: 'FastAPI Modern Development', description: 'High-performance APIs', price: 109, studentsEnrolled: 167, rating: 4.7 },
                    { id: 'c30', title: 'React Testing Library', description: 'Component testing strategies', price: 79, studentsEnrolled: 167, rating: 4.7 }
                ],
                learningGoal: 'Build Professional Skills',
                totalHoursLearned: 35,
                streak: 5,
                certificates: ['Network Basics'],
                preferredLearningStyle: 'Video with Coding Assignments',
                languages: ['English'],
                enrolledOn: { 'c2': '18 Feb 2024', 'c11': '25 Feb 2024', 'c30': '03 Mar 2024' },
                progressPercentage: { 'c2': 100, 'c11': 45, 'c30': 20 }
            }
        ];

        this.instructorsSubject.next(mockInstructors);
        this.learnersSubject.next(mockLearners);
    }

    getInstructors(): Observable<Instructor[]> {
        return this.instructors$;
    }

    getLearners(): Observable<Learner[]> {
        return this.learners$;
    }

    deleteInstructor(id: string): void {
        const currentInstructors = this.instructorsSubject.value;
        const updatedInstructors = currentInstructors.filter(instructor => instructor.id !== id);
        this.instructorsSubject.next(updatedInstructors);
    }

    deleteLearner(id: string): void {
        const currentLearners = this.learnersSubject.value;
        const updatedLearners = currentLearners.filter(learner => learner.id !== id);
        this.learnersSubject.next(updatedLearners);
    }

    searchInstructors(searchTerm: string): Observable<Instructor[]> {
        return new Observable(subscriber => {
            this.instructors$.subscribe(instructors => {
                if (!searchTerm.trim()) {
                    subscriber.next(instructors);
                } else {
                    const searchLower = searchTerm.toLowerCase().trim();
                    const filteredInstructors = instructors.filter(instructor =>
                        instructor.name.toLowerCase().includes(searchLower)
                    );
                    subscriber.next(filteredInstructors);
                }
            });
        });
    }

    searchLearners(searchTerm: string): Observable<Learner[]> {
        return new Observable(subscriber => {
            this.learners$.subscribe(learners => {
                if (!searchTerm.trim()) {
                    subscriber.next(learners);
                } else {
                    const searchLower = searchTerm.toLowerCase().trim();
                    const filteredLearners = learners.filter(learner =>
                        learner.name.toLowerCase().includes(searchLower)
                    );
                    subscriber.next(filteredLearners);
                }
            });
        });
    }
}
