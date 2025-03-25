import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("/v1/api");
  app.use(cookieParser());
  app.enableCors({
    origin: "http://localhost:8888",
  });

  await app.listen(7777);
}
bootstrap();
