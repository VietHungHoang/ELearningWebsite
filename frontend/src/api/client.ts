import type { ApiResponse } from "../types";

// Default headers
const defaultHeaders = {
    "Content-Type": "application/json",
};

// Generic API client
class ApiClient {
    private async request<T>(baseURL: string, endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
        const url = `${baseURL}${endpoint}`;

        const config: RequestInit = {
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ApiResponse<T> = await response.json();
            return data;
        } catch (error) {
            console.error("API request failed:", error);
            throw error;
        }
    }

    // GET request
    async get<T>(baseURL: string, endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
        return this.request<T>(baseURL, endpoint, {
            method: "GET",
            headers,
        });
    }

    // POST request
    async post<T>(baseURL: string, endpoint: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
        return this.request<T>(baseURL, endpoint, {
            method: "POST",
            headers,
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    // PUT request
    async put<T>(baseURL: string, endpoint: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
        return this.request<T>(baseURL, endpoint, {
            method: "PUT",
            headers,
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    // DELETE request
    async delete<T>(baseURL: string, endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
        return this.request<T>(baseURL, endpoint, {
            method: "DELETE",
            headers,
        });
    }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
