import { Component } from '@angular/core';
import { TotalMentorsComponent } from './total-mentors/total-mentors.component';
import { StudentsInterestedTopicsComponent } from './students-interested-topics/students-interested-topics.component';
import { TopInstructorsComponent } from './top-instructors/top-instructors.component';
import { TotalCoursesComponent } from './total-courses/total-courses.component';
import { TotalSalesComponent } from './total-sales/total-sales.component';
import { OnlineClassesComponent } from "./online-classes/online-classes.component";
import { TotalStudentsComponent } from "./total-students/total-students.component";

@Component({
    selector: 'app-overview',
    imports: [TotalCoursesComponent, TotalSalesComponent, TotalMentorsComponent, StudentsInterestedTopicsComponent, TopInstructorsComponent, OnlineClassesComponent, TotalStudentsComponent],
    templateUrl: './overview.component.html',
    styleUrl: './overview.component.scss'
})
export class OverviewComponent {
    // Each child component handles its own API calls
    // No need to load data here anymore
}
