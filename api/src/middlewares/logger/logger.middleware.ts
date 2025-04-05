import { Injectable, NestMiddleware } from "@nestjs/common";
import { type Request, type Response, type NextFunction } from "express";
import * as morgan from "morgan";

import logger from "./winston";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  public use(req: Request, res: Response, next: NextFunction) {
    morgan(":method :url :status :res[content-length] - :response-time ms", {
      stream: {
        write: (message: string) => {
          const messageParts = message.split(" ");

          if (Number(messageParts[messageParts.length - 5]) >= 400) {
            logger.error(message.replace(/\n$/, ""));
            return;
          }

          logger.http(message.replace(/\n$/, ""));
        },
      },
      skip: () => {
        const env = process.env.NODE_ENV || "development";
        return env === "test";
      },
    })(req, res, next);
  }
}
