import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, timeout, tap, map } from 'rxjs/operators';
import { ApiResponse } from '../types/ApiResponse.js';  // import từ file bạn vừa tạo
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private apiUrl = `${environment.apiUrl}/v1/admin`;
    private publicCommonApiUrl = `${environment.apiUrl}/v1/public/common`;
    private authApiUrl = `${environment.apiUrl}/v1/auth`;
    private readonly API_TIMEOUT = 30000; // Tăng lên 30s để debug

    private isLoadingSubject = new BehaviorSubject<boolean>(false);
    public isLoading$ = this.isLoadingSubject.asObservable();

    private successMessageSubject = new BehaviorSubject<string | null>(null);
    public successMessage$ = this.successMessageSubject.asObservable();

    private errorMessageSubject = new BehaviorSubject<string | null>(null);
    public errorMessage$ = this.errorMessageSubject.asObservable();

    private lastStatusSubject = new BehaviorSubject<'idle' | 'loading' | 'success' | 'error'>('idle');
    public lastStatus$ = this.lastStatusSubject.asObservable();

    constructor(private http: HttpClient) { }

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
            // Temporarily disable tap to test if it's causing issues
            // tap(res => {
            //     if (res.success === true) {
            //         this.setSuccess(res.message ?? 'Success');
            //         this.setStatus('success');
            //     } else {
            //         this.setError(res.message ?? 'Operation failed');
            //         this.setStatus('error');
            //     }
            //     this.setLoading(false);
            // }),
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
        const url = `${this.apiUrl}${endpoint}`;
        console.log('[ApiService] GET request:', url, 'params:', httpParams.toString());
        return this.handleRequest<T>(
            this.http.get<ApiResponse<T>>(url, { params: httpParams })
        );
    }

    post<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
        return this.handleRequest<T>(
            this.http.post<ApiResponse<T>>(`${this.apiUrl}${endpoint}`, body)
        );
    }

    put<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
        return this.handleRequest<T>(
            this.http.put<ApiResponse<T>>(`${this.apiUrl}${endpoint}`, body)
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

    /**
     * Download binary file (e.g., PDF) from API
     * @param endpoint API endpoint
     * @returns Observable of Blob
     */
    getBlob(endpoint: string): Observable<Blob> {
        const url = `${this.apiUrl}${endpoint}`;
        console.log('[ApiService] GET Blob request:', url);
        return this.http.get(url, { responseType: 'blob' });
    }

    // Common API methods (using Public Common API)
    getCommon<T>(endpoint: string, params?: any): Observable<ApiResponse<T>> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== null && params[key] !== undefined) {
                    httpParams = httpParams.set(key, params[key].toString());
                }
            });
        }
        const url = `${this.publicCommonApiUrl}${endpoint}`;
        console.log('🚀 [ApiService] GET public common request:', url, 'params:', httpParams.toString());
        return this.handleRequest<T>(
            this.http.get<ApiResponse<T>>(url, { params: httpParams })
        );
    }

    postCommon<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
        return this.handleRequest<T>(
            this.http.post<ApiResponse<T>>(`${this.publicCommonApiUrl}${endpoint}`, body)
        );
    }

    putCommon<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
        return this.handleRequest<T>(
            this.http.put<ApiResponse<T>>(`${this.publicCommonApiUrl}${endpoint}`, body)
        );
    }

    patchCommon<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
        return this.handleRequest<T>(
            this.http.patch<ApiResponse<T>>(`${this.publicCommonApiUrl}${endpoint}`, body)
        );
    }

    deleteCommon<T>(endpoint: string): Observable<ApiResponse<T>> {
        return this.handleRequest<T>(
            this.http.delete<ApiResponse<T>>(`${this.publicCommonApiUrl}${endpoint}`)
        );
    }

    // Auth API methods (using Auth API)
    getAuth<T>(endpoint: string, params?: any): Observable<ApiResponse<T>> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== null && params[key] !== undefined) {
                    httpParams = httpParams.set(key, params[key].toString());
                }
            });
        }
        const url = `${this.authApiUrl}${endpoint}`;
        console.log('🔐 [ApiService] GET auth request:', url, 'params:', httpParams.toString());
        return this.handleRequest<T>(
            this.http.get<ApiResponse<T>>(url, { params: httpParams })
        );
    }

    postAuth<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
        return this.handleRequest<T>(
            this.http.post<ApiResponse<T>>(`${this.authApiUrl}${endpoint}`, body)
        );
    }

    putAuth<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
        return this.handleRequest<T>(
            this.http.put<ApiResponse<T>>(`${this.authApiUrl}${endpoint}`, body)
        );
    }

    patchAuth<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
        return this.handleRequest<T>(
            this.http.patch<ApiResponse<T>>(`${this.authApiUrl}${endpoint}`, body)
        );
    }

    deleteAuth<T>(endpoint: string): Observable<ApiResponse<T>> {
        return this.handleRequest<T>(
            this.http.delete<ApiResponse<T>>(`${this.authApiUrl}${endpoint}`)
        );
    }

    // Public Common API methods
    getPublicCommon<T>(endpoint: string, params?: any): Observable<ApiResponse<T>> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== null && params[key] !== undefined) {
                    httpParams = httpParams.set(key, params[key].toString());
                }
            });
        }
        const url = `${this.publicCommonApiUrl}${endpoint}`;
        console.log('🚀 [ApiService] GET public common START:', url, 'params:', httpParams.toString());

        const request = this.http.get<ApiResponse<T>>(url, { params: httpParams }).pipe(
            tap(response => {
                console.log('✅ [ApiService] Raw HTTP response:', response);
                console.log('🔍 [ApiService] Response analysis:', {
                    status: response.status,
                    success: response.success,
                    message: response.message,
                    hasData: 'data' in response,
                    dataType: typeof response.data,
                    dataValue: response.data
                });
            }),
            catchError(err => {
                console.error('❌ [ApiService] Request failed:', url, err);
                throw err;
            })
        );
        return this.handleRequest<T>(request);
    }
}
