import { CookieOptions } from 'express';

/**
 * Build secure cookie options.
 * - Uses stricter security settings in production.
 */
export function getCookieOptions(isProduction: boolean, maxAge?: number): CookieOptions {
  return {
    sameSite: isProduction ? 'strict' : 'lax',
    httpOnly: true,
    secure: isProduction,
    path: '/',
    maxAge,
  };
}
