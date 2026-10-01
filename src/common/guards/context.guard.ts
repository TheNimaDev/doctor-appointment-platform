import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { AccessRequest, BaseException } from '@/types';
import { ROLES, USER_CONTEXT_METADATA, type UserContextType } from '@/common';
import { DoctorService } from '@/modules/doctor/doctor.service';
import { PatientService } from '@/modules/patient/patient.service';
import { ClinicService } from '@/modules/clinic/clinic.service';

@Injectable()
export class ContextGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly doctorService: DoctorService,
    private readonly patientService: PatientService,
    private readonly clinicService: ClinicService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const userContext = this.reflector.getAllAndOverride<UserContextType>(USER_CONTEXT_METADATA, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!userContext) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AccessRequest>();

    switch (userContext) {
      case 'admin':
        return this.handleAdminContext(request);

      case 'clinic':
        return this.handleClinicContext(request);

      case 'doctor':
        return this.handleDoctorContext(request);

      case 'patient':
        return this.handlePatientContext(request);

      default:
        return true;
    }
  }

  private handleAdminContext(request: AccessRequest): boolean {
    const isAdmin = request.user.roles.includes(ROLES.SUPER_ADMIN);

    if (!isAdmin) {
      throw new ForbiddenException({
        message: 'You do not have admin access.',
        error: 'Admin Access Required',
      } as BaseException);
    }

    return true;
  }

  private async handleClinicContext(request: AccessRequest): Promise<boolean> {
    const { clinic } = await this.clinicService.findByOwnerId({
      ownerId: request.user.userId,
    });

    if (!clinic) {
      throw new NotFoundException({
        message: 'Clinic profile not found.',
        error: 'Clinic Profile Not Found',
      } as BaseException);
    }

    request.clinic = clinic;

    return true;
  }

  private async handleDoctorContext(request: AccessRequest): Promise<boolean> {
    const { doctor } = await this.doctorService.findByUserId({
      userId: request.user.userId,
    });

    if (!doctor) {
      throw new NotFoundException({
        message: 'Doctor profile not found.',
        error: 'Doctor Profile Not Found',
      } as BaseException);
    }

    request.doctor = doctor;

    return true;
  }

  private async handlePatientContext(request: AccessRequest): Promise<boolean> {
    const { patient } = await this.patientService.findByUserId({
      userId: request.user.userId,
    });

    if (!patient) {
      throw new NotFoundException({
        message: 'Patient profile not found.',
        error: 'Patient Profile Not Found',
      } as BaseException);
    }

    request.patient = patient;

    return true;
  }
}
