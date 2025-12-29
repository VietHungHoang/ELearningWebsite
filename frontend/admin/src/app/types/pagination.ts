/**
 * Interface for Spring Boot Pageable response
 * Maps to Spring's Page<T> structure
 */
export interface PaginatedResponse<T> {
    content: T[]; // Array of items (Java standard naming)
    pageable: {
        pageNumber: number; // Current page number (0-based)
        pageSize: number; // Page size
        offset: number; // Offset from start
        paged: boolean; // Whether pagination is enabled
    };
    totalPages: number; // Total number of pages
    totalElements: number; // Total number of elements
    last: boolean; // Whether this is the last page
    first: boolean; // Whether this is the first page
    numberOfElements: number; // Number of elements in current page
    size: number; // Page size
    number: number; // Current page number (0-based)
    empty: boolean; // Whether the page is empty
}

