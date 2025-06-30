import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import * as compression from "compression";

import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./filters/http-exception.filter";
import { ZodExceptionFilter } from "./filters/zod-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new ZodExceptionFilter());

  app.setGlobalPrefix("/v1/api");
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use(
    compression({
      // Compress responses with gzip
      threshold: 0, // Compress all responses regardless of size
      filter: (req, res) => {
        if (req.headers["x-no-compression"]) {
          // Don't compress responses with this request header
          return false;
        }

        return compression.filter(req, res); // Use the default filter function
      },
    }),
  );

  app.enableCors({
    origin: "http://localhost:8888",
    credentials: true,
  });

  await app.listen(7777);
}
bootstrap();
