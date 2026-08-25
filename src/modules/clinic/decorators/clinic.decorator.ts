import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { Permission, PERMISSIONS } from '@/common';

export const CreateClinicDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    Permission({
      permissions: [PERMISSIONS.CLINIC_CREATE],
    }),
  );
};

export const FindClinicsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.CLINIC_READ],
    }),
  );
};

export const FindClinicDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.CLINIC_READ],
    }),
  );
};

export const UpdateClinicDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.CLINIC_UPDATE],
      owner: true,
      resource: 'clinic',
    }),
  );
};

export const DeleteClinicDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.CLINIC_DELETE],
      owner: true,
      resource: 'clinic',
    }),
  );
};

export const UpdateClinicStatusDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.CLINIC_UPDATE_STATUS],
      owner: true,
      resource: 'clinic',
    }),
  );
};
