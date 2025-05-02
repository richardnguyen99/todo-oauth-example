import { HttpException, InternalServerErrorException } from "@nestjs/common";
import type { Response as ResponseType } from "express";

export const respondWithError = (e: unknown, res: ResponseType) => {
  if (e instanceof HttpException) {
    throw new HttpException(
      {
        message: e.message,
        error: e.getResponse(),
      },
      e.getStatus(),
    );
  }

  // Handle other errors
  throw new InternalServerErrorException({
    message: "Internal server error",
    error: e,
  });
};
