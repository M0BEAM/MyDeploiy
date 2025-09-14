import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from 'prisma/prisma.service';

const ALGORITHM = 'aes-256-cbc';

// Ensure SECRET_KEY is always 32 bytes
const SECRET_KEY = crypto.scryptSync(process.env.ENV_SECRET_KEY || "my-secret", 'salt', 32);

// Ensure IV is always 16 bytes (generate from ENV or fallback to a secure random value)
const IV = process.env.ENV_SECRET_IV
  ? Buffer.from(process.env.ENV_SECRET_IV, 'hex')
  : crypto.randomBytes(16);
  
@Injectable()
export class EnvService {
  constructor(private prisma: PrismaService) {}

  async addEnvVariables(deploymentId: string, envVars: Record<string, string>) {
    const encryptedVars = Object.entries(envVars).map(([key, value]) => ({
      key,
      value: this.encrypt(value),
      deploymentId,
    }));

    await this.prisma.environmentVariable.createMany({
      data: encryptedVars,
    });

    return { message: 'Environment variables stored securely' };
  }

  encrypt(value: string): string {
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, IV);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decrypt(value: string): string {
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, IV);
    let decrypted = decipher.update(value, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
