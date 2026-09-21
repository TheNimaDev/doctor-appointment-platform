import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { Permission, PERMISSIONS } from '@/common';
import { ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiParam } from '@nestjs/swagger';
import * as DoctorClinicRes from '../res';

export const CreateDoctorClinicDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    ApiParam({
      name: 'doctorId',
      description: 'Doctor ID',
      type: String,
      format: 'uuid',
      example: '4c6e8f1a-3d5b-4f7c-9a2e-1b3d5f7c9e0a',
    }),
    ApiCreatedResponse({
      type: DoctorClinicRes.CreateDoctorClinicResponse,
    }),
    ApiConflictResponse({
      type: DoctorClinicRes.CreateDoctorClinicConflictResponse,
    }),
    ApiNotFoundResponse({
      type: DoctorClinicRes.CreateDoctorClinicNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_CLINIC_CREATE],
    }),
  );
};

export const FindDoctorClinicsByDoctorDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_CLINIC_READ],
    }),
  );
};

export const FindDoctorClinicsByClinicDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_CLINIC_READ],
    }),
  );
};

export const FindMyClinicDoctorsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_CLINIC_READ],
    }),
  );
};

export const FindMyDoctorClinicsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_CLINIC_READ],
    }),
  );
};

export const DeleteDoctorClinicDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_CLINIC_DELETE],
    }),
  );
};
