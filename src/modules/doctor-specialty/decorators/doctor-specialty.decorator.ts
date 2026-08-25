import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { Permission, PERMISSIONS } from '@/common';

export const AddDoctorSpecialtyDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_UPDATE],
      owner: true,
      resource: 'doctor',
    }),
  );
};

export const FindDoctorSpecialtiesDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_READ],
    }),
  );
};

export const SetDoctorSpecialtyPrimaryDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_UPDATE],
      owner: true,
      resource: 'doctor',
    }),
  );
};

export const RemoveDoctorSpecialtyDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_UPDATE],
      owner: true,
      resource: 'doctor',
    }),
  );
};
