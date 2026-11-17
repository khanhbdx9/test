export interface FieldError {
    field: string;
    message: string;
}
export interface ValidationErrorData {
    errors: FieldError[];
}
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export interface PaginatedData<T> {
    items: T[];
    pagination: PaginationMeta;
}
export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T | null;
}
