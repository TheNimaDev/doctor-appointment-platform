import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import type { BaseException, UserAccess } from '@/types';
import { IS_PUBLIC_KEY } from '@/common';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]) ?? {
      isPublicAccess: false,
      isPublicPermission: false,
    };

    if (isPublic.isPublicAccess) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<T = UserAccess>(
    err: Error | null,
    user: T | null,
    _info: unknown,
    _context: ExecutionContext,
    _status?: unknown,
  ): T {
    if (err || !user) {
      throw new UnauthorizedException({
        message: 'Invalid or expired access token',
        error: 'Invalid Access Token',
      } as BaseException);
    }

    return user;
  }
}
