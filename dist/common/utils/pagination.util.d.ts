export interface PaginationResult {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export declare function buildPagination(page: number, limit: number, total: number): PaginationResult;
