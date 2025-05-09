import { HttpException, InternalServerErrorException } from "@nestjs/common";
import type { Response as ResponseType } from "express";
import mongoose from "mongoose";

export const respondWithError = (e: unknown, _res: ResponseType) => {
  if (e instanceof HttpException) {
    throw new HttpException(
      {
        message: e.message,
        error: e.getResponse(),
      },
      e.getStatus(),
    );
  }

  if (e instanceof mongoose.Error) {
    // There is an error with casting the provided string id to an ObjectId
    if (e instanceof mongoose.Error.CastError) {
      throw new HttpException(
        {
          message: "Bad Request",
          error: {
            name: "InvalidIdError",
            message: "Invalid Id format",
          },
        },
        400,
      );
    }

    if (e instanceof mongoose.Error.ValidationError) {
      throw new HttpException(
        {
          message: "Bad Request",
          error: {
            name: "ValidationError",
            message: e.message,
          },
        },
        400,
      );
    }

    throw new InternalServerErrorException({
      message: "Internal server error",
      error: e,
    });
  }

  // Handle other errors
  throw new InternalServerErrorException({
    message: "Internal server error",
    error: e,
  });
};
