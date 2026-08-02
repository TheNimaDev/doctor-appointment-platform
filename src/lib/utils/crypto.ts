import * as bcrypt from 'bcrypt';

/** hashed password with bcrypt */
export async function hashSecret(value: string, salt: number = 10): Promise<string> {
  return bcrypt.hash(value, salt);
}
