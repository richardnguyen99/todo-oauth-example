import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { ZodError } from "zod";
import { Request, Response } from "express";

@Catch(ZodError)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: ZodError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorMessage = exception.issues
      .reduce((acc, issue) => {
        return `Field ${issue.path.join(".")} - ${issue.message}. ${acc}`;
      }, "")
      .trim();

    response.status(HttpStatus.BAD_REQUEST).json({
      request: {
        params: request.params,
        query: request.query,
        body: request.body,
      },
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      statusCode: HttpStatus.BAD_REQUEST,
      type: "validation_error",
      message: errorMessage,
      details: exception.format(),
    });
  }
}
