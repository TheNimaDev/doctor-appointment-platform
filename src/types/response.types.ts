/** Base response structure for API responses */
export interface BaseResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  path?: string;
}

/** API response without payload data */
export interface BaseApiResponse {
  message: string;
}

/** API response with payload data */
export interface BaseApiResponseData<T> extends BaseApiResponse {
  data: T;
}

/** API response type */
export type ApiResponse<T = void> = T extends void ? BaseApiResponse : BaseApiResponseData<T>;

/** Standard response format returned by response interceptor */
export interface InterceptorResponse<T> extends BaseResponse {
  response: ApiResponse<T>;
}

/** Base exception payload structure */
export interface BaseException {
  message: string;
  error: string;
}
