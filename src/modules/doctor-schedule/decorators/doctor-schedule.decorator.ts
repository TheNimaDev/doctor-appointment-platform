import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';

import { Permission, PERMISSIONS } from '@/common';

export const CreateDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),

    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_CREATE],
      owner: true,
      resource: 'doctor',
    }),
  );
};

export const FindDoctorSchedulesDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),

    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_READ],
    }),
  );
};

export const FindDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),

    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_READ],
    }),
  );
};

export const UpdateDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),

    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_UPDATE],
      owner: true,
      resource: 'doctor',
    }),
  );
};

export const UpdateDoctorScheduleStatusDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),

    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_UPDATE_STATUS],
      owner: true,
      resource: 'doctor',
    }),
  );
};

export const DeleteDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),

    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_DELETE],
      owner: true,
      resource: 'doctor',
    }),
  );
};
