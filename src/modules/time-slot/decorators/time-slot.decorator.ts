import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';

import { Permission, Public, PERMISSIONS } from '@/common';

export const FindAvailableTimeSlotsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Public(),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_READ],
    }),
  );
};

export const FindAvailableClinicTimeSlotsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Public(),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_READ],
    }),
  );
};

export const FindMyTimeSlotsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_READ],
    }),
  );
};

export const FindMyClinicTimeSlotsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_READ],
    }),
  );
};

export const FindMyTimeSlotDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_READ],
      owner: true,
      resource: 'time-slot',
    }),
  );
};

export const FindAvailableTimeSlotDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Public(),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_READ],
    }),
  );
};

export const FindMyClinicAdminTimeSlotsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_READ],
    }),
  );
};

export const FindMyClinicAdminDoctorTimeSlotsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_READ],
    }),
  );
};

export const FindMyClinicAdminTimeSlotDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_READ],
      clinicOwner: true,
      resource: 'time-slot',
    }),
  );
};

export const BlockMyTimeSlotDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_BLOCK],
      owner: true,
      resource: 'time-slot',
    }),
  );
};

export const UnblockMyTimeSlotDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_UNBLOCK],
      owner: true,
      resource: 'time-slot',
    }),
  );
};

export const BlockMyClinicTimeSlotDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_BLOCK],
      clinicOwner: true,
      resource: 'time-slot',
    }),
  );
};

export const UnblockMyClinicTimeSlotDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_UNBLOCK],
      clinicOwner: true,
      resource: 'time-slot',
    }),
  );
};
