export interface BaseResponse<TData> {
  success: true;
  data: TData;
}

export interface BaseResponseWithMeta<TData, TMeta = Record<string, unknown>>
  extends BaseResponse<TData> {
  meta: TMeta;
}

export interface ApiError {
  code: string;
  message: string;
}

export interface ErrorResponse<TError extends ApiError = ApiError> {
  success: false;
  error: TError;
}

export type ApiResponse<TData, TMeta = never> = [TMeta] extends [never]
  ? BaseResponse<TData> | ErrorResponse
  : BaseResponseWithMeta<TData, TMeta> | ErrorResponse;
