import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BaseException, AccessRequest } from '@/types';
import { IS_PUBLIC_KEY, PERMISSIONS_KEY } from '@/common';

interface PermissionsMetadata {
  permissions: string[];
  requiredAll: boolean;
}

interface PublicMetadata {
  isPublicAccess: boolean;
  isPublicPermission: boolean;
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const publicMetadata = this.reflector.getAllAndOverride<PublicMetadata>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (publicMetadata?.isPublicPermission === true) {
      return true;
    }

    const metadata = this.reflector.getAllAndOverride<PermissionsMetadata>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!metadata?.permissions?.length) {
      return true;
    }

    const req = context.switchToHttp().getRequest<AccessRequest>();

    const userPermissions = req.user?.permissions ?? [];

    const hasPermission = metadata.requiredAll
      ? metadata.permissions.every((permission) => userPermissions.includes(permission))
      : metadata.permissions.some((permission) => userPermissions.includes(permission));

    if (!hasPermission) {
      throw new ForbiddenException({
        message: 'You do not have permission to access this resource.',
        error: 'Insufficient Permissions',
      } as BaseException);
    }

    return true;
  }
}
