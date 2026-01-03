import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToggleService } from '../../common/header/toggle.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-sign-in',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
    email: string = '';
    password: string = '';
    isPasswordVisible: boolean = false;
    isLoading: boolean = false;
    errorMessage: string = '';

    constructor(
        public toggleService: ToggleService,
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.toggleService.initializeTheme();

        // If already logged in, redirect to dashboard
        if (this.authService.isAuthenticated()) {
            this.router.navigate(['/dashboard']);
        }
    }

    toggleTheme() {
        this.toggleService.toggleTheme();
    }

    togglePasswordVisibility(): void {
        this.isPasswordVisible = !this.isPasswordVisible;
    }

    onSubmit(): void {
        // Reset error message
        this.errorMessage = '';

        // Validate inputs
        if (!this.email || !this.password) {
            this.errorMessage = 'Vui lòng nhập email và mật khẩu';
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.email)) {
            this.errorMessage = 'Email không hợp lệ';
            return;
        }

        // Start loading
        this.isLoading = true;

        // Call login service
        this.authService.login(this.email, this.password).subscribe({
            next: (success) => {
                this.isLoading = false;
                if (success) {
                    // Login successful, redirect to dashboard
                    this.router.navigate(['/dashboard']);
                } else {
                    this.errorMessage = 'Email hoặc mật khẩu không đúng';
                }
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại';
                console.error('Login error:', error);
            }
        });
    }
}
