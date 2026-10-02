import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BaseException, OwnershipRequest } from '@/types';
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
      ownership: undefined,
      permissions: [],
      requiredAll: false,
      resource: undefined,
      resourceIdParam: 'id',
    };

    if (!metadata.ownership) {
      return true;
    }

    if (!metadata.resource) {
      throw new InternalServerErrorException({
        message: 'Ownership resource is required when ownership check is enabled.',
        error: 'Ownership Resource Not Defined',
      } as BaseException);
    }

    if (!metadata.resourceIdParam) {
      throw new InternalServerErrorException({
        message: 'Ownership resource ID parameter is required when ownership check is enabled.',
        error: 'Ownership Resource ID Parameter Not Defined',
      } as BaseException);
    }

    const request = context.switchToHttp().getRequest<OwnershipRequest>();

    const rawResourceId = request.params[metadata.resourceIdParam];
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

    request.ownershipData = resource;

    if (request.user.permissions.includes(PERMISSIONS.OWNER_ALL)) {
      return true;
    }

    const user = request.user;

    let ownerUserId: string | undefined;

    switch (metadata.ownership) {
      case 'owner':
        ownerUserId = config.getOwnerUserId?.(resource);
        break;

      case 'doctor':
        ownerUserId = config.getDoctorUserId?.(resource);
        break;

      case 'patient':
        ownerUserId = config.getPatientUserId?.(resource);
        break;

      case 'clinic':
        ownerUserId = config.getClinicUserId?.(resource);
        break;
    }

    if (!ownerUserId) {
      throw new InternalServerErrorException({
        message: `Unable to resolve ${metadata.ownership} ownership for resource: ${metadata.resource}.`,
        error: 'Ownership Resolution Failed',
      } as BaseException);
    }

    if (ownerUserId !== user.userId) {
      throw new ForbiddenException({
        message: `Access denied. You dont have access to this ${this.formatResourceName(metadata.resource)}.`,
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
