import { HttpException } from "@nestjs/common";
import type { Response as ResponseType } from "express";

import { ResponsePayloadDto } from "src/dto/response.dto";

export const respondWithError = (e: unknown, res: ResponseType) => {
  if (e instanceof HttpException) {
    const httpError = e as HttpException;
    return res.status(httpError.getStatus()).json({
      statusCode: httpError.getStatus(),
      message: httpError.message,
      data: null,
      count: 0,
    } satisfies ResponsePayloadDto);
  }

  // Handle other errors
  return res.status(500).json({
    statusCode: 500,
    message: `An error occurred: ${
      e instanceof Error ? e.message : "Unknown error"
    }`,
    data: null,
    count: 0,
  } satisfies ResponsePayloadDto);
};
