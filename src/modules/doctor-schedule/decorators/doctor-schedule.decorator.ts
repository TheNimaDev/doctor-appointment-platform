import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';

import { Permission, PERMISSIONS } from '@/common';

export const CreateDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),

    Permission({
      permissions: [PERMISSIONS.DOCTOR_UPDATE],
      owner: true,
      resource: 'doctor',
    }),
  );
};

export const FindDoctorSchedulesDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),

    Permission({
      permissions: [PERMISSIONS.DOCTOR_READ],
    }),
  );
};

export const FindDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),

    Permission({
      permissions: [PERMISSIONS.DOCTOR_READ],
    }),
  );
};

export const UpdateDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),

    Permission({
      permissions: [PERMISSIONS.DOCTOR_UPDATE],
      owner: true,
      resource: 'doctor',
    }),
  );
};

export const UpdateDoctorScheduleStatusDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),

    Permission({
      permissions: [PERMISSIONS.DOCTOR_UPDATE],
      owner: true,
      resource: 'doctor',
    }),
  );
};

export const DeleteDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),

    Permission({
      permissions: [PERMISSIONS.DOCTOR_UPDATE],
      owner: true,
      resource: 'doctor',
    }),
  );
};
