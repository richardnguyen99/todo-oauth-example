export type BaseResponse<T> = {
  message: string;
  statusCode: number;
  data: T;
};

export type BaseErrorResponse<T> = {
  timestamp: string;
  path: string;
  method: string;
  statusCode: number;
  message: string;
  error: T;
  data: null;
};
