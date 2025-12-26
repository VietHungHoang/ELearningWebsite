import { Component } from '@angular/core';
import { TotalMentorsService } from './total-mentors.service';

@Component({
    selector: 'app-total-mentors',
    imports: [],
    templateUrl: './total-mentors.component.html',
    styleUrl: './total-mentors.component.scss'
})
export class TotalMentorsComponent {

    constructor(
        private totalMentorsService: TotalMentorsService
    ) {}

    ngOnInit(): void {
        this.totalMentorsService.loadChart();
    }

}
