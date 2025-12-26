import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToggleService } from '../../common/header/toggle.service';

@Component({
    selector: 'app-logout',
    imports: [RouterLink],
    templateUrl: './logout.component.html',
    styleUrl: './logout.component.scss'
})
export class LogoutComponent {

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