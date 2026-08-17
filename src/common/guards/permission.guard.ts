import { Reflector } from '@nestjs/core';
import { BaseException, AccessRequest } from '@/types';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  IS_PUBLIC_KEY,
  PERMISSION_METADATA,
  PermissionDecoratorParams,
  PERMISSIONS,
  PermissionsKeyType,
  PublicDecoratorParams,
} from '@/common';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const publicMetadata = this.reflector.getAllAndOverride<PublicDecoratorParams>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? {
      isPublicAccess: false,
      isPublicPermission: false,
    };

    if (publicMetadata.isPublicPermission) {
      return true;
    }

    const metadata = this.reflector.getAllAndOverride<PermissionDecoratorParams>(PERMISSION_METADATA, [
      context.getHandler(),
      context.getClass(),
    ]) ?? {
      owner: false,
      permissions: [],
      requiredAll: false,
      resource: undefined,
    };

    if (!metadata.permissions.length) {
      throw new InternalServerErrorException({
        message: 'Permission is required for this route.',
        error: 'Permission Not Defined',
      } as BaseException);
    }

    const req = context.switchToHttp().getRequest<AccessRequest>();

    const userPermissions = req.user.permissions as PermissionsKeyType[];
    const userPermissionsSet = new Set(userPermissions);

    if (userPermissionsSet.has(PERMISSIONS.OWNER_ALL)) {
      return true;
    }

    const hasPermission = metadata.requiredAll
      ? metadata.permissions.every((permission) => userPermissionsSet.has(permission))
      : metadata.permissions.some((permission) => userPermissionsSet.has(permission));

    if (!hasPermission) {
      const missingPermissions = metadata.permissions.filter((permission) => !userPermissionsSet.has(permission));

      throw new ForbiddenException({
        message: 'You do not have sufficient permissions to perform this action.',
        error: 'Permission Denied',
        resource: metadata.resource,
        required_permissions: metadata.permissions,
        missing_permissions: missingPermissions,
        required_mode: metadata.requiredAll ? 'ALL' : 'ANY',
      } as BaseException);
    }

    return true;
  }
}
