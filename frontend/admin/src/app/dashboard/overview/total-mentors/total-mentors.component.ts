import { Component } from '@angular/core';
import { TotalMentorsService } from './total-mentors.service';
import { TranslatePipe } from '../../../i18n/translate.pipe';

@Component({
    selector: 'app-total-mentors',
    imports: [TranslatePipe],
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
