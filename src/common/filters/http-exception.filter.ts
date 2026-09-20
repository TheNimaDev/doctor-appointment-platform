import type { Request, Response } from 'express';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { getHttpStatusMessage, getServerTimestamp } from '@/lib';
import { ExceptionResponse, ValidationFieldError } from '@/types';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();

    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const statusCode = this.getStatusCode(exception);
    const exceptionResponse = this.getExceptionResponse(exception);

    const responseBody = {
      statusCode,
      success: false,
      detail: getHttpStatusMessage(statusCode),
      path: request.url,
      timestamp: getServerTimestamp(),
      message: exceptionResponse.message,
      error: exceptionResponse.error,
      ...(exceptionResponse.errors
        ? {
            errors: exceptionResponse.errors,
          }
        : {}),
    };

    response.status(statusCode).json(responseBody);
  }

  /**
   * Get HTTP status code from the exception.
   */
  private getStatusCode(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  /**
   * Get a normalized exception response.
   */
  private getExceptionResponse(exception: unknown): ExceptionResponse {
    if (!(exception instanceof HttpException)) {
      return {
        message: 'Internal server error.',
        error: 'Internal Server Error',
      };
    }

    const response = exception.getResponse();

    if (typeof response === 'string') {
      return {
        message: response,
        error: getHttpStatusMessage(exception.getStatus()),
      };
    }

    if (this.isExceptionResponse(response)) {
      return {
        message: this.normalizeMessage(response.message),
        error: typeof response.error === 'string' ? response.error : getHttpStatusMessage(exception.getStatus()),
        errors: this.normalizeErrors(response.errors),
      };
    }

    return {
      message: getHttpStatusMessage(exception.getStatus()),
      error: getHttpStatusMessage(exception.getStatus()),
    };
  }

  /**
   * Normalize NestJS exception message.
   */
  private normalizeMessage(message: unknown): string {
    if (typeof message === 'string') {
      return message;
    }

    if (Array.isArray(message)) {
      return message.join(', ');
    }

    return 'An error occurred.';
  }

  /**
   * Normalize validation errors.
   */
  private normalizeErrors(errors: unknown): ValidationFieldError[] | undefined {
    if (!Array.isArray(errors)) {
      return undefined;
    }

    const normalizedErrors = errors.filter(
      (item): item is ValidationFieldError =>
        typeof item === 'object' && item !== null && typeof item.field === 'string' && typeof item.error === 'string',
    );

    return normalizedErrors.length > 0 ? normalizedErrors : undefined;
  }

  /**
   * Check whether an exception response is an object.
   */
  private isExceptionResponse(response: string | object): response is ExceptionResponse {
    return typeof response === 'object' && response !== null;
  }
}
