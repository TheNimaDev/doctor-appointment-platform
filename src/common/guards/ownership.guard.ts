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

import { DatabaseService } from '@/modules/database/database.service';
import { Doctor } from '@/modules/doctor/entities';
import { Clinic } from '@/modules/clinic/entities';

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

    const req = context.switchToHttp().getRequest<AccessRequest>();

    const userId = req.user.userId;

    const rawResourceId = req.params.id ?? req.params.clinicId ?? req.params.doctorId;
    const resourceId = Array.isArray(rawResourceId) ? rawResourceId[0] : rawResourceId;

    if (!resourceId) {
      throw new NotFoundException({
        message: 'Resource identifier was not provided.',
        error: 'Resource ID Not Found',
      } as BaseException);
    }

    if (req.user.permissions.includes(PERMISSIONS.OWNER_ALL)) {
      return true;
    }

    switch (metadata.resource) {
      case 'doctor':
        return this.checkDoctorOwnership(resourceId, userId);

      case 'clinic':
        return this.checkClinicOwnership(resourceId, userId);

      default:
        throw new InternalServerErrorException({
          message: `Ownership check is not implemented for resource: ${metadata.resource}`,
          error: 'Unsupported Ownership Resource',
        } as BaseException);
    }
  }

  private async checkDoctorOwnership(doctorId: string, userId: string): Promise<boolean> {
    const doctor = await this.databaseService.dataSource.manager.findOne(Doctor, {
      where: {
        id: doctorId,
      },
    });

    if (!doctor) {
      throw new NotFoundException({
        message: 'Doctor not found in database.',
        error: 'Doctor Not Found',
      } as BaseException);
    }

    if (doctor.userId !== userId) {
      throw new ForbiddenException({
        message: 'You are not the owner of this doctor profile.',
        error: 'Ownership Verification Failed',
      } as BaseException);
    }

    return true;
  }

  private async checkClinicOwnership(clinicId: string, userId: string): Promise<boolean> {
    const clinic = await this.databaseService.dataSource.manager.findOne(Clinic, {
      where: {
        id: clinicId,
      },
      relations: {
        doctor: true,
      },
    });

    if (!clinic) {
      throw new NotFoundException({
        message: 'Clinic not found in database.',
        error: 'Clinic Not Found',
      } as BaseException);
    }

    if (!clinic.doctor || clinic.doctor.userId !== userId) {
      throw new ForbiddenException({
        message: 'You are not the owner of this clinic.',
        error: 'Ownership Verification Failed',
      } as BaseException);
    }

    return true;
  }
}
