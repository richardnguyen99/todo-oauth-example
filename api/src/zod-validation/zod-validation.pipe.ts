import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import { ZodError, ZodSchema } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type !== "body") {
      return value;
    }

    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (e) {
      const zodError = e as ZodError;

      const detailedMessage = `${zodError.issues[0].path[0]}: ${zodError.issues[0].message}`;

      throw new BadRequestException({
        message: "Bad Request",
        error: {
          name: "BodyValidationError",
          message: detailedMessage,
        },
      });
    }
  }
}

@Injectable()
export class ZodQueryValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type !== "query") {
      return value;
    }

    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (e) {
      const zodError = e as ZodError;

      throw new BadRequestException({
        message: "Bad Request",
        error: {
          name: "QueryValidationError",
          message: zodError.format()._errors.join("\n"),
        },
      });
    }
  }
}
