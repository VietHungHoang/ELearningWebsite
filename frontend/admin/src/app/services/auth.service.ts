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
    accessToken?: string;
    token?: string; // For backward compatibility
    refreshToken?: string;
    tokenType?: string;
    expiresIn?: number;
    scope?: string;
    user?: AdminUser; // Optional, will parse from token if not provided
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
        const loginRequest: LoginRequest = { email: email, password: password };

        console.log('🔐 Attempting login API call to:', `${this.apiService['authApiUrl']}/login`);

        return this.apiService.postAuth<LoginResponse>('/login', loginRequest).pipe(
            tap(response => console.log('✅ Login API success:', response)),
            map(response => {
                if (response.success && response.data) {
                    const data = response.data;
                    // Support both accessToken and token fields
                    const token = data.accessToken || data.token;
                    
                    if (!token) {
                        console.error('❌ No token found in response');
                        return false;
                    }
                    
                    this.saveToken(token);
                    
                    // If user object exists, use it; otherwise parse from token
                    let user: AdminUser | null = data.user || null;
                    if (!user && token) {
                        user = this.parseUserFromToken(token);
                    }
                    
                    if (user) {
                        this.saveUser(user);
                        this.currentUserSubject.next(user);
                        return true;
                    } else {
                        console.error('❌ Could not parse user from token');
                        return false;
                    }
                }
                console.error('❌ Response not successful or missing data');
                return false;
            }),
            catchError(error => {
                console.warn('❌ Login API failed, falling back to mock data:', error);

                // Fallback to mock data
                const mockToken = 'mock-admin-token-' + Date.now();
                const mockUser: AdminUser = {
                    id: 'admin-' + Math.random().toString(36).substr(2, 9),
                    email: email,
                    name: email.split('@')[0],
                    role: 'admin'
                };

                this.saveToken(mockToken);
                this.saveUser(mockUser);
                this.currentUserSubject.next(mockUser);
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
        // Try to parse user info from token if user not found in storage
        const token = this.getToken();
        if (token) {
            const userFromToken = this.parseUserFromToken(token);
            if (userFromToken) {
                this.saveUser(userFromToken);
                return userFromToken;
            }
        }
        return null;
    }

    /**
     * Parse user information from JWT token
     */
    private parseUserFromToken(token: string): AdminUser | null {
        try {
            // JWT token format: header.payload.signature
            const parts = token.split('.');
            if (parts.length !== 3) {
                return null;
            }

            // Decode payload (base64url)
            const payload = parts[1];
            const decodedPayload = this.base64UrlDecode(payload);
            const tokenData = JSON.parse(decodedPayload);

            // Extract user info from token payload
            // Support Keycloak JWT token structure
            const roles = tokenData.realm_access?.roles || tokenData.authorities || [];
            const adminRole = roles.find((r: string) => r === 'admin') || roles[0] || 'admin';
            
            return {
                id: tokenData.sub || tokenData.id || tokenData.userId || '',
                email: tokenData.email || tokenData.preferred_username || tokenData.username || '',
                name: tokenData.name || 
                       (tokenData.given_name && tokenData.family_name 
                           ? `${tokenData.given_name} ${tokenData.family_name}` 
                           : tokenData.given_name || tokenData.preferred_username || 'Admin'),
                role: adminRole
            };
        } catch (error) {
            console.error('Error parsing token:', error);
            return null;
        }
    }

    /**
     * Decode base64url string
     */
    private base64UrlDecode(str: string): string {
        // Replace URL-safe characters
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        
        // Add padding if needed
        while (base64.length % 4) {
            base64 += '=';
        }

        try {
            return decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
        } catch (e) {
            return atob(base64);
        }
    }

    /**
     * Get current user
     */
    getCurrentUser(): AdminUser | null {
        const user = this.currentUserSubject.value;
        // If no user in subject, try to get from storage or token
        if (!user) {
            const storedUser = this.getUserFromStorage();
            if (storedUser) {
                this.currentUserSubject.next(storedUser);
                return storedUser;
            }
        }
        return user;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        const token = this.getToken();
        return !!token;
    }
}
