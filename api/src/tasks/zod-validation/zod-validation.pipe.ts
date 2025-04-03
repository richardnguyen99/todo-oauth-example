import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import { ZodSchema } from "zod";

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
    } catch (_e) {
      throw new BadRequestException(
        `Validation failed: ${(_e as Error).message}`,
      );
    }
  }
}
