import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, timeout, tap, map } from 'rxjs/operators';
import { ApiResponse } from '../types/ApiResponse.js';  // import từ file bạn vừa tạo

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private apiUrl = 'http://localhost:4200/api/v1/admin';
    private readonly API_TIMEOUT = 5000;

    private isLoadingSubject = new BehaviorSubject<boolean>(false);
    public isLoading$ = this.isLoadingSubject.asObservable();

    private successMessageSubject = new BehaviorSubject<string | null>(null);
    public successMessage$ = this.successMessageSubject.asObservable();

    private errorMessageSubject = new BehaviorSubject<string | null>(null);
    public errorMessage$ = this.errorMessageSubject.asObservable();

    private lastStatusSubject = new BehaviorSubject<'idle' | 'loading' | 'success' | 'error'>('idle');
    public lastStatus$ = this.lastStatusSubject.asObservable();

    constructor(private http: HttpClient) {}

    private setLoading(v: boolean) { this.isLoadingSubject.next(v); }
    private setSuccess(msg: string | null) { this.successMessageSubject.next(msg); }
    private setError(msg: string | null) { this.errorMessageSubject.next(msg); }
    private setStatus(s: 'idle' | 'loading' | 'success' | 'error') { this.lastStatusSubject.next(s); }

    public clearMessages(): void {
        this.setSuccess(null);
        this.setError(null);
    }

    private handleRequest<T>(req: Observable<ApiResponse<T>>): Observable<ApiResponse<T>> {
        this.setLoading(true);
        this.setStatus('loading');

        return req.pipe(
            timeout(this.API_TIMEOUT),
            tap(res => {
                if (res.success === true) {
                    this.setSuccess(res.message ?? 'Success');
                    this.setStatus('success');
                } else {
                    this.setError(res.message ?? 'Operation failed');
                    this.setStatus('error');
                }
                this.setLoading(false);
            }),
            catchError(error => {
                console.error('[API ERROR]', error);
                this.setError(error.message || 'Unexpected API error');
                this.setStatus('error');
                this.setLoading(false);
                // Return error response
                return of({
                    status: 500,
                    success: false,
                    message: error.message || 'Unexpected API error',
                    data: undefined
                } as ApiResponse<T>);
            })
        );
    }

    get<T>(endpoint: string, params?: any): Observable<ApiResponse<T>> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] != null) {
                    httpParams = httpParams.set(key, params[key]);
                }
            });
        }
        return this.handleRequest<T>(
            this.http.get<ApiResponse<T>>(`${this.apiUrl}${endpoint}`, { params: httpParams })
        );
    }

    post<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
        return this.handleRequest<T>(
            this.http.post<ApiResponse<T>>(`${this.apiUrl}${endpoint}`, body)
        );
    }

    patch<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
        return this.handleRequest<T>(
            this.http.patch<ApiResponse<T>>(`${this.apiUrl}${endpoint}`, body)
        );
    }

    delete<T>(endpoint: string): Observable<ApiResponse<T>> {
        return this.handleRequest<T>(
            this.http.delete<ApiResponse<T>>(`${this.apiUrl}${endpoint}`)
        );
    }
}
