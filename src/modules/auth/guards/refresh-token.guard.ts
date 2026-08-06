import { getSafeUser } from '@/lib';
import { RefreshTokenService } from '@/modules/refresh-token/refresh-token.service';
import { BaseException, RefreshRequest } from '@/types';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  private getToken(req: RefreshRequest): string | null {
    const cookies = req.cookies as { refreshToken?: string };
    const header = req.headers['x-refresh-token'];

    return cookies?.refreshToken || (Array.isArray(header) ? header[0] : header) || null;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RefreshRequest>();

    const token = this.getToken(req);

    if (!token) {
      throw new UnauthorizedException({
        message: 'Refresh not found. please login again',
        error: 'Refresh not found',
      } as BaseException);
    }

    const refreshToken = await this.refreshTokenService.findValidRefreshToken(token);

    if (!refreshToken) {
      throw new UnauthorizedException({
        message: 'Invalid or expired refresh token',
        error: 'Invalid refreshToken',
      } as BaseException);
    }

    const { user, ...refreshRecord } = refreshToken;

    req.refreshPayload = {
      refreshRecord,
      user: getSafeUser(user).user,
    };

    return true;
  }
}
