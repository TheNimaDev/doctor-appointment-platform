import { getSafeUser } from '@/lib';
import { RefreshTokenService } from '@/modules/refresh-token/refresh-token.service';
import { BaseException, RefreshRequest } from '@/types';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  /**
   * Extract the refresh token from the request.
   * - Checks the refresh token cookie first.
   * - Falls back to the x-refresh-token header.
   */
  private getToken(req: RefreshRequest): string | null {
    const cookies = req.cookies as { refreshToken?: string };
    const header = req.headers['x-refresh-token'];

    return cookies?.refreshToken || (Array.isArray(header) ? header[0] : header) || null;
  }

  /**
   * Validate the refresh token and attach authentication data to the request.
   * - Rejects requests without a refresh token.
   * - Rejects invalid or expired refresh tokens.
   * - Attaches safe user, session, and refresh token data to req.refreshPayload.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RefreshRequest>();

    const token = this.getToken(req);

    if (!token) {
      throw new UnauthorizedException({
        message: 'Refresh not found. please login again',
        error: 'Refresh not found',
      } as BaseException);
    }

    const refreshToken = await this.refreshTokenService.findValidRefreshToken({ token });

    if (!refreshToken?.session?.user) {
      throw new UnauthorizedException({
        message: 'Invalid or expired refresh token',
        error: 'Invalid refreshToken',
      } as BaseException);
    }

    const { user: _sessionUser, refreshTokens: _refreshTokens, ...safeSession } = refreshToken.session;
    const { session: _session, ...safeRefreshToken } = refreshToken;

    req.refreshPayload = {
      refreshRecord: safeRefreshToken,
      session: safeSession,
      user: getSafeUser(refreshToken.session.user).user,
    };

    return true;
  }
}
