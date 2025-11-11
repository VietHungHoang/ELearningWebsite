import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-course-management',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './course-management.component.html',
    styleUrl: './course-management.component.scss'
})
export class CourseManagementComponent {}
