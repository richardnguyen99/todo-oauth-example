import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EncryptionService } from "./encryption.service";

@Global()
@Module({
  providers: [EncryptionService, ConfigService],
  exports: [EncryptionService],
})
export class EncryptionModule {}
