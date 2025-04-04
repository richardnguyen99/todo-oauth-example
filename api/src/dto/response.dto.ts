export interface ResponsePayloadDto {
  statusCode: number;
  message: string;
  data: unknown;
  count?: number;
}
