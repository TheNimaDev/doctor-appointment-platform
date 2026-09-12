import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';

import { Permission, Public, PERMISSIONS } from '@/common';

export const FindAllDoctorSchedulesDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const FindDoctorSchedulesDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Public(),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_READ],
    }),
  );
};

export const FindDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Public(),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_READ],
    }),
  );
};

export const FindMyDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_READ],
    }),
  );
};

export const FindMyDoctorSchedulesDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_READ],
    }),
  );
};

export const FindMyDoctorClinicSchedulesDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_READ],
    }),
  );
};

export const FindMyClinicSchedulesDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_READ],
    }),
  );
};

export const FindDoctorScheduleByClinicOwnerDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_READ],
      clinicOwner: true,
      resource: 'doctor-schedule',
      resourceIdParam: 'scheduleId',
    }),
  );
};

export const FindDoctorClinicSchedulesForClinicDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_READ],
    }),
  );
};

export const CreateMyDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_CREATE],
    }),
  );
};

export const UpdateMyDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_UPDATE],
    }),
  );
};

export const UpdateDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_UPDATE],
      clinicOwner: true,
      resource: 'doctor-schedule',
      resourceIdParam: 'scheduleId',
    }),
  );
};

export const UpdateMyDoctorScheduleStatusDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_UPDATE_STATUS],
    }),
  );
};

export const UpdateDoctorScheduleStatusDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_UPDATE_STATUS],
      clinicOwner: true,
      resource: 'doctor-schedule',
      resourceIdParam: 'scheduleId',
    }),
  );
};

export const DeleteMyDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_DELETE],
    }),
  );
};

export const DeleteDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_DELETE],
      clinicOwner: true,
      resource: 'doctor-schedule',
      resourceIdParam: 'scheduleId',
    }),
  );
};
