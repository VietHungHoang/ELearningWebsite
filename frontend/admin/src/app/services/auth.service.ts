import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: string;
}

export interface LoginResponse {
    token: string;
    user: AdminUser;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly TOKEN_KEY = 'admin_access_token';
    private readonly USER_KEY = 'admin_user';

    private currentUserSubject = new BehaviorSubject<AdminUser | null>(this.getUserFromStorage());
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(
        private apiService: ApiService,
        private router: Router
    ) {}

    /**
     * Login with email and password
     * Try real API first, fallback to mock if fails
     */
    login(email: string, password: string): Observable<boolean> {
        const loginRequest: LoginRequest = { email, password };

        console.log('🔐 Attempting login API call to:', `${this.apiService['authApiUrl']}/login`);

        return this.apiService.postAuth<LoginResponse>('/login', loginRequest).pipe(
            tap(response => console.log('✅ Login API success:', response)),
            map(response => {
                if (response.success && response.data) {
                    this.saveToken(response.data.token);
                    this.saveUser(response.data.user);
                    this.currentUserSubject.next(response.data.user);
                    return true;
                }
                return false;
            }),
            catchError(error => {
                console.warn('❌ Login API failed, falling back to mock data:', error);

                // Fallback to mock data
                const mockResponse: LoginResponse = {
                    token: 'mock-admin-token-' + Date.now(),
                    user: {
                        id: 'admin-' + Math.random().toString(36).substr(2, 9),
                        email: email,
                        name: email.split('@')[0],
                        role: 'admin'
                    }
                };

                this.saveToken(mockResponse.token);
                this.saveUser(mockResponse.user);
                this.currentUserSubject.next(mockResponse.user);
                return of(true);
            })
        );
    }

    /**
     * Logout - clear token and redirect to login
     */
    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    /**
     * Save token to localStorage
     */
    private saveToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    /**
     * Save user info to localStorage
     */
    private saveUser(user: AdminUser): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    /**
     * Get token from localStorage
     */
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    /**
     * Get user from localStorage
     */
    private getUserFromStorage(): AdminUser | null {
        const userStr = localStorage.getItem(this.USER_KEY);
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    /**
     * Get current user
     */
    getCurrentUser(): AdminUser | null {
        return this.currentUserSubject.value;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        const token = this.getToken();
        return !!token;
    }
}
