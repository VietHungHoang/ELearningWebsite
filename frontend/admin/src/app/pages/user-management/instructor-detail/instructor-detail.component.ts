import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, Instructor } from '../../../services/user.service';
import { CourseService, Course } from '../../../services/course.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-instructor-detail',
    standalone: true,
    imports: [RouterLink, CommonModule, FormsModule],
    providers: [UserService, CourseService],
    templateUrl: './instructor-detail.component.html',
    styleUrl: './instructor-detail.component.scss'
})
export class InstructorDetailComponent implements OnInit, OnDestroy {
    Math = Math;
    instructorId: string = '';
    instructor: Instructor | null = null;
    instructorCourses: Course[] = [];
    isLoading = true;
    errorMessage = '';
    private destroy$ = new Subject<void>();

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
                this.instructorId = params.get('id') || '';
                if (this.instructorId) {
                    this.loadInstructor();
                } else {
                    this.errorMessage = 'No instructor ID provided';
                    this.isLoading = false;
                }
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadInstructor(): void {
        this.isLoading = true;
        this.userService.getInstructors()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (instructors) => {
                    this.instructor = instructors.find(i => i.id === this.instructorId) || null;
                    if (this.instructor) {
                        this.loadInstructorCourses();
                    } else {
                        this.errorMessage = 'Instructor not found';
                        this.isLoading = false;
                    }
                },
                error: (error) => {
                    console.error('Error loading instructor:', error);
                    this.errorMessage = 'Failed to load instructor details';
                    this.isLoading = false;
                }
            });
    }

    loadInstructorCourses(): void {
        this.courseService.getCourses()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (courses) => {

                    this.instructorCourses = courses.filter(course =>
                        course.instructor.name === this.instructor?.name
                    );
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Error loading instructor courses:', error);
                    this.isLoading = false;
                }
            });
    }

    getTotalStudents(): number {
        return this.instructorCourses.reduce((total, course) => total + course.enrolled, 0);
    }

    toggleEditMode(): void {
        this.isEditing = !this.isEditing;

        if (this.isEditing && this.instructor) {
            this.initializeEditedValues();
        }
    }

    private initializeEditedValues(): void {
        if (!this.instructor) return;

        this.editedValues = {
            email: this.instructor.email,
            phone: this.instructor.phone,
            experience: this.instructor.experience,
            nationality: this.instructor.nationality,
            joinDate: this.instructor.joinDate,
            teachingStyle: this.instructor.teachingStyle,
            languages: this.instructor.languages?.join(', ') || '',
            specialization: this.instructor.specialization,
            rating: this.instructor.rating,
            totalReviews: this.instructor.totalReviews || 0,
            totalHours: this.instructor.totalHours || 0,
            coursesCount: this.instructorCourses.length,
            totalStudents: this.getTotalStudents(),
            certification: this.instructor.certification?.join(', ') || ''
        };
    }

    saveAllFields(): void {
        if (!this.instructor) return;

        this.instructor.email = this.editedValues['email'];
        this.instructor.phone = this.editedValues['phone'];
        this.instructor.experience = parseInt(this.editedValues['experience'], 10);
        this.instructor.nationality = this.editedValues['nationality'];
        this.instructor.joinDate = this.editedValues['joinDate'];
        this.instructor.teachingStyle = this.editedValues['teachingStyle'];
        this.instructor.languages = this.editedValues['languages'].split(',').map((lang: string) => lang.trim());
        this.instructor.specialization = this.editedValues['specialization'];
        this.instructor.rating = parseFloat(this.editedValues['rating']);
        this.instructor.totalReviews = parseInt(this.editedValues['totalReviews'], 10);
        this.instructor.totalHours = parseInt(this.editedValues['totalHours'], 10);
        this.instructor.coursesCreated = parseInt(this.editedValues['coursesCount'], 10);
        this.instructor.totalStudents = parseInt(this.editedValues['totalStudents'], 10);
        this.instructor.certification = this.editedValues['certification'].split(',').map((cert: string) => cert.trim()).filter((cert: string) => cert.length > 0);

        this.isEditing = false;
    }

    cancelEdit(): void {
        this.isEditing = false;
        this.editedValues = {};
    }
}
