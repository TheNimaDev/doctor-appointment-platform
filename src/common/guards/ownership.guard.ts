import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BaseException, AccessRequest } from '@/types';
import { PERMISSION_METADATA, PermissionDecoratorParams, PERMISSIONS } from '@/common';
import { OWNERSHIP_CONFIG } from '@/common/configs';
import { DatabaseService } from '@/modules/database/database.service';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,

    private readonly databaseService: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const metadata = this.reflector.getAllAndOverride<PermissionDecoratorParams>(PERMISSION_METADATA, [
      context.getHandler(),
      context.getClass(),
    ]) ?? {
      owner: false,
      permissions: [],
      requiredAll: false,
      resource: undefined,
      resourceIdParam: 'id',
    };

    if (!metadata.owner) {
      return true;
    }

    if (!metadata.resource) {
      throw new InternalServerErrorException({
        message: 'Ownership resource is required when owner is enabled.',
        error: 'Ownership Resource Not Defined',
      } as BaseException);
    }

    if (!metadata.resourceIdParam) {
      throw new InternalServerErrorException({
        message: 'Ownership resource ID parameter is required when owner is enabled.',
        error: 'Ownership Resource ID Parameter Not Defined',
      } as BaseException);
    }

    const req = context.switchToHttp().getRequest<AccessRequest>();

    if (req.user.permissions.includes(PERMISSIONS.OWNER_ALL)) {
      return true;
    }

    const userId = req.user.userId;
    const rawResourceId = req.params[metadata.resourceIdParam];
    const resourceId = Array.isArray(rawResourceId) ? rawResourceId[0] : rawResourceId;

    if (!resourceId) {
      throw new NotFoundException({
        message: 'Resource identifier was not provided.',
        error: 'Resource ID Not Found',
      } as BaseException);
    }

    const config = OWNERSHIP_CONFIG[metadata.resource];

    if (!config) {
      throw new InternalServerErrorException({
        message: `Ownership check is not implemented for resource: ${metadata.resource}`,
        error: 'Unsupported Ownership Resource',
      } as BaseException);
    }

    const resource = await this.databaseService.dataSource.manager.findOne(config.entity, {
      where: {
        id: resourceId,
      },
      relations: config.relations,
    });

    if (!resource) {
      const resourceNameFormatted = this.formatResourceName(metadata.resource);

      throw new NotFoundException({
        message: `${resourceNameFormatted} not found in database.`,
        error: `${resourceNameFormatted} Not Found`,
      } as BaseException);
    }

    const ownerUserId = config.getUserId(resource);
    if (!ownerUserId) {
      throw new InternalServerErrorException({
        message: `Unable to resolve owner for resource: ${metadata.resource}.`,
        error: 'Ownership Resolution Failed',
      } as BaseException);
    }

    if (ownerUserId !== userId) {
      throw new ForbiddenException({
        message: `You are not the owner of this ${this.formatResourceName(metadata.resource)}.`,
        error: 'Ownership Verification Failed',
      } as BaseException);
    }

    return true;
  }

  private formatResourceName(resourceName: string): string {
    return resourceName
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
