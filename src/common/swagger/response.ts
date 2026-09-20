import 'dotenv/config';
import { ApiProperty } from '@nestjs/swagger';
import { getHttpStatusMessage } from '@/lib';
import type { PermissionsKeyType } from '@/common';
import type { ApiResponse, BaseApiResponseData, ValidationFieldError } from '@/types';

const BASE_URL = process.env.BASE_URL ?? 'api/v1';

function getFormatPath(path: string): string {
  const normalizedBaseUrl = BASE_URL.replace(/^\/|\/$/g, '');
  const normalizedPath = path.replace(/^\/+/, '');
  const baseUrlPrefix = `${normalizedBaseUrl}/`;

  if (normalizedPath === normalizedBaseUrl || normalizedPath.startsWith(baseUrlPrefix)) {
    return path;
  }

  return `/${normalizedBaseUrl}/${normalizedPath}`;
}

interface GetNormalErrorTypes {
  message: string;
  statusCode: number;
  path: string;
  error: string;
}

/**
 * Create a standard error response schema for Swagger.
 */
export function getNormalErrorResponse(props: GetNormalErrorTypes) {
  class NormalErrorResponse {
    @ApiProperty({ example: props.statusCode })
    statusCode: number;

    @ApiProperty({ example: false })
    success: boolean;

    @ApiProperty({ example: getHttpStatusMessage(props.statusCode) })
    detail: string;

    @ApiProperty({ example: getFormatPath(props.path) })
    path: string;

    @ApiProperty({ example: '2026-02-08T02:11:20.630Z' })
    timestamp: string;

    @ApiProperty({ example: props.message })
    message: string;

    @ApiProperty({ example: props.error })
    error: string;
  }

  return NormalErrorResponse;
}

function getDynamicClassName(source: string, path: string): string {
  return `${source}_${path.replace(/[^a-zA-Z0-9_$]/g, '_')}`;
}

/**
 * Create an unauthorized response schema for Swagger.
 */
export function getUnauthorizedResponse(path: string) {
  const className = getDynamicClassName('Unauthorized', path);

  return {
    [className]: class extends getNormalErrorResponse({
      message: 'Invalid or expired access token',
      statusCode: 401,
      error: 'Invalid Access Token',
      path,
    }) {},
  }[className];
}

/**
 * Swagger response schema for rate-limited requests.
 */
export class TooManyRequestsResponse extends getNormalErrorResponse({
  message: 'Too many requests. Try again 5 minutes later.',
  path: 'auth/register',
  error: 'Too Many Requests From Your IP',
  statusCode: 429,
}) {}

interface GetForbiddenResponse {
  resource?: string;
  required_permissions?: PermissionsKeyType[];
  missing_permissions?: PermissionsKeyType[];
  required_mode?: 'ALL' | 'ANY';
}

type GetForbiddenErrorTypes = GetForbiddenResponse & GetNormalErrorTypes;

/**
 * Create a forbidden response schema for Swagger.
 */
function getForbiddenClass(props: GetForbiddenErrorTypes) {
  class ForbiddenResponse {
    @ApiProperty({ example: props.statusCode })
    statusCode: number;

    @ApiProperty({ example: false })
    success: boolean;

    @ApiProperty({ example: getHttpStatusMessage(props.statusCode) })
    detail: string;

    @ApiProperty({ example: getFormatPath(props.path) })
    path: string;

    @ApiProperty({ example: '2026-02-08T02:11:20.630Z' })
    timestamp: string;

    @ApiProperty({ example: props.message })
    message: string;

    @ApiProperty({ example: props.error })
    error: string;

    @ApiProperty({
      example: props.resource ?? 'user',
      required: false,
    })
    resource?: string;

    @ApiProperty({
      example: props.required_permissions ?? ['user:read'],
      required: false,
    })
    required_permissions?: PermissionsKeyType[];

    @ApiProperty({
      example: props.missing_permissions ?? ['user:read'],
      required: false,
    })
    missing_permissions?: PermissionsKeyType[];

    @ApiProperty({
      example: props.required_mode ?? 'ANY',
      required: false,
    })
    required_mode?: 'ALL' | 'ANY';
  }

  return ForbiddenResponse;
}

/**
 * Create a forbidden response schema for Swagger.
 */
export function getForbiddenResponse(path: string, data?: GetForbiddenResponse) {
  const className = getDynamicClassName('Forbidden', path);

  return {
    [className]: class extends getForbiddenClass({
      message: 'You do not have sufficient permissions to perform this action.',
      statusCode: 403,
      error: 'Permission Denied',
      path,
      resource: data?.resource ?? 'user',
      required_permissions: data?.required_permissions ?? ['user:read'],
      missing_permissions: data?.missing_permissions ?? ['user:read'],
      required_mode: data?.required_mode ?? 'ANY',
    }) {},
  }[className];
}

interface GetBaseOkResponseParams<T> {
  path: string;
  create?: boolean;
  statusCode?: number;
  response: ApiResponse<T>;
}

/**
 * Create a successful response schema for Swagger.
 */
export function getBaseOkResponseSchema<T>(props: GetBaseOkResponseParams<T>) {
  const responseData = props.response as BaseApiResponseData<T>;

  const response: {
    message: string;
    data?: T;
  } = {
    message: props.response.message,
  };

  if ('data' in responseData) {
    response.data = responseData.data;
  }

  class BaseOkResponse {
    @ApiProperty({
      example: props.statusCode ?? (props.create ? 201 : 200),
    })
    statusCode: number;

    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({
      example: props.create ? 'Resource Created' : 'Resource Successfully',
    })
    detail: string;

    @ApiProperty({ example: getFormatPath(props.path) })
    path: string;

    @ApiProperty({
      example: '2026-02-08T02:11:20.630Z',
    })
    timestamp: string;

    @ApiProperty({
      example: response,
    })
    response: {
      message: string;
      data?: T;
    };
  }

  return BaseOkResponse;
}

interface GetValidationErrorResponseProps {
  path: string;
  errors: ValidationFieldError[];
}

/**
 * Create a validation error response schema for Swagger.
 */
export function getValidationErrorResponse(props: GetValidationErrorResponseProps) {
  const className = getDynamicClassName('ValidationError', props.path);

  return {
    [className]: class extends getValidationErrorClass(props) {},
  }[className];
}

function getValidationErrorClass(props: GetValidationErrorResponseProps) {
  class ValidationErrorResponse {
    @ApiProperty({ example: 400 })
    statusCode: number;

    @ApiProperty({ example: false })
    success: boolean;

    @ApiProperty({ example: getHttpStatusMessage(400) })
    detail: string;

    @ApiProperty({ example: getFormatPath(props.path) })
    path: string;

    @ApiProperty({ example: '2026-02-08T02:11:20.630Z' })
    timestamp: string;

    @ApiProperty({ example: 'Validation failed.' })
    message: string;

    @ApiProperty({ example: 'Bad Request' })
    error: string;

    @ApiProperty({
      example: props.errors,
      type: 'array',
      items: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
            example: 'email',
          },
          error: {
            type: 'string',
            example: 'Invalid email address',
          },
        },
      },
    })
    errors: ValidationFieldError[];
  }

  return ValidationErrorResponse;
}
