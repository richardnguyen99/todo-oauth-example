import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const message =
      typeof exceptionResponse === "string" // Use string response directly
        ? exceptionResponse
        : typeof exceptionResponse === "object" && // Check if a message property exists
            "message" in exceptionResponse
          ? exceptionResponse.message
          : exception.message || exception.name || "failed";

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      statusCode: status,
      message,
      ...(exception.getResponse() as object),
      data: null,
    });
  }
}
