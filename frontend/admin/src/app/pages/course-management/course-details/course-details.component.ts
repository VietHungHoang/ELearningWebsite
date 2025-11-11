import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TablesOfContentComponent } from './tables-of-content/tables-of-content.component';
import { UserService, Instructor } from '../../../services/user.service';

@Component({
    selector: 'app-course-details',
    standalone: true,
    imports: [RouterLink, CommonModule, TablesOfContentComponent],
    templateUrl: './course-details.component.html',
    styleUrl: './course-details.component.scss'
})
export class CourseDetailsComponent implements OnInit {
    courseId: string = '';
    instructors: Instructor[] = [];
    selectedInstructor: Instructor | null = null;
    showInstructorModal = false;

    constructor(private route: ActivatedRoute, private userService: UserService) {}

    ngOnInit() {
        this.courseId = this.route.snapshot.paramMap.get('id') || '';
        console.log('Course ID:', this.courseId);

        this.userService.getInstructors().subscribe(instructors => {
            this.instructors = instructors;
        });
    }

    viewInstructor(instructorId: string): void {
        const instructor = this.instructors.find(i => i.id === instructorId);
        if (instructor) {
            this.selectedInstructor = instructor;
            this.showInstructorModal = true;
        }
    }

    closeInstructorModal(): void {
        this.showInstructorModal = false;
        this.selectedInstructor = null;
    }
}
