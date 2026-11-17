import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
export declare class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: unknown, host: ArgumentsHost): void;
    private toResponse;
    private fromPrismaKnownError;
    private fromHttpException;
    private extractFieldErrors;
    private isFieldErrorList;
    private resolveHttpMessage;
    private readMessage;
    private isFileTooLarge;
    private isConnectionError;
}
