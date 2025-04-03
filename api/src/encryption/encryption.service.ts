import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "node:crypto";

@Injectable()
export class EncryptionService {
  private readonly algorithm = "aes-256-cbc";
  private readonly key: Buffer;
  private readonly ivLength = 16;

  constructor(private configService: ConfigService) {
    // Ideally, you'd load this from env or config service
    const password =
      this.configService.get<string>("CRYPTO_PASSWORD") || "default-password";
    const salt = this.configService.get<string>("CRYPTO_SALT", "default-salt"); // fallback salt

    this.key = scryptSync(password, salt, 32); // Derive 32-byte key for AES-256
  }

  encrypt(plainText: string) {
    const iv = randomBytes(this.ivLength);
    const cipher = createCipheriv(this.algorithm, this.key, iv);

    const encrypted = Buffer.concat([
      cipher.update(plainText, "utf8"),
      cipher.final(),
    ]);

    const encryptedWithIv = Buffer.concat([iv, encrypted]); // Prepend IV

    return encryptedWithIv;
  }

  decrypt(encryptedData: Buffer<ArrayBuffer>) {
    const iv = encryptedData.subarray(0, this.ivLength);
    const encryptedText = encryptedData.subarray(this.ivLength);

    const decipher = createDecipheriv(this.algorithm, this.key, iv);

    const decrypted = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);

    return decrypted;
  }
}
