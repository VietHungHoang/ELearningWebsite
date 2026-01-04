import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToggleService } from '../../common/header/toggle.service';

@Component({
    selector: 'app-forgot-password',
    imports: [RouterLink],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

    constructor(
        public toggleService: ToggleService
    ) {}

    ngOnInit(): void {

        this.toggleService.initializeTheme();
    }

    toggleDirection() {
        this.toggleService.toggleDirection();
    }

}