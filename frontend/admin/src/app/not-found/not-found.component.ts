import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToggleService } from '../common/header/toggle.service';

@Component({
    selector: 'app-not-found',
    imports: [RouterLink],
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

    constructor(
        public toggleService: ToggleService
    ) {}

    ngOnInit(): void {

        this.toggleService.initializeTheme();
    }

    toggleTheme() {
        this.toggleService.toggleTheme();
    }

    toggleDirection() {
        this.toggleService.toggleDirection();
    }

}