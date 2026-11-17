export declare class FieldErrorDto {
    field: string;
    message: string;
}
export declare class ValidationErrorDataDto {
    errors: FieldErrorDto[];
}
export declare class PaginationMetaDto {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
