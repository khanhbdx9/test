import { type Type } from '@nestjs/common';
interface StandardResponseOptions<T> {
    type?: Type<T>;
    description?: string;
    status?: number;
}
export declare function ApiStandardResponse<T>(options?: StandardResponseOptions<T>): MethodDecorator;
export declare function ApiStandardArrayResponse<T>(options: {
    type: Type<T>;
    description?: string;
    status?: number;
}): MethodDecorator;
export declare function ApiStandardPaginatedResponse<T>(options: {
    type: Type<T>;
    description?: string;
}): MethodDecorator;
export declare function ApiStandardErrorResponse(): MethodDecorator;
export {};
