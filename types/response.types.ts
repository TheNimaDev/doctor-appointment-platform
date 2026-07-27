/** base response for exceptions and ok responses */
export interface BaseResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  path?: string;
}

/** API Responses without data */
export interface BaseApiResponse {
  message: string;
}

/** API Responses with data */
export interface BaseApiResponseData<T> extends BaseApiResponse {
  data: T;
}

/** Schema response when request is SUCCESS */
export interface InterceptorResponse<T> extends BaseResponse {
  response: BaseApiResponseData<T> | BaseApiResponse;
}
