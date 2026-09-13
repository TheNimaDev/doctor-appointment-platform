import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { Permission, PERMISSIONS } from '@/common';

export const CreateDoctorClinicDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
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
