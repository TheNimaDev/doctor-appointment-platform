import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import type { AccessRequest, BaseException, UserAccess } from '@/types';
import { IS_PUBLIC_KEY } from '@/common';
import { SessionService } from '@/modules/session/session.service';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly sessionService: SessionService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]) ?? {
      isPublicAccess: false,
      isPublicPermission: false,
    };

    if (isPublic.isPublicAccess) {
      return true;
    }

    const authenticated = await super.canActivate(context);

    if (!authenticated) {
      return false;
    }

    const request = context.switchToHttp().getRequest<AccessRequest>();
    const { sessionId } = request.user;

    await this.sessionService.getById({ id: sessionId });

    return true;
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
