import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { Permission, PERMISSIONS } from '@/common';

export const CreateDoctorClinicDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_CLINIC_CREATE],
      owner: true,
      resource: 'clinic',
      resourceIdParam: 'clinicId',
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

export const DeleteDoctorClinicDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_CLINIC_DELETE],
      owner: true,
      resource: 'clinic',
      resourceIdParam: 'clinicId',
    }),
  );
};
