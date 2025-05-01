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

      throw new BadRequestException(
        `Validation failed for following fields: ${JSON.stringify(zodError.flatten().fieldErrors)}`,
      );
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

      console.error(zodError.flatten());

      throw new BadRequestException({
        message: "Zod validation error",
        error: zodError.flatten(),
      });
    }
  }
}
