import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, Learner } from '../../../services/user.service';
import { CourseService, Course } from '../../../services/course.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-learner-detail',
    standalone: true,
    imports: [RouterLink, CommonModule, FormsModule],
    providers: [UserService, CourseService],
    templateUrl: './learner-detail.component.html',
    styleUrl: './learner-detail.component.scss'
})
export class LearnerDetailComponent implements OnInit, OnDestroy {
    learnerId: string = '';
    learner: Learner | null = null;
    enrolledCourses: Course[] = [];
    isLoading = true;
    errorMessage = '';
    private destroy$ = new Subject<void>();
    Object = Object; 

    isEditing = false;

    editedValues: { [key: string]: any } = {};

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private courseService: CourseService
    ) {}

    ngOnInit() {
        this.route.paramMap
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
                this.learnerId = params.get('id') || '';
                if (this.learnerId) {
                    this.loadLearner();
                } else {
                    this.errorMessage = 'No learner ID provided';
                    this.isLoading = false;
                }
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadLearner(): void {
        this.isLoading = true;
        this.userService.getLearners()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (learners) => {
                    this.learner = learners.find(l => l.id === this.learnerId) || null;
                    if (this.learner) {
                        this.loadEnrolledCourses();
                    } else {
                        this.errorMessage = 'Learner not found';
                        this.isLoading = false;
                    }
                },
                error: (error) => {
                    console.error('Error loading learner:', error);
                    this.errorMessage = 'Failed to load learner details';
                    this.isLoading = false;
                }
            });
    }

    loadEnrolledCourses(): void {
        if (this.learner?.courses) {

            this.enrolledCourses = this.learner.courses.map(course => ({
                id: course.id,
                name: course.title,
                category: 'General', 
                instructor: {
                    name: 'Unknown Instructor', 
                    avatar: 'images/users/default.jpg'
                },
                enrolled: course.studentsEnrolled,
                startDate: 'N/A', 
                lessons: 0, 
                price: `$${course.price}`,
                rating: course.rating, 
                status: 'approved' as const
            }));

            this.courseService.getCourses()
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (courses) => {
                        this.enrolledCourses = this.enrolledCourses.map(enrolledCourse => {
                            const fullCourse = courses.find(c => c.id === enrolledCourse.id);
                            if (fullCourse) {
                                return {
                                    ...enrolledCourse,
                                    category: fullCourse.category,
                                    instructor: fullCourse.instructor,
                                    startDate: fullCourse.startDate,
                                    lessons: fullCourse.lessons
                                };
                            }
                            return enrolledCourse;
                        });
                        this.isLoading = false;
                    },
                    error: () => {

                        this.isLoading = false;
                    }
                });
        } else {
            this.isLoading = false;
        }
    }

    toggleEditMode(): void {
        this.isEditing = !this.isEditing;

        if (this.isEditing && this.learner) {
            this.initializeEditedValues();
        }
    }

    private initializeEditedValues(): void {
        if (!this.learner) return;

        this.editedValues = {
            email: this.learner.email,
            phone: this.learner.phone,
            joinDate: this.learner.joinDate,
            level: this.learner.level || '',
            learningGoal: this.learner.learningGoal || '',
            languages: this.learner.languages?.join(', ') || '',
            certificates: this.learner.certificates?.join(', ') || ''
        };
    }

    saveAllFields(): void {
        if (!this.learner) return;

        this.learner.email = this.editedValues['email'];
        this.learner.phone = this.editedValues['phone'];
        this.learner.joinDate = this.editedValues['joinDate'];
        this.learner.level = this.editedValues['level'];
        this.learner.learningGoal = this.editedValues['learningGoal'];
        this.learner.languages = this.editedValues['languages'].split(',').map((lang: string) => lang.trim()).filter((lang: string) => lang.length > 0);
        this.learner.certificates = this.editedValues['certificates'].split(',').map((cert: string) => cert.trim()).filter((cert: string) => cert.length > 0);

        this.isEditing = false;
    }

    cancelEdit(): void {
        this.isEditing = false;
        this.editedValues = {};
    }
}
