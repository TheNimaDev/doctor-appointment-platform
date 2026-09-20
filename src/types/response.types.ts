/** Base structure for API responses. */
export interface BaseResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  path?: string;
}

/** API response without payload data. */
export interface BaseApiResponse {
  message: string;
}

/** API response containing payload data. */
export interface BaseApiResponseData<T> extends BaseApiResponse {
  data: T;
}

/** Response structure produced by the response interceptor. */
export interface InterceptorResponse<T> extends BaseResponse {
  response: BaseApiResponseData<T> | BaseApiResponse;
}

/** Standard API response type with optional payload data. */
export type ApiResponse<T = void> = T extends void ? BaseApiResponse : BaseApiResponseData<T>;

/** Base structure for API exception payloads. */
export interface BaseException {
  message: string;
  error: string;
}

/** Validation error for a specific request field. */
export interface ValidationFieldError {
  field: string;
  error: string;
}

/** Standard API exception response. */
export interface ExceptionResponse extends BaseException {
  errors?: ValidationFieldError[];
}
