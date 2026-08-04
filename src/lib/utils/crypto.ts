import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';

/** Hashed password with bcrypt */
export async function hashSecret(value: string, salt: number = 10): Promise<string> {
  return bcrypt.hash(value, salt);
}

/** Compare hashed password with bcrypt */
export async function compareSecret(value: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(value, hashed);
}

/** Generate token from randomBytes */
export function generateRandomToken(): string {
  return randomBytes(64).toString('hex');
}

/** Hash token using SHA-256 */
export function hashToken(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}
