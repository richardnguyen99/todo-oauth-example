export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export interface ErrorApiResponse extends ApiResponse<null> {
  data: null;
}
