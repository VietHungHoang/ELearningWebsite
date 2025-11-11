import { Component } from '@angular/core';
import { TotalCoursesService } from './total-courses.service';

@Component({
    selector: 'app-total-courses',
    imports: [],
    templateUrl: './total-courses.component.html',
    styleUrl: './total-courses.component.scss'
})
export class TotalCoursesComponent {

    constructor(
        private totalCoursesService: TotalCoursesService
    ) {}

    ngOnInit(): void {
        this.totalCoursesService.loadChart();
    }

}
