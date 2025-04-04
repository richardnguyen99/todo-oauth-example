import { Injectable, NestMiddleware } from "@nestjs/common";
import { type Request, type Response, type NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId = uuidv4();
    req["requestId"] = requestId;
    res.setHeader("X-Request-ID", requestId);
    next();
  }
}
